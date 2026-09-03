const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API)

/**
 * - send Email using resend
 * - welcome for welcome Email
 * - login for "Some on login to your account"
 * - pass value in the form of obj in 'variables' 
 * - for welcome variables:{name,subject}
 * - for login variables:{date,device,ip,location,name,subject}
 */

const sendEmail = async ({ to, templateType, variables }) => {
    let id
    if (templateType.toLowerCase() === 'welcome') id = 'welcome-email'
    if (templateType.toLowerCase() === 'login') id = 'security-alert'

    const { data, error } = await resend.emails.send({
        from: 'BankSys <onboarding@resend.dev>',
        to,
        template: {
            id,
            variables
        }
    });

    if (error) throw new Error(error.message);

    return data;
}

module.exports = sendEmail