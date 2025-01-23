<template>
    <div class="ex-tree-box ex-page-scroll-y" ref="treeBox">
        <el-input v-model="filterText" class="filterInput" />
        <el-tree ref="treeRef" class="filter-tree ex-page-scroll-y" :data="treeData" :props="defaultProps"
            default-expand-all node-key="id" highlight-current @node-click="HandleNodeClick"
            :filter-node-method="filterNode" />
        <div class="resize-handle" @mousedown="startResize">
            <el-icon class="is-icon">
                <el-icon>
                    <CaretRight />
                </el-icon>
            </el-icon>
        </div>
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
            filterText: '', // 过滤文本
            defaultProps: {
                class: this.customNodeClass,
                children: 'children',
                disabled: 'disabled',
                label: ''
            },
            code: '',
            activeRow: [],
            resizing: false,
            startX: 0,
            startWidth: 0
        };
    },
    props: {
        params: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        // 监听 props.params 的变化，重新初始化
        'params': {
            handler() {
                this.HandleInit();
            },
            deep: true
        },
        filterText(newVal) {
            this.$refs.treeRef.filter(newVal)
        }
    },
    methods: {
        // 自定义节点类名
        customNodeClass(data, node) {
            return data.disabled ? 'disabledTree' : '';
        },

        // 节点点击事件处理
        HandleNodeClick(node, data, event) {
            if (node.disabled) return
            this.activeRow = node;
            this.$emit('HandleNodeClik', node)
            eval(this.params.code);  // 运行父组件传递的代码
        },
        HandleClick(num = 0) {
            let obj = {}
            this.params.report ? obj[this.params.report] = this.activeRow.id : ''
            this.$parent.$refs.exFormRef[num].HandleSetData(obj)
            this.$parent.$refs.exFormRef[num].HandleSearch()
        },
        // API 获取数据
        HandleGetData() {
            if (!this.url || this.url == '') return
            request({
                url: this.url,
                method: 'get',
                data: {}
            }).then((res) => {
                this.treeData = buildTree(res.data,'deptId');
            });
        },

        // 初始化方法
        HandleInit() {
            this.url = this.params.API;
            this.defaultProps.label = this.params.propsLabel;
            this.code = this.params.code;
            this.HandleGetData();
        },

        // 节点过滤方法
        filterNode(value, data) {
            if (!value) return true;
            return data[this.params.propsLabel].includes(value);
        },

        startResize(event) {
            this.resizing = true;
            this.startX = event.clientX;
            this.startWidth = this.$refs.treeBox.offsetWidth;
            document.addEventListener('mousemove', this.resize);
            document.addEventListener('mouseup', this.stopResize);
        },

        resize(event) {
            if (this.resizing) {
                const newWidth = this.startWidth + (event.clientX - this.startX);
                this.$refs.treeBox.style.width = `${newWidth}px`;
                localStorage.setItem(
                    `exTree${this.$route.path}`,
                    newWidth
                );
            }
        },

        stopResize() {
            this.resizing = false;
            document.removeEventListener('mousemove', this.resize);
            document.removeEventListener('mouseup', this.stopResize);
        },
        /**
         * 设置缓存宽度
         */
        resetWidth() {
            const width = localStorage.getItem(`exTree${this.$route.path}`);
            this.$refs.treeBox.style.width = `${width}px`;
        }
    },
    mounted() {
        // 在组件挂载时初始化
        this.HandleInit();
        this.resetWidth()
    }
}
</script>

<style lang="scss" scoped>
.filter-tree {
    height: calc(100% - 60px);
    overflow-y: auto;
}

.filterInput {
    width: 100%;
    margin-bottom: 10px;
}

.resize-handle {
    position: absolute;
    top: 50%;
    right: -2px;
    cursor: ew-resize;
    display: flex;
    justify-content: center;
    align-items: center;
}

.resize-handle i {
    font-size: 12px;
    color: #333;
}
</style>

<style lang="scss">
.disabledTree {
    color: #d1d5db;
    pointer-events: none;
    cursor: not-allowed
}

.disabledTree.is-current .el-tree-node__content {
    background: none !important;
}

.disabledTree .el-tree-node__content:hover {
    cursor: not-allowed !important;
}
</style>
