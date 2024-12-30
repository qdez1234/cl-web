<template>
    <el-tree-select style="width: 100%;" v-model="selectValue" :data="menuOptions" @current-change="handleChange"
        :props="{ value: 'menuId', label: 'menuName', children: 'children' }" value-key="menuId" placeholder="选择上级菜单"
        check-strictly :render-after-expand="false" />

</template>

<script setup>
import { listMenu } from "@/api/system/menu";

const { proxy } = getCurrentInstance();

const props = defineProps({
    value: {
        type: [String,Number],
        default: "",
    },
    menuUrl: {
        type: [String,Number],
        default: "",
    },
});

const emit = defineEmits(['update:modelValue','update:menuUrl', 'handleSelect']);

const menuOptions = ref([]);

let selectValue = ref(props.value);

/** 查询菜单下拉树结构 */
function getTreeselect() {
    menuOptions.value = [];
    listMenu().then(response => {
        const menu = { menuId: 0, menuName: "主类目", children: [] };
        menu.children = proxy.handleTree(response.data, "menuId");
        menuOptions.value.push(menu);
    });
}
function handleChange(row){
    selectValue.value = row.menuId
    emit("update:modelValue", selectValue.value);
    emit("update:menuUrl", row.component || "");
    emit("handleSelect",row)
}
onMounted(() => {
    getTreeselect();
});
</script>
<style lang="scss">
.dict_select {
    width: 100% !important;
}
</style>