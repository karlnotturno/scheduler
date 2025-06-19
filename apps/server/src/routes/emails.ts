import {Router} from 'express';
import {User} from '../models/User';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import fs from 'fs';
import path from 'path';

const router = Router();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
} as SMTPTransport.Options);

router.post('/', async (req, res) => {
  const { to } = req.body;

  const verify = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const user = new User({ email: to, verify });
    await user.save();

    // Load and inject code into HTML template
    const htmlPath = path.join(__dirname, '..', 'templates', 'verification.html');
    const rawHtml = fs.readFileSync(htmlPath, 'utf8');
    const html = rawHtml.replace('{{code}}', verify);

    const info = await transporter.sendMail({
      from: '"Coffee at K Street" <verify@kstreet.show>',
      to,
      subject: 'Coffee Verification Code',
      text: `Your verification code is ${verify}`,
      html,
      attachments: [
        {
          filename: 'dome.png',
          path: path.join(__dirname, '..', 'templates', 'dome.png'),
          cid: 'emailImage',
          contentDisposition: 'inline',
          contentType: 'image/png'
        }
      ]
    });

    res.json({ message: 'Email sent', id: info.messageId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

export default router;
