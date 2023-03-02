//axios.js
import axios from 'axios'
import store from './store'
import router from './router'

//创建axios实例
var instance = axios.create({
 timeout: 5000, //请求超过5秒即超时返回错误
 headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
});
//request拦截器
instance.interceptors.request.use(
 config => {
  //判断是否存在token，如果存在的话，则每个http header都加上token
  if (store.state.token) {
   config.headers.Authorization = `Bearer ${store.state.token}`;
  }
  return config;
 }
);
//respone拦截器
instance.interceptors.response.use(
 response => {
  return response;
 },
 error => { //默认除了2XX之外的都是错误的，就会走这里
  if (error.response) {
   switch (error.response.status) {
    case 401:
     router.replace({ //跳转到登录页面
      path: 'login',
      query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
     });
   }
  }
  return Promise.reject(error.response);
 }
);
var url = 'http://localhost:3000';  //服务器连接
export default {
  //这里export的是axios
  //所以引用的方法是: import axios from '../axios.js';
  //用户注册
  userEnable(data){
    return instance.post(url+'/auth/enable', data);
  },
  //用户登录(只是拿到token)
  userLogin(data){
    return instance.post(url+'/auth/login', data);
  },
  //获取用户
  getUserByToken(data){
    return instance.post(url+'/users/userByToken',data);
  },
  //删除用户
  delUser(data){
    return instance.post('/api/delUser', data);
  },
  //获取课程
  getCourses(data){
    return instance.post(url+'/course/myCourses',data);
  },
  getProjects(data){
    return instance.post(url+'/project/myProjects',data);
  },
  findByCourseId(data){
    return instance.post(url+'/course/findByCourseId',data);
  },
  findProject(data){
    return instance.post(url+'/project/findByCourseId',data);
  },
  async findProjectById(data){
    return await instance.post(url+'/project/findById',data);
  },
  getAnnounceByCourseId(data){
    return instance.post(url+'/notice/getAllNoticeByCourseId',data);
  },
  getAllAnnounce(data){
    return instance.post(url+'/notice/getAllNotice',data);
  },
  async createProject(data){
    return await instance.post(url+'/project/createProject',data);
  },
  async uploadFile(data){
    return await instance.post(url+'/upload/',data);
  },
  async addProjectFile(data){
    return await instance.post(url+'/project/addProjectFile',data);
  },
  addHomework(data){
    return instance.post(url+'/homework/addHomework',data);
  },
  getPracticeByCourseId(data){
    return instance.post(url+'/practice/getPracticeByCourseId',data);
  },
  getProblemsByPracticeId(data){
    return instance.post(url+'/practice/getProblemsByPracticeId',data);
  },
  submitPractice(data){
    return instance.post(url+'/practice/submitPractice',data);
  },
  caculatePracticeGrade(data){
    return instance.post(url+'/score/caculatePracticeScore',data);
  },
  createPractice(data){
    return instance.post(url+'/practice/createPractice',data);
  },
  addHomework(data){
    return instance.post(url+'/homework/addHomework',data);
  },
  getHomeworkList(data){
    return instance.post(url+'/homework/findByProjectId',data);
  },
  setProjectScore(data){
    return instance.post(url+'/score/setProjectScore',data);
  },
  createNotice(data){
    return instance.post(url+'/notice/createNotice',data);
  },
  addNoticeFile(data){
    return instance.post(url+'/notice/addNoticeFile',data);
  },
  findCourseFiles(data){
    return instance.post(url+'/course/findCourseFiles',data);
  },
  addCourseFile(data){
    return instance.post(url+'/course/addCourseFile',data);
  },
  signIn(data){
    return instance.post(url+'/score/signIn',data);
  },
  findScoresByCourse(data){
    return instance.post(url+'/score/findScoresByCourse',data);
  },
  getEvent(data){
    return instance.post(url+'/event/getEvent',data)
  },
  findByUserId(data){
    return instance.post(url+'/homework/findByUserId',data);
  },
  updateUser(data){
    return instance.post(url+'/users/update',data);
  },
  createdCourses(data){
    return instance.post(url+'/course/createdCourses',data);
  },
  editWeight(data){
    return instance.post(url+'/course/editWeight',data);
  },
  deleteCourse(data){
    return instance.post(url+'/course/closeCourse',data);
  },
  sendMail(data){
    return instance.post(url+'/users/validateEmail',data);
  },
  updatePsw(data){
    return instance.post(url+'/users/updatePsw',data);
  }
}