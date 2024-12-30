<template>
  <div class="icon-body">
  <el-tabs type="border-card">
    <div class="icon-search-box" >
      <el-input v-model="name" clearable placeholder="请输入图标名称" @clear="filterIcons" @input="filterIcons">
      </el-input>
      <search class="search" />
    </div>
    <el-tab-pane :label="classify.classifyName" v-for="classify of iconList" :key="classify.classifyName">
      <div class="grid">
        <div v-for="item of classify.iconList" :key="item" @click="selectedIcon(item)" >
          <div class="icon-item" v-copyText="generateIconCode(item)" v-copyText:callback="copyTextSuccess">
            <svg-icon :icon-class="item" />
            <span class="icon_name">{{ item }}</span>
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script setup name="IconSelect">
import icons from './requireIcons'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const props = defineProps({
  notExitisLabel:{
    type: Array,
    default: ()=>['办公']
  }
})
const emit = defineEmits()
const { proxy } = getCurrentInstance()
const name = ref("")
const iconList = ref(icons)


function filterIcons() {
  iconList.value = JSON.parse(JSON.stringify(icons))
  if (name.value) {
    let index = 0
    iconList.value.forEach(function(icons){
      iconList.value[index].iconList = icons.iconList.filter(item => item.includes(name.value))
      index++;
    })
  }
}
const generateIconCode = (symbol) => {
  return `<el-icon><${symbol}/></el-icon>`
}
/** 复制代码成功 */
function copyTextSuccess() {
  ElMessage({
    message: '已复制！',
    type: 'success',
  })
}
function selectedIcon(name) {
  emit('selected', name)
  document.body.click()
}
function reset() {
  name.value = ''
  iconList.value = icons
}

defineExpose({
  reset
})
</script>

<style rel="stylesheet/scss" lang="scss" >
 // 菜单图标选择样式 
.el-popover{
  .search{
    width: 1em;
    height: 1em;
    position: absolute;
    font-size: 18px;
    right: 24px;
    top: 24px;
  }
  
  .grid {
    position: relative;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  }
  .icon-item{
    padding: 4px 0;
    margin: 0!important;
    width: 100%!important;
    text-align: center;
    font-size:18px;
  }
  .el-tab-pane{
    height: 200px;
    overflow: auto;
  }
  .icon_name{
    display: none;
  }
} 

 // 菜单选择页面样式 
.icons-container {
  .icon-body {
    padding: 10px;}
  .icon_name{
    display: block;
  }
  .search{
   position: absolute;
       right: 24px;
       top: 24px;
       font-size: 18px!important;
       color: #24292e;
       width: 1em;
       height: 1em;
  }
  overflow: hidden;
  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  .icon-search-box{
    position: relative;
    padding: 12px;
  }
  .icon-item{
    padding: 16px 0;
    margin: 0!important;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;
    width: 100%!important;
    text-align: center;
  }
  span {
    display: block;
    font-size: 16px;
    margin-top: 4px;
  }

  .disabled {
    pointer-events: none;
  }
.grid{
    border-top: 1px solid #eee;
  }
}
.icons-container span{
    font-size: 12px!important;
    color:#99a9bf ;
  }
  .icons-container svg{
    font-size: 24px!important;
    color:#606266 ;
  }
</style>
