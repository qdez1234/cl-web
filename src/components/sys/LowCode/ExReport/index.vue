<template>
    <div :class="['tagBox', (disabled || PageDisabled) ? 'disabled' : '', `tag-${mondelId}`]" @click="handleOpen"
        v-if="model == 'select'">
        <div class="left">
            <el-tag v-for="(tag, index) in tags" @close="handleDel(tag)" :key="index" :closable="!props.PageDisabled">
                {{ echoText(tag) }}
            </el-tag>
            <el-input class="keyword-input" :disabled="PageDisabled" v-model="keyword" @input="HandelQuery"
                :placeholder="PageDisabled ? placeholder : '请输入关键字查询'"></el-input>
        </div>
        <div class="right">
            <el-icon class="icon-arrow">
                <ArrowDownBold />
            </el-icon>
        </div>
    </div>
    <div class="btn" v-if="model == 'report'" @click="handleOpen">
        <el-button style="margin-right:12px" :type="params.type">
            <svg-icon v-if="params.iconType" :icon-class="params.iconType" style="font-size: 16px;" />
            {{ params.label }}
        </el-button>
    </div>
    <el-select :popper-class="['exReportSelectPopper', `select-${mondelId}`]" ref="selectRef"
        v-if="showType == 'select'" :automatic-dropdown="false" class="exReportSelect" v-model="tags" multiple>
        <template #tag>
            <el-tag v-for="(tag, index) in tags" @close="handleDel(tag)" :key="index" closable>
                {{ echoText(tag) }}
            </el-tag>
        </template>
        <template #header>
            <!-- <div class="search">
            </div> -->
            <div class="tagsBox">
                <el-tag v-for="(tag, index) in tagsBefore" @close="handleDelBefore(tag)" :key="index" closable>
                    {{ echoText(tag) }}
                </el-tag>
            </div>
            <AgTable class="AgTableSelect" :grildParams="queryParams" :grildFixedParams="fixedParams" ref="gridRef"
                :rowSelection="rowSelection" :paging="true" :gridColDefs="gridColDefs" :suppressRowClickSelection="true"
                :grildUrl="Dapi" :gridKey="route.path + 'exReportSelect'" @handleChange="setValue"
                @handleRowSelect="handleRowSelect" />
        </template>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
            </div>
        </template>
    </el-select>

    <el-dialog v-model="dialogVisible" draggable title="数据查询" :close-on-click-modal="false" :append-to-body="true"
        width="80%" v-if="showType == 'dialog'">
        <div class="content">
            <div class="search">
                <span>关键字</span>
                <el-input class="keyword-input" v-model="keyword" @input="HandelQuery"
                    :placeholder="PageDisabled ? placeholder : '请输入关键字查询'" style="width: 380px;"></el-input>
            </div>
            <div class="tagsBox">
                <el-tag v-for="(tag, index) in tagsBefore" @close="handleDelBefore(tag)" :key="index" closable>
                    {{ echoText(tag) }}
                </el-tag>
            </div>
            <AgTable class="AgTable" :grildParams="queryParams" :grildFixedParams="fixedParams" ref="gridRef"
                :rowSelection="rowSelection" :paging="true" :gridColDefs="gridColDefs" :suppressRowClickSelection="true"
                :gridKey="route.path + 'exReportDialog'" :grildUrl="Dapi" @handleChange="setValue"
                @handleRowSelect="handleRowSelect" />
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
import { parseQueryString } from "../config"
const props = defineProps({
    params: {
        default: () => ({})  // 使用函数返回默认对象
    },
    modelValue: {
        type: [String, Number],
        default: ''  // 设置默认值
    },
    model: {   //select为导入, reprot为导入
        type: String,
        default: 'select'
    },
    outerData: {
        type: Object,
        default: () => ({})
    },
    PageDisabled: {
        type: Boolean,
        default: false
    }
});

watch(() => props.outerData, () => {
    initReportField()
}, { deep: true })
watch(() => props.params, () => {
    HandleInit()
}, { deep: true })
const emit = defineEmits(['update:report', 'update:methods'])
const route = useRoute();

const router = useRouter();

const dialogVisible = ref(false)

const selectRef = ref(null)

const gridRef = ref(null)

let disabled = ref(false)

let tagsBefore = ref([])

