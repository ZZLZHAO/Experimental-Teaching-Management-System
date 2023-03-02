//store index.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
//初始化时用sessionStore.getItem('token'),这样子刷新页面就无需重新登录
const state = {
  token: window.sessionStorage.getItem('token'),
  user:JSON.parse(window.sessionStorage.getItem('user')),
};
const mutations = {
  LOGIN: (state, data) => {
    //更改token的值
    state.token = data;
    window.sessionStorage.setItem('token', data);
  },
  LOGOUT: (state) => {
    //登出的时候要清除token
    state.token = null;
    window.sessionStorage.removeItem('token');
  },
  USER: (state, data) => {
    //把用户名存起来
    state.user=data;
    window.sessionStorage.setItem('user',JSON.stringify(data));
  },
};
const actions = {
  UserLogin({ commit }, data){
    commit('LOGIN', data);
  },
  UserLogout({ commit }){
    commit('LOGOUT');
  },
  UserName({ commit }, data){
    commit('USERNAME', data);
  },
  UserId({ commit }, data){
    commit('USERID', data);
  },
  UserType({ commit }, data){
    commit('USERTYPE', data);
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions
});