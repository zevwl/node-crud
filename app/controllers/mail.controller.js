if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const helper = require('sendgrid').mail;


module.exports = {
    send: function (fromEmail, fromName, toString, subjectString, bodyString) {
        const from = new helper.Email(fromEmail, fromName);
        const to = new helper.Email(toString);
        const subject = subjectString;
        const content = new helper.Content('text/plain', bodyString);

        const mail = helper.Mail(from, subject, to, content);

        const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
        const request = sendgrid.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sendgrid.API(request)
            .then(response => {})
            .catch(error => {
                console.log(error.response.statusCode);
                console.log(error.response);
            });
    },

    sendSimple: function (to, subject, content) {
        this.send('mail@olympics-events.herokuapp.com', 'Olympic events', to, subject, content);
    }
};
