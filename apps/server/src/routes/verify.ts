import {Router} from 'express';
import {Verify, User} from '../models/User';
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

router.post('/send-email', async (req, res) => {
  const { email } = req.body;

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await Verify.find({email}).deleteMany()
    const verify = new Verify({ email, code });
    await verify.save();

    // Load and inject code into HTML template
    const htmlPath = path.join(__dirname, '..', 'templates', 'verification.html');
    const rawHtml = fs.readFileSync(htmlPath, 'utf8');
    const html = rawHtml.replace('{{code}}', code);

    const info = await transporter.sendMail({
      from: '"Coffee at K Street" <verify@kstreet.show>',
      to: email,
      subject: `Coffee Verification Code: ${code}`,
      text: `Your verification code is ${code}.`,
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

router.post('/check-code', async (req, res) => {
  const { email, code } = req.body;
  const verify = await Verify.find({email, code})
  console.log(verify)
  if (verify.length === 1){
    await Verify.find({email, code}).deleteMany();
    res.status(200).json('Verified')
  } else res.status(401).json('Not verified');
})

// router.get('/', async (req, res) => {
//   const emails = await User.find().sort({createdAt: -1});
//   res.json(emails)
// })

// router.delete('/', async (req, res) => {
//   const emails = await User.find().deleteMany();
//   res.json('deleted')
// })

export default router;
