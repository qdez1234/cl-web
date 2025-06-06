<template>
   <div class="ex-page-container">
     <div class="container-left">
     </div>
     <div class="container-right">
       <div class="ex-search">
         <el-form :model="queryParams" ref="queryForm" label-width="80px">
           <el-row :gutter="20" class="ex-form-row">
             <el-col :md="6">
               <el-form-item label="部门名称" prop="deptName">
                 <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable @keyup.enter="handleQuery" />
               </el-form-item>
             </el-col>
             <el-col :md="6">
               <el-form-item label="状态" prop="status">
                 <el-select v-model="queryParams.status" placeholder="部门状态" @change="handleQuery" clearable
                   style="width: 100%">
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
               <el-button class="filter-item" v-hasPermi="['system:dept:add']" type="primary" icon="Plus"
                 @click="handleAdd">新增</el-button>
             </el-col>
           </el-row>
         </el-form>
       </div>
       <div class="ex-table-page-body">
         <AgTable class="AgTable" ref="gridRef" :gridGroupParams='{ field: "deptName", headerName: "部门名称" }'
           :gridGroup="true" @HandleCellClick="HandleCellClick" :paging="true" :gridColDefs="gridColDefs"  gridRowKey="deptId"
           gridMethdos="get" :gridActions="gridActions" :gridKey="route.path + 'list'" :grildUrl="gridAPI"
           rowSelection="multiple" :suppressRowClickSelection="true" />
       </div>
     </div>
     <el-dialog :title="title" v-model="open" width="720px" append-to-body>
       <div class="dialog_box" style="height: 400px;">
         <el-form ref="deptRef" :model="form" :rules="rules" label-position="top">
           <el-row :gutter="24">
             <el-col :span="12" v-if="form.parentId !== 0">
               <el-form-item label="上级部门" prop="parentId">
                 <el-tree-select v-model="form.parentId" :data="deptOptions"
                   :props="{ value: 'deptId', label: 'deptName', children: 'children' }" value-key="deptId"
                   placeholder="选择上级部门" check-strictly style="width: 100%;" :render-after-expand="false" />
               </el-form-item>
             </el-col>
           </el-row>
           <el-row :gutter="24">
             <el-col :span="12">
               <el-form-item label="部门名称" prop="deptName">
                 <el-input v-model="form.deptName" placeholder="请输入部门名称" />
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="显示排序" prop="orderNum">
                 <el-input-number v-model="form.orderNum" style="width: 100%;" controls-position="right" :step="10"
                   :min="10" />
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="负责人" prop="leader">
                 <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="联系电话" prop="phone">
                 <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="邮箱" prop="email">
                 <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="部门状态">
                 <el-radio-group v-model="form.status">
                   <el-radio-button v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{
                     dict.label
                   }}</el-radio-button>
                 </el-radio-group>
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
 
 <script setup name="Dept">
 import { listDept, getDept,getDeptC, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
 import {generateChineseCalendar} from "@/utils/public.js"

 const gridRef = ref(null)
 const gridAPI = ref("/sys/dept/list")
 const gridActions = ref([])
 const route = useRoute();
 
 const gridColDefs = ref([
   {
     headerName: "部门名称",
     field: "deptName",
     tooltipField: "deptName",
   },
   {
     headerName: "排序",
     field: "orderNum",
     tooltipField: "orderNum",
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
           authentication: "system:dept:edit",
           fun: 1,
         },
         {
           label: "新增",
           type: "primary",
           authentication: "system:dept:add",
           fun: 2,
         },
         {
           label: "删除",
           type: "danger",
           fun: 3,
           authentication: "system:dept:remove",
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
     handleAdd(data)
   }
   if (fun == 3) {
     handleDelete(data)
   }
 }
 
 
 
 
 const { proxy } = getCurrentInstance();
 const { sys_normal_disable } = proxy.useDict("sys_normal_disable");
 
 const deptList = ref([]);
 const open = ref(false);
 const loading = ref(true);
 const showSearch = ref(true);
 const title = ref("");
 const deptOptions = ref([]);
 const isExpandAll = ref(true);
 const refreshTable = ref(true);
 const companyOptions = ref([]);
 
 const data = reactive({
   form: {},
   queryParams: {
     deptName: undefined,
     status: undefined
   },
   rules: {
     // parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
     deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
     orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
     email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
     phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
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
 
 /** 查询部门列表 */
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
     deptId: undefined,
     parentId: undefined,
     deptName: undefined,
     orderNum: 0,
     leader: undefined,
     phone: undefined,
     email: undefined,
     status: "1"
   };
   proxy.resetForm("deptRef");
 }
 /** 搜索按钮操作 */
 function handleQuery() {
   getList();
 }
 /** 新增按钮操作 */
 function handleAdd(row) {
   reset();
   listDept().then(response => {
     deptOptions.value = proxy.handleTree(response.data, "deptId");
   });
   if (row != undefined) {
     form.value.parentId = row.deptId;
   }
   open.value = true;
   title.value = "添加部门";
 }
 
 /** 修改按钮操作 */
 function handleUpdate(row) {
   reset();
   listDeptExcludeChild(row.deptId).then(response => {
     deptOptions.value = proxy.handleTree(response.data, "deptId");
   });
   getDeptC(row.deptId).then(response => {
     form.value = response.data;
     open.value = true;
     title.value = "修改部门";
   });
 }
 /** 提交按钮 */
 function submitForm() {
   proxy.$refs["deptRef"].validate(valid => {
     if (valid) {
       if (form.value.deptId != undefined) {
         updateDept(form.value).then(response => {
           proxy.$modal.msgSuccess("修改成功");
           open.value = false;
           getList();
         });
       } else {
         addDept(form.value).then(response => {
           proxy.$modal.msgSuccess("新增成功");
           open.value = false;
           getList();
         });
       }
     }
   });
 }
 /** 删除按钮操作 */
 function handleDelete(row) {
   proxy.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的数据项?').then(function () {
     return delDept(row.deptId);
   }).then(() => {
     getList();
     proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
 }
 </script>
 