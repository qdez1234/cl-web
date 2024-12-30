<template>
  <el-row>
    <el-col :span="4">
      <div class="card-header">
        <span class="erp-header-text">采购订单信息</span>
      </div>
    </el-col>
    <el-col :span="20">
      <div class="btn_box" align="right" style="float: right">
        <!-- add -->
        <el-button
          class="filter-item"
          type="primary"
          icon="Plus"
          @click="handleAdd($event)"
          v-hasPermi="buttons['add'].permi"
          v-if="buttons['add']"
        >添加</el-button>
        <!-- edit -->
        <el-button
          class="filter-item"
          type="primary"
          icon="Edit"
          :disabled="single"
          @click="handleEdit($event)"
          v-hasPermi="buttons['edit'].permi"
          v-if="buttons['edit'] && !single"
        >修改</el-button>
        <!-- delete -->
        <el-button
          type="danger"
          icon="Delete"
          :disabled="single"
          @click="handleDelete($event)"
          v-hasPermi="buttons['delete'].permi"
          v-if="buttons['delete'] && !single"
        >删除</el-button>
        <!-- export -->
        <el-button
          type="warning"
          icon="Download"
          @click="handleExport($event)"
          v-hasPermi="buttons['export'].permi"
          v-if="buttons['export']"
        >导出</el-button>
        <!-- print -->
        <el-button
          type=""
          icon="Printer"
          @click="handlePrint($event)"
          :disabled="single"
          v-hasPermi="buttons['printAndView'].permi"
          v-if="buttons['printAndView'] && !single"
        >打印预览</el-button>
        <!-- analysis -->
        <el-button
          type=""
          icon="Analysis"
          @click="handleAnalyze($event)"
          v-hasPermi="buttons['analysis'].permi"
          v-if="buttons['analysis']"
        >分析</el-button>
        <!-- audit -->
        <el-button
          type=""
          icon="DocumentChecked"
          :disabled="single"
          @click="handleAudit($event)"
          v-hasPermi="buttons['audit'].permi"
          v-if="buttons['audit'] && !single"
        >审核</el-button>
        <!-- unaudit -->
        <el-button
          type=""
          icon="DocumentDelete"
          :disabled="single"
          @click="handleUnaudit($event)"
          v-hasPermi="buttons['unaudit'].permi"
          v-if="buttons['unaudit'] && !single"
        >反审核</el-button>
        <!-- finish -->
        <el-button
          type=""
          icon="CircleCheckFilled"
          :disabled="single"
          @click="handleFinish($event)"
          v-hasPermi="buttons['finish'].permi"
          v-if="buttons['finish'] && !single"
        >结案</el-button>
        <!-- unfinish -->
        <el-button
          type=""
          icon="CircleCloseFilled"
          :disabled="single"
          @click="handleUnfinish($event)"
          v-hasPermi="buttons['unfinish'].permi"
          v-if="buttons['unfinish'] && !single"
        >反结案</el-button>
        <!-- activate -->
        <el-button
          type=""
          icon="Checked"
          :disabled="single"
          @click="handleActivate($event)"
          v-hasPermi="buttons['activate'].permi"
          v-if="buttons['activate'] && !single"
        >启用</el-button>
        <!-- deactivate -->
        <el-button
          type=""
          icon="Failed"
          :disabled="single"
          @click="handleDeactivate($event)"
          v-hasPermi="buttons['deactivate'].permi"
          v-if="buttons['deactivate'] && !single"
        >停用</el-button>
        <slot name="mainButton"></slot>
        <!-- 右侧工具栏 -->
        <right-toolbar v-bind="$attrs" v-model:showSearch="state" @queryTable="getList" :showSummary="false" @saveTableSetting="saveTableSetting" @resetTableSetting="resetTableSetting"></right-toolbar>
      </div>
    </el-col>
  </el-row>
</template>


<script setup name="OrderButton">
import { computed } from "vue";


const props = defineProps({
  buttons: {
    type: Object,
    default: {}
  },
  single: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  showSearch: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits([
  'update:showSearch',
  'queryTable',
  'onClickAdd',
  'onClickEdit',
  'onClickDelete',
  'onClickExport',
  'onClickPrint',
  'onClickAnalyze',
  'onClickAudit',
  'onClickUnaudit',
  'onClickFinish',
  'onClickUnfinish',
  'onClickActivate',
  'onClickDeactivate',
  'saveTableSetting',
  'resetTableSetting'
])

const state = computed({
  get() {
    return props.showSearch
  },
  set(value) {
    emit('update:showSearch', !props.showSearch)
  }
})

function getList() {
  emit('queryTable')
}
function handleAdd(evt) {
  emit('onClickAdd', evt)
}
function handleEdit(evt) {
  emit('onClickEdit', evt)
}
function handleDelete(evt) {
  emit('onClickDelete', evt)
}
function handleExport(evt) {
  emit('onClickExport', evt)
}
function handlePrint(evt) {
  emit('onClickPrint', evt)
}
function handleAnalyze(evt) {
  emit('onClickAnalyze', evt)
}
function handleAudit(evt) {
  emit('onClickAudit', evt)
}
function handleUnaudit(evt) {
  emit('onClickUnaudit', evt)
}
function handleFinish(evt) {
  emit('onClickFinish', evt)
}
function handleUnfinish(evt) {
  emit('onClickUnfinish', evt)
}
function handleActivate(evt) {
  emit('onClickActivate', evt)
}
function handleDeactivate(evt) {
  emit('onClickDeactivate', evt)
}
function saveTableSetting(evt) {
  emit('saveTableSetting', evt)
}
function resetTableSetting(evt) {
  emit('resetTableSetting', evt)
}
</script>

<style lang="scss" scoped>
  .filter-item {
    margin-left: 8px
  }
</style>