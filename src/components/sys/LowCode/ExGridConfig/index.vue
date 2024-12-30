<template>
    <el-dialog v-model="dialogTableVisible" :before-close="handleClose" title="导入配置" width="80%" draggable>
        <div class="ex-action">
            <div class="ex-action-box-left">
                <el-form label-width="auto" :inline="true">
                    <el-form-item label="导入数据">
                        <el-select placeholder="选择业务模型表" v-model="selectModel" @change="handleChange">
                            <template v-for="(item, index) in businessModelList" :key="index">
                                <el-option :label="item.label" :value="item.value" />
                            </template>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="单选/多选">
                        <el-select v-model="selectRowSelection" placeholder="请选择展示类型" style="width: 200px">
                            <el-option label="多选" value="multiple" />
                            <el-option label="单选" value="single" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="开启分组">
                        <el-switch v-model="selectIsGroup" />
                    </el-form-item>

                </el-form>
            </div>
            <div class="ex-action-box-right">
                <el-button circle :icon="Plus" @click="handleAddRow"></el-button>
                <el-popover :visible="visible" placement="top" :width="152">
                    <p>确定要删除选中数据</p>
                    <div style="margin-top: 10px">
                        <el-button @click="visible = false" size="small">取消</el-button>
                        <el-button size="small" type="danger" @click="handleDeleteRow">确定</el-button>
                    </div>
                    <template #reference>
                        <el-button circle :icon="Minus" @click="visible = true"></el-button>
                    </template>
                </el-popover>
            </div>
        </div>
        <div class="ex-table-page-body">
            <AgTable class="AgTable" ref="gridRef" :gridColDefs="gridColDefs" :suppressRowClickSelection="false"
                :paging="false" :gridKey="route.path" @handleCellSelect="handleCellSelect"
                @HandleLinkTextClick="HandleLinkTextClick" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <div class="left"></div>
                <div class="right">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
    <ExDictConfig ref="ExDictConfigRef" @update:data="handleSetData" />
    <ExReportConfig ref="ExReportConfigRef" @update:data="handleSetData" />
</template>


<script setup>
import { getModel } from "@/api/system/config";
import ExDictConfig from '@/components/sys/LowCode//ExDictConfig/index.vue'
import ExReportConfig from '@/components/sys/LowCode/ExReportConfig/index.vue'
import { ElMessage } from "element-plus";
import { Plus, Minus, Check, Grid } from "@element-plus/icons-vue";
import { nextTick, onMounted } from "vue";
const selectModel = ref(null)
let selectRowSelection = ref("single")
let selectIsGroup = ref(false)
const route = useRoute();
const gridRef = ref(null);
const ExDictConfigRef = ref(null);
const ExReportConfigRef = ref(null);
let dialogTableVisible = ref(false);
const businessModelList = ref([])

const emit = defineEmits([
    "update:data",
]);

const visible = ref(false);

const gridColDefs = [
    {
        headerName: "字段",
        field: "field",
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "名称",
        field: "headerName",
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "小数数位",
        editable: true,
        field: "decimals",
        cellEditor: "agNumberCellEditor",
    },
    {
        headerName: "默认值",
        field: "defaultValue",
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "表达式",
        field: "expression",
        editable: true,
        cellEditor: "agLargeTextCellEditor", // 使用内置的多行文本编辑器
        cellEditorParams: {
            maxLength: 500, // 最大输入字符数
            rows: 6,        // 显示的行数
            cols: 50        // 显示的列宽
        }
    },
    {
        headerName: "表头显示",
        field: "isShow",
        minWidth: 90,
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "是否只读",
        field: "isReadonly",
        minWidth: 90,
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "是否不能为空",
        field: "isEmpty",
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "是否分组字段",
        field: "isGroup",
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "是否复制字段",
        field: "isCopy",
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "控件类型",
        field: "dataType",
        minWidth: 180,
        cellRenderer: "CustomSelectEditor",
        cellRendererParams: {
            options: [
                { value: 1, label: '本文' },
                { value: 2, label: '数字' },
                { value: 3, label: '日期' },
                { value: 4, label: '布尔' }
            ],
        },
    },
    {
        headerName: "字典",
        field: "dictionary",
        minWidth: 180,
        cellRenderer: "CustomLinkText",
        cellRendererParams: (params) => ({
            text: params.data.dictionary ? truncateString(params.data.dictionary) : "配置",
            type: params.data.linkType,
        }),
    },
    {
        headerName: "导入",
        field: "report",
        minWidth: 180,
        cellRenderer: "CustomLinkText",
        cellRendererParams: (params) => ({
            text: params.data.report ? truncateString(params.data.report) : "配置",
            type: params.data.linkType,
        }),
    },
];

