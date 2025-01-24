<!--

This Vue component represents a search page for a Personal Inventory Tracker application. 
It includes a navigation bar, a search input, and a section to display search results.

Template:
- Header with a navigation bar containing links to Home, Add, and Search pages.
- A search input field with a button to trigger the search.
- A section to display search results in a list format.
- An image and a large search icon for visual enhancement.

Script:
- Uses Vue's Composition API with `ref` to manage reactive state.
- `searchQuery`: A reactive reference to store the search input value.
- `searchResults`: A reactive reference to store the search results.
- `searchItem`: An asynchronous function to fetch items from a Firebase database and filter them based on the search query.

Styles:
- Scoped CSS to style the component.
- Flexbox layout for the container and search container.
- Custom styles for the navigation bar, search results, and responsive design adjustments for smaller screens.
- Background gradient applied to the body element.

Dependencies:
- Vue.js
- Bootstrap for styling
- Font Awesome for icons
-->
<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Personal Inventory Tracker</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/add" class="nav-link">Add</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/search" class="nav-link">Search</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <div class="container mt-5">
    <div class="search-container input-group mb-3">
      <input type="search" class="form-control" placeholder="Search Item By Name..." aria-label="Search" v-model="searchQuery">
      <button class="btn btn-primary" @click="searchItem">
        <i class="fas fa-search"></i> Go
      </button>
    </div>

    <div class="result-container">
      <h2>Search Results</h2>
      <ul class="list-group">
        <li v-for="item in searchResults" :key="item.code" class="list-group-item">
          <h5><strong>{{ item.name }}</strong></h5>
          <p>Quantity: {{ item.quantity }}</p>
          <p>Item Code: <strong>{{ item.code }}</strong></p>
        </li>
      </ul>
      <div class="search-icon-container">
        <i class="fas fa-search fa-10x"></i>
      </div>
    </div>
    <img src="../assets/seo.png" alt="" width="20%" height="20%">
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const searchResults = ref([]);

const searchItem = async () => {
  try {
    const response = await fetch('https://vueusers-18567-default-rtdb.europe-west1.firebasedatabase.app/items.json');
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    const data = await response.json();
    searchResults.value = Object.values(data).filter(item => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

}

.search-container {
  width: 50%;

  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.result-container {
  width: 100%;
  margin-top: 20px;
}
.search-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

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
  background-color: #F4EDD3;
}

body {
  overflow-x: hidden;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #F4EDD3 50%, #7E99A3 50%);
  z-index: -1;
  overflow: hidden;
}

h2 {
  background-color: rgb(102, 102, 102);
  color: white;
  text-align: center;
  padding: 20px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-group-item h5 {
  margin: 0;
}

.list-group-item p {
  margin: 0;
}

@media screen and (max-width: 990px) {
  .container {
    flex-direction: column;
    align-items: center;
  }
  .search-container {
    width: 100%;
  
  }
  .search-icon-container i {
    font-size: 5rem;
  }
  .result-container {
    width: 100%;
    font-size: small;
  }


}

.navbar-collapse {
  justify-content: flex-end;
}
</style>