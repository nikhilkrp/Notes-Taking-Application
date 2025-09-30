// import nodemailer from "nodemailer";

// export const sendEmail = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Your OTP for Note App",
//     text: `Your OTP is: ${otp}`,
//   });
// };

import nodemailer from "nodemailer";

export const sendEmail = async (email, otp, name) => {
  console.log(`Attempting to send email from: ${process.env.EMAIL_USER}`);


  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  try {
    await transporter.sendMail({
      from: `"Notes HD App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Notes HD",
      text: `Hello ${name},\n\nYour OTP is: ${otp}\n\nThis code will expire in 10 minutes.`,
      html: `<p>Hello ${name},</p><p>Your OTP is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`,
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

