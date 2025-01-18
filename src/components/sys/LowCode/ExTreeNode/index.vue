<template>
    <div class="menu-tree">
        <div class="menu" v-for="menu in menuData" :key="menu.id">
            <div class="label">
                <el-checkbox v-model="menu.check" @change="handleChange($event, menu)" :label="menu.label"
                    size="large" />
            </div>
            <div class="right">
                <div class="page" v-for="page in menu.children" :key="page.id">
                    <template v-if="page.meta.menuType == 'M'">
                        <div class="label t-label m-label">
                            <el-checkbox v-model="page.check" @change="handleChange($event, page)" :label="page.label"
                                size="large" />
                        </div>
                        <div class="p-box">
                            <template v-for="pg in page.children" :key="pg.id">
                                <div class="s-box">
                                    <div class="label t-label s-label">
                                        <el-checkbox v-model="pg.check" @change="handleChange($event, pg)"
                                            :label="pg.label" size="large" />
                                    </div>
                                    <div class="b-box">
                                        <template v-for="btn in pg.children" :key="btn.id">
                                            <div class="btn">
                                                <el-checkbox v-model="btn.check" @change="handleChange($event, btn)"
                                                    :label="btn.label" size="large" />
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>
                    <template v-if="page.meta.menuType == 'C'">
                        <div class="label t-label">
                            <el-checkbox v-model="page.check" @change="handleChange($event, page)" :label="page.label"
                                size="large" />
                        </div>
                        <div class="b-box">
                            <template v-for="btn in page.children" :key="btn.id">
                                <div class="btn">
                                    <el-checkbox v-model="btn.check" @change="handleChange($event, btn)"
                                        :label="btn.label" size="large" />
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, watch } from 'vue';

// 使用 props 接收组件的属性
const props = defineProps({
    data: {
        type: Array,
        default: () => ([])
    },
    cehckList: {
        type: Array,
        default: () => ([])
    }
});

const menuData = ref([])

watch(() => props.data, (newVal) => {
    menuData.value = setCheckStatus(newVal)
})

/**
 *  遍历树形结构并为每个节点设置 check 属性
 * @param nodeList 
 */
const setCheckStatus = (nodeList) => {
    nodeList.forEach(node => {
        // 判断当前节点的 id 是否在 checkList 中
        node.check = props.cehckList.includes(node.id);

        // 如果有子节点，则递归调用 setCheckStatus
        if (node.children && node.children.length > 0) {
            setCheckStatus(node.children);
        }
    });
    return nodeList
};
/**
 * 遍历树形结构并为每个获取节点设置 check 属性
 * @param nodeList 
 */
const getCheckedIds = (list = menuData.value) => {
    let checkedIds = [];
    list.forEach(node => {
        // 如果当前节点的 check 为 true，则将 id 加入数组
        if (node.check) {
            checkedIds.push(node.id);
        }

        // 如果有子节点，则递归获取子节点的 checked id
        if (node.children && node.children.length > 0) {
            checkedIds = checkedIds.concat(getCheckedIds(node.children)); // 合并子节点的结果
        }
    });
    return checkedIds;
};
/**
 * 节点选中事件
 */
const handleChange = (flag, menu) => {
    findNodeById(menuData.value, menu.id, flag)
    // console.log(data, '用户数据')
    // menuData.value = data
}
/**
 * 更新子节点及其所有层级的子节点
 * @param treeData 
 * @param id 
 * @param flag 
 */
function findNodeById(treeData, id, flag) {
    for (let node of treeData) {
        if (node.id === id) {
            node.check = flag;  // 更新目标节点的 check 属性
            // 遍历所有子节点，递归更新子节点及其所有层级
            updateChildrenCheck(node.children, flag);
            return
        }
        if (node.children && node.children.length > 0) {
            const found = findNodeById(node.children, id, flag);  // 递归查找子节点
        }
    }
}

/**
 * 更新所有子节点的 check 属性
 * @param children 
 * @param flag 
 */
function updateChildrenCheck(children, flag) {
    for (let child of children) {
        child.check = flag;  // 更新当前子节点的 check 属性
        if (child.children && child.children.length > 0) {
            // 如果有子节点，递归更新
            updateChildrenCheck(child.children, flag);
        }
    }
}

/**
 * 暴露选中ids
 */
const getData = () => {
    return getCheckedIds()
}

onMounted(() => {
    menuData.value = props.data
})
defineExpose({ getData })
</script>
<style scoped lang="scss">
$bgc : #ccc;

.label {
    display: flex;
    align-items: center;
    width: 170px;
    padding-left: 20px;
}

.t-label {
    border-right: 1px dashed $bgc;
}

.p-box {
    display: flex;
    flex-direction: column;

    .s-box {
        border-bottom: 1px dashed $bgc;
        display: flex;
    }

    .s-box:last-child {
        border-bottom: none;
    }

}

.menu-tree {
    display: flex;
    flex-direction: column;
    border: 0.5px dashed #ccc;
    overflow: auto;
    height: 100%;

    .menu {
        display: flex;
        border-bottom: 0.5px dashed $bgc;

        .right {
            display: flex;
            flex: 1;
            flex-direction: column;

            .page {
                display: flex;
                flex: 1;
                border: 0.5px dashed $bgc;
                border-bottom: none;

                .b-box {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    flex: 1;
                    padding-left: 20px;

                    .btn {
                        display: flex;
                        align-items: center;
                        padding-right: 20px;

                    }
                }

            }

            .page:first-child {
                border-top: none;
            }
        }

    }

    .menu:last-child {
        border-bottom: none;
    }
}
</style>