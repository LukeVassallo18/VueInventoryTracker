// filepath: /c:/Users/lukev/OneDrive/Desktop/MCAST/6.2A/Client Side Scripting/InventoryTracker/src/router.js
import { createRouter, createHashWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import AddPage from './components/AddPage.vue';
import SearchPage from './components/SearchPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/add', component: AddPage },
  { path: '/search', component: SearchPage }
];

const router = createRouter({
  history: createHashWebHistory(),
  routes
});

export default router;