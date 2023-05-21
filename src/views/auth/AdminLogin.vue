<script setup>
	import {onMounted, reactive, ref} from 'vue'
	import {ElMessage, ElLoading} from 'element-plus'
	import {handleLogin} from '@/api/request'
	import {encrypt} from '@/utils/jsencrypt'
    import {useRouter} from 'vue-router'
	import Cookies from 'js-cookie'

    const router = useRouter()
    const loginFormRef = ref()
	const loginFormDto = ref({
        username: '',
        password: ''
    })
    
    const APP_NAME = import.meta.env.VITE_APP_NAME
    
    const rules = reactive({
        username: [
			{required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 11, max: 11, message: '请输入11位内地手机号', trigger: 'blur'}
        ],
        password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 4, max: 20, message: '请输入4-20位密码', trigger: 'blur'}
        ]
    })

	const resetForm = (formEl) => {
		if (!formEl) {
			return
		}
		formEl.resetFields()
	}
	
	const loading = ref(false)
	
	const submitForm = async (formRef) => {
		if (!formRef) {
			ElMessage.error('请输入用户名与密码')
			return
        }
		await formRef.validate(async (valid) => {
			if (!valid) {
				ElMessage.error('请检查输入是否正确')
			} else {
				loading.value = true
                try {
					const tmpLoginDto = {
						username: loginFormDto.value.username,
						password: encrypt(loginFormDto.value.password)
					}
					const data = await handleLogin(tmpLoginDto)
					if (data !== null) {
						if(data.result.role === 0) {
							resetForm(loginFormRef.value)
							const loading = ElLoading.service({
								lock: true,
								text: '该账号为一般用户账号,3秒后跳转到客户端',
								background: 'rgba(0, 0, 0, 0.7)'
							})
							setTimeout(() => {
								loading.close()
								window.location.href =
                                    'https://carpooling-client.wangminan.me/#/oauth/alipay/success' +
									'?token=' +
									data.result.token +
									'&id=' +
									data.result.id
                            }, 3000)
                            return
                        }
						Cookies.set('token', data.result.token)
                        await router.push('/main')
					}
				} catch (e) {
                    ElMessage.error('登录失败')
				} finally {
                    loading.value = false
				}
            }
		})
    }
	
	onMounted(() => {
		resetForm(loginFormRef.value)
        document.onkeydown = (e) => {
            if (e.key === 'Enter') {
                submitForm(loginFormRef.value)
            }
        }
    })
</script>

<template>
    <div class="login-container">
        <div class="login-form-box" v-loading="loading">
            <div
                class="form-card"
            >
                <el-card style="border-radius: 10px">
                    <h1>{{APP_NAME}}</h1>
                    <el-image
                        src="/carpooling.svg"
                        :fit="'cover'"
                        class="icon"
                    />
                    <div class="form-box">
                        <el-form
                            ref="loginFormRef"
                            :model="loginFormDto"
                            status-icon
                            :rules="rules"
                        >
                            <el-form-item prop="username">
                                <el-input
                                    placeholder="请输入用户名"
                                    v-model="loginFormDto.username"
                                    clearable>
                                    <template #prefix>
                                        <el-icon class="el-input__icon">
                                            <User />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input
                                    placeholder="请输入密码"
                                    v-model="loginFormDto.password"
                                    type="password" clearable>
                                    <template #prefix>
                                        <el-icon class="el-input__icon">
                                            <Lock />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div class="button-area">
                            <el-button type="primary" @click="submitForm(loginFormRef)"
                            >
                                登录
                            </el-button>
                            <el-button @click="resetForm(loginFormRef)">
                                重置
                            </el-button>
                        </div>
                    </div>
                </el-card>
            </div>
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
            .form-card {
                height: 100%;
                // 透明度
                background-color: rgba(255, 255, 255, 0.7);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                .icon{
                    width: 30%;
                    height: 30%;
                    margin-top: 10%;
                }
                .form-box{
                    margin-top: 10%;
                    // 使用deep进行样式穿透
                    ::v-deep(.el-form-item__label){
                        // 字号2rem
                        font-size: 1rem;
                    }
                    ::v-deep(.el-form-item__inner){
                        // 字号2rem
                        font-size: 1rem;
                    }
                    .button-area{
                        display: flex;
                        justify-content: space-around;
                    }
                }
            }
        }
    }
</style>
