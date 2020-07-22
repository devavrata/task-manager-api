
const sendgrid = require('@sendgrid/mail')

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

sendgrid.send({
    to: 'devthunderster@gmail.com',
    from: 'devthunderster@gmail.com',
    subject: 'Hello Sendgrid from Node Devavrata',
    text: 'Hello whats up what is happening, succefully completing NodeJS course'
})

const sendWelcomeEmail = (destinationEmail, username) => {
    sendgrid.send({
        to: destinationEmail,
        from: 'devthunderster@gmail.com',
        subject: 'Thanks for Joining in',
        text: 'Hello, \n'+username+'\nWelcome to task manager app, Hope you will find it useful!'

    })
}

const sendCancellationEmail = (destinationEmail, username) => {
        sendgrid.send({
            to: destinationEmail,
            from: 'devthunderster@gmail.com',
            subject: 'Sad to see you go!',
            text: 'Hello, \n'+username+'\nHope to see you sometime soon.'
    
        })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}