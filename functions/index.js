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
