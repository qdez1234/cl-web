<template>
  <el-select class="input" v-model="mdValue" @blur="HandleBlur" @focus="HandleFocus" @change="HandleChange"
    :placeholder="placeholder" :disabled="disabled || PageDisabled"  filterable :type="type" :size="size" clearable>
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>

<script setup>
import { onMounted, ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})  // 使用函数返回默认对象
  },
  modelValue: {
    type: [String, Number],
    default: ''  // 设置默认值
  },
  PageDisabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  "update:methods",
  'update:modelValue'
]);

const options = ref([]);
let mdValue = ref(props.modelValue)
let placeholder = ref()
let disabled = ref(false)
let type = ref('string')
let size = ref('default')
let code = ref("")
const { proxy } = getCurrentInstance()

watch(() => props.params, () => {
  HandleInit()
}, { deep: true })

watch(() => props.modelValue, (newVal) => {
  mdValue.value = newVal
})

/**
* 初始化
*/
const HandleInit = () => {
  placeholder.value = props.params.placeholder
  disabled.value = props.params.isReadonly
  type.value = props.params.type
  size.value = props.params.size
  code.value = props.params.code
  initOptions()
}

/**
* 当输入框失去焦点时触发
*/
const HandleBlur = () => {
  emit('update:modelValue', mdValue.value)
  findEval('S-1')
}

/**
* 当输入框获得焦点时触发
*/
const HandleFocus = () => {
  emit('update:modelValue', mdValue.value)
  findEval('S-2')
}

/**
* 仅当 modelValue 改变时，当输入框失去焦点或用户按Enter时触发
*/
const HandleChange = () => {
  emit('update:modelValue', mdValue.value)
  findEval('S-3')
}

const initOptions = async () => {
  if (code.value == "") return;
  options.value = await proxy.getDictValue(code.value)
};

/**
 * 寻找指定触发代码方法
 * @param value 
 */
const findEval = (value) => {
  let item = props.params.methdoList.find(ele => ele.value == value)
  if (item && item.code != '') emit("update:methods", item.code)
}
onMounted(async () => {
  HandleInit()
  await initOptions();
  mdValue.value = props.modelValue
})
</script>

<style lang="scss">
.input {
  width: 100% !important;
}
</style>
