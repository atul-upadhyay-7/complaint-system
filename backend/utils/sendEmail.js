const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async (options) => {
    let transporter;

    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        // Use actual SMTP if provided in .env
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });
    } else {
        // Hackathon Demo Mode: Use Ethereal fake SMTP
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    const message = {
        from: `${process.env.FROM_NAME || 'Uniissuehub Support'} <${process.env.FROM_EMAIL || 'noreply@campusdesk.edu'}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    const info = await transporter.sendMail(message);

    if (!process.env.SMTP_EMAIL) {
        logger.info(`📧 Fake Email sent to ${options.email}. Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
        logger.info(`📧 Real Email sent to ${options.email}`);
    }
};

module.exports = sendEmail;
