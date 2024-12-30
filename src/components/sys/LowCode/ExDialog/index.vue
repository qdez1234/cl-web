<template>
    <el-dialog v-model="dialogVisible" v-if="dialogVisible" custom-class="exdialogModel" :title="pageConfig.label"
        :width="pageConfig.width || '80%'" draggable :close-on-click-modal="pageConfig.close">
        <div class="content" :style="`height:${pageConfig.height || 'auto'}`">
            <div class="ex-page-container ex-dialog-container">
                <div class="container-left">
                    <template v-for="(outerElement, index) in pageConfig.content" :key="index">
                        <ex-tree :params="outerElement" v-if="outerElement.modelType == 'ex-tree'"></ex-tree>
                    </template>
                </div>
                <div class="container-right">
                    <template v-for="(outerElement, index) in pageConfig.content" :key="index">
                        <div class="ex-search" v-if="outerElement.modelType == 'form'">
                            <ex-form :outerElement="outerElement" :PageDisabled="PageDisabled" ref="exFormRef"
                                @update:methods="updateMethods" :outerData="form"></ex-form>
                        </div>

                        <div class="ex-table-page-body" v-if="outerElement.modelType == 'ex-grid'">
                            <AgTable class="AgTable" ref="gridRef" :paging="true" :PageDisabled="PageDisabled"
                                :gridColDefs="outerElement.gridColDefs.filter(ele => ele.isShow)"
                                :gridActions="outerElement.actionGroup" :gridKey="$route.path + outerElement.id"
                                :grildUrl="outerElement.API" :rowSelection="outerElement.rowSelection"
                                :suppressRowClickSelection="true" />
                        </div>

                        <div class="ex-table-page-body" v-if="outerElement.modelType == 'ex-tabs'">
                            <ex-tabs :outerElement="outerElement" :outerData="form" ref="tabs"
                                :PageDisabled="PageDisabled"></ex-tabs>
                        </div>
                    </template>
                </div>
                <caseDialog ref="caseDialogRef" />
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="HandleClose">{{ pageConfig.cancelTxt || '取消' }}</el-button>
                <el-button type="primary" @click="HandleConfirm" v-if="!PageDisabled">
                    {{ pageConfig.confirmTxt || '确认' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script>
import { nextTick } from "vue";
import { $action } from "../action/index.js"
export default {
    props: {
        pageConfig: {
            type: Object,
            default: () => ({})
        },
    },
    data() {
        return {
            // pageConfig:[],
            dialogVisible: false,
            form: {},
            businessModelCode: "",
            PageDisabled: false,
        }
    },
    mounted() {
        this.businessModelCode = $action.getBusinessModelCode()
    },
    methods: {
        /**
         * 弹窗开启
         */
        async HandleOpen(params = {}, disabled = false) {
            this.form = {}
            this.PageDisabled = disabled
            this.dialogVisible = true
            let { id, copy = false } = params
            if (id) {
                const res = await $action.HandleGet(this.pageConfig.detailAPI, params)
                this.form = res.data
                if (copy) {
                    nextTick(() => {
                        this.HandleCopy()
                    })
                }
            } else {
                this.form = {}
            }
        },
        /**
         * 弹窗关闭
         */
        HandleClose() {
            this.dialogVisible = false
        },
        confirm() {
            eval(this.pageConfig.code)
        },
        /**
         * 弹窗确认提交,新增or修改
         */
        async HandleConfirm() {
            if (this.$refs.exFormRef) {
                let valid = await this.$refs.exFormRef[0].HandleValidate()
                if (!valid) return
            }
            if (this.$refs.tabs) {
                let valid = await this.$refs.tabs[0].HandleValidate()
                if (!valid) return
            }
            let tabsData = this.$refs.tabs ? this.$refs.tabs[0].HandleGetData() : {}
            let data = Object.assign({}, this.form, tabsData)
            if (data.id) {
                const res = await $action.HandleChange(this.pageConfig.editAPI, data, this.$parent.$refs.gridRef[0].HandleLoadData)
                if (res.code == 200) {
                    this.HandleClose()
                }
            } else {
                const res = await $action.HandleAdd(this.pageConfig.addAPI, data, this.$parent.$refs.gridRef[0].HandleLoadData)
                if (res.code == 200) {
                    this.HandleClose()
                }
            }
        },
        /**
         * 保存页面复制字段
         */
        HandleCopy() {
            let data = {}
            if (this.$refs.exFormRef) {
                this.$refs.exFormRef.forEach(ele => {
                    data = Object.assign(data, ele.HandleGetCopyData())
                })
            }
            if (this.$refs.tabs) {
                this.$refs.tabs.forEach(ele => {
                    data = Object.assign(data, ele.HandleGetCopyData())
                })
            }
            this.form = data
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

    .ex-dialog-container {
        background: white;
        padding: 0;
        box-shadow: none;

        .ex-search {
            border-bottom: 1px dashed #d1d5db;
        }

        .ex-search:last-child {
            border: none;
        }
    }
}
</style>