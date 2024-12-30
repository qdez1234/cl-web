<template>
    <div :class="['tagBox', getDisabled() ? 'disabled' : '']" id="CustomDialogTag" @click="handleOpen">
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
    <el-dialog id="CustomDialogReport" v-model="dialogVisible" draggable title="数据查询" :close-on-click-modal="false"
        :append-to-body="true" width="80%">
        <div class="content">
            <div class="search">
                <span>关键字</span>
                <el-input class="keyword-input" v-model="keyword" @input="HandelQuery" placeholder="请输入关键字查询"
                    style="width: 380px;"></el-input>
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
import { parseQueryString } from "../../config"

const props = defineProps({
    params: {
        default: () => ({})  // 使用函数返回默认对象
    },
    modelValue: {
        type: [String, Number],
        default: ''  // 设置默认值
    },
});
watch(() => props.params, () => {
    HandleInit()
}, { deep: true })
const emit = defineEmits(['update:report', 'update:methods'])
const route = useRoute();
const dialogVisible = ref(false)
const gridRef = ref(null)

let {editable,isReadonly} = props.params.colDef

let tagsBefore = ref([])

let queryParams = ref({})

let Dapi = ref("")

let fixedParams = ref({})

let rowSelection = ref("single")

let gridColDefs = ref([])

let tags = ref([])

let reportMap = ref([])

let tableConfig = ref([])

let keyword = ref("")

/**
 * 获取编辑状态
 */
const getDisabled = ()=>{
    return  isReadonly || props.params.context.componentParent.HandleGetPageDisabled();
}
/** 开启弹窗 */
const handleOpen = () => {
    if (getDisabled()) return
    tagsBefore.value = [...tags.value]
    dialogVisible.value = true
    setValue()
}
/** 关闭弹窗 */
const handleClose = () => {
    dialogVisible.value = false
}

/**
* 初始化
*/
const HandleInit = () => {

    Dapi.value = props.params.source?.Dapi

    tableConfig.value = props.params.source?.table || []

    fixedParams.value = parseQueryString(props.params.source?.params)

    initOptions()

    initReportField()
}
/**
 * 关键字搜索
 */
 const HandelQuery = () => {
     gridRef.value.HandleQueryData({_keyword:keyword.value})
}
/**
 * 导出字段映射,并且默认字段赋值
 */
const initReportField = () => {
    reportMap.value = tableConfig.value
        .filter(ele => ele.report)
        .map(ele => ({
            key: ele.field,
            report: ele.report
        }));
    let obj = {}
    reportMap.value.forEach(ele => {
        obj[ele.key] = props.params.data[ele.report]
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
    if (getDisabled()) return
    tags.value = tags.value.filter(ele => ele != tag)
    handleReport()
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
    handleReport()
    handleClose()
}

/**
 * 根据导出字段导出数据
 */
const handleReport = () => {
    // 合并所有项到一个对象，相同的键用字符串连接，长度为0时导出null
    let mergedResult = null
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
    props.params.node.setData(Object.assign(props.params.data, mergedResult))
};
/** 选中事件触发 */
const handleRowSelect = (rows) => {
    if (rows.isSelected && rowSelection.value == 'single') tagsBefore.value[0] = rows.rowData
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
        // gridRef.value ? gridRef.value.HandleLoadData() : ''
    });
};

onMounted(() => {
    HandleInit()
})
</script>

<style scoped lang="scss">
.AgTable {
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
#CustomDialogReport {
    .content {
        height: 60vh;
        display: flex;
        flex-direction: column;
    }

    .search {
        width: 500px;
        padding: 10px 0 6px 10px;
        display: flex;
        align-items: center;

        span {
            margin-right: 10px;
        }
    }
}

#CustomDialogTag {
    display: flex;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    width: 100%;



    .el-tag {
        margin-right: 5px;
        margin-bottom: 0;
    }

    .left {
        flex-grow: 1;
        /* 左侧内容自适应宽度 */
        height: 100%;
        overflow: hidden;
        display: flex;
        padding: 2px 0 0 5px;
        align-items: center;
    }

    .right {
        width: 20px;
    }
}
</style>