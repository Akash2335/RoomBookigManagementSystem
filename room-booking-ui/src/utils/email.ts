import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
// You need to replace these with your actual EmailJS service details
const SERVICE_ID = 'service_rjeqjx8';
const TEMPLATE_ID = 'template_acbg5hg';
const PUBLIC_KEY = 'E83_tzUmONvd8IDEB';

export const sendWelcomeEmail = async (userEmail: string, password: string) => {
  const templateParams = {
    to_email: userEmail,
    user_password: password,
    message: `Welcome to the Room Booking System! Your account has been created successfully. Your password is: ${password}`,
  };

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log('Email sent successfully:', result.text);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (userEmail: string, newPassword: string) => {
  const templateParams = {
    to_email: userEmail,
    user_password: newPassword,
    message: `Your password has been reset by an administrator. Your new password is: ${newPassword}. Please log in and change it immediately.`,
  };

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log('Password reset email sent successfully:', result.text);
    return result;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};

export const sendForgotPasswordEmail = async (userEmail: string) => {
  const templateParams = {
    to_email: userEmail,
    message: `You have requested to reset your password. Please contact the administrator to reset your password or use the reset link if available.`,
  };

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log('Forgot password email sent successfully:', result.text);
    return result;
  } catch (error) {
    console.error('Failed to send forgot password email:', error);
    throw error;
  }
};
