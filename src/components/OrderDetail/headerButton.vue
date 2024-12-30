<template>
  <div class="header-button">
    <span style="font-size: 16px">{{ title }}</span>
    <el-button :loading="loading" type="primary" v-hasPermi="buttons['save'].permi" v-if="isEdit" @click="handleSubmit">保存</el-button>
    <el-button :loading="loading" type="success" v-hasPermi="buttons['saveAdd'].permi" v-if="isEdit" @click="handleSubmitAdd">保存并新增</el-button>
    <el-button :loading="loading" v-hasPermi="buttons['copy'].permi" type="info" v-if="!isEdit" size="small" @click="handleCopy">复制</el-button>
    <slot name="headerButton"></slot>
    <el-button :loading="loading" type="" @click="close">返回</el-button>
  </div>
</template>

<script setup name="HeaderButton">

const { proxy } = getCurrentInstance()

const props = defineProps({
  buttons: {
    type: Object,
    default: {}
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  showOrder: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:showOrder','onClickSubmit','onClickSubmitAdd','onClickCopy'])

function handleSubmit() {
  emit('onClickSubmit')
}
function handleSubmitAdd() {
  emit('onClickSubmitAdd')
}
function handleCopy() {
  emit('onClickCopy')
}
function close() {
  if (props.isEdit) {
    proxy.$modal.confirm('当前页面处于编辑状态，确认关闭？').then(() => {
      emit("update:showOrder", false)
    }).catch(() => {})
  } else {
    emit("update:showOrder", false)
  }
}
</script>

<style lang="scss" scoped>
.header-button {
  margin-bottom: 10px;
  .el-button {
    float: right; 
    margin-right: 10px;
  }
  .el-button+.el-button {
    margin-left: 0px;
  }
}
</style>