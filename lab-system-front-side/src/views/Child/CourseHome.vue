<template>
<div class="course-home">
  <div class="course-container">
    <div class="header">
      <div class="section-one">
        <!-- <div class="course-icon"></div> -->
        <div class="course-name">{{this.course.name}}</div>
      </div>
      <div class="section-two">
        <div class="course-info">创建教师：{{this.creator}}</div>
        <div class="course-info">任课教师：{{this.teachers}}</div>
        <div class="course-info">开课时间：{{formatTime(this.course.startTime)}}</div>
        <div class="course-info">结课时间：{{formatTime(this.course.endTime)}}</div>
      </div>
    </div>
    <el-menu
      :default-active="this.menulist[0].path"
      class="el-menu-demo"
      mode="horizontal"
      active-text-color="#409EFF"
    >
      <el-menu-item
        :index="item.path"
        active-text-color=#409EFF
        v-for="item in menulist"
        :key="item.id"
        v-show="showType(item)"
        @click="routerJump(item.path)"
      >
        <!-- 导航开启路由模式：
                      将index值作为导航路由 -->
        <!-- 二级菜单的模板区域 -->
        <template slot="title">
          <span>{{ item.authName }}</span>
        </template>
      </el-menu-item>
    </el-menu>
    <div class="main">
      <router-view/>
    </div>
  </div>
  </div>
</template>

<script>
import axios from "../../axios";
import moment from 'moment'
var qs = require("qs"); //格式化数据用的，很重要
//import axios from 'axios'
export default {
  data() {
    return {
      menulist: [
        {
          id: 101,
          authName: "实验项目",
          path: 'Project',
          type:'all'
        },
        {
          id: 102,
          authName: "课程公告",
          path: 'CourseAnnounce',
          type:'all'
        },
        {
          id: 103,
          authName: "对抗练习",
          path: 'Practice',
          type:'all'
        },
        {
          id: 104,
          authName: "作业批改",
          path: 'Homework',
          type:'teacher'
        },
        {
          id: 105,
          authName: "教学资料",
          path: 'CourseFiles',
          type:'all'
        },
        {
          id: 106,
          authName: "我的成绩",
          path: 'CourseGrade',
          type:'student'
        },
      ],
      course: {
        name:"",
        courseId:0,
        teachers:[],
      },
      
      total: 0,
      creator: "",
      courseId:0,
    };
  },
  mounted() {
    //需修改，还未写findByCourseId接口
    this.course.courseId = this.$router.history.current.params.id;
    axios.findByCourseId(qs.stringify(this.course))
        .then((res) => {
          console.log(res.data);
          this.course = res.data;
          this.creator = res.data.creator.name;
        })
        .catch((err) => {
          alert("获取课程信息失败");
          console.log(err);
        });
    console.log(this.course);
  },
  computed: {
    teachers: function() {
      if(this.course.teachers[0]){
        var teachers="";
        var len=this.course.teachers.length;
        for(let i = 0;i<len-1;i++){
          console.log(this.course.teachers[i]);
          teachers+=this.course.teachers[i].name+'，';
        }
        teachers+=this.course.teachers[len-1].name;
        return teachers;
      }
    }

  },
  methods: {
    formatTime(utcTime){
        return moment(utcTime).format('YYYY-MM-DD ');
    },
    routerJump(activePath) {
      this.$router.push({name: activePath});
    },
    showType(item){
      if(item.type==='all')
        return true;
      else if(item.type==='teacher'&&(this.$store.state.user.type==='responsible_teacher'||this.$store.state.user.type==='teacher'))
              return true;
            else if(item.type==='student'&&this.$store.state.user.type==='student')
                  return true;
                else
                  return false;
    }
  },
};
</script>

<style lang="scss" scoped>
.course-home{
  width: 100%;
  min-height:100%;
  padding:20px;
  background-color: white;
  .course-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  // padding-left: 40px;
  // padding-right: 40px;
  //background-color: azure;
  display: flex;
  flex-direction: column;
  .header {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: auto;
    padding:50px;
    background-image: linear-gradient(to bottom left, violet, rgb(0, 174, 255));
    .section-one{
      padding-left: 30px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .course-icon{
        width:30px;
        height: 30px;
        background-image: url('../../assets/icons/course1.png');
        background-size: cover;
        margin-right: 10px;
      }
      .course-name{
        font-size: 1.8rem;
        font-weight: 600;
        color:white;
      }
    }

    .section-two{
      padding-left: 30px;
      .course-info{
        margin-top: 15px;
        font-size: 1.3rem;
        font-weight: 500;
        color: white;
        display: flex;
        flex-direction: row;
      }
    }
  }
  .el-menu-demo{
    border-left: #e0e0e0 1px solid;
    border-right: #e0e0e0 1px solid;
  }
  .main {
    flex-shrink: 0;
    box-sizing: border-box;
    width: 100%;
    min-width: 600px;
    height: 60%;
    border-radius: 0px 0px 10px 10px;
    flex-shrink: 0;
    background-color: rgb(159, 167, 167);
  }
}
}
</style>