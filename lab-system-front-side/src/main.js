import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import vuescroll from 'vuescroll';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(vuescroll,{
  ops:{
    vuescroll:{
      mode:'native',
      sizeStrategy: 'percent',
      detectResize: true,
      locking:true,
      wheelScrollDuration: 500,
    },
    scrollPanel:{
      //speed:9000,
      scrollingX:false,
      easing:'easeInOutQuad',
    },
    bar:{
      opacity: .8,
      background: 'rgb(103, 63, 211)', 
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
