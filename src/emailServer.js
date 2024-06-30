// emailServer.js
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'gearwise24@gmail.com',
                pass: ' lgvy xbef mafn nbwv' //  app password 
            }
        });

        // Set email options
        const mailOptions = {
            from: 'gearwise24@gmail.com',
            to,
            subject,
            text
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendEmail;