let queryParams = ref({})

let Dapi = ref("")

let fixedParams = ref({})

let mondelId = ref("")

let keyword = ref("")

let rowSelection = ref("single")

let gridColDefs = ref([])

let showType = ref("select")

let tags = ref([])

let reportMap = ref([])

let tableConfig = ref([])
/** 开启弹窗 */
const handleOpen = () => {
    if (disabled.value || props.PageDisabled) return
    tagsBefore.value = [...tags.value]
    showType.value == 'select' ? openSelect() : dialogVisible.value = true
    setValue()
}
/** 关闭弹窗 */
const handleClose = () => {
    showType.value == 'select' ? openSelect(false) : dialogVisible.value = false
}
/**
 * 开启/关闭下拉框
 */
const openSelect = (show = true) => {
    show ? document.addEventListener('click', handleClickOutside) : document.removeEventListener('click', handleClickOutside);
    const popper = document.querySelector(`.select-${mondelId.value}`);
    popper.style.display = show ? 'block' : 'none'; // 显示 popper
}
// 处理点击事件
const handleClickOutside = (event) => {
    const popper = document.querySelector(`.select-${mondelId.value}`);
    const tagBox = document.querySelector(`.tag-${mondelId.value}`);
    if (
        popper && !popper.contains(event.target) &&
        tagBox && !tagBox.contains(event.target)
    ) {
        openSelect(false);
    }
}
/**
 * 关键字搜索
 */
const HandelQuery = () => {
    gridRef.value.HandleQueryData({ _keyword: keyword.value })
}
/**
* 初始化
*/
const HandleInit = () => {
    disabled.value = props.params.isReadonly

    Dapi.value = props.params.config?.Dapi

    showType.value = props.params.config?.showType

    tableConfig.value = props.params.config?.table || []

    fixedParams.value = parseQueryString(props.params.config?.params)

    rowSelection.value = props.params.config?.rowSelection

    mondelId.value = props.params.id

    initOptions()

}
/**
 * 导出字段映射,并且默认字段赋值
 */
const initReportField = () => {
    if (rowSelection.value != 'single') return

    reportMap.value.value = tableConfig.value
        .filter(ele => ele.report)
        .map(ele => ({
            key: ele.field,
            report: ele.report
        }));
    let obj = {}
    reportMap.value.value.forEach(ele => {
        obj[ele.key] = props.outerData[ele.report]
    })
    function hasValue(obj) {
        return Object.values(obj).some(value => value !== null && value !== undefined && value !== '');
    }
    hasValue(obj) ? tags.value = [obj] : ''
}
/**
 * 删除已经确认过的数据
 */
const handleDel = (tag) => {
    if (props.disabled) return
    tags.value = tags.value.filter(ele => ele['id'] != tag['id'])
    handleReport()
}
/** 选择框弹出删除 */
const handleDelBefore = (tag) => {
    gridRef.value.HandleGridApi().forEachNode((node) => {
        let isSelect = node.data['id'] == tag['id']
        if (isSelect) node.setSelected(false);
    });
    tagsBefore.value = tagsBefore.value.filter(ele => ele['id'] != tag['id'])
}
/**
 * 设置值
 */
const setValue = () => {
    setTimeout(() => {
        gridRef.value.HandleGridApi().forEachNode((node) => {
            let isSelect = tagsBefore.value.find(ele => ele['id'] == node.data['id'])
            if (isSelect) node.setSelected(true);
            else node.setSelected(false);
        });
    }, 50)
};
/** 确定选中 */
const handleSubmit = () => {
    tags.value = [...tagsBefore.value]
    keyword.value = ""
    HandelQuery()
    handleReport()
    handleClose()
}
/**
 * 根据导出字段导出数据
 */
