import { createApp } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control

import "@/assets/styles/ex-ui.scss"

import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'
import { useI18n } from 'vue-i18n';

import i18n from './i18n'; // 引入 i18n 配置


// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'

// 低代码组件start
import ExInput from '@/components/sys/LowCode/ExInput/index.vue'
import ExDate from '@/components/sys/LowCode/ExDate/index.vue'
import ExDateRange from '@/components/sys/LowCode//ExDateRange/index.vue'
import ExButton from '@/components/sys/LowCode/ExButton/index.vue'
import DictValueSelect from '@/components/sys/LowCode/exDictSelect/index.vue'
import ExReport from '@/components/sys/LowCode/ExReport/index.vue'
import ExRender from '@/components/sys/LowCode/ExRender/index.vue'
import ExFrom from '@/components/sys/LowCode/ExRender/form.vue'
import ExTabs from '@/components/sys/LowCode/ExRender/tabs.vue'
import ExDialog from '@/components/sys/LowCode/ExDialog/index.vue'
// import Exfile from '@/components/sys/LowCode/Exfile/index.vue'
import ExImg from '@/components/sys/LowCode/ExImg/index.vue'
import ExTree from '@/components/sys/LowCode/ExTree/index.vue'
import ExTreeSelect from '@/components/sys/LowCode/ExTreeSelect/index.vue'

import AgTable from '@/components/sys/LowCode/AgTable'

const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

// 全局组件挂载
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)
app.component('Editor', Editor)

app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
app.component('svg-icon', SvgIcon)

app.component("AgTable",AgTable)

app.component('ex-dictSelect',DictValueSelect)
app.component('ex-input',ExInput)
app.component('ex-date',ExDate)
app.component('ex-dateRange',ExDateRange)
app.component('ex-dateRange',ExDateRange)
app.component('ex-button',ExButton)
app.component('ex-report',ExReport)
app.component('ex-render',ExRender)
app.component('ex-form',ExFrom)
app.component('ex-tabs',ExTabs)
app.component('ex-dialog',ExDialog)
// app.component('ex-file',Exfile)
app.component('ex-img',ExImg)
app.component('ex-tree',ExTree)
app.component('ex-tree-select',ExTreeSelect)

directive(app)

// 将 i18n 实例挂载到全局属性
app.use(i18n); // 使用 i18n 插件
app.config.globalProperties.$t = i18n.global.t;
app.config.globalProperties.$locale = i18n.global.locale;

//设置本地语言
let language_local = localStorage.getItem('language_local')
let userLanguage = (navigator.language || navigator.userLanguage) == 'zh-CN' ? 'zh' : (navigator.language || navigator.userLanguage);
if (language_local) {
  userLanguage = language_local
} else {
  localStorage.setItem('language_local', userLanguage)
}
app.config.globalProperties.$locale.value = userLanguage

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})

app.mount('#app')

export default app