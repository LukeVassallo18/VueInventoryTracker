import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import AddPage from './components/AddPage.vue';
import SearchPage from './components/SearchPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/add', component: AddPage },
  { path: '/search', component: SearchPage }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;