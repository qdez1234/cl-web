<template>
  <el-date-picker
    @change="onChange"
    v-model="selectedValue"
    class="customerDate_datetime"
    type="datetime"
    placeholder=""
    format="YYYY/MM/DD HH:mm:ss"
    value-format="YYYY/MM/DD HH:mm:ss"
  />
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  emits: ["handleCellSelect"],
  data() {
    return {
      selectedValue: this.params.value, // 初始化为父组件传递的值
    };
  },
  watch: {
    // 监听 params.value 的变化，动态更新 selectedValue
    "params.value"(newValue) {
      this.selectedValue = newValue;
    },
  },
  methods: {
    // 处理值变化事件
    onChange(value) {
      const { data, colDef } = this.params;
      data[colDef.field] = value; // 更新字段值
      this.$emit("handleCellSelect", value, data); // 向父组件发送事件
    },
    // 实现 getValue 方法，返回编辑后的值
    getValue() {
      return this.selectedValue;
    },
  },
};
</script>

<style lang="scss">
.customerDate_datetime {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
}
</style>
