<script setup>
import MyHeader from "@/components/MyHeader.vue";
import MyMain from "@/components/MyMain.vue";
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <MyHeader/>
            </el-header>
            <el-main>
                <MyMain/>
            </el-main>
        </el-container>
    </div>
</template>

<style lang="less" scoped>
    .common-layout{
        height: 100%;
        width: 100%;
        .el-container{
            height: 100%;
            width: 100%;
            .el-header{
                padding: 0;
            }
            .el-main{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
