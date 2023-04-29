const nodemailer = require("nodemailer");
const fs = require("fs")

// Function to send Email //
exports.sendProductMail = async (to, subject, message) => {
    try {
        const mailtemplate = await MailTemplate(message);

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_AUTH_USER,
                pass: process.env.EMAIL_AUTH_PASS
            }
        })

        const info = transporter.sendMail({
            from: process.env.EMAIL_AUTH_USER,
            to: to,
            subject: subject,
            html: mailtemplate,
            // attachments: [{
            //     filename: 'gastro-main-logo.png',
            //     path: 'uploads/gastro-main-logo.png',
            //     cid: 'logo@saturncube.com'
            // }]
        })
        return info
    } catch (error) {
        console.log(error)
        return err
    }
}
{/* <img src="cid:logo@saturncube.com" style="width:40px; height:40px"/> */ }
const MailTemplate = (data) => {
    let logo = process.env.URL + 'uploads/crunchy-bites-logo.png'

    let emailBody = `
        <!doctype html>
            <htlm xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

                <head>
                    <title>Product</title>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1">
                </head>

                <body>
                    <div style="margin:8px">
                        
                        <div style="display:flex; justify-content:center; text-align:center!important">
                            <img src='${logo}' alt="logo" style="width:100px; height=auto;" />
                        </div>

                        <br >
                        <h2> Your product ${data?.name} is added .</h2>

                        <div style="border:3px solid red; padding:15px">
                            <div style="display:flex;justify-content:center;font-size:16px">
                                <h5 style="margin:0; padding:0">Order Number : </h5> <b>${data?.order_num}</b>
                            </div>
                        </div>

                        <h4 style="text-transform:uppercase; text-decoration:underline; margin-top:8px; margin-bottom:8px">Product summary</h4>
                        
                        <div style="marging-top:5px;display:flex">
                            <table style="width:100%;font-size:16px">
                                <thead style="text-align: center;">
                                    <tr>
                                        <th style="border-top:3px solid #0000001c; border-bottom:3px solid #0000001c; border-radius:5px">Name</th>
                                        <th style="border-top:3px solid #0000001c; border-bottom:3px solid #0000001c; border-radius:5px">Price (INR)</th>
                                        <th style="border-top:3px solid #0000001c; border-bottom:3px solid #0000001c; border-radius:5px">Category</th>
                                    </tr>
                                </thead>
                                <tbody style="text-align: center;">
                                    <tr>
                                        <td>${data?.name}</td>
                                        <td>${data?.price}</td>
                                        <td>${data?.category}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <br />
                    </div>
                </body>

            </html>
    `

    return emailBody
}