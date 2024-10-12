<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Vision -->
        <div class="row">
          <h3>Vision</h3>
          <p>
            <strong> • End Hunger:</strong> Work towards a world where everyone has enough to eat.
          </p>
          <p>
            <strong> • Build Community:</strong> Create a strong, supportive network that helps
            fight hunger together.
          </p>
          <p>
            <strong> • Inspire Action:</strong> Encourage people and groups to join in the effort to
            end food insecurity.
          </p>
        </div>

        <!-- Mission -->
        <div class="row">
          <h3>Mission</h3>
          <p>
            <strong> • Make Giving Easy:</strong> Provide a simple way for people to donate,
            volunteer, and get help with food.
          </p>
          <p>
            <strong> • Improve Operations:</strong> Give our team the tools they need to manage
            donations, volunteers, and charities smoothly.
          </p>
          <p>
            <strong> • Simplify Participation:</strong> Make it easy for donors and volunteers to
            get involved and make a difference.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Sign up newsletter -->
        <h3 class="mb-3">Sign Up for Newsletter</h3>
        <button type="button" class="btn btn-primary mb-3" @click="signUpNewsletter">
          Sign Up
        </button>
        <div v-if="message" class="text-success">{{ message }}</div>
        <div v-if="errorMessage" class="text-danger">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore'

const db = getFirestore()
const email = ref(localStorage.getItem('email'))
const message = ref('')
const errorMessage = ref('')

// Fetch existing emails from Firestore
const fetchNewsletterEmails = async () => {
  const newsletterCollection = collection(db, 'newsletter')
  const snapshot = await getDocs(newsletterCollection)
  return snapshot.docs.map((doc) => doc.data().email)
}

// Sign up Newsletter function
const signUpNewsletter = async () => {
  const existingEmails = await fetchNewsletterEmails()

  // Check if user email is already in the newsletter
  if (existingEmails.includes(email.value)) {
    errorMessage.value = 'This email is already signed up for the newsletter.'
    message.value = ''
    return
  }

  // If not, add the email to Firestore
  try {
    await addDoc(collection(db, 'newsletter'), { email: email.value })
    message.value = 'Thank you for signing up for the newsletter!'
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = 'Failed to sign up. Please try again.'
    message.value = ''
    console.error(error)
  }
}
</script>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}
</style>
