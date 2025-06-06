<template>

  <div class="ex-page-container">
    <div class="container-left">
    </div>
    <div class="container-right">
      <div class="ex-search">
        <el-form :model="queryParams" ref="queryForm" label-width="80px">
          <el-row :gutter="20" class="ex-form-row">
            <el-col :md="6">
              <el-form-item label="字典名称" prop="dictName">
                <el-input v-model="queryParams.dictName" placeholder="请输入字典名称" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="字典类型" prop="dictType">
                <el-input v-model="queryParams.dictType" placeholder="请输入字典类型" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="字典状态" clearable style="width: 100%"
                  @change="handleQuery">
                  <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item label="创建时间">
                <el-date-picker style="width: 100%" v-model="dateRange" value-format="YYYY-MM-DD" type="daterange"
                  range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
              <el-button class="filter-item" v-hasPermi="['system:dict:remove']" type="danger" icon="Delete"
                @click="handleBatchDelete">删除</el-button>
              <el-button class="filter-item" v-hasPermi="['system:dict:remove']" type="info" icon="Refresh"
                @click="handleRefreshCache">刷新缓存</el-button>
              <el-button class="filter-item" v-hasPermi="['system:dict:export']" icon="Download"
                @click="handleExport">导出</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="ex-table-page-body">
        <AgTable class="AgTable" ref="gridRef" @HandleCellClick="HandleCellClick" :paging="true"
          :gridColDefs="gridColDefs" gridMethdos="get" :gridActions="gridActions" :gridKey="route.path + 'list'"
          :grildUrl="gridAPI" gridRowKey="dictId" rowSelection="multiple" :suppressRowClickSelection="true" />
      </div>
    </div>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="520px" append-to-body>
      <div class="dialog_box">
        <el-form ref="dictRef" :model="form" :rules="rules" label-position="top">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="字典名称" prop="dictName">
                <el-input v-model="form.dictName" placeholder="请输入字典名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="字典类型" prop="dictType">
                <el-input v-model="form.dictType" placeholder="请输入字典类型" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
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

<script setup name="Dict">
import useDictStore from '@/store/modules/dict'
import { listType, getType, delType, addType, updateType, refreshCache } from "@/api/system/dict/type";

const { proxy } = getCurrentInstance();

const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const gridRef = ref(null)

const gridAPI = ref("/system/dict/type/list")

const gridActions = ref([])

const route = useRoute();
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
    headerName: "字典编号",
    field: "dictName",
    tooltipField: "dictName",
  },
  {
    headerName: "字典名称",
    field: "userName",
    tooltipField: "userName",
  },
  {
    headerName: "字典类型",
    field: "dictType",
    tooltipField: "dictType",
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
        {
          label: "编辑字典值",
          type: "primary",
          fun: 3,
          authentication: "system:dict:edit",
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
  if (fun == 3) {
    handleEditDictValue(data)
  }
}

const advanced = ref(false);
const typeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);

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
    dictName: [{ required: true, message: "字典名称不能为空", trigger: "blur" }],
    dictType: [{ required: true, message: "字典类型不能为空", trigger: "blur" }]
  },
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

/** 查询字典类型列表 */
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
    dictId: undefined,
    dictName: undefined,
    dictType: undefined,
    status: "1",
    remark: undefined
  };
  proxy.resetForm("dictRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryForm");
  handleQuery();
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加字典类型";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const dictId = row.dictId
  getType(dictId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改字典类型";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["dictRef"].validate(valid => {
    if (valid) {
      if (form.value.dictId != undefined) {
        updateType(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addType(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
function handleBatchDelete() {
  let ids = gridRef.value.HandleGetSelectRow().map(ele => ele.dictId)
  handleDelete({}, ids.join(','))
}
/** 删除按钮操作 */
function handleDelete(row, ids) {
  const dictIds = row.dictId || ids;
  proxy.$modal.confirm('是否确认删除字典编号为"' + dictIds + '"的数据项？').then(function () {
    return delType(dictIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/dict/type/export", {
    ...queryParams.value
  }, `dict_${new Date().getTime()}.xlsx`);
}
/** 刷新缓存按钮操作 */
function handleRefreshCache() {
  refreshCache().then(() => {
    proxy.$modal.msgSuccess("刷新成功");
    useDictStore().cleanDict();
  });
}
/**
 * 设置字典值
 */
const handleEditDictValue = (data) => {
  router.push({ path: `/system/dict-data/index/${data.dictId}` })
}

</script>
