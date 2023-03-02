<template>
  <div class="course-container">
    <div class="clendar-container" v-show="openClendar">
      <div class="clendar-box">
        <div class="clendar-head">
          <div class="close" @click="hide()"></div>
        </div>
        <div class="clendar-main">
          <vue-scroll>
          <el-calendar v-model="value" id="calendar">
                <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                <template
                slot="dateCell"
                slot-scope="{date, data}">
                    <div style="font-size:13px"> <!--这里原本有动态绑定的class，去掉-->
                      {{ data.day.split('-')[2]}}
                    </div>
                    <div :class="{'clendar-event':item.type==0,'clendar-event1':item.type==1,'clendar-event2':item.type==2}" v-for="item in getEventByDay(data.day)" :key="item.content">
                      {{item.content}}
                    </div>
                </template>
          </el-calendar>
          </vue-scroll>
        </div>
      </div>
    </div>
    <div class="main">
      <!-- <div class="title">我的课程</div> -->
      <el-breadcrumb separator="/" class="title">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>我的课程</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main-container">
        <router-view/>
      </div>
    </div>
    <div class="side">
      <div class="side-section-one">
        <div class="title">最近</div>
        <div class="side-section-one-main">
          <vue-scroll>
          <div class="item" v-for="item in this.recentList">{{item.content}}</div>
          </vue-scroll>
        </div>
      </div>
      <div class="side-section-two" @click="show()">
        <div class="title">日历</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../axios";
import moment from 'moment'
var qs = require("qs"); //格式化数据用的，很重要
export default {
  mounted() {
   axios.getEvent(qs.stringify({}))
    .then(res=>{
      console.log(res);
      let list=res.data;
      list.forEach(item=>{
        let t={
          date:moment(item.time).format('YYYY-MM-DD'),
          content:item.description,
          type:item.type
        }
        this.calendarData.push(t);
      })

      this.recentList=this.calendarData.slice(0,9);
    })
  },
  data () {
    return {
      openClendar:false,
      recentList:[],
      calendarData: [
          // {"date":"2022-01-08","content":"作业拉斯柯达解放路拉屎看到就烦已评分"},
          // {"date":"2022-01-08","content":"对抗练习拉三等奖付款了拉屎看到就烦截止"},
          // {"date":"2022-01-08","content":"放假3"},
          // {"date":"2022-01-08","content":"放假4"},
          // {"date":"2022-01-19","content":"去交电费"},
          // {"date":"2022-01-15","content":"去学习vue"}
      ],
      value: new Date(),
    }
  },
  methods: {
    show(){
      this.openClendar=true;
    },
    hide(){
      this.openClendar=false;
    },
    getEventByDay(day){
      //console.log('day',typeof(day));
      //console.log(this.calendarData);
      let list=this.calendarData.filter(el=>{
        return el.date==day;
      })
      return list;
    }
  }
}
</script>

<style lang="scss" scoped>
.course-container {
  box-sizing: border-box;
  width: 1085px;
  min-height: 100%;
  //background-color: azure;
  display: flex;
  flex-direction: row;
  .clendar-container{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    //background-color: gray;
    z-index: 1000;
    backdrop-filter: brightness(85%);
    .clendar-box{
        background-color: white;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        // box-shadow:  12px 12px 24px #bebebe,
        //     -12px -12px 24px #ffffff;
        .clendar-head{
            width:100%;
            padding:0 10px;
            //background-color: gray;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            .close{
            margin-top: 5px;
            height:20px;
            width:20px;
            background-image: url('../../assets/icons/close.png');
            background-size: cover;
            transition: all .3s ease;
            &:hover{
                transform: rotate(90deg);
            }
          }
        }
      .clendar-main{
        padding:10px 30px;
        width:1200px;
        height:700px;
        ::v-deep .el-calendar__title{
          font-size: 18px;
          color:#4736df;
        }
        ::v-deep .el-calendar-day{
          height: auto;
          min-height: 85px;
        }
        
        .clendar-event{
          width:100%;
          font-size: 12px;
          background-color: rgb(101, 52, 235);
          color:white;
          padding:3px 2px;
          margin-top: 5px;
          border-radius: 3px;
        }
        .clendar-event1{
          width:100%;
          font-size: 12px;
          background-color: rgb(45, 97, 241);
          color:white;
          padding:3px 2px;
          margin-top: 5px;
          border-radius: 3px;
        }
        .clendar-event2{
          width:100%;
          font-size: 12px;
          background-color: rgb(243, 41, 108);
          color:white;
          padding:3px 2px;
          margin-top: 5px;
          border-radius: 3px;
        }
        .calendar-day{
            text-align: center;
            color: #a1caf0;
            line-height: 30px;
            font-size: 12px;
        }
        .is-selected{
            color: #4736df;
            font-size: 10px;
            margin-top: 5px;
        }
        #calendar .el-button-group>.el-button:not(:first-child):not(:last-child):after{
            content: '当月';
        }
        ::v-deep .is-today{
          font-size: 18px;
        }
      }
    }
  }
  .main {
    flex-shrink: 0;
    box-sizing: border-box;
    flex:1;
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
    }
  }
  .side{
    display: flex;
    flex-direction: column;
    .side-section-one {
      flex-shrink: 0;
      box-sizing: border-box;
      border-radius: 10px;
      width:300px;
      flex-shrink: 0;
      background-color: white;
      height:400px;
      margin-top:30px; 
      transition: all .3s ease;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      padding:30px;
      .title{
        font-size: 1.7rem;
        font-weight: 600;
        color:rgb(120, 44, 241);
        margin-bottom: 10px;
      }
      .side-section-one-main{
        width:100%;
        height:90%;
        //background-color: lightblue;
        .item{
        width:100%;
        font-size: 1.4rem;
        color:gray;
        //text-decoration: underline gray;
        
        margin-bottom: 10px;
      }
      }
      
    }

    .side-section-two{
      margin-top: 20px;
      width:300px;
      height:250px;
      border-radius: 10px;
      background-color: white;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      background-image: url('../../assets/plan.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transition:all .3s ease;
      &:hover{
        box-shadow:  15px 15px 30px #bebebe;
      }
      .title{
        margin-top: 20px;
        font-size: 1.7rem;
        font-weight: 600;
        color:rgb(58, 117, 245);
        margin-bottom: 20px;
      }
    }
  }
}
</style>