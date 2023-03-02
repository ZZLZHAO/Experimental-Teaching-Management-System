<template>
    <div class="course-files">
        <div class="home-work-list-container" v-show="openList">
            <div class="files-box">
                <div class="home-work-list-head">
                    <div class="list-back-icon" @click="closePracticeList()"></div>
                    <div class="list-title">{{this.detailTitle}}</div>
                </div>
                <div class="home-work-list-main">
                    <vue-scroll>
                        <div class="list-container">
                            <div class="list-item" v-for="file in fileList" :key="file.id">
                                <div class="name"><a :href="file.url">{{file.name}}</a></div>
                                <div class="time">{{formatTime(file.createdTime)}}</div>
                                <div class="updater">{{file.creator.name}}</div>
                            </div>
                        </div>
                    </vue-scroll>
                </div>
            </div>
        </div>

        <div class="head-bar" v-show="identify()">
            <div class="head-bar-left">
                <div class="head-bar-button" @click="showUpload">上传教学资料</div>
            </div>
        </div>

        <!-- 发布课程公告弹窗 -->
        <el-dialog title="上传教学资料" :visible.sync="openUpload" class="announce-detail" @close="resetForm('courseFile')">
            <el-form :model="courseFile" :rules="rules" ref="courseFile" label-width="200px">
                <el-form-item label="资料类型" prop="type">
                    <el-select v-model="courseFile.type" placeholder="请选择资料类型">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资料上传" prop="file">
                    <el-upload
                        class="upload-demo"
                        action=""
                        ref="upload"
                        :http-request="uploadFile"
                        :before-remove="beforeRemove"
                        multiple
                        :limit="1"
                        :auto-upload="false"
                        :on-success="addCourseFile"
                        :on-exceed="handleExceed"
                        :file-list="uploadFileList">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAnnounce('courseFile')">立即创建</el-button>
                    <el-button @click="resetForm('courseFile')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <div class="main">
            <div class="item">
                <div class="item-left">
                    <div class="item-icon"></div>
                    <div class="item-title">课程学习资料</div>
                </div>
                <div class="item-right">
                    <div class="item-btn" @click="openPracticeList('课程学习资料')">查看资料</div>
                </div>
            </div>
            
            <div class="item" >
                <div class="item-left">
                    <div class="item-icon"></div>
                    <div class="item-title">实验项目资料</div>
                </div>
                <div class="item-right">
                    <div class="item-btn" @click="openPracticeList('实验项目资料')">查看资料</div>
                </div>
            </div>

            <div class="item">
                <div class="item-left">
                    <div class="item-icon"></div>
                    <div class="item-title">对抗练习资料</div>
                </div>
                <div class="item-right">
                    <div class="item-btn" @click="openPracticeList('对抗练习资料')">查看资料</div>
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
        this.courseFile.courseId=this.courseId;
    },
    data () {
        return {
            courseId:'',
            openUpload:false,
            openList:false,
            detailTitle:'',
            fileType:'',
            fileList:[
                {
                    id:'',
                    name:'开学通知.pdf',
                    url:'',
                    type:'',
                    creator:'',

                },
            ],
            uploadFileList:[],
            options:[
                {
                    value:'course',
                    label:'课程学习资料',
                },
                {
                    value:'project',
                    label:'实验项目资料',
                },
                {
                    value:'exercise',
                    label:'对抗练习资料',
                },
            ],
            //创建项目表单验证规则
            rules: {
                type: [
                    { required: true, message: '请选择资料类型', trigger: 'blur' },
                ],
                file: [
                    { required: false, message: '请选择附件', trigger: 'blur' }
                ]
            },
            url:'',
            //课程资料
            courseFile: {
                id:'',
                name: '',
                type: '',
                url:'',
                courseId:'',
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
        openPracticeList(title){
            this.detailTitle=title;
            if(title==='课程学习资料')
                this.fileType='course';
            if(title==='实验项目资料')
                this.fileType='project';
            if(title==='对抗练习资料')
                this.fileType='exercise';
            
            let data={
                courseId:this.courseId,
                type:this.fileType
            }
            axios.findCourseFiles(qs.stringify(data))
            .then(res=>{
                this.fileList=res.data;
                console.log(this.fileList)
            })
            this.openList=true;
        },
        closePracticeList(){
            this.openList=false;
            this.detailTitle='';
        },
        showUpload(){
            this.openUpload=true;
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //表单验证及文件上传
        async submitAnnounce(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                        this.$refs.upload.submit();
                    // resetForm(formName);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async addCourseFile(){
            console.log("this.courseFile")
            console.log(this.courseFile)
            this.courseFile.url=this.url;
            this.courseFile.name=this.uploadFileList[0].name;
            axios.addCourseFile(qs.stringify(this.courseFile))
                .then((res) => {
                    console.log(res)
                    this.openUpload=false;
                    this.$refs.upload.clearFiles();
                })
                .catch((err) => {
                    alert("上传附件失败");
                    console.log(err);
                });
        },
        async uploadFile(param){
            return new Promise((resolve,reject)=>{
                this.uploadFileList[0]=param.file;
                const formData = new FormData()
                formData.append('file', this.uploadFileList[0])
                console.log('test')
                console.log(param)
                console.log(this.uploadFileList)
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
.course-files{
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
    .home-work-list-container{
        position:fixed;
        top:0;
        right:0;
        width:100%;
        height: 100%;
        //background-color: white;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        backdrop-filter: brightness(75%);
        z-index: 20;
        .files-box{
            width:400px;
            height:100%;
            background-color: white;
            padding:10px;
            .home-work-list-head{
                width:100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                .list-back-icon{
                    width:16px;
                    height:16px;
                    background-image: url('../../../assets/icons/close.png');
                    background-size:cover;
                    margin-right: 15px;
                    transition:all .3s ease;
                    &:hover{
                        transform: rotate(90deg);
                    }
                }
                .list-title{
                    font-size: 1.6rem;
                    color:gray;
                }
            }

            .home-work-list-main{
                margin-top: 10px;
                width:100%;
                height:calc(100% - 30px);
                //background-color: lightblue;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                .list-container{
                    width:100%;
                    height: auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    .list-item{
                        width:100%;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 20px;
                        .name{
                            font-size: 1.3rem;
                            color:rgb(108, 39, 235);
                            text-decoration: underline rgb(108, 39, 235);
                        }
                        .time{
                            font-size: 1.2rem;
                            color:gray;
                        }
                        .updater{
                            font-size: 1.3rem;
                            color:gray;
                        }
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
                    background-image: url('../../../assets/icons/file-b.png');
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