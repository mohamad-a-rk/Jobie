const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMassege = (email, name) => {
    sgMail.send({
        from: 'mohamad.kukhun@gmail.com',
        to: email,
        subject: 'Welcome on board !',
        text: `Welcome to our website ${name}. Enjoy using our services !`
    })
}

const sendFinalMassege = (email, name) => {
    sgMail.send({
        from: 'mohamad.kukhun@gmail.com',
        to: email,
        subject: 'What\'s wrong  !',
        text: `can you tell us why did you left our website ${name} !`
    })
}

module.exports = {
    sendWelcomeMassege,
    sendFinalMassege
}