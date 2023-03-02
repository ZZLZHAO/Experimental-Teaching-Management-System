<template>
  <div class="grade-detail-container">
    <div class="main">
      <!-- <div class="title">我的课程</div> -->
      <el-breadcrumb separator="/" class="title">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item to='/home/grade'>成绩管理</el-breadcrumb-item>
        <el-breadcrumb-item>成绩详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main-container">
        <el-table
          class="table"
          :data="grade"
          style="width: 100%"
          stripe
        >
          <el-table-column type="index"></el-table-column>
          <el-table-column label="学号" prop="id"></el-table-column>
          <el-table-column
            label="姓名"
            prop="name"
          ></el-table-column>
          <el-table-column label="得分" prop="score"></el-table-column>
        </el-table>
         
      </div>
    </div>
    <div class="side">
        <div class="side-box">
            <div class="side-box-title">优秀率</div>
            <div class="side-box-main">
                <el-progress type="circle"  :text-inside="false" :stroke-width="12" :percentage="80" color="violet"></el-progress>
            </div>
        </div>

        <div class="side-box">
            <div class="side-box-title">及格率</div>
            <div class="side-box-main">
                <el-progress type="circle"  :text-inside="false" :stroke-width="12" :percentage="80" color="lightblue"></el-progress>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "../../axios";
var qs = require("qs"); //格式化数据用的，很重要
//import axios from 'axios'
export default {
  data() {
    return {
      grade:[
        {
          id:123,
          name:"小红",
          score:80
        },
        {
          id:123,
          name:"小红",
          score:80
        },
        {
          id:123,
          name:"小红",
          score:80
        },
        {
          id:123,
          name:"小红",
          score:80
        },
        {
          id:123,
          name:"小红",
          score:80
        },
        {
          id:123,
          name:"小红",
          score:80
        },
      ]
    }
  },
  mounted() {
    this.$route.matched[1].parent.path='home/grade';
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
.grade-detail-container {
  box-sizing: border-box;
  width: 1085px;
  min-height: 100%;
  //background-color: azure;
  display: flex;
  flex-direction: row;
  .main {
    flex-shrink: 0;
    box-sizing: border-box;
    //width: 75%;
    width: 800px;
    width:800px;
    min-width: 600px;
    height:100%;
    flex-shrink: 0;
    padding-right:15px;
    //background-color: rgb(159, 167, 167);
    .title{
      box-sizing: border-box;
      height:30px;
      font-size: 15px;
      font-weight: 500;
      padding-top: 10px;
      color:rgb(77, 77, 77);
    }
    .main-container{
        box-sizing: border-box;
        height:calc(100% - 30px);
        width:100%;
        margin:0;
        border:none;
        border-radius: 10px;
        background-color: white;
        padding:20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }
  }
  .side {
    flex-shrink: 0;
    box-sizing: border-box;
    width:300px;
    flex-shrink: 0;
    height:auto;
    margin-top:30px; 
    .side-box{
        flex-shrink: 0;
        border-radius: 10px;
        width:300px;
        height: auto;
        flex-shrink: 0;
        background-color: white;
        margin-bottom: 20px;
        padding:20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .side-box-title{
            font-size: 1.5rem;
            margin-bottom: 30px;
        }
        .side-box-main{
            margin-bottom: 30px;
        }
    }
  }
}
</style>