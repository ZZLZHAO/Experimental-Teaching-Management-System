<template>
    <div class="container">
        <div class="header">
            <div class="h-left">LOGO</div>
            <div class="h-center"></div>
            <div class="h-right">
                <div class="message"></div>
                <div class="setting"></div>
                <div class="empty"></div>
                <div class="user-box" @click="this.showSelector">
                    <img :src="user.avatar" class="avatar"></img>
                    <div class="username">{{this.user.name}}</div>
                </div>
                <transition name="upshow">
                <div class="selector" v-show="this.selectorShow" @mouseleave="this.closeSelector">
                    <div class="s-item" id="setting" @click="this.toAccountSetting">
                        <div class="s-icon" id="s-setting-icon"></div>
                        <div class="title">账户设置</div>
                    </div>
                    <div class="s-item" id="logout" @click="this.logout">
                        <div class="s-icon" id="s-logout-icon"></div>
                        <div class="title" >登出</div>
                    </div>
                </div>
                </transition>
            </div>
        </div>
        <div class="main-container">
            <div class="sidebar">
                <div class="nav-box">
                    <div class="head">
                        <img :src="user.avatar" class="avatar"></img>
                        <div class="greet">Hi! {{this.user.name}}</div>
                    </div>
                    <div class="nav">
                        <router-link exact to='/home/allcourses' class="nav-item" id="course">
                           <div class="nav-icon" id="course-icon"></div> 
                           <div class="name">课程</div>
                        </router-link>
                        <router-link to='/home/info' class="nav-item" id="course">
                           <div class="nav-icon" id="my-icon"></div> 
                           <div class="name">个人信息</div>
                        </router-link>
                        <router-link to='/home/account' class="nav-item" id="course">
                           <div class="nav-icon" id="account-icon"></div> 
                           <div class="name">账户</div>
                        </router-link>
                        <router-link v-show="this.user.type=='responsible_teacher'" to='/home/grade' class="nav-item" id="course">
                           <div class="nav-icon" id="grade-icon"></div> 
                           <div class="name">课程管理</div>
                        </router-link>
                        <router-link to='/home/announce' class="nav-item" id="course">
                           <div class="nav-icon" id="annonce-icon"></div> 
                           <div class="name">公告</div>
                        </router-link>
                    </div>
                </div>
            </div>
            <router-view/>
        </div>
    </div>
</template>

<script>
import axios from '../axios'
var qs = require("qs"); //格式化数据用的，很重要
import store from '../store'
export default {
    // watch: {
    //     $route: function(to, from) {
    //         console.log('route',this.$route);
    //     }
    // },
    mounted () {
        let token = store.state.token;
        //console.log(token);
        if(!token){
            this.$routerouter.push('login');//没有token，回到登陆界面
        }
        else{
            axios.getUserByToken()
            .then((res)=>{
                console.log(res.data);
                this.user=res.data;
                if(this.user.avatar==""){
                    this.user.avatar="http://localhost:3000/upload/avatar_1641746614153_915270754.jpg";
                }
                this.$store.commit('USER', this.user);
                if(this.user.type=='student'){
                axios.signIn(qs.stringify({}));
            }
            })
            .catch((err)=>{
                console.log(err);
            })

            
        }
    },
    data(){
      return{
          user:{},
          selectorShow:false,
      }  
    },
    methods:{
        showSelector(){
            this.selectorShow=true;
        },
        closeSelector(){
            this.selectorShow=false;
        },
        logout(){
            store.dispatch('UserLogout');
            this.$router.push('/login');
        },
        toAccountSetting(){
            this.$router.push('/home/account');
        }
    }
}
</script>

<style lang="scss" scoped>

