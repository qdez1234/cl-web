<template>
    <div :class="['tagBox', !editable ? 'disabled' : '']" @click="handleOpen">
        <div class="left">
            <el-tag v-for="(tag, index) in tags" @close="handleDel(tag)" :key="index" closable>
                {{ echoText(tag) }}
            </el-tag>
        </div>
        <div class="right">
            <el-icon class="icon-arrow">
                <ArrowDownBold />
            </el-icon>
        </div>

    </div>

    <el-dialog id="CustomDialogReport" v-model="dialogVisible" :append-to-body="true" draggable title="数据导入"
        :close-on-click-modal="false" width="80%">
        <div class="content">
            <div class="search">
                <ex-search-box v-model:queryParams='queryParams' :filter="false" :qiuckOptions='qiuckOptions'
                    @search="getList" />
            </div>
            <div class="tagsBox">
                <el-tag v-for="(tag, index) in tagsBefore" @close="handleDelBefore(tag)" :key="index" closable>
                    {{ echoText(tag) }}
                </el-tag>
            </div>
            <AgTable class="AgTable" :grildParams="queryParams" :grildFixedParams="fixedParams" ref="gridRef"
                :rowSelection="props.rowSelection" :paging="true" :gridColDefs="gridColDefs"
                :suppressRowClickSelection="true" :gridKey="route.path + 'exReportDialog'" :grildUrl="dataApi"
                @handleChange="setValue" @handleRowSelect="handleRowSelect" />
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

const props = defineProps({
    params: {
        type: Object,
    },
    rowSelection: {
        type: String,
        default: "single"
    },
    // 是否是表单渲染
    isForm: {
        type: Boolean,
        default: false
    },
    // 是否审核
    isAudited: {
        type: String || Number,
        default: 0
    },

});

let { dataApi, data, formParams, searchParams } = props.params.source

let {editable} = props.params.colDef
// --------------------------数据层次的结构------------------------------
//回显字段数组
let echoFiled = data.filter(ele => ele.echo).map(ele => ele.field)

// 主键字段
let sqlFiled = data.filter(ele => ele.sql).map(ele => ele.field)

let mainFiled = sqlFiled[0]   //默认显示第一个,回显字段

let mainReportFiled = data.filter(ele => ele.sql).map(ele => ele.report)[0]  //主键导出字段

// 导出字段
let reportFiled = data.filter(ele => ele.report).map(ele => {
    return {
        reportField: ele.report,    //导出字段
        currentField: ele.field    //当前字段
    }
})

let formData = ref(props.params.data)  //默认数据
reportFiled.forEach((ele) => {
    formData.value[ele.currentField] = formData.value[ele.reportField]
})
// --------------------------数据层次的结构结束------------------------------


const emit = defineEmits(['handleReport', 'update:modelValue']);

let queryParams = ref({})

let fixedParams = ref({})

const gridRef = ref(null);

const route = useRoute();

const dialogVisible = ref(false)

let tags = ref([])
if(Object.keys(formData.value).length === 0) tags = ref([])
if(formData.value[mainReportFiled] && formData.value[mainReportFiled]!="") tags = ref([formData.value])
//弹窗选择框标签
let tagsBefore = ref([])
onMounted(() => {
    handleFixedParams()
})
//处理固定参数
const handleFixedParams = () => {
    let pm = props.isForm ? formParams : searchParams
    const params = new URLSearchParams(pm);
    params.forEach((value, key) => {
        fixedParams.value[key] = value ? value : null; // 将空字符串转换为 null
    });
}
// 查询列表
let qiuckOptions = data
    .filter((ele) => ele.isSearch)
    .sort((a, b) => a.sequence - b.sequence); // 升序排序：年龄从小到大

// 自定义方法: 获取单元格渲染器
const getCellRenderer = (ele) => {
    if (ele.dictionary && ele.dictionary != "") {
        return 'CustomDict'
    }
    return null;
}
// 自定义方法: 获取单元格渲染器参数
const getCellRendererParams = (ele) => {
    if (ele.dictionary && ele.dictionary != "") {  // 字典
        return { dict_key: ele.dictionary };
    }
    return null;
}

// 渲染的字段
let gridColDefs = data.filter((ele) => ele.isShow).sort((a, b) => a.sequence - b.sequence).map((ele) => {
    return {
        headerName: ele.customName || ele.defaultName,
        field: ele.field,
        editable: false,
        cellEditor: 'agTextCellEditor',
        cellRenderer: getCellRenderer(ele),
        cellRendererParams: getCellRendererParams(ele),
    };
})

gridColDefs.unshift({
    headerName: "",
    field: "",
    minWidth: 30,
    width: 30,
    checkboxSelection: true,
    headerCheckboxSelection: false,
    filter: false, //隐藏过滤条件
    suppressMenu: true, // 隐藏菜单
})

/** aggrid初始化获取数据 */
const getList = () => {
    nextTick(() => {
        gridRef.value.gridLoadData();
    });
};

/** 根据回显字段回显本文 */
const echoText = (row) => {
    return echoFiled.map(ele => row[ele]).join(',')
}

/** 根据导出字段返回导出值 */
const echoReport = () => {
    const { data, colDef } = props.params;
    // 使用reduce来创建一个包含指定字段的对象
    reportFiled.map((ele) => {
        formData.value[ele.reportField] = tags.value[0] ? tags.value[0][ele.currentField] : null
    })
    props.params.node.setData(formData.value)
}
/** 开启弹窗 */
const handleOpen = () => {
    if (!editable) return
    tagsBefore.value = [...tags.value]
    dialogVisible.value = true
    setValue()
}
/** 关闭弹窗 */
const handleClose = () => {
    dialogVisible.value = false
}
/** 确定选中 */
const handleSubmit = () => {
    tags.value = [...tagsBefore.value]
    echoReport()
    handleClose()
}

/** 选中事件触发 */
const handleRowSelect = (rows) => {
    if (rows.isSelected && props.rowSelection == 'single') tagsBefore.value[0] = rows.rowData
    else tagsBefore.value = tagsBefore.value.filter(ele => ele[mainFiled] != rows.rowData[mainFiled])
}
/** 选择框弹出删除 */
const handleDelBefore = (tag) => {
    gridRef.value.HandleGridApi().forEachNode((node) => {
        let isSelect = node.data[mainFiled] == tag[mainFiled]
        if (isSelect) node.setSelected(false);
    });
    tagsBefore.value = tagsBefore.value.filter(ele => ele[mainFiled] != tag[mainFiled])
}
/** label展示回显，删除 */
const handleDel = (tag) => {
    if (!editable) return
    tags.value = tags.value.filter(ele => ele[mainFiled] != tag[mainFiled])
    echoReport()
}

/*  根据tagsBefore回显选中数据 */
const setValue = () => {
    setTimeout(() => {
        gridRef.value.HandleGridApi().forEachNode((node) => {
            let isSelect = tagsBefore.value.find(ele => ele[mainFiled] == node.data[mainFiled])
            if (isSelect) node.setSelected(true);
            else node.setSelected(false);
        });
    }, 100)
};

defineExpose({
    setValue,
});
</script>

<style scoped lang="scss">
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

.disabled {
    background: var(--el-disabled-bg-color) !important;
}
</style>
<style lang="scss">
#CustomDialogReport {
    .content {
        height: 60vh;
        display: flex;
        flex-direction: column;
    }

    .search {
        margin-top: 10px;

        .form-inline {
            display: flex;
        }
    }

    .tagsBox {
        max-height: 80px;
        overflow-y: auto;
        padding-bottom: 10px;

        .el-tag {
            margin-right: 5px;
        }
    }
}
</style>