<template>
  <el-input v-model="state" placeholder="请输入单号" v-if="isEdit"></el-input>
  <el-input v-model="state" placeholder="【保存时自动产生】" readonly class="readonly-input" v-else></el-input>
</template>

<script setup name="BillnoField">
import { getMenusetCode } from "@/api/system/menuset"
import { ref,computed, onMounted } from "vue";
let props = defineProps({
  modelValue: {
    type: String,
    default: () => undefined,
  },
  menusetCode: {
    type: String,
    default: () => undefined,
  },
  formStatus: {
    type: String,
    default: '1',
  }
});

const emit = defineEmits(['update:modelValue'])

const menuset = ref(undefined)

const state = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const isEdit = computed({
  get() {
    if (props.formStatus === '3' || props.formStatus === '0') {
      return false
    }
    else if (menuset.value === undefined) {
      return true
    }
    else if(menuset.value?.allowEdtcode === '1' && menuset.value?.codeFormat === '0') {
      return true
    }
    else if(menuset.value?.allowEdtcode === '0' && menuset.value?.codeFormat === '0' && (props.formStatus === '1')) {
      return true
    }
    return false
  }
})


onMounted(() => {
  if (props.menusetCode === undefined) {
    return
  }
  getMenusetCode(props.menusetCode).then(res => {
    menuset.value = res.data
  })
})

</script>

<style scoped lang="scss">
.readonly-input {
  :deep(.el-input__wrapper) {
    background-color: #f5f7fa;
  }
  :deep(.el-input__inner) {
    color: #a8abb2;
  }
}
</style>