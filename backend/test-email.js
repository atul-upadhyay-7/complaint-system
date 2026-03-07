const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
    try {
        console.log('Testing SMTP connection with:');
        console.log('User:', process.env.SMTP_EMAIL);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const info = await transporter.sendMail({
            from: `"UniIssueHub" <${process.env.SMTP_EMAIL}>`,
            to: process.env.SMTP_EMAIL, // sending to yourself to verify
            subject: '✅ UniIssueHub SMTP Connected!',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2 style="color: #2563eb;">It works perfectly! 🎉</h2>
                    <p>Your new Gmail App Password for <strong>${process.env.SMTP_EMAIL}</strong> is fully operational.</p>
                </div>
            `
        });

        console.log('Test email sent successfully! Message ID:', info.messageId);
    } catch (error) {
        console.error('Failed to send test email:');
        console.error(error.message);
    }
};

testEmail();
