<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top" v-if="search">
        <el-button size="small" circle :icon="showSearch?'ArrowUp':'ArrowDown'" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top" v-if="refresh">
        <el-button size="small" circle icon="Refresh" @click="handleRefresh()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="调整列" placement="top">
        <el-button size="small" circle icon="Operation" @click="handleToolPanel()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="配置" placement="top" v-if="props.gridSetting">
        <el-button size="small" circle icon="Setting" @click="handleSetting()" />
      </el-tooltip>
    </el-row>
  </div>
</template>


<script setup name="RightToolbar">
import cache from '@/plugins/cache.js'

const { proxy } = getCurrentInstance()
let title = ref('配置')
const dragTable = ref()

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true
  },
  search: {
    type: Boolean,
    default: true
  },
  refresh: {
    type: Boolean,
    default: true
  },
  gridSetting:{
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:showSearch','queryTable','update:settings','update:toolPanel'])

// 搜索
function toggleSearch() {
  emit("update:showSearch", !props.showSearch)
}
// 刷新
function handleRefresh() {
  emit("queryTable")
}
// 表头表数据显示
function handleSetting() {
  emit("update:settings")
}
function handleToolPanel() {
  emit("update:toolPanel")
}

</script>

<style lang="scss" scoped>
</style>
