<template>
  <h1>Create an Account</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p>
    <label for="role">Role:</label>
    <select v-model="role" id="role">
      <option value="member">Member</option>
      <option value="librarian">Librarian</option>
    </select>
  </p>
  <p><button @click="signup">Save to Firebase</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import db from '../firebase/init.js'
import { collection, addDoc } from 'firebase/firestore'

const email = ref('')
const password = ref('')
const role = ref('user')
const router = useRouter()
const auth = getAuth()

const signup = async () => {
  try {
    // Register user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Store the user's role in Firestore
    await addDoc(collection(db, 'users'), {
      email: user.email,
      role: role.value
    })

    console.log('Firebase Register as', role.value, 'Successful!')
    router.push('/FireLogin')
  } catch (error) {
    console.error('Error registering user:', error.message)
  }
}
</script>
