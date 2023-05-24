import { createApp } from 'vue'
import VNetworkGraph from 'v-network-graph';
import "bootstrap/dist/css/bootstrap.css"
import "v-network-graph/lib/style.css";
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import { aliases, fa } from 'vuetify/iconsets/fa'
import { aliases, fa } from 'vuetify/iconsets/fa4'
import { mdi } from 'vuetify/iconsets/mdi'
import 'material-design-icons-iconfont/dist/material-design-icons.css' 

const pinia = createPinia();

const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            fa,
            mdi,
        },
    },
    components,
    directives,
  })

createApp(App)
    .use(router)
    .use(VNetworkGraph)
    .use(pinia)
    .use(vuetify)
    .mount('#app')


