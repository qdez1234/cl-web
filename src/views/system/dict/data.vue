<template>
  <div class="ex-page-container">
    <div class="container-left">
    </div>
    <div class="container-right">
      <div class="ex-search">
        <el-form :model="queryParams" ref="queryForm" label-width="80px">
          <el-row :gutter="20" class="ex-form-row">
            <el-col :md="6">
              <el-form-item label="字典名称" prop="dictType">
                <el-select v-model="queryParams.dictType" style="width: 100%" @change="handleQuery">
                  <el-option v-for="item in typeOptions" :key="item.dictId" :label="item.dictName"
                    :value="item.dictType" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="字典标签" prop="dictLabel">
                <el-input v-model="queryParams.dictLabel" placeholder="请输入字典标签" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="数据状态" clearable style="width: 100%"
                  @change="handleQuery">
                  <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="4">
              <el-button class="filter-item" type="primary" @click="handleQuery">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="ex-search">
        <el-form :model="queryParams" ref="queryForm" label-width="80px">
          <el-row :gutter="20" class="ex-form-row">
            <el-col :md="20">
              <el-button class="filter-item" v-hasPermi="['system:dict:add']" type="primary" icon="Plus"
                @click="handleAdd">新增</el-button>
              <el-button class="filter-item" v-hasPermi="['system:dict:remove']" type="primary" icon="Delete"
                @click="handleBatchDelete">删除</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="ex-table-page-body">
        <AgTable class="AgTable" ref="gridRef" @HandleCellClick="HandleCellClick" :paging="true"
          :gridColDefs="gridColDefs" gridMethdos="get" :gridActions="gridActions" :gridKey="route.path + 'list'"
          :grildUrl="gridAPI" gridRowKey="dictCode" rowSelection="multiple" :suppressRowClickSelection="true" />
      </div>
    </div>


    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="720px" append-to-body>
      <div class="dialog_box">
        <el-form ref="dataRef" :model="form" :rules="rules" label-position="top">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="字典类型">
                <el-input v-model="form.dictType" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据标签" prop="dictLabel">
                <el-input v-model="form.dictLabel" placeholder="请输入数据标签" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据键值" prop="dictValue">
                <el-input v-model="form.dictValue" placeholder="请输入数据键值" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="样式属性" prop="cssClass">
                <el-input v-model="form.cssClass" placeholder="请输入样式属性" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示排序" prop="dictSort">
                <el-input-number v-model="form.dictSort" style="width: 100%;" controls-position="right" :step="10"
                  :min="10" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回显样式" prop="listClass">
                <el-select v-model="form.listClass" style="width: 100%">
                  <el-option v-for="item in listClassOptions" :key="item.value"
                    :label="item.label + '(' + item.value + ')'" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio-button v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{
                    dict.label
                  }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Data">
import useDictStore from '@/store/modules/dict'
import { optionselect as getDictOptionselect, getType } from "@/api/system/dict/type";
import { listData, getData, delData, addData, updateData } from "@/api/system/dict/data";

const { proxy } = getCurrentInstance();

const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const gridRef = ref(null)

const gridAPI = ref("/system/dict/data/list")

const gridActions = ref([])

const router = useRouter();

