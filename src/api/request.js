import axios from './index'
import {ElMessage} from 'element-plus'

export const handleLogin = async (loginDto) => {
	try {
		const {data} = await axios.post('/api/auth/login/password', loginDto)
		if (data.code !== null && data.code === 2000) {
			return data
		} else if (data.code !== null){
			ElMessage.error(`登录失败, ${data.msg}`)
			return null
		}
		ElMessage.error('登录失败')
		return null
	} catch (e) {
		ElMessage.error(`登录失败, ${e.message}`)
	}
	return null
}

export const handleLogout = async () => {
	try {
		const {data} = await axios.post('/api/auth/loginuser/logout')
		if (data.code !== null && data.code === 2000) {
			return data
		} else if (data.code !== null){
			ElMessage.error(`退出失败, ${data.msg}`)
			return null
		}
		ElMessage.error('退出失败')
		return null
	} catch (e) {
		ElMessage.error(`退出失败, ${e.message}`)
	}
	return null
}

export const handleGetLoginCount = async () => {
	try {
		const {data} = await axios.get('/api/auth/admin/count')
		if (data.code !== null && data.code === 2000) {
			return data
		} else if (data.code !== null) {
			ElMessage.error(`获取登录统计信息失败, ${data.msg}`)
			return null
		}
		ElMessage.error('获取登录统计信息失败')
		return null
	} catch (e) {
		ElMessage.error(`获取登录统计信息, ${e.message}`)
	}
	return null
}

export const handleGetDriversList = async () => {
	try {
		const {data} = await axios.get('/api/user/admin/driver/list')
		if (data.code !== null && data.code === 2000) {
			return data
		} else if (data.code !== null) {
			ElMessage.error(`获取驱动列表失败, ${data.msg}`)
			return null
		}
		ElMessage.error('获取驱动列表失败')
		return null
	} catch (e) {
		ElMessage.error(`获取驱动列表失败, ${e.message}`)
	}
	return null
}

export const genTotalList = async (downloadAllDto) => {
try {
		const {data} = await axios.get('/api/order/admin/carpooling/list',{
			params: {
				beginTime: downloadAllDto.beginTime,
				endTime: downloadAllDto.endTime,
				driverId: downloadAllDto.driverId
			}
		})
		if (data.code !== null && data.code === 2000) {
			return data
		} else if (data.code !== null) {
			ElMessage.error(`获取总列表失败, ${data.msg}`)
			return null
		}
		ElMessage.error('获取总列表失败')
		return null
	} catch (e) {
		ElMessage.error(`获取总列表失败, ${e.message}`)
	}
	return null
}

export const genPraiseList = async (downloadPraiseDto) => {
	try {
		const {data} = await axios.get('/api/order/admin/prize/list',{
			params: {
				beginTime: downloadPraiseDto.beginTime,
				endTime: downloadPraiseDto.endTime
			}
		})
		if (data.code !== null && data.code === 2000) {
			return data
		} else if (data.code !== null) {
			ElMessage.error(`获取好评列表失败, ${data.msg}`)
			return null
		}
		ElMessage.error('获取好评列表失败')
		return null
	} catch (e) {
		ElMessage.error(`获取好评列表失败, ${e.message}`)
	}
	return null
}
