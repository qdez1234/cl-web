<template>
    <div class="contain">
        <div class="btn-box">
            <div class="left">
                <div v-for="(lang, index) in languages" :key="index" class="txt">{{ lang.label }}</div>
            </div>
            <div class="right">
                <el-button type="primary" @click="handleSave">保存</el-button>
                <el-button type="success" @click="formateCode">格式化</el-button>
            </div>
        </div>
        <div class="tab">
            <div v-for="(lang, index) in languages" :key="index" class="li">
                <codeEDT ref="codeEditors" :code="lang.code"></codeEDT>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import codeEDT from './editor.vue';
import request from "@/utils/request";
import { ElMessage } from 'element-plus';

let config = {}
if (languageConfig) {
    config = languageConfig
}
const languages = [{ label: '中文', code: JSON.stringify(config['zh']) }, { label: '英文', code: JSON.stringify(config['en']) }, { label: '越南语', code: JSON.stringify(config['vi']) }];

const codeEditors = ref([]);

const formateCode = () => {
    codeEditors.value.forEach(editor => editor.formateCode());
};
const handleSave = () => {
    const allValid = codeEditors.value.every(editor => editor.vaildCode());
    if (!allValid) return;

    const codeData = codeEditors.value.map(editor => editor.getData());
    // 在这里处理保存的逻辑，codeData 会是一个包含所有代码的数组

    let jsContent = `let languageConfig = {zh:${codeData[0]},en:${codeData[1]},vi:${codeData[2]}}`

    request({
        url: '/system/language/update',
        method: 'post',
        data: {
            jsContent: jsContent
        },
    }).then((res) => {
        if (res.code == 200) ElMessage.success("保存成功")
    });

};
</script>

<style lang="scss" scoped>
.contain {
    display: flex;
    height: 100%;
    overflow: hidden;
    flex-direction: column;

    .tab {
        display: flex;
        width: 100%;
        flex: 1;

        .li {
            flex: 1;
        }
    }

    .btn-box {
        padding: 6px 10px;
        display: flex;
        background: #1e1e1e;
        justify-content: space-between;

        .left {
            color: white;
            flex: 1;
            display: flex;
            align-items: center;

            .txt {
                display: inline-block;
                width: 33.333%;
                text-align: center;
            }
        }
    }
}
</style>