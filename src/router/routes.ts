import { RouteRecordRaw } from 'vue-router';

// Layouts
import LoginLayout from 'layouts/LoginLayout/LoginLayout.vue';
import MainLayout from 'layouts/MainLayout/MainLayout.vue';

// Pages
import LoginPage from 'pages/LoginPage/LoginPage.vue';
import SettingPage from 'pages/SettingPage/SettingPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
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
    path: '',
    component: MainLayout,
    children: [
      {
        name: 'home',
        path: '/home',
        component: () => import('pages/IndexPage.vue')
      },
      {
        name: 'settings',
        path: '/settings',
        component: SettingPage,
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
