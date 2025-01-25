import nodemailer from 'nodemailer'
// Looking to send emails in production? Check out our Email API/SMTP product!
export const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    // user: process.env.EMAIL_USER || '',
    // pass: process.env.EMAIL_PASS || ''
     user: "d5e6b50a34a959",
    pass: "68e6fd029f9367"
  }
  
});
