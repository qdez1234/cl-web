<template>
    <div class="ex-page-container">
        <div class="container-left">
            <ex-tree :params="treeParams" @HandleNodeClik="HandleNodeClik"></ex-tree>
        </div>
        <div class="container-right">
            <div class="ex-search">
                <el-form :model="queryParams" class="el-form-inline" ref="queryForm" label-width="80px">
                    <el-row :gutter="20" class="ex-form-row">
                        <el-col :md="6">
                            <el-form-item label="用户账号" prop="userName">
                                <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable
                                    @keyup.enter="handleQuery" />
                            </el-form-item>
                        </el-col>
                        <el-col :md="6">
                            <el-form-item label="用户昵称" prop="userName">
                                <el-input v-model="queryParams.nickName" placeholder="请输入用户名称" clearable
                                    @keyup.enter="handleQuery" />
                            </el-form-item>
                        </el-col>
                        <el-col :md="6">
                            <el-form-item label="手机号码" prop="phonenumber">
                                <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable
                                    @keyup.enter="handleQuery" />
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
                            <el-button class="filter-item" v-hasPermi="['system:user:add']" type="primary" icon="Plus"
                                @click="handleAdd">新增</el-button>
                            <el-button class="filter-item" v-hasPermi="['system:user:remove']" type="danger"
                                icon="Delete" @click="handleBatchDelete">删除</el-button>
                            <el-button class="filter-item" v-hasPermi="['system:user:export']" icon="Download"
                                @click="handleExport">导出</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="ex-table-page-body">
                <AgTable class="AgTable" ref="gridRef" @HandleCellClick="HandleCellClick" :paging="true"
                    :gridColDefs="gridColDefs" gridMethdos="get" :gridActions="gridActions"
                    :gridKey="route.path + 'list'" :grildUrl="gridAPI" gridRowKey="userId" rowSelection="multiple"
                    :suppressRowClickSelection="true" />
            </div>
        </div>
        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" v-model="open" width="600px" append-to-body>
            <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户昵称" prop="nickName">
                            <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="归属部门" prop="deptId">
                            <el-tree-select v-model="form.deptId" :data="enabledDeptOptions"
                                :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id"
                                placeholder="请选择归属部门" check-strictly />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="phonenumber">
                            <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
                            <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
                            <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20"
                                show-password />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户性别">
                            <el-select v-model="form.sex" placeholder="请选择">
                                <el-option v-for="dict in sys_user_sex" :key="dict.value" :label="dict.label"
                                    :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :value="dict.value">{{
                                    dict.label
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="岗位">
                            <el-select v-model="form.postIds" multiple placeholder="请选择">
                                <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName"
                                    :value="item.postId" :disabled="item.status == 1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色">
                            <el-select v-model="form.roleIds" multiple placeholder="请选择">
                                <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName"
                                    :value="item.roleId" :disabled="item.status == 1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="User">
import { getToken } from "@/utils/auth";
import useAppStore from '@/store/modules/app'
import { changeUserStatus, listUser, resetUserPwd, delUser, getUser, updateUser, addUserC, deptTreeSelect } from "@/api/system/user";
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"

const { proxy } = getCurrentInstance();

const { sys_normal_disable, sys_user_sex } = proxy.useDict("sys_normal_disable", "sys_user_sex");

const gridRef = ref(null)

const gridAPI = ref("/sys/user/list")

const gridActions = ref([])

const route = useRoute();

const router = useRouter();

const appStore = useAppStore()

const empOptions = ref({
    "field": "empId",
    "label": "员工",
    "methdoList": [],
    "type": "string",
    "config": {
        "Dapi": "/api/common/listPage/BaseEmp",
        "params": "",
        "showType": "select",
        "table": [
            {
                "field": "empCode",
                "label": "",
                "code": "",
                "sequence": "",
                "report": "",
                "isShow": true,
                "echo": false,
                "customName": "工号",
            },
            {
                "field": "empName",
                "label": "",
                "code": "",
                "sequence": "",
                "report": "empName",
                "isShow": true,
                "echo": true,
                "customName": "姓名",
            },
            {
                "field": "id",
                "label": "",
                "code": "",
                "sequence": "",
                "report": "empId",
                "isShow": false,
                "echo": false,
                "customName": "",
            },
        ],
        "rowSelection": "single"
    },
    id: "b3f3add3-2d2e-4657-9256-1a21ef0a742e"
})

const treeParams = ref({
    icon: 'icon-node-tree',
    modelType: 'ex-tree',
    label: "节点树",
    API: "/system/dept/list",
    propsLabel: 'deptName',
})
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
        headerName: "用户编号",
        field: "userId",
        tooltipField: "userId",
    },
    {
        headerName: "用户账号",
        field: "userName",
        tooltipField: "userName",
    },
    {
        headerName: "用户昵称",
        field: "nickName",
        tooltipField: "nickName",
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
        headerName: "所属员工",
        field: "phonenumber",
        tooltipField: "phonenumber",
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
                    authentication: "system:user:edit",
                    fun: 1,
                },
                {
                    label: "删除",
                    type: "danger",
                    fun: 2,
                    authentication: "system:user:remove",
                },
                {
                    label: "重置密码",
                    type: "warning",
                    fun: 3,
                    authentication: "system:user:resetPwd",
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
        handleResetPwd(data)
    }
}


/**
 * 点击当前行节点
 * @param row 
 */
const HandleNodeClik = (row) => {
    handleNodeClick(row)
}


