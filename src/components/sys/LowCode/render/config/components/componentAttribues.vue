<template>
    <el-form style="max-width: 600px" status-icon label-width="auto" class="demo-ruleForm">
        <el-form-item label="ref">
            <el-input v-model="modelValue.id" disabled />
        </el-form-item>
        
        <el-form-item label="类型" draggable
            v-if="computedComponent(['ex-button', 'ex-input', 'ex-date', 'ex-dateRange'])">
            <el-select v-model="modelValue.type" placeholder="" style="width: 100%">
                <el-option v-for="(item, index) in modelValue.typeOptions" :key="index" :label="item.label"
                    :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="尺寸"
            v-if="computedComponent(['ex-button', 'ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-dictSelect'])">
            <el-select v-model="modelValue.size" placeholder="" style="width: 100%">
                <el-option v-for="(item, index) in sizeOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="字段"
            v-if="computedComponent(['ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-dictSelect', 'ex-report','ex-img'])">
            <el-input v-model="modelValue.field" />
        </el-form-item>

        <el-form-item label="API" v-if="computedComponent(['ex-tree-select'])">
            <el-input v-model="modelValue.API" />
        </el-form-item>

        <el-form-item label="label字段" v-if="computedComponent(['ex-tree-select'])">
            <el-input v-model="modelValue.propsLabel"/>
        </el-form-item>

        <el-form-item label="格式" v-if="computedComponent(['ex-date', 'ex-dateRange'])">
            <el-input v-model="modelValue.format" />
        </el-form-item>
        <el-form-item label="值格式" v-if="computedComponent(['ex-date', 'ex-dateRange'])">
            <el-input v-model="modelValue.valueFormat" />
        </el-form-item>
        <el-form-item label="label"
            v-if="computedComponent(['ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-button', 'ex-dictSelect', 'ex-report', 'ex-grid', 'ex-table','ex-img'])">
            <el-input v-model="modelValue.label" />
        </el-form-item>
        <el-form-item label="数据KEY" v-if="computedComponent(['ex-grid', 'ex-table'])">
            <el-input v-model="modelValue.propsName" />
        </el-form-item>
        <el-form-item label="label宽度"
            v-if="computedComponent(['ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-dictSelect', 'ex-report','ex-img'])">
            <el-input v-model="modelValue.labelWidth" type="number" />
        </el-form-item>
        <el-form-item label="图标" prop="icon" v-if="computedComponent(['ex-button'])">
            <el-popover placement="bottom-start" :width="540" v-model:visible="showChooseIcon" trigger="click"
                @show="showSelectIcon" class="popover-box">
                <template #reference>
                    <el-input v-model="modelValue.iconType" placeholder="点击选择图标" readonly>
                        <template #prefix>
                            <svg-icon v-if="modelValue.iconType" :icon-class="modelValue.iconType"
                                class="el-input__icon" style="height: 32px;width: 16px;" />
                            <el-icon v-else style="height: 32px;width: 16px;">
                                <search />
                            </el-icon>
                        </template>
                    </el-input>
                </template>
                <icon-select @selected="HandleSelectIcon" />
            </el-popover>
        </el-form-item>
        <el-form-item label="后缀" v-if="computedComponent(['ex-input',])">
            <el-input v-model="modelValue.suffix" />
        </el-form-item>
        <el-form-item label="默认值" v-if="computedComponent(['ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-dictSelect'])">
            <el-input v-model="modelValue.defaultValue" />
        </el-form-item>
        <el-form-item label="最大上传个数" v-if="computedComponent(['ex-img'])">
            <el-input v-model="modelValue.limit" type="number" />
        </el-form-item>
        <el-form-item label="最大MB" v-if="computedComponent(['ex-img'])">
            <el-input v-model="modelValue.maxSize" type="number" />
        </el-form-item>
        <el-form-item label="默认值表达式" v-if="computedComponent(['ex-date', 'ex-dateRange'])">
            <el-input v-model="modelValue.defaultValueEcho" style="width: 100%" :autosize="{ minRows: 3, maxRows: 10 }"
                type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="占位提示" v-if="computedComponent(['ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-dictSelect'])">
            <el-input v-model="modelValue.placeholder" />
        </el-form-item>
        <el-form-item label="字典code" v-if="computedComponent(['ex-dictSelect'])">
            <el-link type="primary" @click="reportDict(modelValue.code)">{{ modelValue.code || '配置' }}</el-link>
        </el-form-item>
        <el-form-item label="数据来源" v-if="computedComponent(['ex-report',])">
            <el-link type="primary" @click="reportField(modelValue.config)">{{ modelValue.config ?
                computedLength(modelValue.config) : '配置'
                }}</el-link>
        </el-form-item>
        <el-form-item label="栅格"
            v-if="computedModel(['form', 'ex-dialog']) && computedComponent(['ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-dictSelect', 'ex-report','ex-img'])">
            <el-slider v-model="modelValue.occupy" show-stops :step="1" :max="4" :min="1" />
        </el-form-item>

        <el-form-item label="多选"
            v-if="computedComponent(['ex-tree-select'])">
            <el-switch v-model="modelValue.multiple" />
        </el-form-item>

        <el-form-item label="明细锁定"
            v-if="computedComponent(['ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-dictSelect', 'ex-report',])">
            <el-switch v-model="modelValue.isLock" />
        </el-form-item>
        <el-form-item label="只读"
            v-if="computedComponent(['ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-dictSelect', 'ex-report','ex-img'])">
            <el-switch v-model="modelValue.isReadonly" />
        </el-form-item>
        <el-form-item label="隐藏"
            v-if="computedComponent(['ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-dictSelect', 'ex-report','ex-img'])">
            <el-switch v-model="modelValue.isShow" />
        </el-form-item>
        <el-form-item label="复制"
            v-if="computedModel(['form']) &&computedComponent(['ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-dictSelect', 'ex-report','ex-img'])">
            <el-switch v-model="modelValue.isCopy" />
        </el-form-item>
        <el-form-item label="不能为空"
            v-if="computedComponent(['ex-input','ex-tree-select', 'ex-date', 'ex-dateRange', 'ex-dictSelect', 'ex-report','ex-img'])">
            <el-switch v-model="modelValue.isEmpty" />
        </el-form-item>
        <el-form-item label="数据配置" v-if="computedComponent(['ex-grid', 'ex-table'])">
            <el-link type="primary" @click="reportGrid">{{ modelValue.gridColDefs ?
                computedLength(modelValue.gridColDefs) : '配置'
                }}</el-link>
        </el-form-item>

        <el-form-item label="API" v-if="computedComponent(['ex-grid', 'ex-table'])">
            <el-input v-model="modelValue.API" />
        </el-form-item>

        <!-- 按钮配置 -->
        <el-form-item label="按钮配置" v-if="computedComponent(['ex-grid', 'ex-table'])">
            <el-tag v-for="tag in actionTags" class="btnTags" :key="tag" closable :disable-transitions="false"
                @click="handleClickActionTag(tag)" :effect="selectActionTag.label == tag.label ? 'dark' : ''"
                @close="handleCloseActionTag(tag)">
                {{ tag.label }}
            </el-tag>
            <el-input v-if="inputActionVisible" ref="InputActionRef" v-model="inputActionValue" class="w-20"
                size="small" @keydown.enter.prevent="handleInputActionConfirm" />
            <el-button v-else class="button-new-tag" size="small" @click="showInputAction">
                + 添加按钮
            </el-button>
        </el-form-item>

        <div class="setBtnBox" v-if="computedComponent(['ex-grid', 'ex-table']) && selectActionTag.label">
            <el-form-item label="数据来源">
                <el-link type="primary" @click="reportBtnField(selectActionTag.config)">{{ selectActionTag.config ?
                    computedLength(selectActionTag.config) : '配置'
                    }}</el-link>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-popover placement="bottom-start" :width="540" v-model:visible="showChooseIcon" trigger="click"
                    @show="showSelectIcon" class="popover-box">
                    <template #reference>
                        <el-input v-model="selectActionTag.iconType" placeholder="点击选择图标" readonly>
                            <template #prefix>
                                <svg-icon v-if="selectActionTag.iconType" :icon-class="selectActionTag.iconType"
                                    class="el-input__icon" style="height: 32px;width: 16px;" />
                                <el-icon v-else style="height: 32px;width: 16px;">
                                    <search />
                                </el-icon>
                            </template>
                        </el-input>
                    </template>
                    <icon-select @selected="HandleActivedTagSelectIcon" />
                </el-popover>
            </el-form-item>
            <el-form-item label="按钮名称">
                <el-input v-model="selectActionTag.label" @input="updateGridActionButton" />
            </el-form-item>
            <el-form-item label="按钮类型">
                <el-select v-model="selectActionTag.type" placeholder="" style="width: 100%"
                    @change="updateGridActionButton">
                    <el-option v-for="(item, index) in modelValue.typeOptions" :key="index" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="方法代码">
                <el-input v-model="selectActionTag.code" style="width: 100%" :autosize="{ minRows: 3, maxRows: 10 }"
                    type="textarea" placeholder="Please input" @change="updateGridActionButton" />
            </el-form-item>
        </div>

        <!-- 操作列按钮配置 -->
        <el-form-item label="操作列按钮配置" v-if="computedComponent(['ex-grid', 'ex-table'])">
            <el-tag v-for="tag in dynamicTags" class="btnTags" :key="tag" closable :disable-transitions="false"
                @click="handleClickTag(tag)" :effect="activedTag.label == tag.label ? 'dark' : ''"
                @close="handleCloseTag(tag)">
                {{ tag.label }}
            </el-tag>
            <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
                @keydown.enter.prevent="handleInputConfirm" />
            <el-button v-else class="button-new-tag" size="small" @click="showInput">
                + 添加按钮
            </el-button>
        </el-form-item>
        <div class="setBtnBox" v-if="computedComponent(['ex-grid', 'ex-table']) && activedTag.label">
            <el-form-item label="排序">
                <el-input type="number" v-model="activedTag.num" @input="updateGridActionButton" />
            </el-form-item>
            <el-form-item label="鉴权标识">
                <el-input v-model="activedTag.authentication" @input="updateGridActionButton" />
            </el-form-item>
            <el-form-item label="按钮名称">
                <el-input v-model="activedTag.label" @input="updateGridActionButton" />
            </el-form-item>
            <el-form-item label="按钮类型">
                <el-select v-model="activedTag.type" placeholder="" style="width: 100%"
                    @change="updateGridActionButton">
                    <el-option v-for="(item, index) in modelValue.typeOptions" :key="index" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="方法代码">
                <el-input v-model="activedTag.code" style="width: 100%" :autosize="{ minRows: 3, maxRows: 10 }"
                    type="textarea" placeholder="Please input" @change="updateGridActionButton" />
            </el-form-item>
            <el-form-item label="状态展示表达式">
                <el-input v-model="activedTag.expression" style="width: 100%" :autosize="{ minRows: 3, maxRows: 10 }"
                    type="textarea" placeholder="Please input" @change="updateGridActionButton" />
            </el-form-item>
        </div>

        <el-form-item label="鉴权标识" v-if="computedComponent(['ex-button'])">
            <el-input v-model="modelValue.authentication" @change="updateGridActionButton" />
        </el-form-item>


        <div class="methdosBox"
            v-if="computedComponent(['ex-button', 'ex-input', 'ex-date', 'ex-dateRange', 'ex-dictSelect', 'ex-report'])">
            <el-form-item label="方法事件">
                <el-tag v-for="(tag, index) in modelValue.methdoList" class="btnTags" :key="index" closable
                    :disable-transitions="false" @click="handleClickSelectTag(tag)"
                    :effect="selectTag.label == tag.label ? 'dark' : ''" @close="handleCloseSelectTag(tag)">
                    {{ tag.label }}
                </el-tag>

                <el-select v-if="selectVisible" v-model="selectMethods" @change="handleAddSelectTag" placeholder=""
                    style="width: 100%">
                    <el-option v-for="(item, index) in computedMethods" :key="index" :label="item.label"
                        :value="item.value" />
                </el-select>

                <el-button v-else class="button-new-tag" size="small" @click="selectVisible = true">
                    + 添加事件
                </el-button>
            </el-form-item>

            <el-form-item label="状态展示表达式" v-if="computedComponent(['ex-button'])">
                <el-input v-model="modelValue.expression" style="width: 100%" :autosize="{ minRows: 3, maxRows: 10 }"
                    type="textarea" placeholder="Please input" />
            </el-form-item>

            <div class="methdosEdit" v-if="selectTag.label">
                <el-form-item label="方法代码">
                    <el-input v-model="selectTag.code" style="width: 100%" :autosize="{ minRows: 3, maxRows: 10 }"
                        type="textarea" placeholder="Please input" />
                </el-form-item>
            </div>

        </div>

    </el-form>
    <ExDictConfig ref="ExDictConfigRef" v-model="modelValue.code" />
    <ExReportConfig ref="ExReportConfigRef" v-model="modelValue.config" />
    <ExReportConfig ref="ExReportConfigBtnRef" v-model="selectActionTag.config" />
    <ExGridConfig ref="ExGridConfigRef" @update:data="updateGrid" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import ExDictConfig from '@/components/sys/LowCode/ExDictConfig/index.vue'
