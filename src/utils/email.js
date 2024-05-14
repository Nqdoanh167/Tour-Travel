/** @format */

const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
const {convert} = require('html-to-text');

module.exports = class Email {
   constructor(user, url) {
      //  this.to = user.email;
      this.to = 'nqdcntt2002@gmail.com';
      this.url = url;
      this.from = `Doanh Dev <${process.env.EMAIL_USERNAME}>`;
   }

   newTransport() {
      return nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
         port: process.env.EMAIL_PORT,
         auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
         },
      });
   }

   // Send the actual email
   async send(template, subject) {
      // 1) Render HTML based on a pug template
      const html = pug.renderFile(path.join(__dirname, `templates/${template}.pug`), {
         to: this.to,
         url: this.url,
         subject,
      });

      // 2) Define email options
      const mailOptions = {
         from: this.from,
         to: this.to,
         subject,
         html,
         text: convert(html),
      };

      // 3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
   }

   async sendWelcome() {
      await this.send('welcome', 'Welcome to the Tour Travel!');
   }

   async sendPasswordReset() {
      await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
   }
};
