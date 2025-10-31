import nodemailer from "nodemailer";

export async function sendResetEmail(email: string, link: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
    });
}