import ExReportConfig from '@/components/sys/LowCode/ExReportConfig/index.vue'
import ExGridConfig from '@/components/sys/LowCode/ExGridConfig/index.vue'
import IconSelect from "@/components/IconSelect";
import { sorted } from "../../../config"

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => { },
    },
    modelType: {
        type: String,
        default: () => ""
    },
    componentModel: {
        type: String,
        default: () => ""
    }
})

watch(() => props.componentModel, (newVal) => {
    methodsOptions()
})

watch(() => props.modelValue, (newVal) => {
    selectActionTag.value = {}
    inputVisible.value = false
    inputActionVisible.value = false
    selectVisible.value = false
    inputValue.value = false
    inputActionValue.value = false
    selectMethods.value = ''
    activedTag.value = {}
    selectTag.value = {}
    dynamicTags.value = newVal.btnGroup || {}
    actionTags.value = newVal.actionGroup || {}
})
const emit = defineEmits(['update:modelValue', 'update:data', 'update:colDefs'])
const route = useRoute()

const ExDictConfigRef = ref(null)
const ExReportConfigRef = ref(null)
const ExReportConfigBtnRef = ref(null)
const ExGridConfigRef = ref(null)
const InputRef = ref(null)
const InputActionRef = ref(null)
// 按钮配置
const dynamicTags = ref(props.modelValue.btnGroup)

