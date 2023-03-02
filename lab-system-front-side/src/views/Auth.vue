// Auth.vue
<template>
    <div class="container">
        <loading/>
    </div>
</template>

<script>
import loading from '../components/Loading.vue'
export default {
    components:{
        loading
    },
    mounted () {
        let token=this.$route.query.token;
        console.log(token);
        this.$store.dispatch('UserLogin', token);//放入store
        this.$router.push('/home');//跳转到home
    }
}
</script>

