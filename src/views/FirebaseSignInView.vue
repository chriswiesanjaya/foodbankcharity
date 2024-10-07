<template>
  <h1>Sign In</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="signin">Sign in via Firebase</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import db from '../firebase/init.js'
import { collection, query, where, getDocs } from 'firebase/firestore'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = getAuth()

const signin = async () => {
  try {
    // Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Fetch user role from Firestore
    const q = query(collection(db, 'users'), where('email', '==', user.email))
    const querySnapshot = await getDocs(q)

    let userRole = 'Role not found'
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      userRole = data.role || 'Role not found'
    })

    console.log('Firebase Sign In Successful!')
    console.log(auth.currentUser)
    console.log('User Role:', userRole)
    router.push('/')
  } catch (error) {
    console.error('Error signing in:', error.message)
  }
}
</script>
