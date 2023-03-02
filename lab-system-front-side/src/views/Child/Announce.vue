<template>
  <div class="account-container">
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
    <div class="announce-detail" v-show="openDetail">
        <div class="announce-detail-box">
            <div class="announce-detail-head">
                <div class="close" @click="hideDetail()"></div>
            </div>
            <div class="announce-detail-main">
                <div class="detail-section-head">
                    <div class="d-left">
                        <div class="announce-icon"></div>
                        <div class="detail-title">{{this.announceDetail.title}}</div>
                    </div>
                    <div class="d-right">
                        <div class="detail-time">{{this.announceDetail.time}}</div>
                    </div>
                </div>
                <div class="detail-content-box">
                    <vue-scroll>
                    <div class="detail-content">{{this.announceDetail.content}}</div>
                    </vue-scroll>
                </div>
            </div>
        </div>
        <div class="appendix" v-show="hasAppendix">
            <div class="head">
                <div class="file-icon"></div>
                <div class="file-title">附件</div>
            </div>
            <div class="content">
                <vue-scroll>
                    <div class="content-main" v-for="file in announceDetail.files" :key="file.id">
                        <a :href="file.url">{{file.name}}</a>
                    </div>
                </vue-scroll>
            </div>
        </div>
    </div>
    <!-- 发布公告弹窗 -->
    <el-dialog title="发布公告" :visible.sync="openPublish" class="announce-detail" @close="resetForm('publishAnnounce')">
        <el-form :model="publishAnnounce" :rules="rules" ref="publishAnnounce" label-width="200px" class="demo-ruleForm">
            <el-form-item label="公告名称" prop="title">
                <el-input v-model="publishAnnounce.title"></el-input>
            </el-form-item>
            <el-form-item label="公告内容" prop="content">
                <el-input type="textarea" v-model="publishAnnounce.content"></el-input>
            </el-form-item>
            <el-form-item label="公告附件上传" prop="file">
                <el-upload
                    class="upload-demo"
                    action=""
                    ref="upload"
                    :http-request="uploadFile"
                    :before-remove="beforeRemove"
                    multiple
                    :limit="1"
                    :auto-upload="false"
                    :on-success="addNoticeFile"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitAnnounce('publishAnnounce')">立即创建</el-button>
                <el-button @click="resetForm('publishAnnounce')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <div class="main">
      <!-- <div class="title">我的课程</div> -->
      <el-breadcrumb separator="/" class="title">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>公告</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main-container">
          
        <div class="head-bar" v-show="identify()">
            <div class="head-bar-left">
                <div class="head-bar-button" @click="showPublish">发布公告</div>
            </div>
            <div class="head-bar-right">

            </div>
        </div>

        <div class="announce-container">
            <div class="item" v-for="item in this.announceList" :key="item.id">
                <div class="item-left">
                    <div class="item-icon"></div>
                    <div class="item-title">{{item.title}}</div>
                </div>
                <div class="item-right">
                    <div class="item-time">{{formatTime(item.createdTime)}}</div>
                    <div class="item-btn" @click="showDetail(item.id)">查看详情</div>
                </div>
            </div>
        </div>
      </div>
    </div>
    <div class="side">
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
//import axios from 'axios'
export default {
  data() {
    return {
      userType:'',
      openPublish:false,
      openClendar:false,
      calendarData: [
          // {date:"2022-01-08",content:"作业拉斯柯达解放路拉屎看到就烦已评分"},
          // {date:"2022-01-08",content:"对抗练习拉三等奖付款了拉屎看到就烦截止"},
          // {date:"2022-01-08",content:"放假3"},
          // {date:"2022-01-08",content:"放假4"},
          // {date:"2022-01-19",content:"去交电费"},
          // {date:"2022-01-15",content:"去学习vue"}
      ],
      value: new Date(),
      openDetail:false,
      hasAppendix:false,
      announceList:[],//课程列表
        announceDetail:{
            announceId:'',
            title:'',
            content:'',
            time:'',
            files:[
                {
                    fileName:'',
                    url:''
                }
            ]//附件，可能有多个
        },
        publishAnnounce: {
            id:'',
            title: '',
            content: '',
        },
        //创建项目表单验证规则
        rules: {
            title: [
                { required: true, message: '请输入公告名称', trigger: 'blur' },
            ],
            content: [
                { required: true, message: '请填写公告内容', trigger: 'blur' }
            ],
            file: [
                { required: false, message: '请选择附件', trigger: 'blur' }
            ]
        },
        //上传文件list
        fileList:[],
        url:"",
        //关联存储项目附件
        noticeFile:{
            url:'',
            noticeId:'',
            name:'',
        },
    };
  },
  mounted() {
  this.userType=this.$store.state.user.type;
   this.loadAnnounce();
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
    })
  },
  methods: {
    identify(){
        if(this.$store.state.user.type==='responsible_teacher'||this.$store.state.user.type==='teacher')
            return true;
        else
            return false;
    },
    getEventByDay(day){
      //console.log('day',typeof(day));
      //console.log(this.calendarData);
      let list=this.calendarData.filter(el=>{
        return el.date==day;
      })
      return list;
    },
    formatTime(utcTime){
        return moment(utcTime).format('YYYY-MM-DD');
    },
    show(){
      this.openClendar=true;
    },
    hide(){
      this.openClendar=false;
    },
    loadAnnounce(){
        //获取公告
        let data={};
        axios.getAllAnnounce(qs.stringify(data))
        .then(res=>{
            console.log(res.data);
            this.announceList=res.data;
        })
    },
    showDetail(id){
        let index=this.announceList.findIndex((el)=>el.id==id);
        this.announceDetail.announceId=id;
        this.announceDetail.title=this.announceList[index].title;
        this.announceDetail.content=this.announceList[index].content;
        this.announceDetail.time=moment(this.announceList[index].createdTime).format('YYYY-MM-DD');
        this.announceDetail.files=this.announceList[index].files;;//记得改
        if(this.announceDetail.files.length!=0){
                this.hasAppendix=true;
                this.openDetail=true;
            }
        else{
            this.hasAppendix=false;
            this.openDetail=true;
        }
    },
    hideDetail(){
        this.openDetail=false;
        this.announceDetail.announceId='';
        this.announceDetail.title='';
        this.announceDetail.content='';
        this.announceDetail.time='';
        this.announceDetail.files=[]
    },
        showPublish(){
            this.openPublish=true;
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //表单验证及文件上传
        async submitAnnounce(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createAnnounce().then(()=>{   
                        return this.$refs.upload.submit();
                    })
                    // resetForm(formName);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async createAnnounce(){
            return new Promise((resolve,reject)=>{
                axios.createNotice(qs.stringify(this.publishAnnounce))
                .then((res) => {
                    this.publishAnnounce.id=res.data.id;
                    console.log(res)
                    alert('成功创建!');
                    resolve();
                })
                .catch((err) => {
                    alert("创建项目信息失败");
                    console.log(err);
                    resolve();
                });
            })
        },
        async addNoticeFile(){
            console.log("this.noticeFile")
            console.log(this.noticeFile)
            this.noticeFile.url=this.url;
            this.noticeFile.noticeId=this.publishAnnounce.id;
            this.noticeFile.name=this.fileList[0].name;
            axios.addNoticeFile(qs.stringify(this.noticeFile))
                .then((res) => {
                    console.log(res)
                    this.openPublish=false;
                    this.$refs.upload.clearFiles();
                })
                .catch((err) => {
                    alert("上传附件失败");
                    console.log(err);
                });
        },
        async uploadFile(param){
            return new Promise((resolve,reject)=>{
                this.fileList[0]=param.file;
                const formData = new FormData()
                formData.append('file', this.fileList[0])
                console.log('test')
                console.log(param)
                console.log(this.fileList)
                console.log(formData)
                axios.uploadFile(formData)
                    .then((res) => {
                        console.log(res)
                        this.url=res.data;
                        resolve();  
                    })
                    .catch((err) => {
                        alert("上传文件失败");
                        console.log(err);
                        resolve();
                    });
            })
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        }
  },
};
</script>