const handleReport = () => {
    // 筛选出需要映射的字段
    reportMap.value = tableConfig.value
        .filter(ele => ele.report)
        .map(ele => ({
            key: ele.field,
            report: ele.report
        }));
    // 合并所有项到一个对象，相同的键用字符串连接，长度为0时导出null
    let mergedResult = null

    if (props.model == 'select') {
        mergedResult = tags.value.length > 0
            ? tags.value.reduce((acc, item) => {
                reportMap.value.forEach(({ key, report }) => {
                    if (item[key] !== undefined) {
                        if (!acc[report]) {
                            acc[report] = ''; // 初始化为空字符串
                        }
                        acc[report] = acc[report]
                            ? `${acc[report]},${item[key]}` // 拼接字符串
                            : `${item[key]}`; // 第一个值直接赋值
                    }
                });
                return acc;
            }, {})
            : Object.fromEntries(reportMap.value.map(({ report }) => [report, null])); // 长度为0时导出null
    }

    if (props.model == 'report') {
        mergedResult = tags.value.length > 0
            ? tags.value.map(item => {
                const resultItem = {}; // 单个对象
                reportMap.value.forEach(({ key, report }) => {
                    if (item[key] !== undefined) {
                        resultItem[report] = item[key]; // 将 key 转换为 report 并赋值
                    }
                });
                return resultItem; // 返回转换后的对象
            })
            : []; // 如果 tags.value 为空，则返回空数组
    }
    emit('update:report', mergedResult); // 如果是多选，发送所有选中项
    findEval('R-1')
};
/** 选中事件触发 */
const handleRowSelect = (rows) => {
    if (rows.isSelected && rowSelection.value == 'multiple') tagsBefore.value.push(rows.rowData)
    else if (rows.isSelected && rowSelection.value == 'single') tagsBefore.value[0] = rows.rowData
    else tagsBefore.value = tagsBefore.value.filter(ele => ele.id != rows.rowData.id)
}
/** 根据回显字段回显本文 */
const echoText = (row) => {
    let list = tableConfig.value.filter(ele => ele.echo).map(ele => ele.field)
    return list.map(ele => row[ele]).join(',')
}
/**
 * 表头回显
 */
const initColdefs = () => {
    // 渲染的字段
    let list = tableConfig.value.filter((ele) => ele.isShow).sort((a, b) => a.sequence - b.sequence).map((ele) => {
        return {
            headerName: ele.customName || ele.defaultName,
            field: ele.field,
            editable: false,
            cellEditor: 'agTextCellEditor',
            cellRenderer: (ele.dictionary && ele.dictionary != "") ? 'CustomDict' : null,
            cellRendererParams: (ele.dictionary && ele.dictionary != "") ? { dict_key: ele.code } : null,
        };
    })
    list.unshift({
        headerName: "",
        field: "",
        minWidth: 30,
        width: 30,
        checkboxSelection: true,
        headerCheckboxSelection: false,
        filter: false, //隐藏过滤条件
        suppressMenu: true, // 隐藏菜单
    })
    gridColDefs.value = list
}
/**
 * 获取api数据
 */
const initOptions = async () => {
    initColdefs()
    nextTick(() => {
        gridRef.value ? gridRef.value.HandleLoadData() : ''
    });
};

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
    initReportField()
})
</script>

<style scoped lang="scss">
.content {
    height: 60vh;
    display: flex;
    flex-direction: column;
}

.search {
    width: 500px;
    padding: 10px 0 0 10px;
    display: flex;
    align-items: center;

    span {
        margin-right: 10px;
    }
}

.exReportSelect {
    position: absolute;
    z-index: -999;
    width: 100%;
}

.tagBox {
    display: flex;
    height: 30px;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--el-border-color);
    cursor: pointer;
    width: 100%;

    .el-tag {
        margin-right: 5px;
        margin-bottom: 8px;
    }

    .left {
        flex-grow: 1;
        /* 左侧内容自适应宽度 */
        height: 100%;
        overflow: hidden;
        display: flex;
        padding: 2px 0 0 5px;
    }

    .right {
        width: 20px;
    }
}

.tagsBox {
    max-height: 80px;
    max-width: 820px;
    padding: 5px;

    .el-tag {
        margin-right: 5px;
    }
}

.AgTableSelect {
    height: 350px !important;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
}

.disabled {
    background: var(--el-disabled-bg-color) !important;
}
</style>
<style lang="scss">
.exReportSelectPopper {
    z-index: 99999 !important;

    .el-select-dropdown__header {
        padding-bottom: 0;
    }

    .el-select-dropdown__empty {
        display: none;
    }

    .el-select-dropdown__footer {
        border: none;
    }
}

.tagBox {
    .keyword-input {
        .el-input__wrapper {
            box-shadow: none !important;
            border: none;
        }
    }
}
</style>