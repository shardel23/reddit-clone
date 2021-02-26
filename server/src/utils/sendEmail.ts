import nodemailer from "nodemailer";

const SERVER_EMAIL_ADDRESS = "reddit-client@example.com";
const MAILTRAP_TEST_USER = "4f324c3ff4f5c5";
const MAILTRAP_TEST_PASSWORD = "96cbf527e8f41d";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (mailOptions: MailOptions) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_TEST_USER,
      pass: MAILTRAP_TEST_PASSWORD,
    },
    connectionTimeout: 3 * 1000,
  });

  transporter.sendMail(
    { from: SERVER_EMAIL_ADDRESS, ...mailOptions },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
};
