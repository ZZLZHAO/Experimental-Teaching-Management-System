<template>
    <div class="container">
        <div class="main-container">
            <div class="login-container">
                <div class="main">
                    <div class="title">激活您的账户</div>
                    <el-input class="login-input" v-model="identify_number" placeholder="输入学/工号"></el-input>
                    <el-input class="login-input"  v-model="email" placeholder="输入邮箱"></el-input>
                    <el-input type="password" class="login-input" v-model="psw" placeholder="输入密码"></el-input>
                    <!-- <el-input type="password" class="login-input" v-model="psw" placeholder="确认密码"></el-input> -->
                    <input type="button" class="button" value="确认" @click="enable">
                </div>
            </div>
        </div>
        <loading
        v-show="loading"
        />
    </div>
</template>

<script>
import axios from '../axios'
import loading from '../components/Loading.vue'
var qs = require('qs');//格式化数据用的，很重要
export default {
    components:{
        loading,
    },
    data(){
        return{
            loading:false,
            email:'',
            psw:'',
            identify_number:'',//学号，工号
        }
    }
    ,
    methods:{
        enable(){
            this.loading=true;
            if(!this.email||!this.psw||!this.identify_number)return;
            let data={
                email:this.email,
                password:this.psw,
                jobNumber:this.identify_number
            }
            console.log(data);
            axios.userEnable(qs.stringify(data))
            .then((res)=>{
                this.loading=false;
                alert("验证邮件已发出，请注意查收")
                //this.$router.push('/home');
            })
            .catch((err)=>{
                this.loading=false;
                alert(err.data.message)
                console.log(err);
            })
        },
    }
}
</script>


<style scoped>
.el-input >>> .el-input__inner {
    box-sizing: border-box;
    border:none;
    outline: none;
    border-radius: 0;
    background-color: rgba(255,255,255,0);
    border-bottom: silver 2px solid;
    transition: all .5s ease;
}
.el-input >>> .el-input__inner:focus{
    border-bottom: whitesmoke 2px solid;
    color:whitesmoke;
}
</style>
<style lang="scss" scoped>
*{
    user-select: none;
}
.container{
    padding:0;
    margin:0;
    position: absolute;
    width:100%;
    height:100%;
    background-color: white;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .main-container{
        box-sizing: border-box;
        padding:0;
        margin:0;
        width:60%;
        height:70%;
        min-height:500px ;
        background-image: linear-gradient(to top right, violet, rgb(0, 174, 255));
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        border-radius: 20px;
        box-shadow:  30px 30px 60px #bebebe,
             -30px -30px 60px #ffffff;
        .login-container{
            box-sizing: border-box;
            width:350px;
            height:100%;
            background-color: rgba($color: #777272, $alpha: 0.2);
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            .main{
                box-sizing: border-box;
                width:350px;
                height:100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .title{
                    box-sizing: border-box;
                    //margin-top:-10%;
                    margin-bottom: 50px;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size:22px;
                    color:white;
                    transition: all .5s ease;
                }
                .title:hover{
                    font-size:24px;
                }
                .login-input{
                    box-sizing: border-box;
                    width:80%;
                    margin-bottom:30px;
                }
                .button{
                    box-sizing: border-box;
                    width:110px;
                    height:40px;
                    margin-top:30px;
                    border-radius: 20px;
                    outline: none;
                    border:none;
                    color:white;
                    background-color: rgb(69, 102, 163);
                    transition: all .5s ease;
                }
                .button:hover{
                    background-color: lightblue;
                }
                .forget{
                    box-sizing: border-box;
                    width: 80%;
                    //@debugbackground-color: lightblue;
                    text-align: right;
                    color:silver;
                    font-size:13px;
                    transition: all .5s ease;
                }
                .forget:hover{
                    color: white;
                }

            }
        }
    }
}
</style>