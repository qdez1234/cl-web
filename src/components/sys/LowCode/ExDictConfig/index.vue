<template>
    <el-dialog v-model="dialogTableVisible" :before-close="handleClose" title="字典配置" width="80%" draggable>
        <div class="content">
            <AgTable class="AgTable" ref="gridRef" :gridColDefs="gridColDefs" :paging="true"
                :gridKey="'renderConfig/dictionary'" :suppressRowClickSelection="true" :grildUrl="grildUrl" gridMethdos="get" />
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
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''  // 设置默认值
  }
});

const { proxy } = getCurrentInstance();

const gridRef = ref(null)

const grildUrl = ref("/system/dict/type/list");

let dialogTableVisible = ref(false);

const emit = defineEmits([
    'update:modelValue',
    'update:data'
]);

// 字典表头数据
const gridColDefs = [
    {
        headerName: "",
        field: "",
        minWidth: 30,
        width: 30,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        filter: false, //隐藏过滤条件
        suppressMenu: true, // 隐藏菜单
    },
    {
        headerName: "字典名称",
        field: "dictName",
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "字典类型",
        field: "dictType",
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "状态",
        field: "status",
        cellRenderer: "CustomDict",
        cellRendererParams: {
            dict_key: "sys_normal_disable",
        },
    },
    {
        headerName: "备注",
        field: "remark",
        cellEditor: "agTextCellEditor",
    },
];
gridColDefs.map((ele) => {
    ele.filter = false;
    ele.suppressMenu = true;
});

const handleClose = () => {
    dialogTableVisible.value = false;
};

// 开启弹窗,初始化内容
const handleOpen = (value) => {
    dialogTableVisible.value = true;
    setValue(value)
};
// 提交值
const handleSubmit = () => {
    getValue()
    handleClose()
};
/*  获取选中行数据 */
const getValue = () => {
    let codeVal = gridRef.value.HandleGridApi().getSelectedRows()[0]?.dictType || null;
    emit("update:modelValue", codeVal)
    emit("update:data", codeVal)
    handleClose()
};
/*  设置选中行数据 */
const setValue = (code) => {
    setTimeout(() => {
        gridRef.value.HandleGridApi().deselectAll();
        gridRef.value.HandleGridApi().forEachNode((node) => {
            if (code == node.data.dictType) node.setSelected(true);
        });
    }, 200)
};
defineExpose({
    handleOpen
});
</script>

<style scoped lang="scss">
.content {
    height: 60vh;
    display: flex;
    flex-direction: column;
}

.dialog-footer {
    display: flex;
    justify-content: space-between;
}
</style>