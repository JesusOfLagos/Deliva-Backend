import { createTransport } from 'nodemailer';

let transporter = createTransport({
    service: 'gmail',
    auth: {
        user: 'asaborodaniel@gmail.com',
        pass: process.env.MAILER_PASS
    }
});

const sendMail = async (email, subject, html) => {
    let mailOptions = {
        from: 'asaborodaniel@gmail.com',
        to: email,
        subject,
        html
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent succesfully: ' + info.response);
    } catch (error) {
        console.log(error);
    }
}

export default sendMail;