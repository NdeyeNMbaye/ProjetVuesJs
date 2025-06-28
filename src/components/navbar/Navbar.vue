<template>
  <nav class="custom-navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand">Projet Vues Js </router-link>

      <!-- Menu (inline for desktop) -->
      <ul class="navbar-links">
        <li><router-link to="/offre" class="nav-link">Offres</router-link></li>
        <li><router-link to="/voyage" class="nav-link">Voyages</router-link></li>

        <!-- Dropdown -->
        <li class="dropdown">
          <span class="nav-link dropdown-toggle">Plus ▼</span>
          <ul class="dropdown-menu">
            <li><a href="#">Flottes</a></li>
            <li><a href="#">Reservations</a></li>
            <li><a href="#">Autre...</a></li>
          </ul>
        </li>
      </ul>

      <!-- Barre de recherche -->
      <div class="search-box">
        <input type="text" placeholder="Rechercher..." />
      </div>
    </div>
  </nav>
</template>

<script setup>
// router-link global dans Vue 3
</script>

<style scoped>
.custom-navbar {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 10px 20px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 22px;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  position: relative;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #007bff;
}

.router-link-exact-active {
  color: #28a745;
  border-bottom: 2px solid #28a745;
}

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  cursor: pointer;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 120%;
  left: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  min-width: 140px;
  padding: 10px 0;
  z-index: 1001;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu li {
  padding: 8px 16px;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}

/* Search Box */
.search-box input {
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
  width: 160px;
  transition: width 0.3s;
}

.search-box input:focus {
  width: 200px;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .navbar-links {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  .search-box {
    margin-top: 10px;
    width: 100%;
  }
}
</style>
