// import { createRouter, createWebHistory } from 'vue-router';
// import Login from '../components/login/Login.vue';
// import Signup from '../components/Signup/Signup.vue';
// import Dashboard from '../components/dashboard/Dashboard.vue'; // Ensure correct path and filename
// import MainLayout from '../layouts/MainLayout.vue';
// import Profile from '../components/profile/Profile.vue';
// import ProjectManagement from '../views/ProjectManagement.vue';
// import BugManagement from '../views/BugManagement.vue';
// import BugDetails from '../views/BugDetails.vue';

// const routes = [
//   { path: '/login', component: Login },
//   { path: '/signup', component: Signup },
//   {
//     path: '/',
//     component: MainLayout,
//     redirect: '/dashboard', // Redirect to dashboard
//     meta: { requiresAuth: true }, // Main layout requires auth
//     children: [
//       { path: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
//       { path: 'profile', component: Profile, meta: { requiresAuth: true } },
//       { path: 'project-management', component: ProjectManagement, meta: { requiresAuth: true } },
//       { path: 'bug-management', component: BugManagement, meta: { requiresAuth: true } },
//       { path: 'bug-details', component: BugDetails, meta: { requiresAuth: true } },
//       // Add more routes here with meta.requiresAuth if needed
//     ],
//   },
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// // Navigation guard for routes that require authentication
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!sessionStorage.getItem('token'); // Check sessionStorage for the token
//   console.log('Is authenticated:', isAuthenticated); // Debugging
//   console.log('Token from sessionStorage:', sessionStorage.getItem('token')); // Debugging
//   console.log('Role from sessionStorage:', sessionStorage.getItem('role')); // Debugging
//   if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
//     next('/login');
//   } else {
//     next();
//   }
// });

// export default router;
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/login/Login.vue';
import Signup from '../components/Signup/Signup.vue';
import Dashboard from '../components/dashboard/Dashboard.vue';
import MainLayout from '../layouts/MainLayout.vue';
import Profile from '../components/profile/Profile.vue';
import ProjectManagement from '../views/ProjectManagement.vue';
import BugManagement from '../views/BugManagement.vue';
import BugDetails from '../views/BugDetails.vue';
import TaskManagement from '../components/Task/TaskManagement.vue';

const commonRoutes = [
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
];

const testerRoutes = [
  { path: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: 'profile', component: Profile, meta: { requiresAuth: true } },
  { path: 'project-management', component: ProjectManagement, meta: { requiresAuth: true } },
  { path: 'bug-management', component: BugManagement, meta: { requiresAuth: true } },
];

const developerRoutes = [
  { path: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: 'bug-details', component: BugDetails, meta: { requiresAuth: true } },
  { path: 'profile', component: Profile, meta: { requiresAuth: true } },
  { path: 'task-management', component: TaskManagement, meta: { requiresAuth: true } },
];

const routes = [
  ...commonRoutes,
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [], // Initially empty, will be populated based on role
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for routes that require authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem('token'); // Check sessionStorage for the token
  const userRole = sessionStorage.getItem('role'); // Get the user role from sessionStorage

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else {
    if (isAuthenticated && !router.hasAddedRoutes) {
      let roleRoutes = [];

      if (userRole === 'tester') {
        roleRoutes = testerRoutes;
      } else if (userRole === 'developer') {
        roleRoutes = developerRoutes;
      }

      router.addRoute({
        path: '/',
        component: MainLayout,
        redirect: '/dashboard',
        meta: { requiresAuth: true },
        children: roleRoutes,
      });

      router.hasAddedRoutes = true;
      next({ ...to, replace: true }); // Ensure the navigation happens to the correct route
    } else {
      next();
    }
  }
});

export default router;
