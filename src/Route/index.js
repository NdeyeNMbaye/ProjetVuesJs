import { createRouter, createWebHistory } from 'vue-router'

import Offre from '../components/offre/Offre.vue'
import HelloWorld from '../components/HelloWorld.vue'
import Navbar from '../components/navbar/Navbar.vue'
import Voyage from '../components/voyage/Voyage.vue'

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/offre', component: Offre },
   { path: '/navbar', component: Navbar },
 { path: '/voyage', component: Voyage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router