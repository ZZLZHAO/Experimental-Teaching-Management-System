<template>
    <div class="course-announce">
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


        <div class="head-bar" v-show="identify()">
            <div class="head-bar-left">
                <div class="head-bar-button" @click="showPublish">发布公告</div>
            </div>
            <div class="head-bar-right">
                
            </div>
        </div>

        <!-- 发布课程公告弹窗 -->
        <el-dialog title="发布课程公告" :visible.sync="openPublish" width="60%" @close="resetForm('publishAnnounce')">
            <el-form :model="publishAnnounce" :rules="rules" ref="publishAnnounce" label-width="200px" class="demo-ruleForm">
                <el-form-item label="课程公告名称" prop="title">
                    <el-input style="width:500px;" v-model="publishAnnounce.title"></el-input>
                </el-form-item>
                <el-form-item label="课程公告内容" prop="content">
                    <el-input style="width:500px;" type="textarea" v-model="publishAnnounce.content"></el-input>
                </el-form-item>
                <el-form-item label="课程公告附件上传" prop="file">
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
</template>

<script>
import axios from '../../../axios'
import moment from 'moment'
var qs = require('qs');
export default {
    mounted () {
        this.courseId=this.$router.history.current.params.id;
        this.userType=this.$store.state.user.type;
        let data={
            courseId:this.courseId
        }
        axios.getAnnounceByCourseId(qs.stringify(data))
        .then(res=>{
            this.announceList=res.data;
            console.log(this.announceList)
        })
    },
    data () {
        return {
            courseId:'',
            userType:'',
            openPublish:false,
            hasAppendix:false,
            openDetail:false,
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
                courseId:'',
            },
            //创建项目表单验证规则
            rules: {
                title: [
                    { required: true, message: '请输入课程公告名称', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请填写课程公告内容', trigger: 'blur' }
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
        }
    },

    methods: {
        identify(){
            if(this.$store.state.user.type==='responsible_teacher'||this.$store.state.user.type==='teacher')
                return true;
            else
                return false;
        },
        formatTime(utcTime){
            return moment(utcTime).format('YYYY-MM-DD');
        },
        loadAnnounce(){
            //获取公告
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
                this.publishAnnounce.courseId=this.courseId;
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
    }
}
</script>

<style lang="scss" scoped>
.course-announce{
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
                    background-image: url('../../../assets/icons/announce-d.png');
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
                    background-image: url('../../../assets/icons/announce-b.png');
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
</style>