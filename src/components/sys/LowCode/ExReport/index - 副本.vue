<template>
    <div :class="['tagBox', disabled ? 'disabled' : '']" @click="handleOpen">
        <div class="left">
            <el-tag v-for="(tag, index) in tags" @close="handleDel(tag)" :key="index" closable>
                {{ echoText(tag) }}
            </el-tag>
        </div>
        <div class="right">
            <el-icon class="icon-arrow">
                <ArrowDownBold />
            </el-icon>
        </div>
    </div>
    <el-select popper-class="exReportSelectPopper" ref="selectRef"  :automatic-dropdown="true" class="exReportSelect"
        v-model="tags" multiple>
        <template #tag>
            <el-tag v-for="(tag, index) in tags" @close="handleDel(tag)" :key="index" closable>
                {{ echoText(tag) }}
            </el-tag>
        </template>
        <template #header>
            <div class="search">
                <!-- <ex-search-box v-model:queryParams='queryParams' :filter="false" :qiuckOptions='qiuckOptions'
            @search="getList" /> -->
            </div>
            <div class="tagsBox">
                <el-tag v-for="(tag, index) in tagsBefore" @close="handleDelBefore(tag)" :key="index" closable>
                    {{ echoText(tag) }}
                </el-tag>
            </div>
            <AgTable class="AgTable" :grildParams="queryParams" :grildFixedParams="fixedParams" ref="gridRef"
                :rowSelection="rowSelection" :paging="true" :gridColDefs="gridColDefs" :suppressRowClickSelection="true"
                :grildUrl="Dapi" :gridKey="route.path + 'exReportSelect'" @handleChange="setValue"
                @handleRowSelect="handleRowSelect" />
        </template>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
            </div>
        </template>
    </el-select>
<!-- 
    <el-dialog v-model="dialogVisible" v-if="showType=='dialog'"  draggable title="数据查询" :close-on-click-modal="false" width="80%">
        <div class="content">
            <div class="search">
               <ex-search-box v-model:queryParams='queryParams' :filter="false" :qiuckOptions='qiuckOptions'
          @search="getList" /> 
            </div>
            <div class="tagsBox">
                <el-tag v-for="(tag, index) in tagsBefore" @close="handleDelBefore(tag)" :key="index" closable>
                    {{ echoText(tag) }}
                </el-tag>
            </div>
            <AgTable class="AgTable" :grildParams="queryParams" :grildFixedParams="fixedParams" ref="gridRef"
                :rowSelection="rowSelection" :paging="true" :gridColDefs="gridColDefs" :suppressRowClickSelection="true"
                :gridKey="route.path + 'exReportDialog'" :grildUrl="Dapi" @handleChange="setValue"
                @handleRowSelect="handleRowSelect" />
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
            </div>
        </template>
    </el-dialog> -->

</template>

<script setup>
const props = defineProps({
    params: {
        default: () => ({})  // 使用函数返回默认对象
    },
    modelValue: {
        type: [String, Number],
        default: ''  // 设置默认值
    }
});
watch(() => props.params, () => {
    console.log('数据改变了')
    HandleInit()
}, { deep: true })

const route = useRoute();

const router = useRouter();

const dialogVisible = true

const selectRef = ref(null)

let disabled = ref(false)

let tagsBefore = ref([])

let queryParams = ref({})

let Dapi = ref("")

let fixedParams = ref({})

let rowSelection = ref("multiple")

let gridColDefs = ref([])

let showType = ref("select")

/** 开启弹窗 */
const handleOpen = () => {
    if (disabled) return
    tagsBefore.value = [...tags.value]
    selectRef.value.focus()
    setValue()
}
/**
* 初始化
*/
const HandleInit = () => {
    disabled.value = props.params.isReadonly

    fixedParams.value = props.params.config.params

    rowSelection.value = props.params.config.rowSelection

    Dapi.value = props.params.config.Dapi

    showType.value = props.params.config.showType

}
/**
 * 回显字段配置
 */
const echoText = () => {

}
/**
 * 删除已经确认过的数据
 */
const handleDel = () => {

}
/**
 * 删除未确认的数据
 */
const handleDelBefore = () => {

}
/**
 * 确认选择
 */
const handleRowSelect = () => {

}
/**
 * 获取api数据
 */
const initOptions = async () => {
    if (code.value == "") return;
    options.value = await proxy.getDictValue(code.value)
};
/**
 * 设置值
 */
const setValue = () => {

}
</script>

<style scoped lang="scss">
.content {
    height: 60vh;
    display: flex;
    flex-direction: column;
}

.search {
    .form-inline {
        display: flex;
    }

    :deep(.el-col) {
        flex: 1;
        max-width: 40%;
    }
}

.exReportSelect {
    position: absolute;
    z-index: -999;
}

.tagBox {
    display: flex;
    height: 30px;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--el-border-color);
    cursor: pointer;
    width: 100%;

    .el-tag {
        margin-right: 5px;
        margin-bottom: 8px;
    }

    .left {
        flex-grow: 1;
        /* 左侧内容自适应宽度 */
        height: 100%;
        overflow: hidden;
        display: flex;
        padding: 2px 0 0 5px;
    }

    .right {
        width: 20px;
    }
}

.tagsBox {
    max-height: 80px;
    overflow-y: auto;
    max-width: 820px;
    padding-bottom: 10px;

    .el-tag {
        margin-right: 5px;
    }
}

.AgTable {
    height: 350px !important;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
}

.disabled {
    background: var(--el-disabled-bg-color) !important;
}
</style>
<style lang="scss">
.exReportSelectPopper {
    .el-select-dropdown__header {
        padding-bottom: 0;
    }

    .el-select-dropdown__empty {
        display: none;
    }

    .el-select-dropdown__footer {
        border: none;
    }
}
</style>