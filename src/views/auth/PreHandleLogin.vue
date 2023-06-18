<script setup>
    import {useRouter} from 'vue-router'
	import {onMounted} from 'vue'
	import {ElMessage} from 'element-plus'
    
    const router = useRouter()
    
    onMounted(() => {
		const token = router.currentRoute.value.query.token
        if (token === ''){
			ElMessage.error('不合法的请求,即将跳转回登录界面')
            setTimeout(async () => {
				await router.push('/login')
            }, 2000)
            return
        }
		window.localStorage.setItem('token', token)
        ElMessage.success('登录成功,即将跳转到管理界面')
        setTimeout(async () => {
			await router.push('/main')
        }, 2000)
    })
</script>

<template>
    <div class="loading-text-box">
        <span>正在处理登录信息,请稍后...</span>
    </div>
</template>

<style lang="less" scoped>
    .loading-text-box{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        text-align: center;
    }
</style>
