const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API)

/**
 * - send Email using resend
 * - welcome-email for welcome Email
 * - security-alert for "Someone login to your account"
 * - money-sent for money transfer email
 * - money-received for money received email
 * - pass value in the form of obj in 'variables' 
 * - for welcome variables:{name,subject}
 * - for login variables:{date,device,ip,location,name,subject}
 * - for money-sent variables:{amount,receiver,transactionId,name,subject,date}
 * - for money-received variables:{amount,sender,transactionId,name,subject,date}
 */

const sendEmail = async ({ to, templateType, variables }) => {
    const { data, error } = await resend.emails.send({
        from: 'BankSys <onboarding@resend.dev>',
        to,
        template: {
            templateType,
            variables
        }
    });

    if (error) throw new Error(error.message);

    return data;
}

module.exports = sendEmail