const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref(undefined);
const enabledDeptOptions = ref(undefined);
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
/*** 用户导入参数 */
const upload = reactive({
    // 是否显示弹出层（用户导入）
    open: false,
    // 弹出层标题（用户导入）
    title: "",
    // 是否禁用上传
    isUploading: false,
    // 是否更新已经存在的用户数据
    updateSupport: 0,
    // 设置上传的请求头部
    headers: { Authorization: "Bearer " + getToken() },
    // 上传的地址
    url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
});
// 列显隐信息
const columns = ref([
    { key: 0, label: `用户编号`, visible: true },
    { key: 1, label: `用户名称`, visible: true },
    { key: 2, label: `用户昵称`, visible: true },
    { key: 3, label: `部门`, visible: true },
    { key: 4, label: `手机号码`, visible: true },
    { key: 5, label: `状态`, visible: true },
    { key: 6, label: `创建时间`, visible: true }
]);

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
    },
    rules: {
        userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
        nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
        password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }, { pattern: /^[^<>"'|\\]+$/, message: "不能包含非法字符：< > \" ' \\\ |", trigger: "blur" }],
        email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
        phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
    }
});

const { queryParams, form, rules } = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
};

/** 根据名称筛选部门树 */
watch(deptName, val => {
    proxy.$refs["deptTreeRef"].filter(val);
});

/** 查询用户列表 */
function getList() {
    gridRef.value.HandleQueryData(queryParams.value)
};

/** 查询部门下拉树结构 */
function getDeptTree() {
    deptTreeSelect().then(response => {
        deptOptions.value = response.data;
        enabledDeptOptions.value = filterDisabledDept(JSON.parse(JSON.stringify(response.data)));
    });
};

/** 过滤禁用的部门 */
function filterDisabledDept(deptList) {
    return deptList.filter(dept => {
        if (dept.disabled) {
            return false;
        }
        if (dept.children && dept.children.length) {
            dept.children = filterDisabledDept(dept.children);
        }
        return true;
    });
};

/** 节点单击事件 */
function handleNodeClick(data) {
    queryParams.value.deptId = data.deptId;
    handleQuery();
};

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
};

/** 重置按钮操作 */
function resetQuery() {
    dateRange.value = [];
    proxy.resetForm("queryRef");
    queryParams.value.deptId = undefined;
    proxy.$refs.deptTreeRef.setCurrentKey(null);
    handleQuery();
};
function handleBatchDelete() {
    let ids = gridRef.value.HandleGetSelectRow().map(ele => ele.userId)
    handleDelete({}, ids.join(','))
}
/** 删除按钮操作 */
function handleDelete(row, ids) {
    const userIds = row.userId || ids
    proxy.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function () {
        return delUser(userIds);
    }).then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => { });
};

/** 导出按钮操作 */
function handleExport() {
    proxy.download("system/user/export", {
        ...queryParams.value,
    }, `user_${new Date().getTime()}.xlsx`);
};

/** 用户状态修改  */
function handleStatusChange(row) {
    let text = row.status === "0" ? "启用" : "停用";
    proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(function () {
        return changeUserStatus(row.userId, row.status);
    }).then(() => {
        proxy.$modal.msgSuccess(text + "成功");
    }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
    });
};

/** 更多操作 */
function handleCommand(command, row) {
    switch (command) {
        case "handleResetPwd":
            handleResetPwd(row);
            break;
        case "handleAuthRole":
            handleAuthRole(row);
            break;
        default:
            break;
    }
};

/** 跳转角色分配 */
function handleAuthRole(row) {
    const userId = row.userId;
    router.push("/system/user-auth/role/" + userId);
};

/** 重置密码按钮操作 */
function handleResetPwd(row) {
    proxy.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
        inputValidator: (value) => {
            if (/<|>|"|'|\||\\/.test(value)) {
                return "不能包含非法字符：< > \" ' \\\ |"
            }
        },
    }).then(({ value }) => {
        resetUserPwd(row.userId, value).then(response => {
            proxy.$modal.msgSuccess("修改成功，新密码是：" + value);
        });
    }).catch(() => { });
};

/** 选择条数  */
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.userId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
};

/** 导入按钮操作 */
function handleImport() {
    upload.title = "用户导入";
    upload.open = true;
};

/** 下载模板操作 */
function importTemplate() {
    proxy.download("system/user/importTemplate", {
    }, `user_template_${new Date().getTime()}.xlsx`);
};

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true;
};

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
    upload.open = false;
    upload.isUploading = false;
    proxy.$refs["uploadRef"].handleRemove(file);
    proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
    getList();
};

/** 提交上传文件 */
function submitFileForm() {
    proxy.$refs["uploadRef"].submit();
};

/** 重置操作表单 */
function reset() {
    form.value = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
    };
    proxy.resetForm("userRef");
};

/** 取消按钮 */
function cancel() {
    open.value = false;
    reset();
};

/** 新增按钮操作 */
function handleAdd() {
    reset();
    getUser().then(response => {
        postOptions.value = response.posts;
        roleOptions.value = response.roles;
        open.value = true;
        title.value = "添加用户";
        form.value.password = initPassword.value;
    });
};

/** 修改按钮操作 */
function handleUpdate(row) {
    reset();
    const userId = row.userId || ids.value;
    getUser(userId).then(response => {
        form.value = response.data;
        postOptions.value = response.posts;
        roleOptions.value = response.roles;
        form.value.postIds = response.postIds;
        form.value.roleIds = response.roleIds;
        open.value = true;
        title.value = "修改用户";
        form.password = "";
    });
};

/** 提交按钮 */
function submitForm() {
    proxy.$refs["userRef"].validate(valid => {
        if (valid) {
            if (form.value.userId != undefined) {
                updateUser(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    getList();
                });
            } else {
                addUserC(form.value).then(response => {
                    proxy.$modal.msgSuccess("新增成功");
                    open.value = false;
                    getList();
                });
            }
        }
    });
};

getDeptTree();
</script>