const actionTags = ref(props.modelValue.actionGroup)

let selectActionTag = ref({})
const inputVisible = ref(false)
const inputActionVisible = ref(false)
const selectVisible = ref(false)
const inputValue = ref("")
const inputActionValue = ref("")
const selectMethods = ref("")
let gridColDefs = props.modelValue.gridColDefs
let activedTag = ref({})
let selectTag = ref({})
let computedMethods = ref([])
const sizeOptions = [{ label: 'large', value: 'large' }, { label: 'default', value: 'default' }, { label: 'small', value: 'small' }]
const inputMethods = [{ label: '失去焦点', value: 'I-1' }, { label: '获得焦点时', value: 'I-2' }, { label: '值改变,失去焦点或用户按Enter时', value: 'I-3' }, { label: 'input输入时', value: 'I-4' }]
const dictMethods = [{ label: '失去焦点', value: 'S-1' }, { label: '获得焦点时', value: 'S-2' }, { label: '选中值发生变化时触发', value: 'S-3' }]
const btnMethods = [{ label: '点击事件', value: 'B-1' }]
const ReportMethods = [{ label: '值发生变化时触发', value: 'R-1' }]

/**
 * grid按钮新增
 */
const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push({ label: inputValue.value, type: 'primary', methdoList: [], expression: '', authentication: '', num: 0 })
    }
    inputVisible.value = false
    inputValue.value = ''
    updateGridActionButton()
}
/**
 * grid按钮新增
 */
