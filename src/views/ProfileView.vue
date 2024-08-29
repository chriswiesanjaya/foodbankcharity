<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Profile</h1>
        <div class="image-container">
          <img
            src="@/assets/images/blank-profile-picture.jpeg"
            alt="Profile Image"
            class="profile-image"
          />
        </div>
        <div class="row">
          <h3>Email: {{ profileData.email }}</h3>
        </div>
        <div class="row">
          <h3>Role: {{ profileData.role }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Profile data
const profileData = ref({
  email: localStorage.getItem('email'),
  role: localStorage.getItem('role')
})
</script>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

.image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px; /* Adjust as needed */
}

.profile-image {
  max-width: 100%; /* Ensure the image doesn't overflow its container */
  width: 200px; /* Adjust size as needed */
  height: auto;
}
</style>
