<template>
    <el-checkbox v-model="checked" @change="onChange" :disabled="getDisabled" class="ag-cus-check" size="large" />
</template>

<script>
export default {
    props: {
        params: {
            type: Object,
            required: true,
        },
    },
    emits: ["HandleCellClick"],
    data() {
        return {
            checked: this.params.value == 1 ? true : false,
        };
    },
    computed: {
        // 获取是否禁用状态
        getDisabled() {
            const { isReadonly } = this.params.colDef || {};
            return isReadonly || this.params.context.componentParent.HandleGetPageDisabled();
        },
    },
    watch: {
        // 监听 params.value 的变化
        "params.value"(newValue) {
            this.checked = newValue == 1 ? true : false;
        },
    },
    methods: {
        // 处理值变化
        onChange() {
            const { data, colDef } = this.params;
            data[colDef.field] = this.checked ? "1" : "0";
        },
        // 必须实现 getValue 方法，用于 AG Grid 获取返回编辑后的值
        getValue() {
            return this.checked;
        }
    },
};
</script>

<style lang="scss">
.ag-cus-check {
    .el-checkbox__inner {
        width: 18px !important;
        height: 18px !important;
    }

    .el-checkbox__inner::after {
        border-width: 3px;
        left: 5px !important;
        top: 2px !important;
    }
}
</style>