const handleInputActionConfirm = () => {
    if (inputActionValue.value) {
        actionTags.value.push({ label: inputActionValue.value, type: 'primary', methdoList: [], expression: '', authentication: '', iconType: '', config: {} })
    }
    inputActionVisible.value = false
    inputActionValue.value = ''
    updateGridActionButton()
}
/**
 * 点击input输入grid按钮
 */
const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}
/**
 * 点击input输入grid按钮
 */
const showInputAction = () => {
    inputActionVisible.value = true
    nextTick(() => {
        InputActionRef.value.input.focus()
    })
}
const methodsOptions = () => {
    if (props.componentModel == 'ex-input') computedMethods.value = inputMethods
    if (props.componentModel == 'ex-dictSelect' || props.componentModel == 'ex-date' || props.componentModel == 'dateRange') computedMethods.value = dictMethods
    if (props.componentModel == 'ex-button') computedMethods.value = btnMethods
    if (props.componentModel == 'ex-report') computedMethods.value = ReportMethods
}
methodsOptions()

/**
 * 选中按钮
 * @param tag 
 */
const handleClickTag = (tag) => {
    activedTag.value = tag
}
/**
 * 选中按钮
 * @param tag 
 */
const handleClickActionTag = (tag) => {
    selectActionTag.value = tag
}

/**
 * grid按钮删除
 * @param tag 
 */