const gridColDefs = ref([
  {
    minWidth: 50,
    filter: false,
    editable: false,
    checkboxSelection: true,
    suppressMenu: true, // 隐藏菜单
    headerCheckboxSelection: true,
  },
  {
    headerName: "序号",
    isReadonly: true,
    isShow: true,
    valueGetter: (params) => {
      return params.node.rowIndex + 1
    },
    filter: false, // 隐藏过滤条件
    suppressMenu: true, // 隐藏菜单
    minWidth: 70
  },
  {
    headerName: "字典编码",
    field: "dictCode",
    tooltipField: "dictCode",
  },
  {
    headerName: "字典排序",
    field: "dictSort",
    tooltipField: "dictSort",
  },
  {
    headerName: "数据标签",
    field: "dictLabel",
    tooltipField: "dictLabel",
  },
  {
    headerName: "状态",
    field: "status",
    tooltipField: "status",
    cellRenderer: "CustomDict",
    cellRendererParams: {
      "dict_key": "sys_normal_disable"
    },
  },
  {
    headerName: "备注",
    field: "remark",
    tooltipField: "remark",
  },
  {
    headerName: "创建时间",
    field: "createTime",
    tooltipField: "createTime",
  },
  {
    headerName: "操作",
    pinned: "right",
    isShow: true,
    filter: false,
    suppressMenu: true,
    cellRendererParams: {
      buttonConfig: [
        {
          label: "修改",
          type: "primary",
          authentication: "system:dict:edit",
          fun: 1,
        },
        {
          label: "删除",
          type: "danger",
          fun: 2,
          authentication: "system:dict:remove",
        },
      ]
    },
    cellRenderer: "ActionButtons",
    width: 300
  }
])
const HandleCellClick = (fun, row) => {
  let { data } = row
  if (fun == 1) {
    handleUpdate(data)
  }
  if (fun == 2) {
    handleDelete(data)
  }
}

const dataList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const defaultDictType = ref("");
const typeOptions = ref([]);
const route = useRoute();
// 数据标签回显样式
const listClassOptions = ref([
  { value: "default", label: "默认" },
  { value: "primary", label: "主要" },
  { value: "success", label: "成功" },
  { value: "info", label: "信息" },
  { value: "warning", label: "警告" },
  { value: "danger", label: "危险" }
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    dictName: undefined,
    dictType: undefined,
    status: undefined
  },
  rules: {
    dictLabel: [{ required: true, message: "数据标签不能为空", trigger: "blur" }],
    dictValue: [{ required: true, message: "数据键值不能为空", trigger: "blur" }],
    dictSort: [{ required: true, message: "数据顺序不能为空", trigger: "blur" }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 隐藏搜索按钮操作 */
watch(showSearch, (value) => {
  let oldHeight = proxy.$refs.queryRef.$el.offsetHeight
  if (value) {
    oldHeight = oldHeight - 12
  } else {
    oldHeight = oldHeight + 12
  }
})

/** 查询字典类型详细 */
function getTypes(dictId) {
  getType(dictId).then(response => {
    queryParams.value.dictType = response.data.dictType;
    defaultDictType.value = response.data.dictType;
    getList();
  });
}

/** 查询字典类型列表 */
function getTypeList() {
  getDictOptionselect().then(response => {
    typeOptions.value = response.data;
  });
}
/** 查询字典数据列表 */
function getList() {
  gridRef.value.HandleQueryData(queryParams.value)
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    dictCode: undefined,
    dictLabel: undefined,
    dictValue: undefined,
    cssClass: undefined,
    listClass: "default",
    dictSort: 0,
    status: "1",
    remark: undefined
  };
  proxy.resetForm("dataRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 返回按钮操作 */
function handleClose() {
  const obj = { path: "/system/dict" };
  proxy.$tab.closeOpenPage(obj);
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.dictType = defaultDictType;
  handleQuery();
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加字典数据";
  form.value.dictType = queryParams.value.dictType;
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const dictCode = row.dictCode 
  getData(dictCode).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改字典数据";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["dataRef"].validate(valid => {
    if (valid) {
      if (form.value.dictCode != undefined) {
        updateData(form.value).then(response => {
          useDictStore().removeDict(queryParams.value.dictType);
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addData(form.value).then(response => {
          useDictStore().removeDict(queryParams.value.dictType);
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
function handleBatchDelete() {
  let ids = gridRef.value.HandleGetSelectRow().map(ele => ele.dictCode)
  handleDelete({}, ids.join(','))
}
/** 删除按钮操作 */
function handleDelete(row,ids) {
  const dictCodes = row.dictCode || ids;
  proxy.$modal.confirm('是否确认删除字典编码为"' + dictCodes + '"的数据项？').then(function () {
    return delData(dictCodes);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
    useDictStore().removeDict(queryParams.value.dictType);
  }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/dict/data/export", {
    ...queryParams.value
  }, `dict_data_${new Date().getTime()}.xlsx`);
}

getTypes(route.params && route.params.dictId);
getTypeList();
</script>
