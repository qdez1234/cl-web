<template>
    <el-button v-if="!authentication" :disabled="disabled" @click="HandleClick" :type="type" :size="size">
        <svg-icon v-if="iconType" :icon-class="iconType" style="font-size: 16px;" />
        {{ label }}
    </el-button>
    <el-button v-else v-hasPermi="authentication" :disabled="disabled" @click="HandleClick" :type="type" :size="size">
        <svg-icon v-if="iconType" :icon-class="iconType" style="font-size: 16px;" />
        {{ label }}
    </el-button>
</template>

<script setup>
import { onMounted, ref, watch, defineProps, defineEmits, computed } from 'vue'
import { useRoute } from "vue-router"
const route = useRoute()
const props = defineProps({
    params: {
        type: Object,
        default: () => ({})  // 使用函数返回默认对象
    },
    NoMethodsList: {
        type: Boolean,
        default: false
    },
});

const emit = defineEmits([
    "update:methods",
]);

let disabled = ref(false)
let type = ref('string')
let size = ref('default')
let label = ref('')
let iconType = ref(null)
let authentication = ref(null)
watch(() => props.params, () => {
    HandleInit()
}, { deep: true })

/**
 * 初始化
 */
const HandleInit = () => {
    disabled.value = props.params.isReadonly
    type.value = props.params.type
    label.value = props.params.label
    size.value = props.params.size
    iconType.value = props.params.iconType
    authentication.value = props.params.authentication ? props.params.authentication.split(',') : null
}

/**
 * 当输入框失去焦点时触发
 */
const HandleClick =debounce(() => {
    if (props.NoMethodsList) {   //无事件队列直接执行code
        emit("update:methods", props.params.code)
        return
    }
    findEval('B-1')
})

/**
 * 防抖
 * @param fn 
 * @param delay 
 */
function debounce(fn, delay=50) {
  let timeout;
  return function(...args) {
    // 清除上一个定时器
    clearTimeout(timeout);
    // 设置新的定时器
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
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
})
</script>

<style lang="scss"></style>