const handleCloseTag = (tag) => {
    if (tag == activedTag.value) activedTag.value = {}
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    updateGridActionButton()
}
/**
 * grid按钮删除
 * @param tag 
 */
const handleCloseActionTag = (tag) => {
    if (tag == selectActionTag.value) selectActionTag.value = {}
    actionTags.value.splice(actionTags.value.indexOf(tag), 1)
    updateGridActionButton()
}
/**
 * 新增方法
 */
const handleAddSelectTag = (value) => {
    let item = computedMethods.value.find(ele => ele.value == value)
    props.modelValue.methdoList.push({ label: item.label, value: item.value, code: "" })
    selectVisible.value = false
}
/**
 * 选中方法
 * @param tag 
 */
const handleClickSelectTag = (tag) => {
    selectTag.value = tag
}
/**
 * select方法删除  
 * @param tag 
 */
const handleCloseSelectTag = (tag) => {
    if (tag == selectTag.value) selectTag.value.value = {}
    props.modelValue.methdoList.splice(props.modelValue.methdoList.indexOf(tag), 1)
}
/**
 * 跟新grid表配置字段
 * @param data
 */
const updateGrid = (config) => {
    let { data, model, rowSelection,isGroup,isGroupParams } = config
    gridColDefs = data
    props.modelValue.gridColDefs = gridColDefs
    props.modelValue.model = model
    props.modelValue.rowSelection = rowSelection
    props.modelValue.isGroup = isGroup
    props.modelValue.isGroupParams = isGroupParams
    updateGridActionButton()
}

/**
 * 跟新grid表操作队列
 */
const updateGridActionButton = () => {
    let list = {
        headerName: "操作",
        pinned: "right",
        isShow: true,
        filter: false, // 隐藏过滤条件
        suppressMenu: true, // 隐藏菜单
        cellRendererParams: {
            buttonConfig: sorted(dynamicTags.value, 'num')
        },
        cellRenderer: 'ActionButtons',
        width: 300
    };
    // 判断 gridColDefs 是否已经有 "操作" 的列
    const index = props.modelValue.gridColDefs.findIndex(col => col.headerName === "操作");

    // 如果有，删除该列并替换为新的 list
    if (index !== -1) {
        props.modelValue.gridColDefs.splice(index, 1); // 删除原有的"操作"列
    }
    if (dynamicTags.value.length > 0) props.modelValue.gridColDefs = [...props.modelValue.gridColDefs, list];
    // 添加新的 list 到 gridColDefs
}
/**
 * 配置字典导入
 */
const reportDict = (code) => {
    ExDictConfigRef.value.handleOpen(code)
}
/**
 * 配置导入
 */
const reportField = (config) => {
    ExReportConfigRef.value.handleOpen(config)
}
/**
 * 按钮配置导入
 */
const reportBtnField = (config) => {
    ExReportConfigBtnRef.value.handleOpen(config)
}
/**
 * 配置grid导入
 */
const reportGrid = () => {
    ExGridConfigRef.value.handleOpen({ data: props.modelValue.gridColDefs, model: props.modelValue.model, rowSelection: props.modelValue.rowSelection,isGroup:props.modelValue.isGroup })
}
/**
 * 计算是否在当前组件里面
 * @param model 
 */
const computedComponent = (model = []) => {
    return model.includes(props.modelValue.modelType)
}
/**
 * 计算label是否在当前模型里面
 * @param model 
 */
const computedModel = (model = []) => {
    return model.includes(props.modelType)
}
/**
 * 计算使用模型对应方法
 * @param type 
 */

/**
 * 长度超过10个字符就用三个省略号
 */
const computedLength = (str) => {
    // 判断字符串长度
    let jsonStr = JSON.stringify(str)
    if (jsonStr.length > 50) {
        return jsonStr.slice(0, 50) + '...'; // 截取前 10 个字符并加上省略号
    }
    return str; // 如果长度不超过 10，直接返回原字符串
}

/**
 * 按钮配置
 */
const showChooseIcon = ref(false)
const showSelectIcon = () => {
    showChooseIcon.value = true
}
const HandleSelectIcon = (value) => {
    props.modelValue.iconType = value
}
const HandleActivedTagSelectIcon = (value) => {
    selectActionTag.value.iconType = value

}
</script>
<style lang="scss" scoped>
.btnTags {
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
}

.button-new-tag {
    margin-bottom: 10px;
}
</style>