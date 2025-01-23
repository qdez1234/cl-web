<template>
   <div class="ex-page-container">
      <div class="container-left">
      </div>
      <div class="container-right">
         <div class="ex-search">
            <el-form :model="queryParams" ref="queryForm" label-width="80px">
               <el-row :gutter="20" class="ex-form-row">
                  <el-col :md="6">
                     <el-form-item label="操作地址" prop="operIp">
                        <el-input v-model="queryParams.operIp" placeholder="请输入操作地址" clearable 
                           @keyup.enter="handleQuery" />
                     </el-form-item>
                  </el-col>
                  <el-col :md="6">
                     <el-form-item label="系统模块" prop="title">
                        <el-input v-model="queryParams.title" placeholder="请输入系统模块" clearable 
                           @keyup.enter="handleQuery" />
                     </el-form-item>
                  </el-col>
                  <el-col :md="6">
                     <el-form-item label="操作人员" prop="operName">
                        <el-input v-model="queryParams.operName" placeholder="请输入操作人员" clearable 
                           @keyup.enter="handleQuery" />
                     </el-form-item>
                  </el-col>
                  <el-col :md="6">
                     <el-form-item label="类型" prop="businessType">
                        <el-select v-model="queryParams.businessType" placeholder="操作类型" clearable >
                           <el-option v-for="dict in sys_oper_type" :key="dict.value" :label="dict.label"
                              :value="dict.value" />
                        </el-select>
                     </el-form-item>
                  </el-col>
                  <el-col :md="6">
                     <el-form-item label="状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="操作状态" clearable >
                           <el-option v-for="dict in sys_common_status" :key="dict.value" :label="dict.label"
                              :value="dict.value" />
                        </el-select>
                     </el-form-item>
                  </el-col>
                  <el-col :md="6">
                     <el-form-item label="操作时间" >
                        <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
                           range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                           :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
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
                     <el-button class="filter-item" v-hasPermi="['monitor:operlog:add']" type="primary" icon="Delete"
                        @click="handleBatchDelete">删除</el-button>
                     <el-button class="filter-item" v-hasPermi="['monitor:operlog:add']" type="primary" icon="Delete"
                        @click="handleClean">清空</el-button>
                     <el-button class="filter-item" v-hasPermi="['monitor:operlog:add']" type="primary" icon="Download"
                        @click="handleExport">导出</el-button>
                  </el-col>
               </el-row>
            </el-form>
         </div>
         <div class="ex-table-page-body">
            <AgTable class="AgTable" ref="gridRef" @HandleCellClick="HandleCellClick" :paging="true"
               :gridColDefs="gridColDefs" gridMethdos="get" :gridActions="gridActions" :gridKey="route.path + 'list'"
               :grildUrl="gridAPI" gridRowKey="operId" rowSelection="multiple" :suppressRowClickSelection="true" />
         </div>
      </div>

      <!-- 操作日志详细 -->
      <el-dialog title="操作日志详细" v-model="open" width="800px" append-to-body>
         <el-form :model="form" label-width="100px">
            <el-row>
               <el-col :span="12">
                  <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
                  <el-form-item label="登录信息：">{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation
                     }}</el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
                  <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
               </el-col>
               <el-col :span="8">
                  <el-form-item label="操作状态：">
                     <div v-if="form.status === 0">正常</div>
                     <div v-else-if="form.status === 1">失败</div>
                  </el-form-item>
               </el-col>
               <el-col :span="8">
                  <el-form-item label="消耗时间：">{{ form.costTime }}毫秒</el-form-item>
               </el-col>
               <el-col :span="8">
                  <el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button @click="open = false">关 闭</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="Operlog">
import { list, delOperlog, cleanOperlog } from "@/api/monitor/operlog";

const { proxy } = getCurrentInstance();
const { sys_oper_type, sys_common_status } = proxy.useDict("sys_oper_type", "sys_common_status");

const gridRef = ref(null)

const gridAPI = ref("/monitor/operlog/list")

const gridActions = ref([])

const route = useRouter();

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
      headerName: "日志编号",
      field: "operId",
      tooltipField: "operId",
   },
   {
      headerName: "系统模块",
      field: "title",
      tooltipField: "title",
   },
   {
      headerName: "操作类型",
      field: "businessType",
      tooltipField: "status",
      cellRenderer: "CustomDict",
      cellRendererParams: {
         "dict_key": "sys_oper_type"
      },
   },
   {
      headerName: "操作人员",
      field: "operName",
      tooltipField: "operName",
   },
   {
      headerName: "操作地址",
      field: "operIp",
      tooltipField: "operIp",
   },
   {
      headerName: "操作状态",
      field: "status",
      tooltipField: "status",
      cellRenderer: "CustomDict",
      cellRendererParams: {
         "dict_key": "sys_common_status"
      },
   },
   {
      headerName: "操作日期",
      field: "operTime",
      tooltipField: "operTime",
   },
   {
      headerName: "消耗时间",
      field: "costTime",
      tooltipField: "costTime",
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
               label: "详细",
               type: "primary",
               authentication: "monitor:operlog:query",
               fun: 1,
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
      handleView(data)
   }
}





const operlogList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const defaultSort = ref({ prop: "operTime", order: "descending" });

const data = reactive({
   form: {},
   queryParams: {
      pageNum: 1,
      pageSize: 10,
      operIp: undefined,
      title: undefined,
      operName: undefined,
      businessType: undefined,
      status: undefined
   }
});

const { queryParams, form } = toRefs(data);

/** 查询角色列表 */
function getList() {
  gridRef.value.HandleQueryData(queryParams.value)
}

/** 操作日志类型字典翻译 */
function typeFormat(row, column) {
   return proxy.selectDictLabel(sys_oper_type.value, row.businessType);
}

/** 搜索按钮操作 */
function handleQuery() {
   queryParams.value.pageNum = 1;
   getList();
}

/** 重置按钮操作 */
function resetQuery() {
   dateRange.value = [];
   proxy.resetForm("queryRef");
   queryParams.value.pageNum = 1;
   proxy.$refs["operlogRef"].sort(defaultSort.value.prop, defaultSort.value.order);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.operId);
   multiple.value = !selection.length;
}

/** 排序触发事件 */
function handleSortChange(column, prop, order) {
   queryParams.value.orderByColumn = column.prop;
   queryParams.value.isAsc = column.order;
   getList();
}

/** 详细按钮操作 */
function handleView(row) {
   open.value = true;
   form.value = row;
}

function handleBatchDelete() {
  let ids = gridRef.value.HandleGetSelectRow().map(ele => ele.operId)
  handleDelete({}, ids.join(','))
}
/** 删除按钮操作 */
function handleDelete(row, ids) {
   const operIds = row.operId || ids;
   proxy.$modal.confirm('是否确认删除日志编号为"' + operIds + '"的数据项?').then(function () {
      return delOperlog(operIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}

/** 清空按钮操作 */
function handleClean() {
   proxy.$modal.confirm("是否确认清空所有操作日志数据项?").then(function () {
      return cleanOperlog();
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("清空成功");
   }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
   proxy.download("monitor/operlog/export", {
      ...queryParams.value,
   }, `config_${new Date().getTime()}.xlsx`);
}

</script>
