<script setup>
	import {useDark, useToggle} from '@vueuse/core'
	import {ref} from 'vue'
	import {handleLogout} from '@/api/request'
	import {useRouter} from 'vue-router'
	import { ElLoading } from 'element-plus'

	const router = useRouter()
	const APP_NAME = import.meta.env.VITE_APP_NAME
	const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR

	const dark = ref(
		window.localStorage.getItem('vueuse-color-scheme') === 'dark'
	)
	const isDark = useDark()
	const toggleDark = useToggle(isDark)
	const changeTheme = () => {
		dark.value = !dark.value
		toggleDark()
	}

	const logout = async () => {
		const loading = ElLoading.service({
			lock: true,
			text: '正在退出登录...',
			background: 'rgba(0, 0, 0, 0.7)'
		})
		try {
			await handleLogout()
		} catch (e) {
			// 不用操作
		} finally {
			loading.close()
			await router.push('/login')
		}
	}
</script>

<template>
    <div class="header" id="header">
        <div class="l-content">
            <h1>{{APP_NAME}}</h1>
        </div>
        <div class="flex-grow"></div>
        <div class="r-content">
            <el-row :gutter="15">
                <el-col :span="18">
                    <el-button v-if="!dark" @click="changeTheme()" style="background:#409EFF; color: white">
                        <el-icon><Sunny/></el-icon>
                        <span>明亮模式</span>
                    </el-button>
                    <el-button v-else @click="changeTheme()" style="background: #303133;color: white">
                        <el-icon><Moon/></el-icon>
                        <span>暗黑模式</span>
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                          <img :src="DEFAULT_AVATAR" class="user-icon" alt="LOGO">
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<style lang="less" scoped>
  .header{
    display: flex;
    width: 100%;
    height: 100%;
    background: #79BBFF;
    align-items: center;
    .l-content{
      color: white;
      margin-left: 1%;
    }
    .flex-grow {
      flex-grow: 1;
    }
    .r-content{
      padding: 0 10px;
      .user-icon{
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
  }
</style>
