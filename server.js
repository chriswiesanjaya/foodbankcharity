import express from 'express'
import sgMail from '@sendgrid/mail'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000
app.use(cors()) // This allows all origins

// Set SendGrid API key
sgMail.setApiKey('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')

app.use(bodyParser.json({ limit: '10mb' })) // Increase the limit for larger attachments

// Endpoint to send email
app.post('/send-email', async (req, res) => {
  console.log('sending...')
  const { to, from, subject, text, attachment } = req.body

  const msg = {
    to,
    from,
    subject,
    text,
    attachments: []
  }

  // Only add attachments if they are present
  if (attachment) {
    msg.attachments.push({
      content: attachment.content.split(',')[1], // Extract the base64 part
      filename: attachment.name, // Use the name from the attachment object
      type: attachment.type, // Use the type from the attachment object
      disposition: 'attachment'
    })
  }

  try {
    await sgMail.send(msg)
    return res.status(200).json({ success: true, message: 'Email sent successfully.' })
  } catch (error) {
    console.error('Error sending email:', error)
    return res.status(500).json({ success: false, message: 'Failed to send email.' })
  }
})

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
