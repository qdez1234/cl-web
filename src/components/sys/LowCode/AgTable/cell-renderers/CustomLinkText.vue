<template>
  <el-link :type="type" @click="handleClick">{{ text }}</el-link>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
// 接收 ag-Grid 传入的 params
const props = defineProps<{ params: any }>();

// 获取自定义属性
const type = props.params.type || 'primary';
const text = props.params.text || 'primary';
function handleClick() {
  const { data, colDef } = props.params;
  const rowIndex = props.params.node.rowIndex;
  props.params.context.componentParent.HandleLinkTextClick(colDef.field,data,rowIndex);
}
</script>
