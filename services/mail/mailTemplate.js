import sendMail from './nodemailer';

export default sender = {
    name: 'Daniel',
    position: 'Chief Support Officer',
    company: 'Deliva Pro',
    email: "asaborodaniel@gmail.com"
}

export const sendSignupMail = async (member) => {
    const subject = `Thank you for joining Us!`;
    const content = `<!DOCTYPE html><html><head><title>Thank You for Joining!</title></head><body><p>Dear ${member.name ? member.name : "Friend"},</p><p>Thank you for joining us! We're excited to have you on board. If you need any help, reach out to us at ${sender.email}. Welcome!</p><p>Best regards,<br>${sender.name}</p></body></html>`;
    await sendMail(member.email, subject, content);

}
export const sendResetMail = async (member, resetLink) => {
    const subject = 'Account Password Reset - Your Access Restoration';
    const content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Account Password Reset</title></head><body><p>Dear ${member.name ? member.name : "Friend"},</p><p>To reset your account password, please follow this link: <a href="${resetLink}">Password Reset Link</a></p><p>If you didn't request a password reset, please ignore this email.</p><br><p>And if you need any assistance, feel free to reach out to me.</p><p>Thank you,<br><br><b>${sender.name}</b><br>${sender.position}<br>${sender.company}</p></body></html>`;
    await sendMail(member.email, subject, content);
}

export const sendConfirmResetMail = async () => {
    const message = {
        subject: 'Password Changed',
        text:
            `You are receiving this email because you changed your password. \n\n` +
            `If you did not request this change, please contact us immediately.`
    };

    return message;
}

export const sendRiderConfirmationMail = (host, { resetToken, email }) => {
    const message = {
        subject: 'Rider Registration',
        text: `${'Congratulations! Your application has been accepted. Please complete your Rider\'s account setup by clicking on the link below. \n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://'
            }${host}/rider-signup/${resetToken}?email=${email}\n\n`
    };

    return message;
};


export const sendContactEmail = () => {
    const message = {
        subject: 'Contact Us',
        text: `We received your message! Our team will contact you soon. \n\n`
    };

    return message;
};

export const sendRiderApplicationEmail = () => {
    const message = {
        subject: 'Be a Rider on Deliva Pro',
        text: `We received your request! Our team will contact you soon. \n\n`
    };

    return message;
};

export const sendUserDeactivateAccount = () => {
    const message = {
        subject: 'Rider account on Deliva Pro (Status)',
        text:
            `Your Rider\'s account has been disabled. \n\n` +
            `Please contact admin to request access again.`
    };

    return message;
};