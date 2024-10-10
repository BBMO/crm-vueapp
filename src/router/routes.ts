import { RouteRecordRaw } from 'vue-router';

/**
 * Layouts
 */
import MainLayout from 'layouts/MainLayout/MainLayout.vue';
import MainLayoutWeb from 'layouts/MainLayout/MainLayoutWeb.vue';

/**
 * Pages
 */
import DashboardPage from 'pages/DashboardPage.vue';
import AgentPage from 'pages/AgentPage/AgentPage.vue';
import AgentDetailsPage from 'pages/AgentPage/AgentDetailsPage.vue';
import ContactPage from 'pages/ContactPage/ContactPage.vue';
import ContactDetailsPage from 'pages/ContactPage/ContactDetailsPage.vue';
import CalendarPage from 'pages/CalendarPage.vue';
import PropertyPage from 'pages/PropertyPage/PropertyPage.vue';
import PropertyFormPage from 'pages/PropertyPage/PropertyFormPage.vue';
import OpportunityPage from 'pages/OpportunityPage.vue';
import SettingPage from 'pages/SettingPage.vue';
import AboutPage from 'pages/AboutPage.vue';

/**
 * Check if the app is running in app mode
 */
const isAppMode = import.meta.env.VITE_APP_MODE === 'APP';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: isAppMode ? MainLayout : MainLayoutWeb,
    children: [
      {
        name: 'home',
        path: '',
        meta: { module: 'home' },
        component: DashboardPage
      },
      {
        path: '/agents',
        meta: { module: 'agents' },
        children: [
          {
            name: 'agents',
            path: '',
            component: AgentPage
          },
          {
            name: 'agentDetails',
            path: ':id',
            component: AgentDetailsPage

          }
        ]
      },
      {
        path: '/contacts',
        meta: { module: 'contacts' },
        children: [
          {
            name: 'contacts',
            path: '',
            component: ContactPage,
          },
          {
            name: 'contactDetails',
            path: ':id',
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
        path: '/properties',
        meta: { module: 'properties' },
        children: [
          {
            name: 'properties',
            path: '',
            component: PropertyPage
          },
          {
            name: 'propertyCreate',
            path: 'create',
            component: PropertyFormPage
          },
          {
            name: 'propertyEdit',
            path: 'edit/:id',
            component: PropertyFormPage
          }
        ]
      },
      {
        name: 'opportunities',
        path: '/opportunities',
        meta: { module: 'opportunities' },
        component: OpportunityPage
      },
      {
        name: 'settings',
        path: '/settings',
        meta: { module: 'settings' },
        component: SettingPage,
      },
      {
        name: 'about',
        path: '/about',
        meta: { module: 'about' },
        component: AboutPage,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: isAppMode ? MainLayout : MainLayoutWeb,
    children: [
      {
        path: '',
        component: () => import('pages/ErrorNotFound.vue'),
      },
    ]
  },
];

export default routes;
