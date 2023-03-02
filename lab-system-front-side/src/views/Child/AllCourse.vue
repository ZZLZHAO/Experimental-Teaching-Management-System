<template>
  <div class="all-course">
    <el-table
      class="table"
      :data="
        courseList.slice(
          (queryInfo.pagenum - 1) * queryInfo.pagesize,
          queryInfo.pagenum * queryInfo.pagesize
        )
      "
      @row-click="CourseHome"
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
</template>

<script>
import axios from "../../axios";
var qs = require("qs"); //格式化数据用的，很重要
import moment from 'moment'
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
    };
  },
  mounted() {
    this.getCourses();
  },
  methods: {
    getCourses() {
      axios.getCourses()
        .then((res) => {
          console.log(res.data);
          //this.courseList = res.data;
          let resList=[];
          let list=res.data;
          list.forEach(item=>{
            item.startTime=moment(item.startTime).format('YYYY-MM-DD');
            item.endTime=moment(item.endTime).format('YYYY-MM-DD');
            if(item.isCourseOpen)resList.push(item);
          })
          this.courseList=resList;
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
    getTeachersData(row) {
      let arr = [];
      row.teachers.forEach((item, index) => {
        arr.push(item.name);
      });
      return arr.join(",");
    },
    CourseHome(row, event, column) {
      this.$router.push({name:'CourseHome', params:{id:row.id}})
    },
  },
};
</script>


<style lang="scss" scoped>    
.all-course{
  width:100%;
  padding:20px;
  height: 100%;
  background-color: white;
  border-radius: 10px;
  .table{
    min-height:calc(100% - 40px);
    margin-bottom: 8px;
  }
}
</style>