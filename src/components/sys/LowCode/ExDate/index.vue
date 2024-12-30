<template>
    <el-date-picker class="input" v-model="mdValue" @blur="HandleBlur" @focus="HandleFocus" @change="HandleChange"
    :placeholder="PageDisabled?placeholder:''" :disabled="disabled || PageDisabled" :type="type" :size="size" :format="format" :value-format="valueFormat">
    </el-date-picker>
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
let mdValue = ref(props.modelValue)
let placeholder = ref()
let disabled = ref(false)
let type = ref('string')
let size = ref('default')
let format = ref('')
let valueFormat = ref('')

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
    format.value = props.params.format
    valueFormat.value = props.params.valueFormat
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
 * 点击确认键当输入框失去焦点或用户按Enter时触发
 */
const HandleChange = () => {
    emit('update:modelValue', mdValue.value)
    findEval('S-3')
}
/**
 * 寻找指定触发代码方法
 * @param value 
 */
 const findEval = (value) => {
  let item = props.params.methdoList.find(ele => ele.value == value)
  if (item && item.code != '') emit("update:methods", item.code)
}
onMounted(() => {
    HandleInit()
    mdValue.value = props.modelValue
})
</script>

<style lang="scss">
.input {
    width: 100%;
}
</style>
