<template>
  <span>
    <el-button link type="primary" @click="handleView" v-hasPermi="buttons['view'].permi" v-if="buttons['view'] && scope.row.audited === '1'">查看</el-button>
    <el-button link type="primary" @click="handleUpdate" v-hasPermi="buttons['edit'].permi" v-if="buttons['edit'] && scope.row.audited != '1'">修改</el-button>
    <el-button link type="danger" @click="handleDelete" v-hasPermi="buttons['remove'].permi" v-if="buttons['remove'] && scope.row.audited != '1'">删除</el-button>
    <slot name=columnButton></slot>
    <el-dropdown  @command="(command) => handleCommand(command)" v-hasPermi="morePermi">
      <el-button link type="primary" icon="">更多</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <div v-hasPermi="buttons['printAndView'].permi"  v-if="buttons['printAndView']">
            <el-dropdown-item command="handlePrint">打印预览</el-dropdown-item>
          </div>
          <div v-hasPermi="buttons['audit'].permi" v-if="buttons['audit'] && (scope.row.audited === '0' || scope.row.audited===null)">
            <el-dropdown-item command="handleAudit">审核</el-dropdown-item>
          </div>
          <div v-hasPermi="buttons['unaudit'].permi" v-if="buttons['unaudit'] && scope.row.audited && scope.row.audited === '1'">
            <el-dropdown-item command="handleUnaudit">反审核</el-dropdown-item>
          </div>
          <div v-hasPermi="buttons['finish'].permi" v-if="buttons['finish'] && scope.row.audited && scope.row.audited === '1'">
            <el-dropdown-item command="handleFinish">结案</el-dropdown-item>
          </div>
          <div v-hasPermi="buttons['unfinish'].permi" v-if="buttons['unfinish'] && scope.row.audited && scope.row.audited === '1'">
            <el-dropdown-item command="handleUnfinish">反结案</el-dropdown-item>
          </div>
          <div v-hasPermi="buttons['copy'].permi" v-if="buttons['copy']">
            <el-dropdown-item command="handleCopy">复制</el-dropdown-item>
          </div>
          <slot name=columnMoreButton></slot>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </span>
</template>

<script setup name="TableColumnButton">
import { computed } from "vue";

const props = defineProps({
  buttons: {
    type: Object,
    default: {}
  },
  scope: {
    type: Object,
    default: {},
  },
})
const emit = defineEmits(['onClickView','onClickCopy','onClickUpdate','onClickDelete','onClickDelete','command'])

const morePermi = computed({
  get() {
    let result = [];
    if (props.buttons['printAndView']) { result = result.concat(props.buttons['printAndView'].permi) };
    if (props.buttons['audit']) { result = result.concat(props.buttons['audit'].permi) };
    if (props.buttons['unaudit']) { result = result.concat(props.buttons['unaudit'].permi) };
    if (props.buttons['finish']) { result = result.concat(props.buttons['finish'].permi) };
    if (props.buttons['unfinish']) { result = result.concat(props.buttons['unfinish'].permi) };
    if (props.buttons['copy']) { result = result.concat(props.buttons['copy'].permi) };
    return result;
  }
})

function handleView() {
  emit('onClickView')
}
function handleUpdate() {
  emit('onClickUpdate')
}
function handleDelete() {
  emit('onClickDelete')
}
// 更多操作触发
function handleCommand(command) {
  emit('command', command);
}
</script>

<style scoped lang="scss">
:deep(.el-button+.el-button) {
    margin-left: 8px;
}
:deep(.el-button+.el-dropdown) {
    margin-left: 8px;
}
</style>