.selector{
    //用于下拉框的块
    box-sizing: border-box;
    position:absolute;
    top:60px;
    right:40px;
    width:120px;
    border-radius: 5px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    //transition: all .5s ease;
    .s-item{
        box-sizing: border-box;
        height:40px;
        width:100%;
        //background-color: aqua;
        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-left:10%;
        transition: all .5s ease;
        .s-icon{
            flex-shrink: 0;
            box-sizing: border-box;
            height:18px;
            width:18px;
            background-size: cover;
            background-position: center;
            margin-right:8px;
        }
        #s-setting-icon{
            background-image: url('../assets/icons/setting.png');
        }
        #s-logout-icon{
            background-image: url('../assets/icons/logout.png');
        }
        .title{
            color:#515151;
            font-size:12px;
            font-weight:450;
        }
    }
    .s-item:hover{
        background-color: #cdcdcd;
    }
}
.container{
    box-sizing: border-box;
    background-color: aquamarine;
    min-height:100vh;
    .header{
        box-sizing: border-box;
        height:60px;
        width: 100%;
        background-color: rgb(105, 104, 104);
        display: flex;
        padding-left:40px;
        padding-right: 40px;
        .h-left{
            box-sizing: border-box;
            height:100%;
            width:200px;
            //background-color: rgb(28, 241, 241);
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            color:#cdcdcd;
            font-size: 23px;
            font-weight: 500;
            transition: all .5s ease;
        }
        .h-left:hover{
            font-size:25px;
        }
        .h-right{
            box-sizing: border-box;
            height:100%;
            //width:250px;
            //background-color: rgb(28, 241, 241);
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .message{
                box-sizing: border-box;
                height:24px;
                width:24px;
                background-image: url('../assets/icons/lingdang.png');
                background-size: cover;
                background-position: center;
                margin-right:20px;
                transition: all .5s ease;
            }
            .setting{
                box-sizing: border-box;
                height:25px;
                width:25px;
                background-image: url('../assets/icons/shezhi.png');
                background-size: cover;
                background-position: center;
                margin-right:20px;
            }
            .empty{
                flex:1;
            }
            .user-box{
                box-sizing: border-box;
                height:60px;
                //width:150px;
                background-color: rgb(116, 115, 115);
                //border-radius: 25px;
                padding-left: 15px;
                padding-right: 15px;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                transition:all 1s ease;
                .avatar{
                    flex-shrink: 0;
                    box-sizing: border-box;
                    height:42px;
                    width:42px;
                    border-radius: 21px;
                    
                    object-fit: cover;
                    margin-right: 15px;
                }
                .username{
                    color:#e6e6e6;
                    font-size: 13px;
                }

            }
            
            
        }
        .h-center{
            flex:1;
        }
    }
    .main-container{
        box-sizing: border-box;
        width:100%;
        min-height:calc(100vh - 60px);
        //min-height: auto;
        background-color: whitesmoke;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: flex-start;
        padding-left:40px;
        padding-right: 40px;
        padding-top:20px;
        .sidebar{
            flex-shrink: 0;
            box-sizing: border-box;
            width:260px;
            min-height:100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .nav-box{
                box-sizing: border-box;
                width:240px;
                height:100%;
                background-color: white;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                transition: all .5s ease;
                .head{
                    box-sizing: border-box;
                    width:100%;
                    //height:130px;
                    background-image: url('../assets/waves.png');
                    background-repeat: no-repeat;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    padding-top:50px;
                    margin-bottom: 30px;
                    //background-color: lightblue;
                    .avatar{
                        flex-shrink: 0;
                        box-sizing: border-box;
                        height:56px;
                        width:56px;
                        border-radius: 28px;
                        object-fit: cover;
                        margin-bottom: 10px;
                    }
                    .greet{
                        color:rgb(126, 97, 204);
                        font-size: 15px;
                    }
                }
                .nav{
                    box-sizing: border-box;
                    width:100%;
                    display: flex;
                    flex-shrink: 0;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    .nav-item{
                        box-sizing: border-box;
                        text-decoration: none;
                        width:90%;
                        height:30px;
                        //background-color: azure;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                        padding-left:18%;
                        transition: all .5s ease;
                        margin-bottom: 15px;
                        .nav-icon{
                            flex-shrink: 0;
                            box-sizing: border-box;
                            height:25px;
                            width:25px;
                            background-size: cover;
                            background-position: center;
                            margin-right:20px;
                            transition:all .5s ease;
                        }
                        #course-icon{
                            background-image: url('../assets/icons/course.png');
                        }
                        #my-icon{
                            background-image: url('../assets/icons/user.png');
                        }
                        #account-icon{
                            background-image: url('../assets/icons/account.png');
                        }
                        #grade-icon{
                            background-image: url('../assets/icons/grade.png');
                        }
                        #annonce-icon{
                            background-image: url('../assets/icons/annonce.png');
                        }
                        .name{
                            color:#cdcdcd;
                            font-size: 15px;
                            transition:all .5s ease;
                            margin-right:20px;
                            text-decoration: none;
                        }
                    }
                    .nav-item:hover{
                        //margin-bottom: 20px;
                        #course-icon{
                            background-image: url('../assets/icons/course-a.png');
                        }
                        #my-icon{
                            background-image: url('../assets/icons/user-a.png');
                        }
                        #account-icon{
                            background-image: url('../assets/icons/account-a.png');
                        }
                        #grade-icon{
                            background-image: url('../assets/icons/grade-a.png');
                        }
                        #annonce-icon{
                            background-image: url('../assets/icons/annonce-a.png');
                        }
                        .name{
                            color:#684497;
                            font-size:16px;
                        }
                        
                    }
                    .router-link-active{
                        //margin-bottom: 20px;
                        #course-icon{
                            background-image: url('../assets/icons/course-a.png');
                        }
                        #my-icon{
                            background-image: url('../assets/icons/user-a.png');
                        }
                        #account-icon{
                            background-image: url('../assets/icons/account-a.png');
                        }
                        #grade-icon{
                            background-image: url('../assets/icons/grade-a.png');
                        }
                        #annonce-icon{
                            background-image: url('../assets/icons/annonce-a.png');
                        }
                        .name{
                            color:#684497;
                            font-size:16px;
                        }
                    }
                }
            }

        }
    }
}

</style>