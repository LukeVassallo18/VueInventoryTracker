import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import AddPage from './components/AddPage.vue';
import SearchPage from './components/SearchPage.vue';

// Routing to all of the components of the project.
const routes = [
  { path: '/', component: HomePage },
  { path: '/add', component: AddPage },
  { path: '/search', component: SearchPage }
];

// overriding router method and populating it with the routes of the available components
const router = createRouter({
  // webHashHistory is used when a web applicaiton has no host, it uses the filename in the URL
  history: createWebHashHistory(),
  routes
});

export default router;