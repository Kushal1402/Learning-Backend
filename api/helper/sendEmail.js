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
        return error;
    }
}

exports.sendOtpMail = (to, subject, message) => {
    try {
        const mailtemplate = otpMailTemplate(message);

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
            html: mailtemplate
        })

        return info
    } catch (error) {
        console.log(error)
        return error;
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
                        
                        <div style="display:flex; justify-content:center">
                            <img src='${logo}'  alt="logo" style="width:100px; height=auto;" />
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

const otpMailTemplate = (otp) => {

    let logo = process.env.URL + 'uploads/crunchy-bites-logo.png'

    let EmailBody =
        `<!DOCTYPE html>
            <html>
                <head>
                    <title>Signup email verification OTP</title>

                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    
                    <link
                        href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                        rel="stylesheet"
                    />

                    <style>
                    body,
                    table,
                    td,
                    a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }

                    table,
                    td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }

                    img {
                        -ms-interpolation-mode: bicubic;
                    }

                    /* RESET STYLES */
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }

                    table {
                        border-collapse: collapse !important;
                    }

                    body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }

                    @media screen and (max-width: 600px) {
                        h1 {
                        font-size: 30px !important;
                        line-height: 34px !important;
                        }

                        h2 {
                        font-size: 18px !important;
                        line-height: 26px !important;
                        }

                        .profile {
                        width: 180px;
                        }
                    }
                    </style>
                </head>

                <body
                    style="
                        margin: 0 !important;
                        padding: 0 !important;
                        font-family: 'Rubik', sans-serif;
                    "
                >
                    <div style="max-width: 900px; margin: 0 auto; padding: 0; width: 100%">
                    <table
                        border="0"
                        bgcolor="#566DCB"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                    >
                        <tr>
                        <td
                            bgcolor="#566DCB"
                            align="center"
                            style="
                            padding-top: 30px;
                            padding-bottom: 25px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            text-align: center;
                            "
                        >
                            <img src='${logo}' alt="logo" width="80px" />
                        </td>
                        </tr>
                        <!-- body content -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="display:flex; justify-content:center;">
                        <tbody>
                            <tr>
                            <td
                                bgcolor="#fff"
                                style="
                                padding: 19px 33px 16px 33px;
                                color: #200e32;
                                "
                            >
                                <p style="font-size: 20px; margin: 0">
                                Here is your <b>One Time Password</b>
                                </p>
                            </td>
                            </tr>
                            <tr>
                            <td
                                bgcolor="#fff"
                                style="padding: 0 33px 0 33px; color: #200e32; display:flex; justify-content:center;"
                            >
                                <p style="font-size: 20px; line-height: 28px; margin: 0">
                                to validate your email address
                                </p>
                            </td>
                            </tr>
                            <tr style="display:flex; justify-content:center;">
                                <td
                                    bgcolor="#fff"
                                    style="margin:0; font-weight:100; font-size:40px"
                                >
                                    <p style="margin-top:10px; margin-bottom:10px">${otp}</p>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                        <!-- footer -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                            <tr>
                            <td
                                align="center"
                                bgcolor="#EEF0FA"
                                style="padding: 12px; color: #566dcb"
                            >
                                <p
                                style="
                                    text-align: center;
                                    font-size: 14px;
                                    line-height: 20px;
                                    margin: 0;
                                "
                                >
                                Sent by Testing Project | Copyright company, 2023
                                </p>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </table>
                    </div>
                </body>
            </html>`

    return EmailBody;
}