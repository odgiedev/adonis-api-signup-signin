import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'

import User from 'App/Models/User'
export default class UsersController {
    public async store({ request, response }: HttpContextContract) {
        try {
            const userCreate = schema.create({
                username: schema.string({ trim: true }, [rules.regex(/^[a-zA-Z0-9_]+$/), rules.unique({ table: 'users', column: 'username' }), rules.minLength(2), rules.maxLength(24)]),
                email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'email' }), rules.minLength(7), rules.maxLength(102)]),
                password: schema.string({}, [rules.minLength(6), rules.maxLength(255)]),
            });

            const validatedData = await request.validate({
                schema: userCreate,
                messages: {
                    required: "{{ field }} is required.",
                    unique: "This {{ field }} is already taken.",

                    "username.regex": "Only letters, numbers, and underscores are allowed.",
                    "username.minLength": "Username must be at least 2 characters.",
                    "username.maxLength": "Username must be at most 24 characters.",

                    "email.email": "Your email adress is right?",
                    "email.minLength": "Email adress must be at least 7 characters.",
                    "email.maxLength": "Email adress must be at most 102 characters.",

                    "password.minLength": "Password must be at least 6 characters.",
                    "password.maxLength": "Password  must be at most 255 characters.",
                },
            });

            await User.create({
                username: validatedData.username,
                email: validatedData.email,
                password: validatedData.password,
            });

            response.status(201);

            const res = {
                message: "User created successfully.",
                data: User
            }

            return res
        }
        
        catch (err) {
            return err
        }
    }

    public async login({ request, response }: HttpContextContract) {
        const body = request.body();

        const userLogin = schema.create({
            email: schema.string({ trim: true }, [rules.email(), rules.exists({ table: 'users', column: 'email' })]),
            password: schema.string(),
        });

        const validatedData = await request.validate({
            schema: userLogin,
            messages: {
                required: "{{ field }} is required.",
                "email.email": "Your email adress is right?",
                "email.exists": "Incorrect email or password.",
            }
        })

        const user = await User.findBy("email", validatedData.email);

        if (user && await Hash.verify(user.password, validatedData.password)) {
            return "logado";
        }

        return "deslogado";
    }
}
