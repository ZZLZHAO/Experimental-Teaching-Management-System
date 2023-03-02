<template>
  <div class="account-container">
    <el-dialog title="修改密码" width="40%" :visible.sync="changePsw">
      <el-form :model="form">
        <el-form-item label="验证码" >
          <el-input style="width:200px;" v-model="form.validate" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" >
          <el-input style="width:200px;" v-model="form.psw" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="确认密码" >
          <el-input style="width:200px;" v-model="form.pswCheck" autocomplete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changePsw = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit()">确 定</el-button>
      </div>
    </el-dialog>
    <div class="help-container" v-show="this.openHelp">
      <div class="help-box">
        <div class="help-head">
          <div class="close" @click="hideHelp()"></div>
        </div>
        <div class="help-main">
          <vue-scroll>
          <div class="help-item">
            <div class="help-q">Q：我的信息被抢注/误注怎么办？</div>
            <div class="help-a">由于系统功能方面的要求，理论上只要知道其他人的学工号即可进行注册。因此我们无法保证您的信息不被抢注或误注，如果发现您的信息已经被他人注册，请携带身份证明前往教务说明情况，我们会在确认您的身份后为您重置账号。</div>
          </div>
          <div class="help-item">
            <div class="help-q">Q：我的激活邮箱失效了怎么办？</div>
            <div class="help-a">邮箱换绑功能必须通过原有邮箱的验证，因此无法在本系统中完成换绑操作。您可以点击下方的“立即反馈”，以邮件的形式向管理员发送邮件，说明相关情况并出示证明材料，如身份证，学生证正面照片等。您也可以携带身份证明资料前往教务处理。</div>
          </div>
          <div class="help-item">
            <div class="help-q">Q：我的密码疑似被他人篡改？</div>
            <div class="help-a">忘记密码或密码被他人篡改时，我们建议您向管理员说明情况并出示身份证明，或者携带身份证明前往教务进行反馈，您可以选择找回密码或者重置您的账户。</div>
          </div>
          </vue-scroll>
        </div>
      </div>
    </div>
    <div class="main">
      <!-- <div class="title">我的课程</div> -->
      <el-breadcrumb separator="/" class="title">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账户</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main-container">
        <div class="account-item">
          <div class="left">
            <div class="account-item-icon" id="user"></div>
            <div class="account-item-title">账号</div>
            <div class="content">{{this.user.id}}</div>
          </div>
          <div class="right">
            <div class="copy"></div>
          </div>
        </div>

        <div class="account-item">
          <div class="left">
            <div class="account-item-icon" id="email"></div>
            <div class="account-item-title" >邮箱</div>
            <div class="content">{{this.user.email}}</div>
          </div>
          <div class="right">
            <div class="account-item-btn">更改绑定</div>
          </div>
        </div>

        <div class="account-item">
          <div class="left">
            <div class="account-item-icon" id="password"></div>
            <div class="account-item-title" >密码</div>
            <div class="content">******</div>
          </div>
          <div class="right">
            <div class="account-item-btn" @click="showPswForm()">修改密码</div>
          </div>
        </div>
      </div>
    </div>
    <div class="side">
      <div class="title">遇到问题？</div>
      <div class="lower">
        <div class="side-btn" @click="showHelp()">常见问题</div>
        <a href="mailto:aiysosis@qq.com" class="side-btn">立即反馈</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../axios";
var qs = require("qs"); //格式化数据用的，很重要
//import axios from 'axios'
export default {
  data() {
    return {
      openHelp:false,
      changePsw:false,
      validateCode:'',
      user:{},
      form:{
        validate:'',
        psw:'',
        pswCheck:''
      }
    };
  },
  mounted() {
    this.user=this.$store.state.user;
  },
  methods: {
    showPswForm(){
      this.changePsw=true;
      axios.sendMail()
      .then(res=>{
        alert('验证码已发出，请注意查收');
        this.validateCode=res.data;
        console.log(this.validateCode);
      })
    },
    confirmEdit(){
      if(this.form.validate!=this.validateCode)alert('验证码错误');
      else{
        let data={
          password:this.form.psw
        }

        axios.updatePsw(qs.stringify(data))
        .then(res=>{
          alert('修改成功');
          this.changePsw=false;
        })
        .catch(err=>{
          alert('修改失败');
          this.changePsw=false;
        })
      }
    },
    showHelp(){
      this.openHelp=true;
    },
    hideHelp(){
      this.openHelp=false;
    },
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
    .help-container{
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
    .help-box{
      background-color: white;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .help-head{
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

      .help-main{
        padding:10px 30px;
        width:500px;
        height:600px;
        .help-item{
          width:100%;
          padding:20px 20px;
          .help-q{
            font-size: 15px;
            color:rgb(58, 117, 245);;
          }
          .help-a{
            margin-top: 15px;
            font-size: 13px;
            color:rgb(87, 87, 87);
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
        .account-item{
          width:100%;
          padding:30px 20px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          border-bottom: #e5e5e5 1px solid;
          transition: all .3s ease;

          // &:hover{
          //   box-shadow:   10px 10px 20px #dfdddd;
          // }
          .left{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .account-item-icon{
              height:30px;
              width:30px;
              background-size: cover;
              margin-right: 30px;
            }
            #user{
              background-image: url('../../assets/icons/user-a.png');
            }
            #email{
              background-image: url('../../assets/icons/email.png');
            }
            #password{
              background-image: url('../../assets/icons/psw.png');
            }
            .account-item-title{
              color:gray;
              font-size: 1.3rem;
              margin-right: 30px;
            }
            .content{
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              color:rgb(128, 71, 219);
              font-size: 1.3rem;
            }
          }

          .right{
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;

            .copy{
              width:20px;
              height: 20px;
              background-image: url('../../assets/icons/copy.png');
              background-size: cover;
            }

            .account-item-btn{
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
  .side {
    flex-shrink: 0;
    box-sizing: border-box;
    border-radius: 10px;
    width:300px;
    background-color: white;
    height:400px;
    margin-top:30px; 
    transition: all .3s ease;
    background-image: url('../../assets/feedback.png');
    background-size: 100% auto;
    background-position: top center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .title{
        margin-top: 20px;
        font-size: 1.7rem;
        font-weight: 600;
        color:rgb(58, 117, 245);
        margin-bottom: 20px;
    }
    .lower{
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 20px;
      .side-btn{
        text-decoration: none;
        user-select: none;
        height: 36px;
        padding:0 40px 0 40px;
        border-radius: 18px;
        color: white;
        background-color: rgb(18, 77, 238);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        &:hover{
          background-color: rgb(103, 63, 211);
        }
      }
    }
  }
  // .side:hover{
  //   box-shadow:  25px 25px 51px #bebebe,
  //               -25px -25px 51px #ffffff
  // }
}
</style>