<template>
    <div class="form">
        <el-form class="ex-form-inline" ref="form" :inline="true" @submit.native.prevent
            :label-width="outerElement.labelWidth" :model="form" :label-position="outerElement.labelPosition">
            <el-row :gutter="20" class="ex-form-row">
                <template v-for="(element, key) in outerElement.children" :key="key">
                    <template v-if="parent(element) && !element.isShow">
                        <el-col :span="computedSpan(element, outerElement)">
                            <el-form-item :label="computeLabel(element)" :label-width="element.labelWidth" :rules="[{
                                required: element.isEmpty,
                                message: ``,
                                trigger: 'blur',
                            }]" :prop="element.field">
                                <component :is="element['modelType']" :ref="element['id']"
                                    v-model="form[element['field']]" :outerData="outerData" :PageDisabled="PageDisabled"
                                    v-if="computedComponent(element, ['ex-input', 'ex-date', 'ex-dateRange', 'ex-button', 'ex-dictSelect', 'ex-img', 'ex-tree-select'])"
                                    :params="element" @update:methods='updateMethods' />
                                <ex-report v-if="computedComponent(element, ['ex-report'])" v-model="element['config']"
                                    :PageDisabled="PageDisabled" :outerData="outerData" :params="element"
                                    @update:report="HandleUpdateReport" @update:methods='updateMethods' />
                            </el-form-item>
                        </el-col>
                    </template>
                </template>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { $action } from "../action/index.js"
export default {
    props: {
        outerElement: {
            type: Object,
            default: () => ({})
        },
        outerData: {
            type: Object,
            default: () => ({})
        },
        PageDisabled: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        outerData(newVal) {
            this.form = newVal
        },
        outerElement(newVal) {
            this.init()
        }
    },
    data() {
        return {
            form: {
            },
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        /**
         * 初始化
         */
        init() {
            this.form = this.outerData
            this.outerElement.children.forEach(ele => {
                if (ele.field) {
                    if (!this.form[ele.field]) {
                        this.form[ele.field] = ele.defaultValue || undefined
                        if (ele.modelType == 'ex-date') {
                            const expression = new Function(`${ele.defaultValueEcho}`);
                            this.form[ele.field] = expression() || undefined
                        }
                    }
                }
            })
        },
        /**
         * 
         * 表达式解析
         * @param element 
         */
        parent(element) {
            if (this.$route.path == '/system/render/config') return true
            let params = this.outerData || {}
            let route = this.$route
            let edit = this.PageDisabled
            if (element.expression) {
                const expression = new Function('params', 'route', 'edit', `${element.expression}`);
                return expression(params, route, edit)
            }
            return true
        },
        /**
        * 计算占位
        * @param row 
        */
        computedSpan(row) {
            let occupy = row.occupy * 6
            if (row.modelType == 'ex-button') occupy = 1
            return occupy
        },
        /**
         * 计算label
         * @param row 
         */
        computeLabel(row) {
            let label = row.label
            if (row.modelType == 'ex-button') label = ''
            return label
        },
        /**
         * 计算是否在当前组件里面
         * @param model 
         */
        computedComponent(row, model = []) {
            return model.includes(row['modelType'])
        },
        /**
         * 处理导出字段
         */
        HandleUpdateReport(data) {
            this.form = Object.assign(this.form, data)
        },
        /**
         * 获取值
         */
        HandleGetData() {
            return this.form
        },
        /**
         * 获取复制值
         */
        HandleGetCopyData() {
            let list = this.outerElement.children.filter(ele => ele.isCopy).map(ele => ele.field)
            let copyForm = list.reduce((acc, key) => {
                if (key in this.form) { // 检查 key 是否存在于 b 中
                    acc[key] = this.form[key];
                }
                return acc;
            }, {});
            return copyForm
        },
        /**
         * 复制
         */
        async HandleCopy() {
            this.$parent.HandleCopy()
        },
        /**
         *   编辑状态改变
         */
        handleEditChange() {
            this.$parent.handleEditChange()
        },
        /**
         * 校验值
         */
        async HandleValidate() {
            const result = await this.$refs.form.validate((valid) => {
                if (valid) {
                    return true
                } else {
                    this.$message.error('必填值未填')
                    return false
                }
            })
            return result
        },
        /**
         * 查询搜索事件
         */
        async HandleSearch() {
            if (await this.HandleValidate()) {
                this.$parent.$refs.gridRef[0].HandleQueryData(this.HandleGetData())
            }
        },
        /**
         * 设置值
         */
        HandleSetData(data) {
            this.form = Object.assign(this.form, data)
        },
        /**
         * 新增打开页面
         */
        HandleGoPage(path) {
            $action.HandleGoPage(path, { status: 1 })
        },
        /**
         * 新增打开弹窗
         */
        HandleOpenDialog(num = 0) {
            this.$parent.$refs.exDialogRef[num].HandleOpen()
        },
        /**
         * 审核/反审核
         */
        async HandleAudit(audited = 1) {
            let txt = audited == 1 ? '审核' : '反审核'
            $action.HandleAudit({ id: this.form.id, audited }, txt, this.$parent.init)
        },
        /**
         * 批量审核/反审核
         */
        HandleBatchAudit(audited = 1) {
            this.$parent.$refs.gridRef[0].HandleBatchAudit(audited)
        },
        /**
         * 停用/启用
         */
        async HandleStatus(status = 1) {
            let txt = status == 1 ? '启用' : '停用'
            $action.HandleStatus({ id: this.form.id, status }, txt, this.$parent.init)
        },
        /**
         * 批量停用/启用
         */
        HandleBatchstatus(audited = 1) {
            this.$parent.$refs.gridRef[0].HandleBatchstatus(audited)
        },
        /**
         * 删除
         */
        HandleDelete() {
            $action.HandleDelete({ id: this.form.id }, '删除', this.$tab.closePage)
        },
        /**
         * 导出
         */
        HandleReport() {
            this.$parent.HandleReport()
        },
        /**
         * 结案/反结案
         */
        async HandleCase(status = 1) {
            if (status == 1) this.$parent.$refs.caseDialogRef.HandleOpen({ id: this.form.id })
            if (status == 0) {
                let res = await $action.HandleCase({ id: this.form.id, finishStatus: '0' })
                if (res.code == 200) this.$parent.init()
            }
        },
        /**
         * 打印
         */
        HandlePrint() {
            $action.HandleGoPage('/print')
        },
        /**
         * 
         * 批量删除
         */
        HandleBatchDelete() {
            this.$parent.$refs.gridRef[0].HandleBatchDelete()
        },
        /**
         * 保存
         */
        async HandleSave() {
            if (await this.$parent.$refs.exFormRef[1].HandleValidate() && this.$parent.$refs.tabs[0].HandleValidate()) {
                this.$parent.HandleSave()
            }
        },
        /**
         * 运行代码字符串
         * @param code 
         */
        updateMethods(code) {
            eval(code)
        },
        HandleClose() {
            this.$tab.closePage()
        },
    }
}
</script>
<style lang="scss" scoped>
.el-col-1 {
    max-width: 200px;

    .el-form-item {
        margin-right: 0
    }
}

.el-form-item {
    margin-bottom: 6px;
}

.ex-form-row {
    padding-top: 6px;
    margin-bottom: 6px;
    background: white;
    position: relative;
}
</style>