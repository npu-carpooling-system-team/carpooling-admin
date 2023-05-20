import axios from 'axios'
import Cookies from 'js-cookie'
import {ElMessage} from 'element-plus'

const _axios = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL
})

_axios.interceptors.request.use(
	(req) => {
		// 比如在这里添加统一的 headers
		if (Cookies.get('token') !== undefined) {
			req.headers.Authorization = 'Bearer ' + Cookies.get('token')
		}
		return req
	},
	(err) => {
		return Promise.reject(err)
	}
)

_axios.interceptors.response.use(
	// eslint-disable-next-line consistent-return
	(res) => {
		if (res !== null && res.data !== null && res.data.code !== null){
			if (res.data.code === 4012 || res.data.code === 4010 || res.data.code === 4030) {
				Cookies.remove('token')
				ElMessage({
					type: 'error',
					message: '登录过期，将跳转至登录页'
				})
				// 倒计时
				setTimeout(() => {
					window.location.href = '/login'
				}, 3000)
			}
		}
		return res
	},
	(err) => {
		return Promise.reject(err)
	}
)

export default _axios
