<template>
    <div class="form" id="exTabsClass">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <template v-for="(element) in outerElement.children" :key="element.id">
                <el-tab-pane class="demo-pane" :label="element.label" :name="element.id">
                    <AgTable class="AgTable" :ref="element.propsName" :paging="true"
                        :gridColDefs="element.gridColDefs.filter(ele => ele.isShow)" :gridActions="element.actionGroup"
                        :gridKey="$route.path + element.id" :grildUrl="element.API" :rowSelection="element.rowSelection"
                        :suppressRowClickSelection="false" :PageDisabled="PageDisabled" />
                </el-tab-pane>
            </template>
        </el-tabs>
    </div>
</template>

<script>
export default {
    props: {
        outerElement: {
            type: Object,
            default: () => { }
        },
        outerData: {
            type: Object,
            default: () => { }
        },
        PageDisabled: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        outerData(newVal) {
            this.form = newVal
            this.HandleSetData()
        },
    },
    data() {
        return {
            form: {
            },
            activeName: ''
        }
    },
    mounted() {
        this.activeName = this.outerElement.children[0].id
        this.HandleSetData()
    },
    methods: {
        /**
         * aggrid赋值
         */
        HandleSetData() {
            this.outerElement.children.forEach(ele => {
                let data = this.outerData[ele.propsName] || []
                this.$refs[ele.propsName][0].HandleSetData(data)
            })
        },
        /**
         * 校验结果
         */
        HandleValidate() {
            let vaild = this.outerElement.children.every(item => this.$refs[item.propsName][0].HandleValidate())
            if (!vaild) this.$message.error('必填值未填')
            return vaild
        },
        /**
         * aggrid获取
         */
        HandleGetData() {
            let obj = {}
            this.outerElement.children.forEach(ele => {
                let data = this.$refs[ele.propsName][0].HandleGetData()
                obj[ele.propsName] = data
            })
            return obj
        },
        /**
         * aggrid获取复制之后数据
         */
         HandleGetCopyData() {
            let obj = {}
            this.outerElement.children.forEach(ele => {
                let data = this.$refs[ele.propsName][0].HandleGetCopyData()
                obj[ele.propsName] = data
            })
            return obj
        }
    }
}
</script>
<style scoped lang="scss">
.form {
    width: 100%;
    padding-inline: 5px 20px;
    background: white;
}

.demo-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.demo-pane {
    height: 100%;
}
</style>
<style lang="scss">
#exTabsClass {
    .el-tabs__content {
        flex: 1;
        overflow: auto;
    }
}
</style>