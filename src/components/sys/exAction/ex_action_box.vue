<template>
    <div class="ex-action-box-left"></div>
    <div class="ex-action-box-right">
        <slot name="append"></slot>
        <template v-for="(item, index) in renderBtnConfig" :key="index">
            <el-button class="filter-item" style="margin-left: 8px" :type="item.type" @click="handleCellClick(item.fun)"
                :v-hasPermi="item.perms" v-if="pareBtn(item.fun)">
                {{ isForm ? (item.aliasLabel || item.label) : item.label }}
            </el-button>
        </template>
        <slot name="after"></slot>
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
            default: {},
        },
        isForm: {
            type: Boolean,
            default: false,
        },
        //是否能编辑
        editable: {
            type: Boolean,
            default: true
        }
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
                (status == 0 && fun == 5) ||  // 停用状态, 隐藏停用按钮
                (status == 1 && fun == 6) ||  // 启用状态, 隐藏启用按钮
                (audited == 0 && fun == 8) || // 未审核, 隐藏反审按钮
                (audited == 1 && fun == 7) ||    // 已审核, 隐藏审核按钮
                (audited == 1 && fun == 2) ||    //以审核，不能修改删除
                (audited == 1 && fun == 3)       //以审核，不能修改删除
            );
            if (this.routeStatus == 1) {          //新增数据的时候，只能有一个新增保存按钮
                return (fun == 1);
            }

            if(!this.editable || this.routeStatus ==4){          //没有修改权限或者查看状态，全部禁用
                return false  
            }

            if (shouldHideAction) {
                return false;
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
