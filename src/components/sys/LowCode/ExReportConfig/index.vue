<template>
    <el-dialog v-model="dialogTableVisible" :before-close="handleClose" title="导入配置" width="80%" draggable>
        <div class="content">
            <div class="search">
                <el-form :inline="true" ref="ruleFormRef" label-width="80">
                    <el-form-item label="数据API">
                        <el-input v-model="config.Dapi" style="width: 200px" placeholder="请输入表头API" />
                    </el-form-item>

                    <el-form-item label="表头API">
                        <el-input v-model="config.Hapi" style="width: 200px" placeholder="请输入表头API" />
                    </el-form-item>

                    <el-form-item label="查询参数">
                        <el-input v-model="config.params" style="width: 200px" placeholder="格式name='123'&age='123'" />
                    </el-form-item>

                    <el-form-item label="展示类型" v-if="setting">
                        <el-select v-model="config.showType" placeholder="请选择展示类型" style="width: 200px">
                            <el-option label="下拉框" value="select" />
                            <el-option label="弹窗" value="dialog" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="单选/多选" v-if="setting">
                        <el-select v-model="config.rowSelection" placeholder="请选择展示类型" style="width: 200px">
                            <el-option label="多选" value="multiple" />
                            <el-option label="单选" value="single" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="ex-btn">
                        <el-button type="primary" @click="handleReport">导入配置</el-button>
                    </el-form-item>

                </el-form>
            </div>
            <AgTable class="AgTable" ref="gridRef" gridKey="renderConfig/report" :paging="false"
                :gridColDefs="gridColDefs" :suppressRowClickSelection="true" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <div class="left"><el-button @click="handleDelete">删除数据</el-button></div>
                <div class="right">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import request from "@/utils/request";
import { mergeArrays } from "@/utils"

import { nextTick, onMounted } from "vue";
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''  // 设置默认值
    }
});

let config = ref({})

const { proxy } = getCurrentInstance();

const gridRef = ref(null)

let dialogTableVisible = ref(false);

const setting = ref(true)

const emit = defineEmits([
    'update:modelValue',
    'update:data'
]);
const reset = () => {
    config.value = {
        Dapi: '',
        params: '',
        Hapi: '',
        showType: 'select',
        table: [],
        rowSelection: 'single'
    }
}
// 字典表头数据
const gridColDefs = [
    {
        headerName: "字段",
        field: "field",
        editable: false,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "默认名称",
        field: "defaultName",
        editable: false,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "自定义名称",
        field: "label",
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "字典值",
        field: "code",
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "导出字段",
        field: "report",
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "表头显示",
        field: "isShow",
        minWidth: 90,
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    // {
    //     headerName: "参与查询",
    //     field: "isSearch",
    //     minWidth: 90,
    //     editable: true,
    //     cellEditor: "agCheckboxCellEditor",
    // },
    {
        headerName: "回显字段",
        field: "echo",
        minWidth: 90,
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
];

gridColDefs.map((ele) => {
    ele.filter = false;
    ele.suppressMenu = true;
});
let Gdata = {
    field: "",
    defaultName: "",
    label: "",
    code: "",
    sequence: '',
    report: '',
    isShow: false,
    isSearch: false,
    echo: false
}
const handleReport = () => {
    request({
        url: config.value.Hapi,
        method: "post",
    }).then(res => {
        let data = res.data || [];
        let list = data.map(ele => {
            return ({
                ...Gdata,
                ...ele,
            })
        })

        config.value.table = mergeArrays(list, config.value.table, 'field')
        gridRef.value.HandleSetData(config.value.table)
    })
}
const handleClose = () => {
    dialogTableVisible.value = false;
};

// 开启弹窗,初始化内容
const handleOpen = (config,set=true) => {
    setting.value = set
    dialogTableVisible.value = true;
    setValue(config)
};
// 提交值
const handleSubmit = () => {
    getValue()
    handleClose()
};
/*  获取选中行数据 */
const getValue = () => {
    config.value.table = gridRef.value.HandleGetData()
    emit("update:modelValue", config.value)
    emit("update:data", config.value)
    handleClose()
};
/*  设置选中行数据 */
const setValue = (data = null) => {
    data ? config.value = data : reset()
    nextTick(() => {
        gridRef.value.HandleSetData(config.value.table)
    })
};
/**
 * 
 * @param id 
 */
const handleDelete = (id) => {
    emit("update:modelValue", null)
    emit("update:data", null)
    handleClose()
}
defineExpose({
    handleOpen
});
onMounted(() => {
    reset()
})
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

.search {
    display: flex;
    padding: 10px;
}
</style>