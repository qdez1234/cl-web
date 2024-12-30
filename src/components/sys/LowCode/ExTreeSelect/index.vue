<template>
    <div style="width: 100%;">
        <el-tree-select class="el-tree-select" :props="defaultProps" node-key="id" v-model="mdValue" filterable  clearable
            v-if="!multiple" @change="handleCheck" :disabled="disabled || PageDisabled" show-checkbox :data="treeData" 
            check-strictly />

        <el-tree-select class="el-tree-select" :props="defaultProps" node-key="id" v-model="mdValue" filterable v-else clearable
            multiple @change="handleCheck" :disabled="disabled || PageDisabled" show-checkbox :data="treeData"
            check-strictly />
    </div>

</template>

<script>
import { buildTree } from "../config"
import request from "@/utils/request";

export default {
    data() {
        return {
            treeData: [],  // 树的数据
            url: null,
            defaultProps: {
                children: 'children',
                disabled: 'disabled',
                label: 'label'
            },
            multiple: undefined,
            mdValue: null,
            placeholder: "",
            disabled: false,
            size: ""
        };
    },
    props: {
        modelValue: {
            type: [String, Number],
            default:null  // 设置默认值
        },
        params: {
            type: Object,
            default: () => ({})
        },
        PageDisabled: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        // 监听 props.params 的变化，重新初始化
        'params': {
            handler() {
                this.HandleInit();
            },
            deep: true
        },
        'modelValue':{
            handler() {
                this.mdValue = this.modelValue
            },
        }
    },
    methods: {
        // 自定义节点类名
        customNodeClass(data, node) {
            return data.disabled ? 'disabledTree' : '';
        },
        // API 获取数据
        HandleGetData() {
            if (!this.url || this.url == '') return
            request({
                url: this.url,
                method: 'post',
                data: {}
            }).then((res) => {
                this.treeData = buildTree(res.data);
            });
        },
        /**
         * 复选框被选中
         */
        handleCheck() {
            if (this.multiple) {
                this.$emit('update:modelValue', this.mdValue.join(','))
            } else {
                this.$emit('update:modelValue', this.mdValue)
            }
        },
        HandleInit() {
            this.url = this.params.API;
            this.defaultProps.label = this.params.propsLabel;
            this.code = this.params.code;
            this.multiple = this.params.multiple
            this.placeholder = this.params.placeholder
            this.disabled = this.params.isReadonly
            this.size = this.params.size
            this.HandleGetData();
            this.mdValue = this.modelValue
            if (this.multiple) {
                this.mdValue = this.modelValue?.split(',') || []
            }
        },
    },
    mounted() {
        this.HandleInit();
    }
}
</script>

<style lang="scss" scoped>
.el-tree-select {
    width: 100%;
}
</style>