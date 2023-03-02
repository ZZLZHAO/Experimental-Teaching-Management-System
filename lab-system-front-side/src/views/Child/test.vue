<template>
    <div class="container">
        <div class="main">这里是主要内容</div>
        <div class="side">这里是侧边内容</div>
    </div>
</template>

<style lang="scss" scoped>
.container{
    box-sizing: border-box;
    width:100%;
    height:auto;
    background-color: azure;
    display: flex;
    flex-direction: row;
    .main{
        flex-shrink: 0;
        box-sizing: border-box;
        width:75%;
        min-width:600px;
        flex-shrink: 0;
        background-color: rgb(159, 167, 167);
    }
    .side{
        flex-shrink: 0;
        box-sizing: border-box;
        width:25%;
        min-width:200px;
        flex-shrink: 0;
        background-color: burlywood;
    }
}
</style>