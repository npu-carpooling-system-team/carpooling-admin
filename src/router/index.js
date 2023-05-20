import {createRouter, createWebHashHistory} from 'vue-router'
import Cookies from 'js-cookie'
import {ElMessage} from 'element-plus'

const routes = [
	{
		path: '/',
		name: 'default',
		redirect: '/login'
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/auth/AdminLogin.vue'),
		meta: {
			title: '西工大拼车系统-后台登录'
		}
	},
	{
		path: '/main',
		name: 'admin-dashboard',
		component: () => import('../views/main/AdminDashboard.vue'),
		meta: {
			title: '西工大拼车系统-后台管理'
		}
	},
	{
		path: '/404',
		name: 'NotFound',
		component: () => import('../views/common/NotFound.vue'),
		meta: {
			title: '您访问的页面不存在'
		}
	},
	// 所有未定义路由，全部重定向到404页，必须放在最后
	{
		path: '/:catchAll(.*)',
		redirect: '/404'
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

router.beforeEach((to, from, next) => {
	// 挂载页面名称
	if (to.meta.title) {
		document.title = to.meta.title
	}
	if (to.path === '/login') {
		return next()
	}
	const token = Cookies.get('token')
	if (!token) {
		ElMessage.error(
			'请先登录'
		)
		return next('/login')
	}
	next()
})

export default router
