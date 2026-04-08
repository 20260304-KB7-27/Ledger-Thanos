import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
// import App from './BoxTestApp.vue'; // Box 컴포넌트 테스트 시 활성화
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
