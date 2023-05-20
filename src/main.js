import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './assets/style/main.css'

// 引入自定义黑色主题
import './assets/style/dark.less'

// pinia持久化插件
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)
	.use(router)
	.use(createPinia().use(piniaPluginPersistedState))
	.use(ElementPlus,{
		locale: zhCn
	})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

app.mount('#app')
