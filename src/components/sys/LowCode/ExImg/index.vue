<template>
    <div>
        <el-upload :class="['avatar-uploader', (fileListData.length >= limit || disabled || PageDisabled) ? 'uploadNone' : '']"
            v-model:file-list="fileListData" :action="props.action" :headers="props.headers" :multiple="props.multiple"
            :limit="limit" :show-file-list="true" text :accept="props.accept" list-type="picture-card"
            :on-preview="handlePreview" :on-remove="handleRemove" :disabled="disabled || PageDisabled"
            :on-success="handleSuccess" :before-upload="beforeUpload" :on-error="handleError" :on-exceed="handleExceed">
            <el-icon class="avatar-uploader-icon">
                <Plus />
            </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible" title="图片查看" width="80%" custom-class="exImgDialog">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </div>
</template>

<script setup>
import { commonUploadAPI, fileAddress } from "../config"
import { getToken } from '@/utils/auth'
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import { onMounted, watch } from "vue";

// 使用 props 接收组件的属性
const props = defineProps({
    params: {
        type: Object,
        default: () => ({})  // 使用函数返回默认对象
    },
    // action: {
    //     type: String,
    //     default: commonUploadAPI
    // },
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
    accept: {
        type: String,
        default: "image/*"
    },
    tip: {
        type: String,
        default: ""
    },
    PageDisabled: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: [String, Number],
        default: ''  // 设置默认值
    },
});
const emit = defineEmits([
    'update:modelValue'
]);

watch(() => props.params, () => {
    HandleInit()
}, { deep: true })
watch(() => props.modelValue, (newVal) => {
    if (newVal == "") return
    fileListData.value = stringToArray(newVal)
})
// 使用响应式对象来管理文件列表
const fileListData = ref([])
let disabled = ref(false)
let limit = ref(1)
let maxSize = ref(3)
let dialogImageUrl = ref("")
let dialogVisible = ref(false)
// 事件处理函数
const handlePreview = (file) => {
    dialogVisible.value = true
    dialogImageUrl = file.url
    
};
/**
 * 索引检测
 * @param str 
 * @param separator 
 */
const stringToArray = (str, separator = ",") => {
    // 如果字符串为空或者没有找到分隔符，直接返回一个包含该字符串的数组
    if (!str || str.indexOf(separator) === -1) {
        return [{ name: '', url: fileAddress + str }]; // 直接返回数组形式
    }

    // 如果存在分隔符，则按分隔符分割字符串
    return str.split(separator).map(item => {
        return {
            name: '',
            url: fileAddress + item
        }
    }); // 去除多余空格
}

/**
 * 初始化
 */
const HandleInit = () => {
    disabled.value = props.params.isReadonly
    limit.value = props.params.limit
    maxSize.value = props.params.maxSize || 3
}
/**
 *  在删除文件时同步更新文件列表
 * @param file 
 * @param fileList 
 */
const handleRemove = (file, fileList) => {
    const index = fileListData.value.findIndex(item => item.url === file.response.url);
    if (index !== -1) {
        fileListData.value.splice(index, 1);
    }
    emit('update:modelValue', fileListData.value.join(','))
};
/**
 * 上传成功
 * @param response 
 * @param file 
 * @param fileList 
 */
const handleSuccess = (response, file, fileList) => {
    fileListData.value = fileList.map(ele => {
        return {
            url: ele.response.url,
            name: ele.name
        }
    })
    emit('update:modelValue', fileListData.value.map(ele => ele.url).join(','))
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
    const size = maxSize.value * 1024 * 1024; // 最大文件大小 5MB
    console.log(maxSize,file.size > maxSize)
    if (file.size > size) {
        this.$message.error(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`);
        return false;  // 阻止上传
    }
    return true;  // 允许上传
};
onMounted(() => {
    HandleInit()
})
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    text-align: center;
}

.uploadNone .el-upload {
    display: none !important;
}

.exImgDialog .el-dialog__header {
    padding: 6px !important;
}

.exImgDialog .el-dialog__headerbtn {
    width: 35px !important;
    height: 38px !important;
}

.exImgDialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>