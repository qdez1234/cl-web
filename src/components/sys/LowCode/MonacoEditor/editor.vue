<template>
    <div class="codemirror">
        <div id="monacoEditor" class="monaco-editor" ref="monacoEditor"></div>
    </div>
</template>
<script setup>
// 引入vue模块
import { ref, reactive, onMounted, nextTick } from 'vue';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
//引入monaco编辑器
import * as monaco from "monaco-editor";
import { ElMessage } from 'element-plus';

self.MonacoEnvironment = {
    getWorker(workerId, label) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html') {
            return new htmlWorker()
        }
        if (['typescript', 'javascript'].includes(label)) {
            return new tsWorker()
        }
        return new editorWorker();
    },
};
const props = defineProps({
    language: {
        type: String,
        default: "json"
    },
    code: {
        type: String,
        default: "{}"
    },
})
let code = ref('{}'); //代码
let language = ref(); //语言
let editor = ref(null); //编辑器实例
const monacoEditor = ref(null);
/**
 * 格式化代码
 */
const formateCode = () => {
    getEditor().trigger(null, "editor.action.formatDocument");
}
/**
 * 校验代码语法是否正确
 */
const vaildCode = () => {
    const markers = monaco.editor.getModelMarkers({});
    if (markers.length > 0) {
        ElMessage.error("数据格式错误")
        return false
    }
    return true
}
const getEditor=()=>{
    if (editor.value == null) {
        return;
    }
    return toRaw(editor.value);
}
/**
 * 获取数据
 */
const getData = () => {
    return getEditor().getValue() || '{}'
}
onMounted(() => {
    language.value = props.language
    code.value = props.code
    initEditor(language.value, code.value);
});

//初始化编辑器
function initEditor(language, code) {
    editor.value = monaco.editor.create(monacoEditor.value, {
        value: code,
        theme: "vs-dark", // 主题
        fontSize: 20,
        language: language,
        folding: true, // 是否折叠
        foldingHighlight: true, // 折叠等高线
        foldingStrategy: "indentation", // 折叠方式  auto | indentation
        showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
        disableLayerHinting: true, // 等宽优化
        emptySelectionClipboard: false, // 空选择剪切板
        selectionClipboard: false, // 选择剪切板
        automaticLayout: true, // 自动布局
        codeLens: true, // 代码镜头
        scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
        colorDecorators: true, // 颜色装饰器
        accessibilitySupport: "auto", // 辅助功能支持  "auto" | "off" | "on"
        lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
        lineNumbersMinChars: 5, // 行号最小字符   number
        readOnly: false, //是否只读  取值 true | false
        quickSuggestions: true, // 启用快速建议（代码提示）
        suggestOnTriggerCharacters: true, // 启用触发字符时提示
        acceptSuggestionOnEnter: 'on', // 按回车时接受建议
    });
    setTimeout(()=>{
        formateCode()
    },500)
}
defineExpose({
    formateCode,
    vaildCode,
    getData
})
</script>
<style lang="scss" scoped>
.codemirror {
    width: 100%;
    height: 100%;

    .monaco-editor {
        width: 100%;
        height: 100%;
    }
}
</style>