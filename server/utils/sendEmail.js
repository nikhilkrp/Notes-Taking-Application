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

import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email, otp) => {
  console.log(`Attempting to send email to: ${email} via Resend`);

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: 'Your OTP for Notes HD',
      html: `<p>Hello ${name},</p><p>Your OTP is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`,
    });

    if (error) {
      console.error("Error sending email via Resend:", error);
      throw error;
    }

    console.log("Email sent successfully via Resend!", data);
    
  } catch (error) {
    console.error("Caught exception while sending email:", error);
    throw error;
  }
};