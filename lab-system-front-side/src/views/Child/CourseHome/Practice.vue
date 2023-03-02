<template>
    <div class="practice">
        <div class="create-practice" v-show="createForm">
            <div class="announce-detail-box">
                <div class="announce-detail-head">
                    <div class="close" @click="cancleCreate()"></div>
                </div>
                <div class="announce-detail-main">
                   <div class="form-area">
                       <vue-scroll>
                       <el-form class="form-main" ref="form" :model="form" :rules="rules" label-width="80px">
                           <el-form-item label="练习名称">
                                <el-input style="width:200px;" v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="时间限制">
                                <el-input style="width:200px;" v-model="form.timeLimit"></el-input>
                            </el-form-item>
                            <el-form-item label="开放时间">
                                <el-col :span="11">
                                <el-date-picker type="date" placeholder="选择日期" v-model="form.startTime" style="width: 100%;"></el-date-picker>
                                </el-col>
                                <el-col class="line" style="text-align:center;" :span="1">-</el-col>
                                <el-col :span="11">
                                <el-time-picker placeholder="选择时间" v-model="form.startTime" style="width: 100%;"></el-time-picker>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="截止时间">
                                <el-col :span="11">
                                <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime" style="width: 100%;"></el-date-picker>
                                </el-col>
                                <el-col class="line" style="text-align:center;" :span="1">-</el-col>
                                <el-col :span="11">
                                <el-time-picker placeholder="选择时间" v-model="form.endTime" style="width: 100%;"></el-time-picker>
                                </el-col>
                            </el-form-item>
                            <span  v-for="(item,index) in this.form.problems" :key="index">
                            <el-form-item style="padding-top:30px;border-top:#e0e0e0 1px solid;" :label="'第'+(index+1)+'题'">
                                <el-input style="width:400px;" type="textarea":rows="2" v-model="form.problems[index].description"></el-input>
                            </el-form-item>
                            <el-radio-group style="margin-left:80px;margin-bottom:20px;" v-model="form.problems[index].type">
                                <el-radio :label="0">单选题</el-radio>
                                <el-radio :label="1">多选题</el-radio>
                            </el-radio-group>
                            <el-form-item label="选项A">
                                <el-input style="width:400px;" v-model="form.problems[index].options[0]"></el-input>
                            </el-form-item>
                            <el-form-item label="选项B">
                                <el-input style="width:400px;" v-model="form.problems[index].options[1]"></el-input>
                            </el-form-item>
                            <el-form-item label="选项C">
                                <el-input style="width:400px;" v-model="form.problems[index].options[2]"></el-input>
                            </el-form-item>
                            <el-form-item label="选项D">
                                <el-input style="width:400px;" v-model="form.problems[index].options[3]"></el-input>
                            </el-form-item>
                            <el-checkbox-group style="margin-left:80px;margin-bottom:20px;"  class="option-box" :max="item.type==0?1:999" v-model="form.problems[index].answer">
                                    <el-checkbox 
                                    v-for="(option,index) in item.options" 
                                    :key="index" 
                                    :label="index"
                                    >
                                    {{String.fromCharCode(65+index)}}
                                    </el-checkbox>
                            </el-checkbox-group>
                            </span>
                            <el-form-item>
                                <el-button type="primary" @click="onPracticeCreate()">立即创建</el-button>
                                <el-button @click="cancleCreate()">取消</el-button>
                            </el-form-item>
                       </el-form>
                       </vue-scroll>
                   </div>
                </div>
            </div>
        </div>
        <div class="interact-container" v-show="this.startBtn">
                <div class="start-box">
                    <div class="start-words">本次对抗练习的时间为{{this.selectedPractice.timeLimit}}分钟</div>
                    <div class="start-btns">
                        <div class="interact-btn" @click="startPractice()">开始答题</div>
                        <div class="interact-btn" @click="exitPractice()">退出答题</div>
                    </div>
                </div>
        </div>
        <div class="home-work-list-container" v-show="openList">
            
            <div class="home-work-list-head">
                <div class="list-back-icon" @click="closePracticeList()"></div>
                <div class="list-title">{{selectedPractice.name}}</div>
            </div>
            <div class="home-work-list-main">
                <div class="problem-area">
                    <div class="problem-area-head">
                        <div class="min">{{this.leftMin}}</div>分
                        <div class="sec">{{this.leftSec}}</div>秒
                    </div>
                    <div class="problem-main">
                        <vue-scroll>
                        <div class="problems">
                            <div class="problem"
                            v-for="(item,index) in this.problems"
                            :key="item.id"
                            >
                            <div class="problem-index">{{index+1}}.</div>
                            <div class="problem-index">({{item.type==0?'单选题':'多选题'}})</div>
                            <div class="problem-desc">{{item.description}}</div>
                            <div class="problem-option" v-for="(answer,index) in item.options" :key="answer">
                                <div class="option-index">{{String.fromCharCode(65+index)}}.</div>
                                {{answer}}
                            </div>
                            </div>
                        </div>
                        </vue-scroll>
                    </div>
                </div>
                <div class="answer-area">
                    <div class="answer-area-main">
                        <vue-scroll>
                            <div class="answer" v-for="(item,index) in this.problems" :key="item.id">
                                <div class="answer-title">问题{{index+1}}：</div>
                                <div class="answer-title">({{item.type==0?'单选题':'多选题'}})</div>
                                <el-checkbox-group class="option-box" :max="item.type==0?1:999" v-model="myOptions[index]">
                                    <el-checkbox 
                                    v-for="(option,index) in item.options" 
                                    :key="option" 
                                    :label="index"
                                    >
                                    {{String.fromCharCode(65+index)}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </vue-scroll>
                    </div>
                    <div class="submit-content">
                        <div class="submit-btn" @click="submitPractice()">提交</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="head-bar" v-show="(userType=='teacher'||userType=='responsible_teacher')">
            <div class="head-bar-left">
                <div class="head-bar-button"  @click="openCreate()">创建对抗练习</div>
            </div>
            <div class="head-bar-right">
                
            </div>
        </div>
        <div class="main">
            <div class="item" v-for="item in this.practiceList" :key="item.id">
                <div class="item-left">
                    <div class="item-icon"></div>
                    <div class="item-title">{{item.name}}</div>
                </div>
                <div class="item-right">
                    <div class="item-finished" v-show="!isOver(item)&&!item.marked&&!item.submited">截止于：{{endDate(item)}}</div>
                    <div class="item-finished" v-show="isOver(item)&&!item.marked&&!item.submited">已截止</div>
                    <div class="item-finished" v-show="item.marked">已评分</div>
                    <div class="item-finished" v-show="!item.marked&&item.submited&&userType=='student'">已提交</div>
                    <div class="item-btn" v-show="(userType=='teacher'||userType=='responsible_teacher')&&!item.marked" @click="caculateGrade(item)">统计成绩</div>
                    <div class="item-btn" v-show="userType=='student'&&!item.marked&&!item.submited&&!isOver(item)" @click="openPracticeList(item)">立即参与</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import axios from '../../../axios'
var qs = require("qs"); //格式化数据用的，很重要
export default {
    data () {
        return {
            form:{
                //创建对抗练习的表单
                name:'',
                timeLimit:0,
                startTime:'',
                endTime:'',
                problems:[],
            },
            rules:{
                name:[ { required: true, message: '请输入名称', trigger: 'blur' }],
                timeLimit:[{ required: true, message: '请输入时间限制', trigger: 'blur' }],
                startTime:[{ required: true, message: '请输入开始时间', trigger: 'change' }],
                endTime:[{ required: true, message: '请输入截止时间', trigger: 'change' }],
                problems:[{ required: true, message: '请完成问题', trigger: 'blur' }]
            },
            createForm:false,
            openList:false,
            leftMin:'5',
            leftSec:'0',
            practiceList:[],
            problems:[],
            myOptions:[],
            selectedPractice:{},
            startBtn:false,//开始答题按钮
            timeLimit:5,
            clock:null,
            courseId:0,
            userType:'',
            userId:0
        }
    },
    mounted () {
        for(let i=0;i<5;i++){
            let data={
                description:'',
                type:0,//0->单选 1->多选
                options:['','','',''],
                answer:[]
            }
            this.form.problems.push(data);
        }
        console.log(this.form.problems);
      this.courseId=this.$router.history.current.params.id;
      this.userType=this.$store.state.user.type;
      this.userId=this.$store.state.user.id;
      //console.log(this.userType);
      this.loadPracticeList();
      //console.log(this.problems);
      console.log('options',this.myOptions);
    },
    methods: {
        onPracticeCreate(){
            //创建对抗练习
            let list=[];
            this.form.problems.forEach(item=>{
                let temp={
                    description:item.description,
                    type:item.type,
                    options:JSON.stringify(item.options),
                    answer:JSON.stringify(item.answer.sort())
                }
                list.push(temp);
            })
            let data={
                courseId:this.courseId,
                name:this.form.name,
                timeLimit:parseInt(this.form.timeLimit),
                startTime:this.form.startTime,
                endTime:this.form.endTime,
                problems:list
            }
            //console.log(this.form);
            axios.createPractice(qs.stringify(data))
            .then(res=>{
                console.log(res);
                let practiceId=res.data.raw[0].id;
                if(practiceId==undefined){alert('创建失败');this.createForm=false;}
                else{
                    alert('创建成功');
                    this.createForm=false;
                }
            })
        },
        openCreate(){
            this.createForm=true;
        },
        cancleCreate(){
            this.createForm=false;
        },
        endDate(item){
            return moment(item.endTime).format('YYYY-MM-DD');
        },
        isOver(item){//判断是否过期
        let end=moment(item.endTime);
        let now=moment(new Date());
        return now.isAfter(end);
        },
        caculateGrade(item){
            let data={
                courseId:this.courseId,
                practiceId:item.id
            }
            axios.caculatePracticeGrade(qs.stringify(data))
            .then(res=>{
                alert(res.data);
            })
        },
        loadPracticeList(){
            let data={
                courseId:this.courseId
            }
            axios.getPracticeByCourseId(qs.stringify(data))
            .then(res=>{
                this.practiceList=res.data;
                console.log(this.practiceList);
            })
        },
        openPracticeList(item){
            this.openList=true;
            this.startBtn=true;
            this.selectedPractice=item;
            this.leftMin=item.timeLimit.toString();
        },
        closePracticeList(){
            this.openList=false;
        },
        loadProblems(){
            return new Promise(resolve=>{
                let data={
                    practiceId:this.selectedPractice.id,
                }
                axios.getProblemsByPracticeId(qs.stringify(data))
                .then(res=>{
                    let list=res.data;
                    list.forEach(item=>{
                    let problem={
                        id:item.id,
                        description:item.description,
                        type:item.type,
                        options:JSON.parse(item.options),
                        answer:JSON.parse(item.answer)
                    }
                    this.myOptions.push([]);//push空数组进去
                    this.problems.push(problem);
                    })

                    resolve();
            })
            //let list=[{"id":1,"description":"这是用于测试的问题","type":0,"options":"[\"这是选项a\",\"这是选项b\",\"这是选项c\",\"这是选项d\"]","answer":"[1]"},{"id":2,"description":"这是用于测试的问题2","type":0,"options":"[\"这是选项a\",\"这是选项b\",\"这是选项c\",\"这是选项d\"]","answer":"[1]"},{"id":3,"description":"这是用于测试的多选题3","type":1,"options":"[\"这是选项a\",\"这是选项b\",\"这是选项c\",\"这是选项d\"]","answer":"[0,1,2,3]"},{"id":4,"description":"这是用于测试的多选题4","type":1,"options":"[\"这是选项a\",\"这是选项b\",\"这是选项c\",\"这是选项d\"]","answer":"[0,1,2]"},{"id":5,"description":"这是用于测试的多选题5","type":1,"options":"[\"这是选项a\",\"这是选项b\",\"这是选项c\",\"这是选项d\"]","answer":"[0,2]"}]
            
      })
        },
        startTimeCount(){
            let now = moment(new Date());
            let duration=moment.duration(this.selectedPractice.timeLimit,'minutes');//建立以分钟为单位的计时
            this.endTime=now.add(duration);
            this.clock=setInterval(()=>{
                let t=moment(new Date());
                if(t.isAfter(this.endTime)){
                    //alert('考试时间到');
                    clearInterval(this.clock);
                    this.submitPractice();
                }
                else{
                    let diff=this.endTime.diff(t);
                    const minutes = moment.duration(diff).minutes();  //分钟
                    const seconds = moment.duration(diff).seconds();  //秒
                    //this.leftTime=minutes+'分 '+seconds+'秒';
                    this.leftMin=minutes;
                    this.leftSec=seconds;
                }
            },1000);
        },
        startPractice(){
            this.startBtn=false;
            this.loadProblems().then(()=>{//加载完成题目才开始计时
                this.startTimeCount();
            })
        },
        exitPractice(){
            this.startBtn=false;
            this.closePracticeList();
        },
        submitPractice(){
            clearInterval(this.clock);
            console.log(this.myOptions);
            let list=[];
            this.problems.forEach((item,index)=>{
                let temp={
                    id:item.id,
                    answer:JSON.stringify(this.myOptions[index].sort()),
                }
                list.push(temp);
            })

            let data={
                practiceId:this.selectedPractice.id,
                timeLeft:parseInt(this.leftMin)*60+parseInt(this.leftSec),
                answer:JSON.stringify(list),
                courseId:this.courseId
            }

            axios.submitPractice(qs.stringify(data))
            .then(res=>{
                this.closePracticeList();
                alert('提交成功');
            })

            
        },
    }
}
</script>

<style lang="scss" scoped>
.practice{
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
    .create-practice{
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
        z-index: 9;
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
      }
      .announce-detail-main{
        padding:10px 30px 20px 30px;
        width:750px;
        height:700px;
        //background-color: gray;
        .form-area{
            width:100%;
            height: 100%;
            //background-color: lightpink;
        }
      }
    }
    .interact-container{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        backdrop-filter: brightness(85%);
        z-index: 9999999;
        .start-box{
            width:400px;
            height: 240px;
            background-color: white;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .start-words{
                font-size: 15px;
                color:gray;
                margin-bottom: 50px;
            }
            .start-btns{
                display: flex;
                flex-direction: row;
                width:55%;
                justify-content: space-between;
            }
            .interact-btn{
                user-select: none;
                //margin-left: 10px;
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
            padding:10px 0 10px 10px;
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
            //background-color: lightblue;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            border-top: rgb(189, 189, 189) 1px solid;
            .problem-area{
                height: 100%;
                width:calc(100% - 350px);
                //background-color: whitesmoke;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                .problem-area-head{
                    width:100%;
                    //height: 50px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    align-items: center;
                    font-size: 15px;
                    color:gray;
                    padding:20px 30px 20px 0;
                    //background-color: lightblue;
                    .min{
                        color:rgb(74, 97, 231);
                        font-size: 16px;
                        margin-right: 5px;
                    }
                    .sec{
                        color:rgb(103, 63, 211);
                        font-size: 16px;
                        display: flex;
                        margin-right: 5px;
                        margin-left: 5px;
                    }
                }

                .problem-main{
                    width:100%;
                    height: 100%;
                    padding:0 0px 30px 150px;
                    .problems{
                        width:100%;
                        height: 100%;
                        //background-color: whitesmoke;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: flex-start;
                        padding-right: 100px;
                        padding-bottom: 200px;
                        .problem{
                            width:100%;
                            margin-bottom: 30px;
                            .problem-index{
                                display: inline;
                                font-size: 15px;
                                color:rgb(103, 63, 211);
                                margin-right: 5px;
                            }
                            .problem-desc{
                                display: inline;
                                font-size: 15px;
                                color:black;
                            }
                            .problem-option{
                                font-size: 14px;
                                color:gray;
                                margin-top: 20px;
                                .option-index{
                                    margin-left: 20px;
                                    color:rgb(74, 97, 231);
                                    margin-right: 3px;
                                    display: inline;
                                }
                            }
                        }
                    }
                }
            }
            .answer-area{
                height: 100%;
                width:350px;
                background-color: white;
                border-left: rgb(189, 189, 189) 1px solid;
                padding:20px;
                .answer-area-main{
                    width:100%;
                    height: 90%;
                    //background-color: whitesmoke;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    padding-bottom: 20px;
                    .answer{
                        padding-top: 10px;
                        padding-bottom: 10px;
                        //border-bottom:rgb(168, 168, 168) 1px solid;
                        .answer-title{
                            display: inline;
                            font-size: 14px;
                            color:rgb(74, 97, 231);
                            margin-bottom: 15px;
                            //margin-top: 15px;
                        }
                        .option-box{
                            margin-top: 15px;
                        }
                    }
                }
                .submit-content{
                    width:100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    .submit-btn{
                        user-select: none;
                        margin-left: 10px;
                        padding:0 50px;
                        height:40px;
                        border-radius: 20px;
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
                    background-image: url('../../../assets/icons/practise.png');
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