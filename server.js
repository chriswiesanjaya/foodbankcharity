import express from 'express'
import sgMail from '@sendgrid/mail'
import bodyParser from 'body-parser'
import cors from 'cors' // Import cors

const app = express()
const port = process.env.PORT || 3000

// Set SendGrid API key
sgMail.setApiKey('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')

// Middleware
app.use(cors()) // Enable CORS
app.use(bodyParser.json())

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Node.js!')
})

// Email sending route
app.post('/send-email', (req, res) => {
  const { to, from, subject, text } = req.body

  const msg = {
    to,
    from,
    subject,
    text
  }

  sgMail
    .send(msg)
    .then(() => {
      res.status(200).send('Email sent')
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send('Error sending email')
    })
})

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
