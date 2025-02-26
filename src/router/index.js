import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import LoginView from '../views/LoginView.vue'
import ChatDetailView from '../views/ChatDetailView.vue'
import { auth, authReady } from '@/firebase'
import Main from "../views/index.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: Main
    },
    {
      path: '/sign-up',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/sign-in',
      name: 'signIn',
      component: LoginView
    },
    {
      path: '/chat',
      name: 'chat',
      component: HomeView,
      meta: { layout: 'LayoutSidebar', requiresAuth: true }
    },
    {
      path: '/chat/:id',
      name: 'chatDetailView',
      component: ChatDetailView,
      meta: { layout: 'LayoutSidebar', requiresAuth: true }
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  await authReady;
  const isAuthenticated = !!auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !isAuthenticated) {
    next('/sign-in');
  }
  else if ((to.path === '/sign-in' || to.path === '/sign-up') && isAuthenticated) {
    next('/chat');
  }
  else {
    next();
  }
});

export default router;
