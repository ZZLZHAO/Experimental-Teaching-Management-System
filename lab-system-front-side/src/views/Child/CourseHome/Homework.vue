<template>
    <div class="home-work">
        <div class="home-work-list-container" v-show="openList">
            <div class="home-work-list-head">
                <div class="list-back-icon" @click="closeHomeworkList()"></div>
                <div class="list-title">作业批改</div>
            </div>
            <div class="home-work-list-main">
                <el-table
                    class="table"
                    :data="homeworkList"
                    height="250"
                    border
                    stripe
                    style="width: 100%">
                    <el-table-column prop="creator.jobNumber" label="学工号"></el-table-column>
                    <el-table-column prop="creator.name" label="学生姓名"></el-table-column>
                    <el-table-column prop="name" label="作业名称" ></el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="scope">
                            <div class="operation">
                                <a class="item" :href="scope.row.url">下载</a>
                                <div class="item-btn" v-show="!scope.row.isGrade" @click="openSetScoreDialog(scope.row.creator.id)">打分</div>
                                <div class="item-btn" v-show="scope.row.isGrade" @click="openSetScoreDialog(scope.row.creator.id)">重新打分</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <el-dialog title="作业批改" :visible.sync="openSetScore" @close="resetForm('setScoreObject')">
             <el-form :model="setScoreObject"  ref="setScoreObject">
                <el-form-item prop="score" label="分数" label-width=120px
                              :rules="[
                                { required: true, message: '分数不能为空'},
                                { type: 'number', message: '分数必须为数字值'}
                                ]">
                    <el-input type="number" v-model.number="setScoreObject.score" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setScore('setScoreObject')">确 定</el-button>
                <el-button @click="resetForm('setScoreObject')">取 消</el-button>
            </div>
        </el-dialog>

        <div class="main">
            <div class="item" v-for="project in projectList" :key="project.id">
                <div class="item-left">
                    <div class="item-icon"></div>
                    <div class="item-title">{{project.name}}</div>
                </div>
                <div class="item-right">
                    <div class="item-btn" @click="openHomeworkList(project.id)">开始批改</div>
                </div>
            </div>
            <!-- <div class="item">
            <div class="item-left">
                <div class="item-icon"></div>
                <div class="item-title">实验作业一</div>
            </div>
            <div class="item-right">
                <div class="item-finished">已完成</div>
            </div>
        </div> -->
        </div>
        
    </div>
</template>

<script>
import axios from "../../../axios";
import moment from 'moment'
var qs = require("qs"); //格式化数据用的，很重要
export default {
    data () {
        return {
            openList:false,
            openSetScore:false,
            course: {
                courseId:0,
            },
            projectList:[],
            project:{
                projectId:"",
                name:"",
                endTime:"",
                files:[],
                desc: ''
            },
            setScoreObject:{
                courseId:'',
                projectId:'',
                userId:'',
                score:'',
            },
            homeworkList:[],

        }
    },
    computed: {
        
    },
    mounted() {
        this.course.courseId = this.$router.history.current.params.id;
        axios.findProject(qs.stringify(this.course))
            .then((res) => {
                console.log(res)
                this.projectList=res.data;
                console.log(this.projectList)
                this.setScoreObject.courseId=this.course.courseId;
                this.openSetScore=false;
            })
            .catch((err) => {
                alert("获取项目列表失败");
                console.log(err);
            });
  },
    methods: {
        openSetScoreDialog(id){
            this.setScoreObject.userId=id;
            console.log(this.setScoreObject);
            this.openSetScore=true;
        },
        setScore(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    console.log('this.setScoreObject');
                    console.log(this.setScoreObject);
                    axios.setProjectScore(qs.stringify(this.setScoreObject))
                        .then((res) => {
                            console.log(res);
                            this.openSetScore=false;
                            this.setScoreObject.score='';
                        })
                        .catch((err)=>{
                            alert("分数上传失败");
                            console.log(err);
                        })
                }
                else{
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        openHomeworkList(projectId){
            this.openList=true;
            this.project.projectId=projectId;
            this.setScoreObject.projectId=projectId;
            this.getHomeworkList();
            console.log(this.project);
        },
        getHomeworkList(){
            axios.getHomeworkList(qs.stringify(this.project))
                .then((res) => {
                    console.log(res);
                    this.homeworkList=res.data;
                    console.log(this.homeworkList);
                })
                .catch((err) => {
                    alert("获取作业列表失败");
                    console.log(err);
                })
        },
        closeHomeworkList(){
            this.openList=false;
        }
    }
}
</script>

<style lang="scss" scoped>
.home-work{
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
        left:0;
        width:100%;
        height: 100%;
        background-color: white;
        z-index: 20;
        .home-work-list-head{
            width:100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            .list-back-icon{
                width:28px;
                height:28px;
                background-image: url('../../../assets/icons/left.png');
                background-size:cover;
                margin-right: 15px;
                transition:all .3s ease;
                &:hover{
                    transform: scale(1.2);
                }
            }
            .list-title{
                font-size: 1.6rem;
                color:gray;
            }
        }

        .home-work-list-main{
            width:100%;
            height:calc(100% - 30px);
            // background-color: lightblue;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            .table{
                margin-top: 30px;
                min-height:calc(100%);
                margin-bottom: 8px;
                .operation{
                    padding: 10px 10px;
                    display: flex;
                    flex-direction: row;
                    .item{
                        margin: 0 10px;
                    }
                    .item-btn{
                        user-select: none;
                        cursor:pointer;
                        margin-left: 10px;
                        color:#3453a7;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        &:hover{
                            color: rgb(103, 63, 211);
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
        padding:10px 10px;
        .head-bar-right{
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
                    background-image: url('../../../assets/icons/pen.png');
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