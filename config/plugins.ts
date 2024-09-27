require('dotenv').config()

export default ({ env }) => ({
    email: {
        config: {
            provider: process.env.EMAIL_PROVIDER,
            providerOptions: {
                host: process.env.EMAIL_SMTP_HOST,
                port: process.env.EMAIL_SMTP_PORT,
                auth: {
                    user: process.env.EMAIL_SMTP_USER,
                    pass: process.env.EMAIL_SMTP_PASS,
                },
            },
            settings: {
                defaultFrom: process.env.EMAIL_SMTP_USER,
            },
        },
    },
});
