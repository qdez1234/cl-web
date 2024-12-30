<template>
  <el-button :type="type" text bg size="small">{{ text }}</el-button>
</template>

<script setup >

import { defineProps, onMounted } from 'vue';
// 字典回显

const { proxy } = getCurrentInstance();

const props = defineProps({
  params: Object
});

let text = ref(null);

const dict_key = props.params.dict_key

let type =  ref('primary');

const { data, colDef } = props.params;
const field = data[colDef.field]

onMounted(async ()=>{
  let val =  await  proxy.getDictValue(dict_key)
  text.value = val.find(ele=>ele.value == field)?.label || ""
  type.value = val.find(ele=>ele.value == field)?.elTagType || "primary"
})
</script>
