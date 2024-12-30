<template>
    <el-input class="input" v-model="mdValue" @blur="HandleBlur" @focus="HandleFocus" @change="HandleChange"
        @input="HandleInput" :placeholder="PageDisabled?placeholder:''" :disabled="disabled || PageDisabled" :type="type" :size="size" clearable>
        <template #suffix>
            {{ suffix }}
        </template>
    </el-input>
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
let suffix = ref('')

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
    suffix.value = props.params.suffix
}

/**
 * 当输入框失去焦点时触发
 */
const HandleBlur = () => {
    emit('update:modelValue', mdValue.value)
    findEval('I-1')
}

/**
 * 当输入框获得焦点时触发
 */
const HandleFocus = () => {
    emit('update:modelValue', mdValue.value)
    findEval('I-2')
}

/**
 * 仅当 modelValue 改变时，当输入框失去焦点或用户按Enter时触发
 */
const HandleChange = () => {
    emit('update:modelValue', mdValue.value)
    findEval('I-3')
}

/**
 * 在 Input 值改变时触发
 */
const HandleInput = () => {
    emit('update:modelValue', mdValue.value)
    findEval('I-4')
}

/**
 * 寻找指定触发代码方法
 * @param value 
 */
const findEval = (value) => {
    let item = props.params.methdoList.find(ele => ele.value == value)
    if (item && item.code != '') emit("update:methods", item.code)
}
/**
 * 设定值
 * @param value 
 */
const HandleSetData = (value) => {
    mdValue.value = value
}
/**
 * 设定值
 * @param value 
 */
const HandleGetData = (value) => {
    return mdValue.value
}
defineExpose({
    HandleSetData,
    HandleGetData
});
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
