<template>
  <el-row class="detail-button" :gutter="10">
    <el-col :span="1.5" v-if="isEdit && buttons['add']">
      <el-button
        :loading="loading"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddLine"
        v-hasPermi="buttons['add'].permi"
      >添加</el-button>
    </el-col>
    <el-col :span="1.5" v-if="isEdit && buttons['delete']">
      <el-button
        :loading="loading"
        type="danger"
        plain
        icon="Delete"
        @click="handleDeleteLine"
        v-hasPermi="buttons['delete'].permi"
      >删除</el-button>
    </el-col>
    <el-col :span="1.5" v-if="!isEdit && formModel.model.isFinish==='1' && buttons['finish']">
      <el-button
        :loading="loading"
        type=""
        @click="handleFinishLine"
        icon="CircleCheck"
        v-hasPermi="buttons['finish'].permi"
      >结案</el-button>
    </el-col>
    <el-col :span="1.5" v-if="!isEdit && formModel.model.isFinish==='1' && buttons['unfinish']">
      <el-button
        :loading="loading"
        type=""
        @click="handleUnfinishLine"
        icon="CircleClose"
        v-hasPermi="buttons['unfinish'].permi"
      >反结案</el-button>
    </el-col>
    <slot name="detailButton"></slot>
    <el-col :span="1.5">
      <el-dropdown @command="handleImportLine" v-if="isEdit">
        <el-button type="primary" plain icon="Bottom">
          导入<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="{ publicImport } in importLine" :key="publicImport.importId" :command="publicImport.importNo">{{ publicImport.importName }}</el-dropdown-item>
            </el-dropdown-menu>            
          </template>
      </el-dropdown>
    </el-col>
    <right-toolbar v-bind="$attrs" :search="false" :refresh="false" :showSummary="true" @saveTableSetting="saveTableSetting" @resetTableSetting="resetTableSetting"></right-toolbar>
  </el-row>

</template>

<script setup name="DetailButton">

const props = defineProps({
  buttons: {
    type: Object,
    default: {}
  },
  formModel: {
    type: Object,
    default: {},
  },
  importLine: {
    type: Array,
    default: []
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits([
  'onClickAddLine',
  'onClickDeleteLine',
  'onClickFinishLine',
  'onClickUnfinishLine',
  'command',
  'saveTableSetting',
  'resetTableSetting',
])

function handleAddLine() {
  emit('onClickAddLine')
}
function handleDeleteLine() {
  emit('onClickDeleteLine')
}
function handleFinishLine() {
  emit('onClickFinishLine')
}
function handleUnfinishLine() {
  emit('onClickUnfinishLine')
}
function handleImportLine(type) {
  emit('command', type)
}
function saveTableSetting() {
  emit('saveTableSetting')
}
function resetTableSetting() {
  emit('resetTableSetting')
}
</script>

<style lang="scss" scoped>
.detail-button {
  margin-bottom: 10px;
}
</style>