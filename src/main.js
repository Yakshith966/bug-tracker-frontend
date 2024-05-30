import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './routes/router';
import store from './store'

import '@mdi/font/css/materialdesignicons.css';  // Optional: for Material Design Icons

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(store);
app.mount('#app');
