<template>
  <el-dialog v-model="dialogVisible" draggable title="编辑" width="80%">
    <div class="content">
      <div class="search">
        <ex-search-box ref="exSearchBoxRef" :editable="editable" :isForm="true" v-model:queryParams='queryParams'
          :qiuckOptions='formOptions' />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted } from 'vue';

const { formOptions,editable} = defineProps({
  formOptions: {
    type: Object,
    required: true,
  },
  editable: {
    type: Boolean,
    default: true
  },
});

const emit = defineEmits(['handleChange', 'update:modelValue']);

const dialogVisible = ref(false)

let btnFun = ref(null)

let exSearchBoxRef = ref(null)

let queryParams = ref({})

onMounted(() => {

})
/** 开启弹窗 */
const handleOpen = (btnConfig) => {
  let { fun, params } = btnConfig
  queryParams.value = params || {}
  btnFun.value = fun
  dialogVisible.value = true
}
/** 关闭弹窗 */
const handleClose = () => {
  dialogVisible.value = false
}
/** 确定选中 */
const handleSubmit = () => {
  exSearchBoxRef.value.searchValid().then(Valid => {
    if (Valid) {
      dialogVisible.value = false
      emit("handleChange", btnFun.value, queryParams.value)
    }
  })
   
}

defineExpose({
  handleOpen
});
</script>

<style scoped lang="scss">
.content {
  display: flex;
  padding: 15px 15px 30px 15px;
  flex-direction: column;
}

.search {
  margin-top: 10px;

  .form-inline {
    display: flex;
  }
}
</style>