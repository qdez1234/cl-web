<template>
  <div class="base-dialog">
    <el-dialog draggable title="报表" width="30%" append-to-body v-model="visible" v-if="visible" :close-on-click-modal="false">
      <el-table
        ref="printTable"
        :data="gridData"
        width="100%"
        highlight-current-row
        @current-change="handleCurrentChange"
        >
        <el-table-column property="menuName" label="报表名称" min-width="150"></el-table-column>
      </el-table>
      <template #footer>
        <div>
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="confirmBtn">预览</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="PrintDialog">
import { getPrint } from '@/api/system/menu.js'
import { ref, computed } from "vue";

const { proxy } = getCurrentInstance()

const props = defineProps({
  title: {
    type: String,
    default: ()=>'',
  },
  routerName: {
    type: String,
    default: ()=>'',
  },
  printType: {
    type: String,
    default: ()=>'',
  },
})

const emit = defineEmits(['onPrintView'])

const gridData = ref([])
const visible = ref(false)
const currentRow = ref(undefined)


const queryParams = computed({
  get() {
    return { menuType: props.printType, path: props.routerName }
  }
})

function reset() {
  gridData.value = []
  currentRow.value = undefined
}

function getPrintList() {
  getPrint(queryParams.value).then(response => {
    gridData.value = response.data
    if (gridData.value.length > 0) {
      setCurrent(gridData.value[0])
    }
  }) 
}

function dialogOpen() {
  reset()
  getPrintList()
  visible.value = true
}

function confirmBtn() {
  emit('onPrintView', currentRow.value.perms.split(':').pop())
  visible.value = false
}

function setCurrent(row) {
  proxy.$refs.printTable.setCurrentRow(row)
}

function handleCurrentChange(val) {
  currentRow.value = val
}

defineExpose({
  dialogOpen
})
</script>

<style>

</style>