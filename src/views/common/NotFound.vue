<script setup>
	import { onMounted } from 'vue'
	import { ElLoading } from 'element-plus'
	import { useRouter } from 'vue-router'

	const router = useRouter()

	onMounted(async () => {
		const loading = ElLoading.service({
			lock: true,
			text: '您似乎访问了不存在的页面,三秒后跳转到上一页面',
			background: 'rgba(0, 0, 0, 0.7)'
		})
		setInterval(async () => {
			loading.close()
			await router.go(-1)
		}, 3000)
	})
</script>

<template>
    <div></div>
</template>

<style scoped>
</style>
