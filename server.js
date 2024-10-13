import express from 'express'
import sgMail from '@sendgrid/mail'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

// Set SendGrid API key
sgMail.setApiKey('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')

// Middleware
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' })) // Increase the limit for larger attachments

app.post('/send-email', (req, res) => {
  const { to, from, subject, text, attachment } = req.body

  // Log the email details for debugging
  console.log('Email details:', { to, from, subject, text, attachment })

  if (!to) {
    return res.status(400).send('Recipient email is required.')
  }

  const msg = {
    to,
    from,
    subject,
    text,
    attachments: []
  }

  // Handle attachment if provided
  if (attachment) {
    const matches = attachment.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (matches) {
      const content = matches[2] // base64 content
      const filename = `attachment_${Date.now()}.png` // Change extension based on your needs
      const mimeType = matches[1]

      msg.attachments.push({
        content, // base64 content
        filename, // name of the file
        type: mimeType, // MIME type
        disposition: 'attachment'
      })

      // Log the attachment details for debugging
      console.log('Attachment added:', { filename, mimeType })
    } else {
      console.error('Attachment format is incorrect')
    }
  }

  sgMail
    .send(msg)
    .then(() => {
      res.status(200).send('Email sent')
    })
    .catch((error) => {
      console.error('SendGrid error:', error)
      res.status(500).send('Error sending email')
    })
})

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
