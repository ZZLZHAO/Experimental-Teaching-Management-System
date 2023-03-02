<template>
<div class="grade-container">
    <el-breadcrumb separator="/" class="title">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item>课程管理</el-breadcrumb-item>
    </el-breadcrumb>
  <div class="grade">
    <!--搜索区域-->
    <!-- <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row> -->
    <el-dialog title="权重调整" width="40%" :visible.sync="editWeight">
      <el-form :model="form">
        <el-form-item label="平时成绩" >
          <el-input style="width:200px;" v-model="form.usualRatio" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目成绩" >
          <el-input style="width:200px;" v-model="form.projectRatio" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="练习成绩" >
          <el-input style="width:200px;" v-model="form.practiceRatio" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editWeight = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确认删除" width="32%" :visible.sync="deleteCourse">
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteCourse = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete()">确 定</el-button>
      </div>
    </el-dialog>

    <el-table
      class="table"
      :data="
        courseList.slice(
          (queryInfo.pagenum - 1) * queryInfo.pagesize,
          queryInfo.pagenum * queryInfo.pagesize
        )
      "
      style="width: 100%"
      stripe
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="课程名称" prop="name"></el-table-column>
      <el-table-column
        label="任课教师"
        prop="teachers"
        :formatter="getTeachersData"
      ></el-table-column>
      <el-table-column label="课程开始时间" prop="startTime"></el-table-column>
      <el-table-column label="课程结束时间" prop="endTime"></el-table-column>
      <el-table-column label="课程状态"
      prop="isCourseOpen"
      :formatter="formatState"
      ></el-table-column>
      <el-table-column
      width="100">
      <template slot-scope="scope">
        <el-button type="primary" @click="openEditForm(scope.row)" size="small" >修改权重</el-button>
      </template>
    </el-table-column>
     <el-table-column
      width="100">
      <template slot-scope="scope">
        <el-button type="danger" @click="openDeleteForm(scope.row)"  size="small">删除课程</el-button>
      </template>
    </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 30, 50]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
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
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页显示数据条数
        pagesize: 10,
      },
      courseList: [],
      total: 0,
      editWeight:false,
      deleteCourse:false,
      courseId:0,//被选中的courseId
      form: {
        usualRatio:0,
        projectRatio:0,
        practiceRatio:0
      },
    };
  },
  mounted() {
    this.getCourses();
  },
  methods: {
    openDeleteForm(row){
      this.deleteCourse=true;
      this.courseId=row.id;
    },
    confirmDelete(){
      let data={
        courseId:this.courseId
      }

      axios.deleteCourse(qs.stringify(data))
      .then(res=>{
          this.deleteCourse=false;
          alert('操作成功');
        })
        .catch(err=>{
          this.deleteCourse=false;
          alert('操作失败');
        })
    },
    confirmEdit(){
      let data={
        courseId:this.courseId,
        usualRatio:parseFloat(this.form.usualRatio),
        projectRatio:parseFloat(this.form.projectRatio),
        practiceRatio:parseFloat(this.form.practiceRatio),
      }
      if(data.usualRatio+data.projectRatio+data.practiceRatio!=1){
        alert('权值和应该为1');
        return;
      }
      else{
        axios.editWeight(qs.stringify(data))
        .then(res=>{
          this.editWeight=false;
          alert('修改成功');
        })
        .catch(err=>{
          this.editWeight=false;
          alert('修改失败');
        })
      }
    },
    openEditForm(row){
      this.form.usualRatio=row.usualRatio,
      this.form.projectRatio=row.projectRatio,
      this.form.practiceRatio=row.practiceRatio,
      this.courseId=row.id;
      this.editWeight=true;
    },
    getCourses() {
      axios
        .createdCourses()
        .then((res) => {
          let list=res.data;
          list.forEach(item=>{
            item.startTime=moment(item.startTime).format('YYYY-MM-DD');
            item.endTime=moment(item.endTime).format('YYYY-MM-DD');
          })
          this.courseList=list;
          console.log(this.courseList);
          this.total = this.courseList.length;
        })
        .catch((err) => {
          alert("获取课程信息失败");
          console.log(err);
        });
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.queryInfo.pagesize = newSize;
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage;
    },
    // 获取任课教师数组名字
    formatState(row){
      return row.isCourseOpen?'正常':'已关闭';
    },
    getTeachersData(row) {
      let arr = [];
      row.teachers.forEach((item, index) => {
        arr.push(item.name);
      });
      return arr.join(",");
    },
    CourseHome(row, event, column) {
      this.$router.push({name:'GradeDetail', params:{couresId:row.id}})
    },
  },
};
</script>


<style lang="scss" scoped>    
.grade-container{
    width:1085px;
    min-height:100%;
    .title{
      box-sizing: border-box;
      height:30px;
      font-size: 15px;
      font-weight: 500;
      padding-top: 10px;
      color:rgb(77, 77, 77);
    }
    .grade{
    width:1085px;
    padding:20px;
    height: calc(100% - 30px);
    background-color: white;
    border-radius: 10px;
    .table{
        min-height:calc(100% - 40px);
        margin-bottom: 8px;
    }
}
}
</style>