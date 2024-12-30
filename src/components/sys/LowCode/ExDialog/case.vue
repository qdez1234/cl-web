<template>
    <el-dialog v-model="dialogVisible" custom-class="exdialogModel" title="结案" width="800px" draggable
        :close-on-click-modal="false">
        <div class="content">
            <el-form :inline="true" :model="form" :rules="rules" class="demo-form-inline" ref="ruleFormRef">
                <el-form-item label="结案原因" prop="finishCause" style="width: 100%;">
                    <el-input v-model="form.finishCause" placeholder="请填写结案原因" clearable style="width: 100%;"
                        type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" />
                </el-form-item>

            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="HandleClose">取消</el-button>
                <el-button type="primary" @click="HandleConfirm">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script>
import { $action } from "../action/index.js"
export default {
    data() {
        return {
            dialogVisible: false,
            form: {
                finishCause: '',
                finishStatus: 1,
                id: null
            },
            rules: {
                finishCause: [{ required: true, message: '必填内容', trigger: 'blur' }]
            },
        }
    },
    mounted() {
    },
    methods: {
        /**
         * 弹窗开启
         */
        async HandleOpen(params = {}) {
            this.form.finishCause= ''
            let { id } = params
            this.form.id = id
            this.dialogVisible = true
        },
        /**
         * 弹窗关闭
         */
        HandleClose() {
            this.dialogVisible = false
        },
        /**
         * 弹窗确认提交,新增or修改
         */
        async HandleConfirm() {
            await this.$refs.ruleFormRef.validate(async (valid, fields) => {
                if (valid) {
                    let fn = this.$route.meta.isMain == '1'? this.$parent.$refs.gridRef[0].HandleLoadData : this.$parent.init
                    const res = await $action.HandleCase(this.form,fn)
                    if (res.code == 200) {
                        this.HandleClose()
                    }
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.content {
    padding: 15px 10px;
}
</style>
<style lang="scss">
.exdialogModel {
    .el-dialog__body {
        overflow-x: hidden;
        overflow-y: auto;
    }
}
</style>