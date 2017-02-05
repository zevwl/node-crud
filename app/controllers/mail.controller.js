require('dotenv').config();

const helper = require('sendgrid').mail;


module.exports = {
    send: (fromString, toString, subjectString, bodyString) => {
        const from = new helper.Email(fromString);
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
            .then(response => {
                console.log('Status code: ', response.statusCode);
                console.log('Body: ', response.body);
                console.log('Headers: ', response.headers);
            })
            .catch(error => {
                console.log(error.response.statusCode);
                console.log(error.response);
            });
    }
};
