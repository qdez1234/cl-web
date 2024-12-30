<template>
    <div class="ex-action-box-left"></div>
    <div class="ex-action-box-right">
        <template v-for="(item, index) in renderBtnConfig" :key="index">
            <el-button class="filter-item" style="margin-left: 8px" :type="item.type" 
                @click="handleCellClick(item.fun)"
                v-if="pareBtn(item.fun)" :v-hasPermi="item.perms">
                {{ isForm ? (item.aliasLabel || item.label) : item.label }}
            </el-button>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        renderBtnConfig: {
            type: Array,
            required: true,
        },
        queryParams: {
            type: Object,
            required: true,
        },
        isForm: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            routeStatus: this.$route.query.status,
        };
    },
    methods: {
        handleCellClick(fun) {
            this.$emit("handleCellClick", fun, this.queryParams);
        },
        pareBtn(fun) {
            const { status, audited } = this.queryParams;

            // 定义隐藏按钮的条件
            const shouldHideAction = (
                (status === 0 && fun === 5) ||  // 停用状态, 隐藏停用按钮
                (status === 1 && fun === 6) ||  // 启用状态, 隐藏启用按钮
                (audited === 0 && fun === 8) || // 未审核, 隐藏某按钮
                (audited === 1 && fun === 7)    // 已审核, 隐藏某按钮
            );

            if (shouldHideAction) {
                return false;
            }
            if (this.routeStatus == 1) {          //新增数据
                return (fun == 1 || fun == 10);
            }
            if (this.routeStatus == 3 || this.routeStatus == 4) {
                return fun != 1;
            }
            return true;
        },
    },
    mounted() {
        // 获取路由状态
        this.routeStatus = this.$route.query.status;
    },
};
</script>
