<template>
  <el-select v-model="state" clearable placeholder="请选择单别" :disabled="!isEdit" v-if="billstyleList.length > 0">
    <el-option v-for="billstyle in billstyleOptions"
      :key="billstyle.billstyleCode"
      :label="billstyle.billstyleCode + '.' + billstyle.billstyleName"
      :value="billstyle.billstyleCode" 
      >
    </el-option>
  </el-select>
  <el-select v-model="state" clearable placeholder="请选择单别" :disabled="!isEdit" v-else>
    <el-option label="请选配置单别" value="" disabled />
  </el-select>

</template>

<script setup name="BillstyleField">
import { getBillstyleCode } from "@/api/system/menuset"
import useUserStore from '@/store/modules/user'

let props = defineProps({
  modelValue: {
    type: String,
    default: () => undefined,
  },
  menusetCode: {
    type: String,
    require: () => undefined,
  },
  formStatus: {
    type: String,
    default: '1',
  },
  companyId: {
    type: [String, Number],
    default: useUserStore().dept.companyId
  },
});

const emit = defineEmits(['update:modelValue'])
const billstyleList = ref([])

const billstyleOptions = computed({
  get() {
    let result = billstyleList.value
    if (props.companyId) {
      result = billstyleList.value.filter(item => { return item.companyId === props.companyId })
    }
    return result
  }
})

const state = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

//监听billstyleOptions
watch(() => billstyleOptions.value, value => {
  if (value.length>0) {
    if (props.modelValue === undefined || props.modelValue === null || props.modelValue === "") {
      emit('update:modelValue', value[0].billstyleCode);
    } else {
      if (value.filter(item => { return item.billstyleCode === props.modelValue }).length <= 0) {
        emit('update:modelValue', undefined);
      }
    }
  } else {
    emit('update:modelValue', undefined);
  }
});

const isEdit = computed({
  get() {
    return props.formStatus === '1'
  }
})

onMounted(() => {
  if (props.menusetCode === undefined) {
    return
  }
  getBillstyleCode(props.menusetCode).then(res => {
    billstyleList.value = res.data
  })
})


</script>

<style scoped lang="scss">
  :deep(.el-input__inner[backgroundColor="disable"]) {
    background-color: #f4f4f5;
  }
</style>