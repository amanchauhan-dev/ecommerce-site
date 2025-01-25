import { transport } from "./emailConfig"

export const EmailVerify = async ({ emailId, url }: { emailId: string, url: string }) => {
    try {
        const response = await transport.sendMail({
            from: '"From Backend 👨‍💼" <BazzarVibe>',
            to: emailId,
            subject: "Email verification", // Subject line
            html: `
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body>
                <h1 class="text-align:center; font-size:1.5rem;background-color:blue;color:white;">Email Verification</h1>
                <br/>
                <a href='${url}' >Click To verify</a>
            </body>
            </html>
            `,
        })
        return response
    } catch (error: any) {
        console.log(error)
        return error
    }
}