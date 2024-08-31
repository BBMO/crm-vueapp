import { RouteRecordRaw } from 'vue-router';

// Layouts
import LoginLayout from 'layouts/LoginLayout/LoginLayout.vue';
import MainLayout from 'layouts/MainLayout/MainLayout.vue';

// Pages
import LoginPage from 'pages/AuthenticationPage/LoginPage.vue';
import UserPage from 'pages/UserPage/UserPage.vue';
import UserDetailsPage from 'pages/UserPage/UserDetailsPage.vue';
import ContactPage from 'pages/ContactPage/ContactPage.vue';
import ContactDetailsPage from 'pages/ContactPage/ContactDetailsPage.vue';
import CalendarPage from 'pages/CalendarPage.vue';
import SettingPage from 'pages/SettingPage.vue';

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
        meta: { module: 'home' },
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: '/user',
        meta: { module: 'user' },
        children: [
          {
            name: 'user',
            path: '',
            component: UserPage
          },
          {
            name: 'userDetails',
            path: 'details',
            component: UserDetailsPage

          }
        ]
      },
      {
        path: '/contact',
        meta: { module: 'contact' },
        children: [
          {
            name: 'contact',
            path: '',
            component: ContactPage,
          },
          {
            name: 'contactDetails',
            path: 'details',
            component: ContactDetailsPage
          }
        ]
      },
      {
        name: 'calendar',
        path: '/calendar',
        meta: { module: 'calendar' },
        component: CalendarPage
      },
      {
        name: 'settings',
        path: '/settings',
        meta: { module: 'settings' },
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
