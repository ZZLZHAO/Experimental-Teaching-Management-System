<template>
    <div class="course-project">
        <!-- 实验项目详情页弹窗 -->
          <div class="announce-detail" v-show="openDetail">
            <div class="announce-detail-box">
                <div class="announce-detail-head">
                    <div class="close" @click="hideDetail()"></div>
                </div>
                <div class="announce-detail-main">
                    <div class="detail-section-head">
                        <div class="d-left">
                            <div class="announce-icon"></div>
                            <div class="detail-title">{{this.project.name}}</div>
                        </div>
                        <div class="d-right">
                            <div class="d-right-title">开始时间：</div>
                            <div class="detail-time">{{formatTime(this.project.startTime)}}</div>
                          <div class="d-right-title">截止时间：</div>
                            <div class="detail-time">{{formatTime(this.project.endTime)}}</div>
                        </div>
                    </div>
                    <div class="detail-content-box">
                        <vue-scroll>
                        <div class="detail-content">{{this.project.desc}}</div>
                        </vue-scroll>
                    </div>
                </div>
                <div class="announce-detail-footer">
                    
                    <el-upload
                        class="upload-demo"
                        action=""
                        ref="uploadHomework"
                        :http-request="uploadFile"
                        multiple
                        :limit="1"
                        :auto-upload="false"
                        :on-exceed="homeworkHandleExceed"
                        :on-success="addHomework"
                        :file-list="fileList">
                        <div slot="trigger" class="item-btn" v-show="!isOver(project)">选取文件</div>
                        <div class="item-btn" @click="uploadHomework()" v-show="!isOver(project)">确认提交</div>
                    </el-upload>
                </div>
            </div>
            <div class="appendix" v-show="hasAppendix">
                <div class="head">
                    <div class="file-icon"></div>
                    <div class="file-title">附件</div>
                </div>
                <div class="content">
                    <vue-scroll>
                        <div class="content-main">
                            <div class="file-url" v-for="file in project.files" :key="file.id">
                                <a :href="file.url">{{file.name}}</a>
                            </div>
                        </div>
                    </vue-scroll>
                </div>
            </div>
        </div>

        <!-- 发布实验项目弹窗 -->
        <el-dialog title="发布实验项目" :visible.sync="openPublish" class="announce-detail" @close="resetForm('createProject')">
            <el-form :model="createProject" :rules="rules" ref="createProject" label-width="200px" class="demo-ruleForm">
                <el-form-item label="实验项目名称" prop="name">
                    <el-input style="width:400px;" v-model="createProject.name"></el-input>
                </el-form-item>
                <el-form-item label="开始截止时间" prop="date">
                    <el-date-picker
                        v-model="createProject.date"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="截止时间"
                        :default-time="['12:00:00']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="项目介绍" prop="desc">
                    <el-input style="width:400px;" type="textarea" v-model="createProject.desc"></el-input>
                </el-form-item>
                <el-form-item label="实验项目分数" prop="fullMark">
                    <el-input style="width:400px;" v-model.number="createProject.fullMark"></el-input>
                </el-form-item>
                <el-form-item label="实验项目附件上传" prop="file">
                    <el-upload
                        class="upload-demo"
                        action=""
                        ref="upload"
                        :http-request="uploadFile"
                        :before-remove="beforeRemove"
                        multiple
                        :limit="1"
                        :auto-upload="false"
                        :on-success="addProjectFile"
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitProject('createProject')">立即创建</el-button>
                    <el-button @click="resetForm('createProject')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 发布实验项目按钮 -->
        <div class="head-bar" v-show="identify()">
            <div class="head-bar-left">
                <div class="head-bar-button" @click="showPublish">发布实验项目</div>
            </div>
        </div>

        <!-- 实验项目列表 -->
        <div class="main">
            <div class="item" v-for="project in projectList" :key="project.id" >
                <div class="item-left">
                    <div class="item-icon"></div>
                    <div class="item-title">{{project.name}}</div>
                </div>
                <div class="item-right">
                    <div class="item-score">总分:{{project.fullMark}}</div>
                    <div class="item-finished" v-show="!isOver(project)">截止于：{{endDate(project)}}</div>
                    <div class="item-finished" v-show="isOver(project)">已截止</div>
                    <div class="item-btn" v-show="(userType=='teacher'||userType=='responsible_teacher')||(userType=='student'&&!project.submited)" @click="showDetail(project.id)">查看详情</div>
                    <div class="item-btn" v-show="userType=='student'&&project.submited" @click="showDetail(project.id)">已提交</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../../axios";
