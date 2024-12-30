<template>
    <el-upload class="custom-upload" :action="props.action" :headers="props.headers" :multiple="props.multiple"
        :limit="props.limit" :file-list="fileListData" :show-file-list="props.showFileList" text :accept="props.accept"
        :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeUpload"
        :on-error="handleError" :on-exceed="handleExceed">
        <template #trigger>
            <el-button>
                上传
                <el-icon class="el-icon--right">
                    <Upload />
                </el-icon>
            </el-button>
        </template>

        <template #tip v-if="props.tip != ''">
            <div class="el-upload__tip">
                {{ tip }}
            </div>
        </template>
    </el-upload>
</template>

<script setup>
import { commonUploadAPI,fileAddress } from "../config"
import { getToken } from '@/utils/auth'
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'

// 使用 props 接收组件的属性
const props = defineProps({
    action: {
        type: String,
        default: ''
    },
    headers: {
        type: Object,
        default: () => ({
            ['Authorization']: 'Bearer ' + getToken()
        })
    },
    data: {
        type: Object,
        default: () => ({})
    },
    multiple: {
        type: Boolean,
        default: true
    },
    limit: {
        type: Number,
        default: 5
    },
    showFileList: {
        type: Boolean,
        default: true
    },
    accept: {
        type: String,
        default: ""
    },
    tip: {
        type: String,
        default: ""
    },
    buttonText: {
        type: String,
        default: "上传文件"
    },
    maxSize: {
        type: Number,
        default: 10
    },
    modelValue: {
        type: String,
        default: () => ''
    },
});


// 使用响应式对象来管理文件列表
const fileListData = ref([])

// 事件处理函数
const handlePreview = (file) => {
};

/**
 *  在删除文件时同步更新文件列表
 * @param file 
 * @param fileList 
 */
const handleRemove = (file, fileList) => {
    const index = fileListData.value.findIndex(item => item.name === file.name);
    if (index !== -1) {
        fileListData.value.splice(index, 1);
    }
};
/**
 * 上传成功
 * @param response 
 * @param file 
 * @param fileList 
 */
const handleSuccess = (response, file, fileList) => {
    fileListData.value = fileList.map(ele => ({
        url: ele.response.url,
        name: ele.name
    }))
}
/**
 * 上传失败
 * @param err 
 * @param file 
 * @param fileList 
 */
const handleError = (err, file, fileList) => {
    console.err(err)
};
/**
 * 超出事件
 * @param err 
 * @param file 
 * @param fileList 
 */
const handleExceed = (files, fileList) => {

};
/**
 * 上传之前
 * @param file 
 */
const beforeUpload = (file) => {
    const maxSize = props.maxSize * 1024 * 1024; // 最大文件大小 5MB
    if (file.size > maxSize) {
        this.$message.error(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`);
        return false;  // 阻止上传
    }
    return true;  // 允许上传
};
</script>

<style scoped>
.custom-upload {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style>