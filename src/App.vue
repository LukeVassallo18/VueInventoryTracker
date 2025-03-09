<script setup>
import { useRouter } from 'vue-router';
import * as bootstrap from 'bootstrap';


const handleNavLinkClick = () => {
  const navbarCollapse = document.getElementById('navbarNav');
  if (navbarCollapse.classList.contains('show')) {
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
      toggle: false
    });
    bsCollapse.hide();
  }
};
</script>

<template>
  <header>
    <!--- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light" style="z-index: 1050;">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Personal Inventory Tracker</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" @click="handleNavLinkClick">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/add" class="nav-link" @click="handleNavLinkClick">Add</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/search" class="nav-link" @click="handleNavLinkClick">Search</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
    <router-view />
</template>

<style scoped>

.navbar {
  background-color: #7E99A3 !important;
}

.navbar-brand, .nav-link {
  color: #F4EDD3 !important;
  padding: 10px;
  border-radius: 10px;
  margin: 5px;
}

.nav-link:hover {
  color: #4A628A !important;
  background-color: #F4EDD3; /* Add scale transform on hover */
}

.navbar-collapse {
  justify-content: flex-end;
}
</style>