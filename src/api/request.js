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
