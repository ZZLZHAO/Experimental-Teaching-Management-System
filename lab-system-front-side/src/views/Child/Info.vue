<template>
  <div class="info-container">
    <div class="help-container" v-show="this.openHelp">
      <div class="help-box">
        <div class="help-head">
          <div class="close" @click="hideHelp()"></div>
        </div>
        <div class="help-main">
          <vue-scroll>
          <div class="help-item">
            <div class="help-q">Q：个人信息有误怎么办？</div>
            <div class="help-a">账号信息在注册账号之前由系统自动录入，不排除信息错误的情况，请联系教务或者系统管理员，出示相关证明，我们会为您完成修改。</div>
          </div>
          <div class="help-item">
            <div class="help-q">Q：哪些个人信息是我可以修改的？</div>
            <div class="help-a">用户基本的个人信息是提前录入系统且无法被修改的，我们为您提供的修改功能包括头像以及简介，其余信息如姓名、学工号、年级、身份都是无法修改的。如果发现基本信息错误，请向教务或管理员反应，账号有关的信息请前往“账户”页面。</div>
          </div>
          <div class="help-item">
            <div class="help-q">Q：如何修改个人信息？</div>
            <div class="help-a">在页面的“基本信息”标识右侧有修改的按钮，点击即可对部分个人信息进行编辑。</div>
          </div>
          </vue-scroll>
        </div>
      </div>
    </div>       
    <el-dialog title="修改个人信息" :visible.sync="editInfo" @close="resetForm('updateUser')">
        <el-form :model="updateUser" :rules="rules" ref="updateUser" label-width="200px">
          <el-form-item label="个人头像">
            <el-upload
                action=""
                ref="upload"
                :http-request="uploadFile"
                :before-remove="beforeRemove"
                multiple
                :limit="1"
                accept=".jpg,.png,.jpeg,JPG,JPEG"
                :auto-upload="true"
                :on-exceed="handleExceed"
                :show-file-list="false"
                :file-list="fileList"
                list-type="picture">
            <!-- <div class="head-box-avatar"><a :href="this.user.url"></a></div> -->
            <el-avatar
                :size="100"
                icon="el-icon-user-solid"
                :src="this.updateUser.avatar"
              ></el-avatar>
            </el-upload>
            </el-form-item>
            <el-form-item label="个人简介" prop="description">
                <el-input style="width:300px" v-model="updateUser.description"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitAnnounce('updateUser')">确认修改</el-button>
                <el-button @click="resetForm('updateUser')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <div class="main">
      <!-- <div class="title">我的课程</div> -->
      <el-breadcrumb separator="/" class="title">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main-container">
        <div class="head-box">
          <div class="head-box-top">
            <div class="user-type">{{this.userType}}</div>
          </div>
          <div class="head-box-main">
            <div><img class="head-box-avatar" :src="this.user.avatar"></div>
            <div class="name-description">
              <div class="head-box-name">{{this.user.name}}</div>
              <div class="description">{{moto}}</div>
            </div>
          </div>
        </div>
        <div class="info-box">
          <div class="info-head">
            <div class="info-box-title">基本信息</div>
            <div class="edit-icon" @click="openEdit()"></div>
          </div>
          <div class="info-box-item">
            <div class="item-title">姓名：</div>
            {{this.user.name}}
          </div>
          <div class="info-box-item">
            <div class="item-title">邮箱：</div>
            {{this.user.email}}
          </div>
          <div class="info-box-item">
            <div class="item-title">学工号：</div>
            {{this.user.jobNumber}}
          </div>
          <div class="info-box-item">
            <div class="item-title">年级：</div>
            {{this.user.grade}}
          </div>
          <div class="info-box-item">
            <div class="item-title">账号状态：</div>
            已激活
          </div>
          <!-- <div class="item-title">简介</div>
          <div class="description">life is like a box of chocolate, you never konw what you are going to get.</div> -->
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
//import store from '../../store'
var qs = require("qs"); //格式化数据用的，很重要
//import axios from 'axios'
export default {
  data() {
    return {
      openHelp:false,
      editInfo:false,
      user:{},
      userType:'',
      updateUser: {
          avatar:'',
          description: '',
      },
      //创建项目表单验证规则
      rules: {
          description: [
              { required: true, message: '请填写个人简介', trigger: 'blur' }
          ],
      },
      //上传文件list
      fileList:[],
      url:"",
    }
  },
  mounted() {
    this.user=this.$store.state.user;
    this.updateUser=this.user;
    console.log(this.updateUser)
    if(this.user.type=='teacher')
      this.userType='任课教师';
      else if(this.user.type=='responsible_teacher')
        this.userType='责任教师';
        else
          this.userType='学生';
  },
  computed: {
    moto:function(){
      if(this.user.description=='')return 'Life is like a box of chocolate, you never konw what you are going to get.';
      else return this.user.description;
    }
  },
  methods: {
    showHelp(){
      this.openHelp=true;
    },
    hideHelp(){
      this.openHelp=false;
    },
    openEdit(){
      this.editInfo=true;
    },
    closeEdit(){
      this.editInfo=false;
    },
    
    resetForm(formName) {
      this.fileList=[];
        this.$refs[formName].resetFields();
    },
    //表单验证及文件上传
    async submitAnnounce(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                  return this.updateUserAvatar();
                // resetForm(formName);
            } else {
                console.log('error submit!!');
                return false;
            }
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
                    this.updateUser.avatar=this.url;
                    console.log(this.updateUser)
                    resolve();
                })
                .catch((err) => {
                    alert("上传文件失败");
                    console.log(err);
                    resolve();
                });
        })
    },
    updateUserAvatar(){
      console.log('this.updateUser')
      console.log(this.updateUser)
      axios.updateUser(qs.stringify(this.updateUser))
          .then((res) => {
              console.log(res)
              this.editInfo=false;
              this.resetForm('updateUser');
          })
          .catch((err) => {
              alert("更新失败");
              console.log(err);
          });
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
.info-container {
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
  .info-edit-container{
    position: fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    backdrop-filter: brightness(75%);
    z-index: 99999;
    .info-edit-box{
      background-color: white;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .info-edit-head{
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
      .info-edit-main{
        padding:50px 30px;
        width:400px;
        height:500px;
        display: flex;
        flex-direction: column;
          .el-upload{
            .head-box-avatar{
              height:80px;
              width:80px;
              border-radius: 40px;
              background-color: lightblue;
          }
          }
      }
    }
  }


  
  .main {
    flex-shrink: 0;
    box-sizing: border-box;
    //width: 75%;
    width: 800px;
    width:800px;
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
        margin:0;
        border:none;
        border-radius: 10px;
        background-color: white;
        padding:20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .head-box{
          padding-left:40px;
          width:100%;
          height: auto;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          background-image: linear-gradient(to bottom left, violet, rgb(0, 174, 255));
                  transition: all .3s ease;
        // &:hover{
        //   transform: translateX(3px) translateY(3px);
        //   box-shadow:  20px 20px 60px #bebebe;
        // }
          .head-box-top{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            .user-type{
              margin-top: 10px;
              margin-right: 10px;
              //width:60px;
              padding:0 15px;
              height:24px;
              border-radius: 12px;
              background-color: rgb(90, 126, 224);
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              color:white
            }
          }
            .head-box-avatar{
              height:80px;
              width:80px;
              border-radius: 40px;
              background-color: lightblue;
              margin-right: 30px;
              object-fit: cover;
            }
          .head-box-main{
            width:100%;
            padding:40px;
            padding-left: 0px;
            padding-top: 30px;
            padding-bottom: 60px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .head-box-avatar{
              height:80px;
              width:80px;
              border-radius: 40px;
              background-color: lightblue;
              margin-right: 30px;
            }
            .name-description{
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              .head-box-name{
                margin-top: 30px;
                font-size: 1.8rem;
                color:white;
                font-weight: 500;
              }
              .description{
                margin-top: 20px;
                font-size: 1.4rem;
                color:whitesmoke
              }
            }
            
          }
        }

        .info-box{
          width:100%;
          padding-top: 20px;
          padding-left: 50px;
          padding-bottom: 20px;
          height:auto;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          border:#e4e4e4 1px solid;
          
          .info-head{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 15px;
            .info-box-title{
              font-size: 1.5rem;
              padding:5px;
              color:white;
              background-color: rgb(90, 126, 224);
              border-radius: 5px;
              margin-right: 10px;
            }
            .edit-icon{
              width:20px;
              height:20px;
              background-image:url('../../assets/icons/edit.png');
              background-size: cover;
              transition: all .3s ease;
              &:hover{
                transform: scale(1.2);
              }
            }
          }

          .info-box-item{
            margin-left: 5px;
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 1.4rem;
            color:gray;
            margin-bottom: 10px;
            // .item-title{
            //   padding:3px;
            //   padding-left: 5px;
            //   padding-right: 5px;
            //   background-color: rgb(90, 126, 224);
            //   color:white;
            //   border-radius: 5px;
            //   margin-right: 5px;
            //   font-size: 1.2px;
            // }
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