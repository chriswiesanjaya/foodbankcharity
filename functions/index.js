/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https')
const logger = require('firebase-functions/logger')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
const sgMail = require('@sendgrid/mail')

admin.initializeApp()
sgMail.setApiKey('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')

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})

// Submit Donation function
exports.submitDonation = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed.')
    }

    const { name, amount } = req.body
    const charityRef = admin.firestore().collection('charities').where('name', '==', name)

    try {
      const snapshot = await charityRef.get()
      if (snapshot.empty) {
        return res.status(404).send('Charity not found.')
      }
      const docRef = snapshot.docs[0].ref
      await docRef.update({
        donation: admin.firestore.FieldValue.increment(amount)
      })
      return res.status(201).send('Donation successful! Refresh the page.')
    } catch (error) {
      return res.status(500).send('Error submitting donation.')
    }
  })
})

// Submit Volunteer function
exports.submitVolunteer = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed.')
    }

    const { name } = req.body
    const charityRef = admin.firestore().collection('charities').where('name', '==', name)

    try {
      const snapshot = await charityRef.get()
      if (snapshot.empty) {
        return res.status(404).send('Charity not found.')
      }
      const docRef = snapshot.docs[0].ref
      await docRef.update({
        volunteer: admin.firestore.FieldValue.increment(1)
      })
      return res.status(201).send('Volunteer application successful! Refresh the page.')
    } catch (error) {
      return res.status(500).send('Error submitting volunteer application.')
    }
  })
})

// Submit Rate function
exports.submitRate = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed.')
    }

    const { name, rating } = req.body
    const charityRef = admin.firestore().collection('charities').where('name', '==', name)

    try {
      const snapshot = await charityRef.get()
      if (snapshot.empty) {
        return res.status(404).send('Charity not found.')
      }
      const docRef = snapshot.docs[0].ref
      await docRef.update({
        totalRating: admin.firestore.FieldValue.increment(rating),
        numberRating: admin.firestore.FieldValue.increment(1)
      })
      return res.status(201).send('Rating submitted successful! Refresh the page.')
    } catch (error) {
      return res.status(500).send('Error submitting rating,')
    }
  })
})

// Submit Create Charity function
exports.submitCreateCharity = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed.')
    }

    const { name, location } = req.body
    const charityRef = admin.firestore().collection('charities').where('name', '==', name)

    try {
      const snapshot = await charityRef.get()
      if (!snapshot.empty) {
        return res.status(409).send('Charity with this name already exists.')
      }

      await admin.firestore().collection('charities').add({
        name: name,
        location: location,
        donation: 0,
        volunteer: 0,
        totalRating: 0,
        numberRating: 0
      })

      return res.status(201).send('Charity created successful! Refresh the page.')
    } catch (error) {
      return res.status(500).send('Error creating charity.')
    }
  })
})

// Submit Modify Charity function
exports.submitModifyCharity = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed.')
    }

    const { charity, name, location } = req.body
    const charityRef = admin.firestore().collection('charities').where('name', '==', charity)

    try {
      const snapshot = await charityRef.get()

      if (snapshot.empty) {
        return res.status(404).send('Charity not found.')
      }

      const docRef = snapshot.docs[0].ref
      await docRef.update({
        name: name,
        location: location
      })

      return res.status(200).send('Charity modification successful! Refresh the page.')
    } catch (error) {
      return res.status(500).send('Error modifying charity.')
    }
  })
})

// Submit Delete Charity function
exports.submitDeleteCharity = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed.')
    }

    const { charity } = req.body
    const charityRef = admin.firestore().collection('charities').where('name', '==', charity)

    try {
      const snapshot = await charityRef.get()

      if (snapshot.empty) {
        return res.status(404).send('Charity not found.')
      }

      const docRef = snapshot.docs[0].ref
      await docRef.delete()

      return res.status(200).send('Delete charity successful! Refresh the page.')
    } catch (error) {
      return res.status(500).send('Error deleting charity.')
    }
  })
})

// Get Charity Count API
exports.getCharityCount = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const charitiesCollection = admin.firestore().collection('charities')
      const snapshot = await charitiesCollection.get()
      const count = snapshot.size

      res.status(200).send({ count })
    } catch (error) {
      console.error('Error counting charities: ', error.message)
      res.status(500).send('Error counting charities')
    }
  })
})

// Get All Charities API
exports.getAllCharities = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const charitiesCollection = admin.firestore().collection('charities')
      const snapshot = await charitiesCollection.get()

      // Check if there are any documents
      if (snapshot.empty) {
        return res.status(404).send('No charities found')
      }

      // Extract and order data from documents
      const charities = snapshot.docs.map((doc) => ({
        name: doc.data().name,
        location: doc.data().location,
        donation: doc.data().donation,
        volunteer: doc.data().volunteer,
        totalRating: doc.data().totalRating,
        numberRating: doc.data().numberRating
      }))

      res.status(200).send(charities)
    } catch (error) {
      console.error('Error fetching charities: ', error.message)
      res.status(500).send('Error fetching charities')
    }
  })
})

// Send email newsletter
exports.sendEmail = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed.')
    }

    const { to, from, subject, text, attachment } = req.body

    const msg = {
      to,
      from,
      subject,
      text,
      attachments: []
    }

    if (attachment) {
      const matches = attachment.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
      if (matches) {
        const content = matches[2]
        const filename = `attachment_${Date.now()}.png`
        const mimeType = matches[1]

        msg.attachments.push({
          content,
          filename,
          type: mimeType,
          disposition: 'attachment'
        })
      }
    }

    try {
      await sgMail.send(msg)
      return res.status(200).send('Email sent')
    } catch (error) {
      console.error('SendGrid error:', error)
      return res.status(500).send('Error sending email')
    }
  })
})
