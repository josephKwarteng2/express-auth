import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const sendVerificationEmail = async (email: string) => {
  try {
    const verificationToken = jwt.sign(
      { email },
      process.env.EMAIL_SECRET_KEY || "",
      { expiresIn: "15m" }
    );

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true,
      logger: true,
    });

    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="
            display: inline-block; 
            padding: 10px 20px; 
            background-color: #4CAF50; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px;
          ">Verify Email</a>
          <p>If the button doesn't work, copy and paste this link in your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });

    return verificationToken;
  } catch (error) {
    throw new Error("Failed to send verification email");
  }
};
