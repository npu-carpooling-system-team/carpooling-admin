<script setup>
	import {onMounted, reactive, ref, watch} from 'vue'
	import {genPraiseList, genTotalList, handleGetDriversList, handleGetLoginCount} from '@/api/request'
	import {ElLoading, ElMessage} from 'element-plus'
	import * as echarts from 'echarts'
	import {useStorage} from '@vueuse/core'
	import FakeProgress from 'fake-progress'
    import {useRouter} from 'vue-router'

    const router = useRouter()
	const fake = reactive(new FakeProgress({
		timeConstant: 24000, //timeConstant相当于分母，分母越大则加的越少
		autoStart: true //自动开始
	}))
    
    const loginCountArr = ref([{
		date: '',
        count: 0
    }])

	let myChart = ref()
	const checkIsDark = useStorage('vueuse-color-scheme','auto')

	const drawLineChart = () => {
		let option = {
			backgroundColor: '',
			xAxis: {
				type: 'category',
                // 从loginCountArr中取出date字段
				data: [...loginCountArr.value.map(item => item.date)]
			},
			yAxis: {
				type: 'value'
			},
			tooltip: {
				trigger: 'item'
			},
			series: [
				{
					// 从loginCountArr中取出count字段 组成数组
					data: [...loginCountArr.value.map(item => item.count)],
					type: 'line'
				}
			]
		}
		myChart.value = echarts.init(document.getElementById('line'),
			checkIsDark.value === 'dark' ? 'dark' : 'light'
		);
		myChart.value.setOption(option);
	}

	// 使用自定义监听器来重新绘制图表
	watch(checkIsDark, () => {
		if (myChart.value) {
			myChart.value.dispose(); //销毁
		}
		drawLineChart()
	})

	// 接下来是获取总表的代码
	const showDownloadTotalDialog = ref(false)
	const downloadTotalLoading = ref(false)
	const drivesList = ref([{
		driverId: '',
        username: '',
        driversName: ''
    }])
	const isDownloading = ref(false)


	const downloadAllDto = ref({
		beginTime: '',
		endTime: '',
		driverId: ''
	})
	const getDriversList = async () => {
		downloadTotalLoading.value = true
		try {
			const data = await handleGetDriversList()
			drivesList.value = data.driverList
		} catch (e) {
			ElMessage.error('获取首页统计数据失败')
		} finally {
			downloadTotalLoading.value = false
		}
	}
	
	const genTotalExcel = async () => {
		isDownloading.value = true
		fake.progress = 0
        fake.start()
        try {
			const data = await genTotalList(downloadAllDto.value)
            // 使用如下方式防止拦截
			const tempWindow = window.open('_blank') // 先打开页面
			tempWindow.location = data.result // 后更改页面地址
            // 清除downloadAllDto中的数据
            downloadAllDto.value.beginTime = ''
            downloadAllDto.value.endTime = ''
            downloadAllDto.value.driverId = ''
            // 防止刷新之后出现奇奇怪怪的东西
            await router.push('/main')
        } catch (e) {
            ElMessage.error('生成失败,您可以关闭页面或刷新重试')
		} finally {
            isDownloading.value = false
            fake.end()
            showDownloadTotalDialog.value = false
		}
    }
	
	// 接下来是获取表彰表的代码
    const showDownloadPraiseDialog = ref(false)
    const downloadPraiseDto = ref({
        beginTime: '',
        endTime: ''
    })
    
    const genPraiseExcel = async () => {
        isDownloading.value = true
        fake.progress = 0
        fake.start()
        try {
            const data = await genPraiseList(downloadPraiseDto.value)
            const tempWindow = window.open('_blank')
            tempWindow.location = data.result
			// 清除downloadPraiseDto中的数据
            downloadPraiseDto.value.beginTime = ''
            downloadPraiseDto.value.endTime = ''
            await router.push('/main')
        } catch (e) {
            ElMessage.error('生成失败,您可以关闭页面或刷新重试')
        } finally {
            isDownloading.value = false
            fake.end()
            showDownloadPraiseDialog.value = false
        }
    }
    
    onMounted(async () => {
		const loading = ElLoading.service({
			lock: true,
			text: '正在加载首页数据',
			background: 'rgba(0, 0, 0, 0.7)'
		})
        try {
			const data = await handleGetLoginCount()
			loginCountArr.value = data.result
            // loginAccountArr根据date字段排序
            loginCountArr.value.sort((a, b) => {
                return a.date - b.date
            })
            // 将loginAccountArr中的date由yyyyMMdd转换为yyyy-MM-dd
            loginCountArr.value.forEach(item => {
                item.date = item.date.slice(0, 4) + '-' + item.date.slice(4, 6) + '-' + item.date.slice(6, 8)
            })
            drawLineChart()
        } catch (e) {
			ElMessage.error('获取首页统计数据失败')
		} finally {
            loading.close()
		}
		await getDriversList()
    })
