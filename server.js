const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like Yahoo, Outlook, etc.
    auth: {
        user: 'ankityadav9621503357@gmail.com', // Replace with your email
        pass: 'cpbh masv qsuh evsi'  // Replace with your email password or app-specific password
    }
});

app.post('/contact', [
    check('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('phone').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits long')
                  .matches(/^[1-9][0-9]{9}$/).withMessage('Phone number must not start with 0'),
    check('message').isLength({ min: 5 }).withMessage('Message must be at least 5 characters long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, message } = req.body;

    console.log('Contact form submitted:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Message:', message);

    const mailOptions = {
        from: 'ankityadav9621503357@gmail.com', // Sender address
        to: 'shreekrishnapgboys@gmail.com',   // List of recipients
        subject: 'New Contact Form Submission', // Subject line
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}` // Plain text body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error while sending email');
        }
        console.log('Email sent: ' + info.response);
        res.send('Form submitted successfully');
    });
});

// Start the server
app.listen(port,"0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${port}`);
});