<style lang="scss" scoped>
.account-container {
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
    .announce-detail{
        position: fixed;
        left:0;
        top:0;
        width:100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        backdrop-filter: brightness(75%);
        z-index: 99999;
        .announce-detail-box{
        background-color: white;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        // box-shadow:  12px 12px 24px #bebebe,
        //     -12px -12px 24px #ffffff;
        .announce-detail-head{
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
      .announce-detail-main{
        padding:10px 30px;
        width:750px;
        height:500px;
        .detail-section-head{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding-bottom:10px;
            border-bottom: #cecece 1px solid;
            .d-left{
                display: flex;
                flex-direction: row;
                align-items: center;
                .announce-icon{
                    width:40px;
                    height:40px;
                    margin-right: 20px;
                    background-image: url('../../assets/icons/announce-d.png');
                    background-size: cover;
                }
                .detail-title{
                    font-size: 1.8rem;
                    font-weight: 500;
                    color:#7f2fea;
                }
            }

             .d-right{
                display: flex;
                flex-direction: row;
                align-items: center;
                .detail-time{
                    font-size: .8rem;
                    color:gray;
                    margin-right: 20px;
                }
            }
            
        }

        .detail-content-box{
            width:100%;
            height: calc(100% - 70px);
            //background-color: gray;
            .detail-content{
                padding:10px;
                width:100%;
                height: auto;
                font-size: 1.3rem;
                color: rgb(32, 32, 32);
                //background-color: lightblue;
            }
        }
      }
    }

    .appendix{
        margin-left: 20px;
        width:250px;
        height:525px;
        background-color: white;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 10px;
        .head{
            width:100%;
            padding-bottom:10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom: #cecece 1px solid;
            .file-icon{
                width:25px;
                height:25px;
                background-image: url('../../assets/icons/file.png');
                background-size: cover;
                margin-right: 10px;
            }
            .file-title{
                font-size: 1.4rem;
                color:#7f2fea;
            }
        }

        .content{
            flex-shrink: 0;
            width:100%;
            height: 450px;
            .content-main{
                padding:10px;
                width:100%;
                height:auto;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                .file-url{
                    user-select: none;
                    margin-bottom: 5px;
                    font-size: 1.2rem;
                    color:rgb(18, 115, 241);
                    text-decoration: underline rgb(18, 115, 241);
                }
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
        margin:0;
        width:100%;
        border:none;
        border-radius: 10px;
        background-color: white;
        padding:20px 40px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

     .head-bar{
        width:100%;
        height:auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding:10px 10px;
        .head-bar-left{
            .head-bar-button{
                user-select: none;
                margin-left: 10px;
                padding:0 10px;
                height:30px;
                border-radius: 5px;
                background-color: rgb(74, 97, 231);
                color:white;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                &:hover{
                    background-color: rgb(103, 63, 211);
                }
            }
        }
        .head-bar-right{
            .head-bar-button{
                margin-left: 10px;
                padding:0 10px;
                height:30px;
                border-radius: 5px;
                background-color: rgb(74, 97, 231);
                color:white;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                &:hover{
                    background-color: rgb(103, 63, 211);
                }
            }
        }
    }
        .announce-container{
            width:100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .item{
                padding:20px 20px;
                width:100%;
                height:auto;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                border-bottom: #e0e0e0 1px solid;
                //background-color: whitesmoke;
                //border-radius: 10px;
                margin-bottom: 10px;
                transition: all .3s ease;
                // &:hover{
                //     box-shadow:  4px 4px 6px #bebebe;
                // }
                .item-left{
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    .item-icon{
                        width:20px;
                        height:20px;
                        background-image: url('../../assets/icons/announce-b.png');
                        background-size: cover;
                        margin-right: 20px;
                    }
                    .item-title{
                        font-size: 1.6rem;
                        color: gray;
                        &:hover{
                            color: rgb(103, 63, 211);
                        }
                    }
                }
                .item-right{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .item-time{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        font-size: 1rem;
                        color:gray
                    }
                    .item-btn{
                        user-select: none;
                        margin-left: 10px;
                        padding:0 15px;
                        height:30px;
                        border-radius: 15px;
                        background-color: rgb(74, 97, 231);
                        color:white;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        &:hover{
                            background-color: rgb(103, 63, 211);
                        }
                    }
                }
            }
        }

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
        margin-bottom: 20px;
      }
      .item{
        width:100%;
        font-size: 1.3rem;
        color:gray;
        text-decoration: underline gray;
        margin-bottom: 10px;
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
//   .side:hover{
//     box-shadow:  25px 25px 51px #bebebe,
//                 -25px -25px 51px #ffffff
//   }
}
</style>