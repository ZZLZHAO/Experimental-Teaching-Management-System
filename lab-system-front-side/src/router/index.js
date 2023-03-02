import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import PswSetting from '../views/PswSetting'
import Home from '../views/Home.vue'
import store from '../store'

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
const routes = [
  {
    path: '/', //根路由，让它重定向到登陆界面 
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { index: 0 }
  },
  {
    path: '/psw',
    name: 'psw',
    component: PswSetting,
    meta: { index: 1 }
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/Auth.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
    redirect: '/home/course',
    children: [
      {
        path: '',
        name: 'Course',
        component: () => import('../views/Child/Course.vue'),
        meta: { index: 2, requiresAuth: true, },
        redirect: 'allcourses',
        children: [
          {
            path: 'allCourses',
            name: 'AllCourses',
            component: () => import('../views/Child/AllCourse.vue'),
            meta: { index: 3, requiresAuth: true, },
          },
          {
            path: 'courses/:id',
            name: 'CourseHome',
            component: () => import('../views/Child/CourseHome.vue'),
            redirect: 'courses/:id/project',
            meta: { index: 3, requiresAuth: true, },
            children: [
              {
                path: 'project',
                name: 'Project',
                component: () => import('../views/Child/CourseHome/CourseProject.vue'),
                meta: { index: 4, requiresAuth: true, },
              },
              {
                path: 'announce',
                name: 'CourseAnnounce',
                component: () => import('../views/Child/CourseHome/CourseAnnounce.vue'),
                meta: { index: 4, requiresAuth: true, },
              },
              {
                path: 'practice',
                name: 'Practice',
                component: () => import('../views/Child/CourseHome/Practice.vue'),
                meta: { index: 4, requiresAuth: true, },
              },
              {
                path: 'homework',
                name: 'Homework',
                component: () => import('../views/Child/CourseHome/Homework.vue'),
                meta: { index: 4, requiresAuth: true, },
              },
              {
                path: 'courseGrade',
                name: 'CourseGrade',
                component: () => import('../views/Child/CourseHome/CourseGrade.vue'),
                meta: { index: 4, requiresAuth: true, },
              },
              {
                path: 'courseFiles',
                name: 'CourseFiles',
                component: () => import('../views/Child/CourseHome/CourseFiles.vue'),
                meta: { index: 4, requiresAuth: true, },
              },
            ]
          },

        ]
      },
      {
        path: 'info',
        name: 'Info',
        component: () => import('../views/Child/Info.vue'),
        meta: { index: 2, requiresAuth: true, },
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('../views/Child/Account.vue'),
        meta: { index: 2, requiresAuth: true, },
      },
      {
        path: 'grade',
        name: 'Grade',
        component: () => import('../views/Child/Grade.vue'),
        meta: { index: 2, requiresAuth: true, },
      },
      {
        path: 'gradeDetail/:courseId',
        name: 'GradeDetail',
        component: () => import('../views/Child/GradeDetail.vue'),
        meta: { index: 2, requiresAuth: true, },
      },
      {
        path: 'announce',
        name: 'Announce',
        component: () => import('../views/Child/Announce.vue'),
        meta: { index: 2, requiresAuth: true, },
      }
    ]
  }]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


router.beforeEach((to, from, next) => {
  //获取store里面的token
  console.log(1);
  let token = store.state.token;
  console.log(token);
  //判断要去的路由有没有requiresAuth
  if (to.meta.requiresAuth) {
    if (token) { next(); }
    else {
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 将刚刚要去的路由path作为参数，方便登录成功后直接跳转到该路由
      });
    }
  }
  else {
    next();
  }

});

export default router
