import nodemailer from "nodemailer";
import { options } from "../scraper.config.mjs";
import { logger } from "./logger.mjs";

const { email } = options;

const transporter = nodemailer.createTransport({
  ...email.nodemailer,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

// Default to false if not specified in the config
const isEmailEnabled = email.enabled || false;

export const sendMail = async (mailOptions) => {
  if (!isEmailEnabled) {
    logger.info("Email notification is disabled!");
    return;
  }

  try {
    // Verify if the transporter is ready
    await transporter.verify();
    logger.info("Server is ready to take our messages");

    // Send the mail
    const info = await transporter.sendMail({
      from: email.from,
      to: email.to,
      ...mailOptions,
    });

    logger.info("Email sent successfully. MessageId: ", info.messageId);

    return info; // Return the response for further use if needed
  } catch (error) {
    logger.error("Failed to send email", error);
    throw error; // Re-throw the error for the caller to handle
  }
};
