<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Profile</h1>
        <!-- Profile image -->
        <div class="image-container">
          <img
            src="@/assets/images/blank-profile-picture.jpeg"
            alt="Profile Image"
            class="profile-image"
          />
        </div>

        <!-- Profile email -->
        <div class="row">
          <p><strong>Email:</strong> {{ profileData.email }}</p>
        </div>

        <!-- Profile role -->
        <div class="row">
          <p><strong>Role:</strong> {{ profileData.role }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Profile user data
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
  margin-bottom: 20px;
}

.profile-image {
  max-width: 100%;
  width: 200px;
  height: auto;
}
</style>