import moment from 'moment'
var qs = require("qs"); //格式化数据用的，很重要
export default {
    computed: {
        
    },
   data() {
       var checkfullMark=(rule, value, callback) =>{
            if (!value) {
                return callback(new Error('分数不能为空'));
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    if (value < 0||value>100) {
                        callback(new Error('分数在0-100之间'));
                    } else {
                        callback();
                    }
            }
          }, 1000);
       };
    return {
      openPublish:false,
      openDetail:false,
      hasAppendix:true,
      projectList:[],
      project:{
          id:"",
          name:"",
          endTime:"",
          files:[],
          desc: '',
          fullMark:'',
          submited: false,
      },
      userType:'',
      course: {
        courseId:0,
      },
      createProject: {
          id:'',
          name: '',
          startTime: '',
          endTime: '',
          courseId:'',
          date: '',
          desc: '',
          fullMark:'',
        },
        //创建项目表单验证规则
        rules: {
          name: [
            { required: true, message: '请输入实验项目名称', trigger: 'blur' },
          ],
          date: [
            { type: 'array', required: true, message: '请选择日期', trigger: 'change' }
          ],
          fullMark: [
            { validator: checkfullMark, trigger: 'blur' }
          ],
          desc: [
            { required: false, message: '请填写介绍信息', trigger: 'blur' }
          ],
          file: [
            { required: false, message: '请选择附件', trigger: 'blur' }
          ]
        },
        //上传文件list
        fileList:[],
        url:"",
        //关联存储项目附件
        projectFile:{
            url:'',
            projectId:'',
            name:'',
        },
        //关联存储作业
        homework:{
            url:'',
            name:'',
            projectId:'',
        },
    };
  },
  mounted() {
    this.course.courseId = this.$router.history.current.params.id;
    this.userType=this.$store.state.user.type;
    axios.findProject(qs.stringify(this.course))
        .then((res) => {
            this.projectList=res.data;
            console.log(this.projectList);
        })
        .catch((err) => {
          alert("获取课程信息失败");
          console.log(err);
        });
  },
  methods: {
    identify(){
        if(this.$store.state.user.type==='responsible_teacher'||this.$store.state.user.type==='teacher')
            return true;
        else
            return false;
    },
    formatTime(utcTime){
        return moment(utcTime).format('YYYY-MM-DD HH:mm:ss');
    },
    isOver(item){//判断是否过期
        let end=moment(item.endTime);
        let now=moment(new Date());
        return now.isAfter(end);
    },
    endDate(item){
        return moment(item.endTime).format('YYYY-MM-DD');
    },
    loadProject(){
        //获取项目
        axios.findProjectById(qs.stringify(this.project))
        .then((res) => {
            console.log(res)
            this.project=res.data;
            console.log(this.projectList)
        })
        .catch((err) => {
            alert("获取课程信息失败");
            console.log(err);
        });
    },
    showDetail(projectId){
        this.openDetail=true;
        this.project.id=projectId;
        this.loadProject();
        console.log(this.project);
    },
    hideDetail(){
        this.openDetail=false;
    },
    showPublish(){
        this.openPublish=true;
    },
    hidePublish(){
        this.openPublish=false;
    },
    async createProjectFunc(){
        return new Promise((resolve,reject)=>{
            this.createProject.courseId=this.course.courseId;
            this.createProject.startTime=this.createProject.date[0];
            this.createProject.endTime=this.createProject.date[1];
            console.log(this.createProject)
            axios.createProject(qs.stringify(this.createProject))
            .then((res) => {
                this.createProject.id=res.data.id;
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
    async addProjectFile(){
        return new Promise((resolve,reject)=>{
            console.log("this.projectFile")
            console.log(this.projectFile)
            this.projectFile.url=this.url;
            this.projectFile.projectId=this.createProject.id;
            this.projectFile.name=this.fileList[0].name;
            axios.addProjectFile(qs.stringify(this.projectFile))
            .then((res) => {
                console.log(res)
                this.openPublish=false;
                this.$refs.upload.clearFiles();
                resolve();
            })
            .catch((err) => {
                alert("上传附件失败");
                console.log(err);
                resolve();
            });
        })
    },
    async submitProject(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                 this.createProjectFunc().then(()=>{   
                    return this.$refs.upload.submit();
                 })
                // resetForm(formName);
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    async addHomework(){
            console.log(this.homework)
            // this.addProjectFile();
            console.log("this.homework")
            console.log(this.homework)
            this.homework.url=this.url;
            this.homework.projectId=this.project.id;
            this.homework.name=this.fileList[0].name;
            console.log(this.homework)
            axios.addHomework(qs.stringify(this.homework))
            .then((res) => {
                console.log(res)
                alert("提交作业成功");
                this.openDetail=false;
                this.$refs.uploadHomework.clearFiles();
            })
            .catch((err) => {
                alert("上传附件失败");
                console.log(err);
            });
    },
    async uploadHomework() {
        this.$refs.uploadHomework.submit();
        // resetForm(formName);
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
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
                    console.log(this.projectFile)
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
    homeworkHandleExceed(files, fileList) {
        alert(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
    }
  },
}
</script>

<style lang="scss" scoped>
.course-project{
    width:100%;
    height:auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border:#e0e0e0 1px solid;
    border-top:none;
    // border-bottom: none;
    background-color: white;
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
              background-image: url('../../../assets/icons/close.png');
              background-size: cover;
              transition: all .3s ease;
              &:hover{
                  transform: rotate(90deg);
              }
          }
        }
        .announce-detail-main{
          padding:10px 30px;
          width:900px;
          height:600px;
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
                      background-image: url('../../../assets/icons/project.png');
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
                  justify-content: flex-start;
                  align-items: center;
                  .d-right-title{
                    flex-shrink: 0;
                    font-size: 1.3rem;
                  }
                  .detail-time{
                    flex-shrink: 0;
                      font-size: 1.4rem;
                      color:rgb(235, 81, 81);
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
        .announce-detail-footer{
            height:100px;
            display:flex;
            flex-direction: row;
            .upload-demo{
                display:flex;
                flex-direction: row;
                .item-btn{
                    display: inline;
                    margin-bottom: 10px;
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

      .appendix{
          margin-left: 20px;
          width:250px;
          height:725px;
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
                  background-image: url('../../../assets/icons/file.png');
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

    .main{
        padding:20px 20px;
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
            border: #e0e0e0 1px solid;
            //background-color: whitesmoke;
            border-radius: 10px;
            margin-bottom: 10px;
            transition: all .3s ease;
             &:hover{
                box-shadow:  4px 4px 6px #bebebe;
            }
            .item-left{
                display: flex;
                flex-direction: row;
                justify-content: center;
                .item-icon{
                    width:20px;
                    height:20px;
                    background-image: url('../../../assets/icons/project.png');
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
                
                .item-score{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    font-size: 1rem;
                    color:gray
                }
                .item-finished{
                    margin-left: 10px;
                    padding:0 15px;
                    height:30px;
                    border-radius: 15px;
                    //background-color: rgb(74, 97, 231);
                    color:gray;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    // &:hover{
                    //     background-color: rgb(103, 63, 211);
                    // }
                }
            }
        }
    }
}
</style>