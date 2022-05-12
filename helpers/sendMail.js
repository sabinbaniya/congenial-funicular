const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = (to, token) => {
  try {
    async function main() {
      let message = `
    <h1>Verify your email by clicking the link below:</h1>
    <a href=http://localhost:3000/verify-email/${token}>Verify Email</a>
    <p>This is a auto-generated email, please don't reply to this email.</p>
    `;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sabin.chatapp@gmail.com",
          pass: process.env.EMAIL_PASS,
        },
      });

      let mailOptions = {
        from: "sabin.chatapp@gmail.com",
        to,
        subject: "User Account Verification for Chat App",
        html: message,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return true;
    }

    main();
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = sendMail;
