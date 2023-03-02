<template>
    <div class="container">
        <div class="loading">
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container{
    box-sizing: border-box;
    height:100vh;
    width:100vw;
    position: absolute;
    background-color: whitesmoke;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    z-index: 9999999;
    .loading{
        width:100px;
        height:100px;
        background-image: url('../assets/loading.svg');
        background-size:cover;
        background-position: center;
        background-repeat: no-repeat;
        animation: rotate 1s;
        animation-iteration-count: infinite;
    }
}
@keyframes rotate{
    from{
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
}
</style>