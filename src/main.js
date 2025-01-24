import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// creating the app.vue file, using the router to be able to go from one page to 
// another and moutning the component to the DOM for the first time
createApp(App).use(router).mount('#app')