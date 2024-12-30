import { commonAddAPI, commonDeleteAPI, commonChangeAPI, commonCaseAPI, commonDetailAPI, commonReportAPI, commonSearchAPI, commonAuditAPI, commonStatusAPI } from "../config/index.js"
import request from "@/utils/request";
import { ElMessage, ElMessageBox } from 'element-plus'
import useTagsViewStore from '@/store/modules/tagsView'
import app from "../../../../main";

export let $action = {
    /**
     * 
     * @returns 获取配置businessModelCode
     */
    getBusinessModelCode() {
        const route = app.config.globalProperties.$route
        let businessModelCode = route.meta.isMain == '1' ? route.meta.modelId : route.query.businessModelCode
        return businessModelCode
    },
    /**
     * 表单审核/反审核
     */
    async HandleAudit(data, txt, callback = function () { }) {
        let url = commonAuditAPI + this.getBusinessModelCode();

        try {
            // 等待用户操作，返回的是用户点击的动作（确认或取消）
            const action = await ElMessageBox.alert(`是否${txt}数据`, '提示', {
                showCancelButton: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            });

            // 如果用户点击了确认按钮，调用处理 API 的方法
            if (action === 'confirm') {
                const res = await this.HandleActionAPI(url, data);  // 调用异步API函数
                if (res.code == 200) {
                    callback()
                    ElMessage.success(res.msg)
                } return res
            }
        } catch (error) {
            console.error('操作被取消或发生错误:', error);
        }
    },
    /**
     * 表单启用/停用
     */
    async HandleStatus(data, txt, callback = function () { }) {
        let url = commonStatusAPI + this.getBusinessModelCode();

        try {
            // 等待用户操作
            const action = await ElMessageBox.alert(`是否${txt}数据`, '提示', {
                showCancelButton: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            });

            // 如果用户点击了确认按钮，调用处理 API 的方法
            if (action === 'confirm') {
                const res = await this.HandleActionAPI(url, data);  // 调用异步API函数
                if (res.code == 200) {
                    callback()
                    ElMessage.success(res.msg)
                } return res
            }
        } catch (error) {
            console.error('操作被取消或发生错误:', error);
        }
    },
    /**
     * 表单删除
     */
    async HandleDelete(data, txt = '删除', callback = function () { }) {
        let url = commonDeleteAPI + this.getBusinessModelCode();
        try {
            const action = await ElMessageBox.alert(`是否${txt}数据`, '提示', {
                showCancelButton: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            });

            // 确认操作时调用 API
            if (action === 'confirm') {
                const res = await this.HandleActionAPI(url, data);  // 调用异步API函数
                if (res.code == 200) {
                    callback()
                    ElMessage.success(res.msg)
                } return res
            }
        } catch (error) {
            console.error('操作被取消或发生错误:', error);
        }
    },
    /**
     * 获取数据详情
     * @param {} data 
     */
    async HandleGet(API = null, data, callback = function () { }) {
        let url = API ? API : commonDetailAPI + this.getBusinessModelCode();
        const res = await this.HandleActionAPI(url, data);  // 调用异步API函数
        if (res.code == 200) {
            callback()
        } return res
    },
    /**
     * 新增数据
     * @param {} data 
     */
    async HandleAdd(API = null, data, callback = function () { }) {
        let url = API ? API : commonAddAPI + this.getBusinessModelCode();
        const res = await this.HandleActionAPI(url, data);  // 调用异步API函数
        if (res.code == 200) {
            callback()
            ElMessage.success(res.msg)
        }
        return res
    },
    /**
     * 修改数据
     * @param {} data 
     */
    async HandleChange(API = null, data, callback = function () { }) {
        let url = API ? API : commonChangeAPI + this.getBusinessModelCode();
        const res = await this.HandleActionAPI(url, data);  // 调用异步API函数
        if (res.code == 200) {
            callback()
            ElMessage.success(res.msg)
        } return res
    },
    /**
     * 结案/反结案
     * @param {} data 
     */
    async HandleCase(data, callback = function () { }) {
        let url = commonCaseAPI + this.getBusinessModelCode();
        const res = await this.HandleActionAPI(url, data);  // 调用异步API函数
        if (res.code == 200) {
            callback()
            ElMessage.success(res.msg)
        } return res
    },
    /**
     * 新增打开页面
     */
    async HandleGoPage(path, data = {}) {
        let query = Object.assign({}, data, { businessModelCode: this.getBusinessModelCode() })
        const visitedViews = useTagsViewStore().visitedViews;
        let targetView = visitedViews.find(ele => ((ele.path == path && (ele.query.status == 1 || ele.query.status == 3))))
        if (targetView && targetView.meta.menu.isCache == 1) {
            const action = await ElMessageBox.alert(`该页面已经被打开，处于新增或修改状态，是否覆盖`, '提示', {
                showCancelButton: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            });
            if (action === 'confirm') {
                app.config.globalProperties.$router.push({
                    path: path,
                    query: query
                });
            }
        } else {
            app.config.globalProperties.$router.push({
                path: path,
                query: query
            });
        }
    },
    /**
     *数据导出
     */
    async HandleReport(data) {
        let url = commonReportAPI + this.getBusinessModelCode();
        // 使用 await 等待请求完成
        const res = await request({
            url: url,
            method: 'post',
            data: data,
            responseType: "blob",
        });
        const linkUrl = window.URL.createObjectURL(res);
        const link = document.createElement("a");
        link.href = linkUrl;
        link.download = `${new Date().getTime()}.xlsx` // 设置下载的文件名
        link.click();
    },
    /**
     * API网络请求
     */
    async HandleActionAPI(url, params) {
        try {
            // 使用 await 等待请求完成
            const res = await request({
                url: url,
                method: 'post',
                data: params,
            });
            return res;
        } catch (error) {
            // console.error('请求失败:', error);
            // ElMessage.error('请求失败');
        }
    }


}