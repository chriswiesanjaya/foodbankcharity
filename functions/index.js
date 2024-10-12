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

admin.initializeApp()

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})

// Submit Donation functions
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
