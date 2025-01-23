<template>
   <div class="ex-page-container">
     <div class="container-left">
     </div>
     <div class="container-right">
       <div class="ex-search">
         <el-form :model="queryParams" ref="queryForm" label-width="80px">
           <el-row :gutter="20" class="ex-form-row">
             <el-col :md="6">
               <el-form-item label="公告标题" prop="noticeTitle">
                 <el-input v-model="queryParams.noticeTitle" placeholder="请输入公告标题" clearable
                   @keyup.enter="handleQuery" />
               </el-form-item>
             </el-col>
             <el-col :md="6">
               <el-form-item label="操作人员" prop="createBy">
                 <el-input v-model="queryParams.createBy" placeholder="请输入操作人员" clearable @keyup.enter="handleQuery" />
               </el-form-item>
             </el-col>
             <el-col :md="6">
               <el-form-item label="类型" prop="noticeType">
                 <el-select v-model="queryParams.noticeType" placeholder="公告类型" style="width: 100%" @change="handleQuery"
                   clearable>
                   <el-option v-for="dict in sys_notice_type" :key="dict.value" :label="dict.label"
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
               <el-button class="filter-item" v-hasPermi="['system:notice:add']" type="primary" icon="Plus"
                 @click="handleAdd">新增</el-button>
               <el-button class="filter-item" v-hasPermi="['system:notice:remove']" type="danger" icon="Delete"
                 @click="handleBatchDelete">删除</el-button>
             </el-col>
           </el-row>
         </el-form>
       </div>
       <div class="ex-table-page-body">
         <AgTable class="AgTable" ref="gridRef" @HandleCellClick="HandleCellClick" :paging="true"
           :gridColDefs="gridColDefs" gridMethdos="get" :gridActions="gridActions" :gridKey="route.path + 'list'"
           :grildUrl="gridAPI" gridRowKey="noticeId" rowSelection="multiple" :suppressRowClickSelection="true" />
       </div>
     </div>
 
     <!-- 添加或修改公告对话框 -->
     <el-dialog :title="title" v-model="open" width="720px" append-to-body>
       <div class="dialog_box">
         <el-form ref="noticeRef" :model="form" :rules="rules" label-position="top">
           <el-row :gutter="24">
             <el-col :span="12">
               <el-form-item label="公告标题" prop="noticeTitle">
                 <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="公告类型" prop="noticeType">
                 <el-select v-model="form.noticeType" placeholder="请选择" style="width: 100%;">
                   <el-option v-for="dict in sys_notice_type" :key="dict.value" :label="dict.label"
                     :value="dict.value"></el-option>
                 </el-select>
               </el-form-item>
             </el-col>
             <el-col :span="24">
               <el-form-item label="状态">
                 <el-radio-group v-model="form.status">
                   <el-radio-button v-for="dict in sys_notice_status" :key="dict.value" :label="dict.value">{{
                     dict.label
                   }}</el-radio-button>
                 </el-radio-group>
               </el-form-item>
             </el-col>
             <el-col :span="24">
               <el-form-item label="内容">
                 <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="form.noticeContent" />
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
 <script setup name="Notice">
 import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "@/api/system/notice";
 
 const { proxy } = getCurrentInstance();
 
 const { sys_notice_status, sys_notice_type } = proxy.useDict("sys_notice_status", "sys_notice_type");
 
 const gridRef = ref(null)
 
 const gridAPI = ref("/system/notice/list")
 
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
     headerName: "公告标题",
     field: "noticeTitle",
     tooltipField: "noticeTitle",
   },
   {
     headerName: "公告类型",
     field: "noticeType",
     tooltipField: "noticeType",
   },
   {
     headerName: "状态",
     field: "status",
     tooltipField: "status",
     cellRenderer: "CustomDict",
     cellRendererParams: {
       "dict_key": "sys_notice_status"
     },
   },
   {
     headerName: "创建者",
     field: "createBy",
     tooltipField: "createBy",
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
           authentication: "system:notice:edit",
           fun: 1,
         },
         {
           label: "删除",
           type: "danger",
           fun: 2,
           authentication: "system:notice:remove",
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
 
 
 const advanced = ref(false);

 const noticeList = ref([]);
 const open = ref(false);
 const loading = ref(true);
 const showSearch = ref(true);
 const ids = ref([]);
 const single = ref(true);
 const multiple = ref(true);
 const total = ref(0);
 const title = ref("");
 
 const data = reactive({
   form: {},
   queryParams: {
     pageNum: 1,
     pageSize: 10,
     noticeTitle: undefined,
     createBy: undefined,
     status: undefined
   },
   rules: {
     noticeTitle: [{ required: true, message: "公告标题不能为空", trigger: "blur" }],
     noticeType: [{ required: true, message: "公告类型不能为空", trigger: "change" }]
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
 
 /** 查询参数列表 */
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
     noticeId: undefined,
     noticeTitle: undefined,
     noticeType: undefined,
     noticeContent: undefined,
     status: "1"
   };
   proxy.resetForm("noticeRef");
 }
 /** 搜索按钮操作 */
 function handleQuery() {
   queryParams.value.pageNum = 1;
   getList();
 }
 /** 重置按钮操作 */
 function resetQuery() {
   proxy.resetForm("queryForm");
   handleQuery();
 }
 /** 多选框选中数据 */
 function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.noticeId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
 }
 /** 新增按钮操作 */
 function handleAdd() {
   reset();
   open.value = true;
   title.value = "添加公告";
 }
 /**修改按钮操作 */
 function handleUpdate(row) {
   reset();
   const noticeId = row.noticeId || ids.value;
   getNotice(noticeId).then(response => {
     form.value = response.data;
     open.value = true;
     title.value = "修改公告";
   });
 }
 /** 提交按钮 */
 function submitForm() {
   proxy.$refs["noticeRef"].validate(valid => {
     if (valid) {
       if (form.value.noticeId != undefined) {
         updateNotice(form.value).then(response => {
           proxy.$modal.msgSuccess("修改成功");
           open.value = false;
           getList();
         });
       } else {
         addNotice(form.value).then(response => {
           proxy.$modal.msgSuccess("新增成功");
           open.value = false;
           getList();
         });
       }
     }
   });
 }
 function handleBatchDelete() {
   let ids = gridRef.value.HandleGetSelectRow().map(ele => ele.noticeId)
   handleDelete({}, ids.join(','))
 }
 /** 删除按钮操作 */
 function handleDelete(row, ids) {
   const noticeIds = row.noticeId || ids
   proxy.$modal.confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项？').then(function () {
     return delNotice(noticeIds);
   }).then(() => {
     getList();
     proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
 }
 
 </script>
 