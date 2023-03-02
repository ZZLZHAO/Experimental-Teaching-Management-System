<template>
    <div class="course-grade">
        <div class="main">
            <div class="item">
                <div class="item-section-one">
                <div class="item-title1">总成绩</div>
                <div class="item-mark">{{grade.toFixed(2)}}/{{100}}</div>
                </div>
            </div>
            <div class="item">
                <div class="item-section-one">
                <div class="item-title">平时成绩</div>
                <div class="item-mark">{{usual.toFixed(2)}}/{{usualAll}}</div>
                </div>
            </div>

            <div class="item">
                <div class="item-section-one">
                <div class="item-title">项目成绩</div>
                <div class="item-mark">{{project.toFixed(2)}}/{{projectAll}}</div>
                </div>
                <div class="item-detail" v-for="(item,index) in this.projectGrade" :key="index">
                    {{item.project.name}}：{{item.project.fullMark * item.score / 100}}/{{item.project.fullMark}}
                </div>
            </div>
            <div class="item">
                <div class="item-section-one">
                <div class="item-title">练习成绩</div>
                <div class="item-mark">{{practice.toFixed(2)}}/{{practiceAll}}</div>
                </div>
                 <div class="item-detail" v-for="(item,index) in this.practiceGrade" :key="index">
                    {{item.practice.name}}：{{item.score}}/5
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
    mounted () {
        let courseId=this.$router.history.current.params.id;
        let data={
            courseId:courseId,
        }
        axios.findByCourseId(qs.stringify(data))
        .then(res=>{
            //console.log(res.data);
            this.course=res.data;

            axios.findScoresByCourse(qs.stringify(data))
        .then(res=>{
            //console.log(res.data);
            let list=[];
            list=res.data;
            list.forEach(item=>{
                if(item.type=='attendance'){
                    this.usualGrade=item;
                }
                else if(item.type=='project'){
                    this.projectGrade.push(item);
                }
                else if(item.type=='exercise'){
                    this.practiceGrade.push(item);
                }
            })

            this.usualAll=100 * this.course.usualRatio;
            this.projectAll=100 * this.course.projectRatio;
            this.practiceAll=100 * this.course.practiceRatio;

            if(this.usualGrade.score>this.usualAll)this.usual=this.usualAll;
            else this.usual=this.usualGrade.score;

            let count=0;
            let allcount=0;
            this.projectGrade.forEach(item=>{
                let fullmark=item.project.fullMark;
                let score=item.score;
                count += fullmark * score / 100;
                allcount += fullmark;
            })

            this.project= this.projectAll * count / allcount;

            count=0;
            allcount=0;

            this.practiceGrade.forEach(item=>{
                let fullmark=5;
                let score=item.score;
                count += score;
                allcount += fullmark;
            })

            this.practice = this.practiceAll * count / allcount;

            this.grade=this.usual+this.project+this.practice;
        })
        })

        
    },
    data () {
        return {
            course:{},
            usualGrade:{},
            projectGrade:[],
            practiceGrade:[],
            gradeAll:100,
            grade:0,
            usualAll:0,
            usual:0,
            projectAll:0,
            project:0,
            practiceAll:0,
            practice:0
        }
    },
    computed: {
        myGradeAll:function(){
            return this.myGrade.usual.grade + this.myGrade.project.grade + this.myGrade.practice.grade;
        },
        usualP:function(){
            let res= this.myGrade.usual.grade/this.myGrade.usual.all*100;
            return res.toFixed(2);
        },
        projectP:function(){
            let res=this.myGrade.project.grade/this.myGrade.project.all*100;
            return res.toFixed(2);
        },
        practiceP:function(){
            let res=this.myGrade.practice.grade/this.myGrade.practice.all*100;
            return res.toFixed(2);
        },
        allP:function(){
            let res=this.myGradeAll;
            return res.toFixed(2);
        }
    },
    methods: {
        format(a,b){
            return a+'/'+b;
        }
    }
}
</script>

<style lang="scss" scoped>
.course-grade{
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
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            border: #e0e0e0 1px solid;
            //background-color: whitesmoke;
            border-radius: 10px;
            margin-bottom: 10px;
            transition: all .3s ease;
             &:hover{
                box-shadow:  4px 4px 6px #bebebe;
            }
            .item-detail{
                margin-top: 10px;
                margin-left: 10px;
                font-size: 13px;
                color:gray;
            }
            .item-section-one{
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                .item-title1{
                    color:rgb(95, 95, 95);
                    font-weight: 600;
                    font-size: 1.6rem;
                    margin-right: 10px;
                }
                .item-title{
                    color:rgb(128, 71, 219);
                    font-size: 1.4rem;
                    margin-right: 10px;
                }
                .item-mark{
                    font-size: 1.6rem;
                    color:gray;
                }
            }
        }
    }
}
</style>