gridColDefs.map((ele) => {
    ele.filter = false;
    ele.suppressMenu = true;
    ele.minWidth ? "" : (ele.minWidth = 100);
});

const truncateString = (str) => {
    return str.length > 30 ? str.slice(0, 30) + '...' : str;
}

// 关闭弹窗,初始化内容
const handleClose = () => {
    dialogTableVisible.value = false;
};

// 开启弹窗,初始化内容
const handleOpen = (config) => {
    let { data, model, rowSelection, isGroup } = config
    dialogTableVisible.value = true;
    selectModel.value = model
    selectRowSelection.value = rowSelection
    selectIsGroup.value = isGroup
    let datas = replenishment(data)
    nextTick(() => {
        gridRef.value.HandleSetData(datas)
    })
};
/**
 * 字段默认值新增
 */
const replenishment = (data) => {
     data.forEach((ele) => {
        ele.isGroup ? '' : ele.isGroup = false
    })
    return data

}
/** aggrid新增一行 */
const handleAddRow = () => {
    gridRef.value.HandleAddRowAndSelect();
};
/** aggrid删除一行 */
const handleDeleteRow = () => {
    gridRef.value.HandleDeleteSelectRows();
    visible.value = false;
};

let rows = {};

/** 数据导入配置 */
const HandleLinkTextClick = (field, row, index) => {
    let data = row[field]
    if (field == 'dictionary') ExDictConfigRef.value.handleOpen(data)
    if (field == 'report') ExReportConfigRef.value.handleOpen(data, false)
    rows = { field, row, index };
};

//数据来源设置行数据
const handleSetData = (data) => {
    const gridApi = gridRef.value.HandleGridApi();
    const rowNode = gridApi.getDisplayedRowAtIndex(rows.index);
    rows.row[rows.field] = data
    rowNode.setData(rows.row);
};
// 表格提交
const handleSubmit = () => {
    let group = getData().find(ele=>ele.isGroup)
    let isGroupParams = group ? {headerName:group.headerName,field:group.field} : {}
    emit('update:data', { model: selectModel.value, data: getData(), rowSelection: selectRowSelection.value, isGroup: selectIsGroup.value,isGroupParams:isGroupParams})
    handleClose()
};
// 获取全部数据
const getData = () => {
    let list = gridRef.value.HandleGetData()
    list.forEach(ele => {
        ele.editable = !ele.isReadonly
    })
    return list;
}
// 递归扁平化函数
function flattenTree(node, result = []) {
    // 提取当前节点的 name 和 list 字段
    result.push({ list: node.fields || [], label: node.entityName || '未命名', value: node.id });
    // 如果有子节点，则递归调用该函数
    if (node.children && node.children.length > 0) {
        node.children.forEach(childNode => flattenTree(childNode, result));
    }
    return result; // 返回扁平化的数组
}
/**
 * 初始化获取模型配置数据
 */
const handleInit = () => {
    if (!route.query.businessModelCode) return
    getModel(route.query.businessModelCode).then(res => {
        businessModelList.value = flattenTree(res.data.entity)
    })
};

const handleChange = (value) => {
    let list = businessModelList.value.find(ele => ele.value == value).list
    let data = list.map(ele => {
        return {
            headerName: ele.defaultName,
            field: ele.javaField,
            decimals: null,
            defaultValue: null,
            isShow: true,
            isReadonly: false,
            isEmpty: false,
            isCopy: false,
            dictionary: null,
            report: null
        }
    })
    gridRef.value.HandleSetData(data)

}
onMounted(() => {
    handleInit()
})
defineExpose({
    getData,
    handleOpen
})
</script>

<style scoped lang="scss">
.ex-table-page-body {
    height: 60vh;
}

.el-form-item {
    margin-bottom: 0;
}

.ex-action {
    padding-left: 10px;
    padding-right: 10px;
}
</style>
