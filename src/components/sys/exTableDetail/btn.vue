<template>
    <template v-for="(item, index) in GridRenderBtnConfig" :key="index">
        <el-button class="filter-item" :v-hasPermi="item.perms" style="margin-left: 8px" :type="item.type"
            v-if="pareBtn(item.fun)" @click="handleClick(item.fun)">
            {{ (item.aliasLabel || item.label) }}
        </el-button>
    </template>

    <template v-if="(isAudited == 0 && editable && routeStatus != 4)">
        <el-button circle icon="Plus" size="small" @click="handleClick('A1')"></el-button>
        <el-popover :visible="visible" placement="top" :width="152">
            <p>确定要删除选中数据</p>
            <div style="margin-top: 10px">
                <el-button @click="visible = false" size="small">取消</el-button>
                <el-button size="small" type="danger" @click="handleClick('A2')">确定</el-button>
            </div>
            <template #reference>
                <el-button circle icon="Minus" size="small" @click="visible = true"></el-button>
            </template>
        </el-popover>
    </template>

    <el-button size="small" circle icon="Operation" @click="handleClick('A3')" />
</template>

<script>
export default {
    props: {
        GridRenderBtnConfig: {
            type: Array,
            default: []
        },
        // 是否审核
        isAudited: {
            type: String || Number,
            default: 0
        },
        //是否能编辑
        editable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            visible: false,
            routeStatus: null,
        };
    },
    methods: {
        handleClick(fun) {
            this.$emit('handleClick', fun)
            this.visible = false
        },
        pareBtn(fun) {
            let flag = false
            if (!this.editable) return false   //没有编辑权限
            if (this.routeStatus == 4) return false  //查看状态不能编辑
            if ((this.isAudited == 1) && (fun == 11 || fun == 12)) {
                flag = true
            }
            if (String(fun).startsWith("R_")) flag = true   //R_代表导入功能
            return flag
        }
    },
    mounted() {
        // 获取路由状态, 新增状态不展示任何修改按钮
        this.routeStatus = this.$route.query.status;
    },
}
</script>