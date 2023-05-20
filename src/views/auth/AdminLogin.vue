<script setup>
    import {ref} from 'vue'

	const loginDto = ref({
        username: '',
        password: ''
    })
</script>

<template>
    <div class="login-container">
        <div class="login-form-box">
            <el-card
                shadow="always"
            >
            
            </el-card>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .login-container{
        width: 100%;
        height: 100%;
        display: flex;
        background: url("../../assets/images/background.webp") no-repeat;
        overflow: hidden;
        background-size:cover;//或者background-size:100%;
        // 横向靠右
        justify-content: flex-end;
        // 纵向居中
        align-items: center;
        .login-form-box{
            width: 40%;
            height: 80%;
            margin-right: 5%;
            .el-card {
                height: 100%;
                // 透明度
                background-color: rgba(255, 255, 255, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>
