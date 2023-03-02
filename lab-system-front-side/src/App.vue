<template>
  <div id="app">
    <!-- <transition :name="transName" :mode="transMode"> -->
    <router-view/>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      transName: '',
      transMode:''
    };
  },
  watch:{
    $route(to,from){
      //这里的to和from都是$route对象
      //console.log("from:"+from.params.index);
      //console.log("to:"+to.params.index);
      let toIndex=Number(to.meta.index);
      let fromIndex=Number(from.meta.index);
      //console.log(toIndex);
      //console.log(fromIndex);
      this.transMode="";
      this.transName=toIndex > fromIndex ? 'slide-left' : 'slide-right';
      
      if(to.meta.index==2||from.meta.index==2){
        this.transName="fade";
        this.transMode="out-in";
      }
      

    }
  }
}
</script>

<style>
*{
  box-sizing: border-box;
}
html{
  font-size: 10px;
}

body,html{
    padding:0;
    margin:0;
    width:100%;
    height: auto;
    font-family: Arial, Helvetica, sans-serif;
    min-width: 1260px;
}
#app{
    padding:0;
    margin:0;
    width:100%;
    height:auto;
    /* overflow-x: hidden; */
}
</style>
<style lang="scss">

.slide-right-enter-active, .slide-right-leave-active, .slide-left-enter-active, .slide-left-leave-active {
  //will-change: transform;
  transition: all .8s cubic-bezier(.55, -.37, .39, 1.38);
  position: absolute;
}

.slide-right-enter {
  transform: translate(-100%, 0);
}

.slide-right-leave-active {
    opacity: 0;
    transform: translate(100%, 0);
}

.slide-left-enter {
    opacity: 0;
    transform: translate(100%, 0);
}

.slide-left-leave-active {
    opacity: 0;
    transform: translate(-100%, 0);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.upshow-enter-active{
  animation: myMove .4s cubic-bezier(0.18,0.89,0.32,1.27);
}
// .upshow-leave-to-active{
//   //animation: myMove 1s ease reverse;
// }
@keyframes myMove{
    from{
        opacity: 0;
        transform: translateY(20%);
    }
    to{
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

