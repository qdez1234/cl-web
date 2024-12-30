<template>
    <el-form ref="ruleFormRef" style="max-width: 600px" status-icon label-width="auto" class="demo-ruleForm">
        <el-form-item label="容器字段" v-if="computedModel([''])">
            <el-input v-model="modelValue.field" />
        </el-form-item>
        <el-form-item label="标签对齐" v-if="computedModel(['form'])">
            <el-select v-model="modelValue.labelPosition" placeholder="" style="width: 100%">
                <el-option v-for="(item, index) in positionOptions" :key="index" :label="item.label"
                    :value="item.value" />
            </el-select>
        </el-form-item>

        <el-form-item label="API" v-if="computedModel(['ex-tree'])">
            <el-input v-model="modelValue.API" />
        </el-form-item>

        <el-form-item label="label字段" v-if="computedModel(['ex-tree'])">
            <el-input v-model="modelValue.propsLabel"/>
        </el-form-item>

        <el-form-item label="id输出字段" v-if="computedModel(['ex-tree'])">
            <el-input  v-model="modelValue.report"/>
        </el-form-item>

        <el-form-item label="点击事件" v-if="computedModel(['ex-tree'])">
            <el-input v-model="modelValue.code" style="width: 100%" :autosize="{ minRows: 3, maxRows: 10 }"
                type="textarea" />
        </el-form-item>

        <el-form-item label="标签宽度" v-if="computedModel(['form'])">
            <el-input v-model="modelValue.labelWidth" type="number" autocomplete="off" />
        </el-form-item>

    </el-form>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => { },
    },
    modelType: {
        type: String,
        default: () => ""
    }
})
const positionOptions = [
    { label: 'left', value: 'left' },
    { label: 'right', value: 'right' },
]
const ruleFormRef = ref(null);
/**
 * 计算label是否在当前模型里面
 * @param model 
 */
const computedModel = (model = []) => {
    return model.includes(props.modelType)
}

</script>