</script>

<template>
    <div class="main-container">
        <el-row :gutter="20">
            <el-col :span="18">
                <el-card shadow="always">
                    <template #header>
                        <div class="card-header">
                            <span>
                                <b>西工大拼车平台本周登录人次统计</b>
                            </span>
                        </div>
                    </template>
                    <div class="graph-card">
                        <el-empty v-if="loginCountArr.length === 0" description="暂无数据" />
                        <div
                            v-else
                            id="line" style="width: 500px; height: 500px;"
                        >
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="always" class="btn-box">
                    <template #header>
                        <div class="card-header">
                            <span>
                                <b>导出统计表</b>
                            </span>
                        </div>
                    </template>
                    <div class="btn-card">
                        <el-row>
                            <el-button type="primary" @click="showDownloadTotalDialog = true">
                                <el-icon><Download /></el-icon>
                                <span>导出 <b>拼车记录</b></span>
                            </el-button>
                        </el-row>
                        <el-row>
                            <el-button type="primary" @click="showDownloadPraiseDialog = true">
                                <el-icon><Download /></el-icon>
                                <span>导出 <b>排名后车主列表</b></span>
                            </el-button>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
    
    <!-- 导出全部拼车记录弹窗 -->
    <el-dialog
        v-loading="downloadTotalLoading"
        v-model="showDownloadTotalDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
        :width="'80%'"
    >
        <template #header>
            <span>导出全部拼车记录</span>
        </template>
        <div class="download-all-box">
            <p>以下所有参数均为可选项</p>
            <el-form :inline="true" :model="downloadAllDto">
                <el-form-item>
                    <el-date-picker
                        v-model="downloadAllDto.beginTime"
                        type="date"
                        placeholder="请选择开始日期"
                    />
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="downloadAllDto.endTime"
                        type="date"
                        placeholder="请选择截止日期"
                    />
                </el-form-item>
                <el-form-item>
                    <el-select
                        v-model="downloadAllDto.driverId"
                        placeholder="请选择车主"
                        filterable
                        clearable
                    >
                        <el-option
                            v-for="item in drivesList"
                            :key="item.driverId"
                            :label="item.username + ' ' + item.driversName"
                            :value="item.driverId"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            
            <p v-if="isDownloading && fake.progress*100 < 50">
                正在生成表单,请不要强制退出该界面
            </p>
            <p v-if="isDownloading && fake.progress*100 >= 50">
                正在上传表单到OSS,上传完成后请前往新页面下载,文件将在48小时后自动删除
            </p>
            <el-progress
                striped
                style="width: 60%; margin: 0 auto;"
                v-if="isDownloading"
                :text-inside="true"
                :stroke-width="24"
                :percentage="parseInt(fake.progress*100 + '')"
            />
        </div>
        <template #footer>
            <el-button type="warning" :disabled="isDownloading" @click="genTotalExcel()">
                <el-icon><Files /></el-icon>
                <span>点击按钮以生成并下载</span>
            </el-button>
        </template>
    </el-dialog>
    
    <!-- 导出表彰记录弹窗 -->
    <el-dialog
        v-model="showDownloadPraiseDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
        :width="'80%'"
    >
        <template #header>
            <span>导出拼车订单排名</span>
        </template>
        <div class="download-all-box">
            <p>以下所有参数均为可选项</p>
            <el-form :inline="true" :model="downloadAllDto">
                <el-form-item>
                    <el-date-picker
                            v-model="downloadAllDto.beginTime"
                            type="date"
                            placeholder="请选择开始日期"
                    />
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                            v-model="downloadAllDto.endTime"
                            type="date"
                            placeholder="请选择截止日期"
                    />
                </el-form-item>
            </el-form>
            <p v-if="isDownloading && fake.progress*100 < 50">
                正在生成表单,请不要强制退出该界面
            </p>
            <p v-if="isDownloading && fake.progress*100 >= 50">
                正在上传表单到OSS,上传完成后请前往新页面下载,文件将在48小时后自动删除
            </p>
            <el-progress
                striped
                style="width: 60%; margin: 0 auto;"
                v-if="isDownloading"
                :text-inside="true"
                :stroke-width="24"
                :percentage="parseInt(fake.progress*100 + '')"
            />
        </div>
        <template #footer>
            <el-button type="warning" :disabled="isDownloading" @click="genPraiseExcel()">
                <el-icon><Files /></el-icon>
                <span>点击按钮以生成并下载</span>
            </el-button>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
    .main-container{
      width: 100%;
      height: 100%;
      .card-header{
        text-align: center;
        // 字号
        font-size: 1.5rem;
      }
      .graph-card{
        display: flex;
        justify-content: center;
      }
      .btn-box{
        height: 50%;
        .btn-card{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 100%;
            .el-row{
                display: flex;
                justify-content: center;
                margin-top: 10%;
            }
        }
      }
    }
    .download-all-box{
      text-align: center;
    }
</style>
