<template>
   <div class="ex-page-container">
      <div class="container-left">
      </div>
      <div class="container-right">
         <div class="ex-search">
            <el-form :model="queryParams" ref="queryForm" label-width="80px">
               <el-row :gutter="20" class="ex-form-row">
                  <el-col :md="6">
                     <el-form-item label="登录地址" prop="ipaddr">
                        <el-input v-model="queryParams.ipaddr" placeholder="请输入登录地址" clearable 
                           @keyup.enter="handleQuery" />
                     </el-form-item>
                  </el-col>
                  <el-col :md="6">
                     <el-form-item label="用户名称" prop="userName">
                        <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable 
                           @keyup.enter="handleQuery" />
                     </el-form-item>
                  </el-col>
                  <el-col :md="6">
                     <el-form-item label="状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="登录状态" clearable>
                           <el-option v-for="dict in sys_common_status" :key="dict.value" :label="dict.label"
                              :value="dict.value" />
                        </el-select>
                     </el-form-item>
                  </el-col>
                  <el-col :md="6">
                     <el-form-item label="登录时间">
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
                     <el-button class="filter-item" v-hasPermi="['monitor:logininfor:remove']" type="primary"
                        icon="Delete" @click="handleBatchDelete">删除</el-button>
                     <el-button class="filter-item" v-hasPermi="['monitor:logininfor:remove']" type="primary"
                        icon="Delete" @click="handleClean">清空</el-button>
                     <el-button class="filter-item" v-hasPermi="['monitor:logininfor:unlock']" type="primary"
                        icon="Unlock" @click="handleUnlock">解锁</el-button>
                     <el-button class="filter-item" v-hasPermi="['monitor:logininfor:export']" type="primary"
                        icon="Download" @click="handleExport">导出</el-button>
                  </el-col>
               </el-row>
            </el-form>
         </div>
         <div class="ex-table-page-body">
            <AgTable class="AgTable" ref="gridRef" @HandleCellClick="HandleCellClick" :paging="true"
               :gridColDefs="gridColDefs" gridMethdos="get" :gridActions="gridActions" :gridKey="route.path + 'list'"
               :grildUrl="gridAPI" gridRowKey="infoId" rowSelection="multiple" :suppressRowClickSelection="true" />
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

<script setup name="Logininfor">
import { list, delLogininfor, cleanLogininfor, unlockLogininfor } from "@/api/monitor/logininfor";

const { proxy } = getCurrentInstance();
const { sys_common_status } = proxy.useDict("sys_common_status");
const gridRef = ref(null)

const gridAPI = ref("/monitor/logininfor/list")

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
      headerName: "访问编号",
      field: "infoId",
      tooltipField: "infoId",
   },
   {
      headerName: "用户名称",
      field: "userName",
      tooltipField: "userName",
   },
   {
      headerName: "地址",
      field: "ipaddr",
      tooltipField: "ipaddr",
   },
   {
      headerName: "登录地点",
      field: "loginLocation",
      tooltipField: "loginLocation",
   },
   {
      headerName: "操作系统",
      field: "os",
      tooltipField: "os",
   },
   {
      headerName: "浏览器",
      field: "browser",
      tooltipField: "browser",
   },
   {
      headerName: "登录状态",
      field: "status",
      tooltipField: "status",
      cellRenderer: "CustomDict",
      cellRendererParams: {
         "dict_key": "sys_common_status"
      },
   },
   {
      headerName: "描述",
      field: "msg",
      tooltipField: "msg",
   },
   {
      headerName: "访问时间",
      field: "loginTime",
      tooltipField: "loginTime",
   },
])
const HandleCellClick = (fun, row) => {
   let { data } = row

}



const logininforList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const selectName = ref("");
const total = ref(0);
const dateRange = ref([]);
const defaultSort = ref({ prop: "loginTime", order: "descending" });

// 查询参数
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   ipaddr: undefined,
   userName: undefined,
   status: undefined,
   orderByColumn: undefined,
   isAsc: undefined
});

/** 查询角色列表 */
function getList() {
   gridRef.value.HandleQueryData(queryParams.value)
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
   proxy.$refs["logininforRef"].sort(defaultSort.value.prop, defaultSort.value.order);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.infoId);
   multiple.value = !selection.length;
   single.value = selection.length != 1;
   selectName.value = selection.map(item => item.userName);
}

/** 排序触发事件 */
function handleSortChange(column, prop, order) {
   queryParams.value.orderByColumn = column.prop;
   queryParams.value.isAsc = column.order;
   getList();
}

function handleBatchDelete() {
   let ids = gridRef.value.HandleGetSelectRow().map(ele => ele.infoId)
   handleDelete({}, ids.join(','))
}

/** 删除按钮操作 */
function handleDelete(row, ids) {
   const infoIds = row.infoId || ids;
   proxy.$modal.confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?').then(function () {
      return delLogininfor(infoIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}

/** 清空按钮操作 */
function handleClean() {
   proxy.$modal.confirm("是否确认清空所有登录日志数据项?").then(function () {
      return cleanLogininfor();
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("清空成功");
   }).catch(() => { });
}

/** 解锁按钮操作 */
function handleUnlock() {
   const username = selectName.value;
   proxy.$modal.confirm('是否确认解锁用户"' + username + '"数据项?').then(function () {
      return unlockLogininfor(username);
   }).then(() => {
      proxy.$modal.msgSuccess("用户" + username + "解锁成功");
   }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
   proxy.download("monitor/logininfor/export", {
      ...queryParams.value,
   }, `logininfor_${new Date().getTime()}.xlsx`);
}

</script>
