import { RouteRecordRaw } from 'vue-router';

// Layouts
import LoginLayout from 'layouts/LoginLayout/LoginLayout.vue';

// Pages
import LoginPage from 'pages/LoginPage/LoginPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LoginLayout,
    children: [
      {
        name: 'login',
        path: '',
        component: LoginPage,
      }
    ],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
