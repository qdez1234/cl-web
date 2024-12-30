<template>
  <el-date-picker @change="onChange" v-model="selectedValue" class="customerDate_input" type="date"
    placeholder="Pick a Date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  emits: ["HandleCellClick"],
  data() {
    return {
      selectedValue: this.params.value, // 初始化值绑定到 params.value
    };
  },
  watch: {
    // 监听 params.value 的变化，更新 selectedValue
    "params.value"(newValue) {
      this.selectedValue = newValue;
    },
  },
  methods: {
    // 处理日期选择变化事件
    onChange(value) {
      const { data, colDef } = this.params;
      data[colDef.field] = value; // 更新字段值
      this.params.context.componentParent.HandleCellSelect(colDef.field, data); // 调用外部方法
    },
    // 必须实现 getValue 方法，用于 AG Grid 获取返回编辑后的值
    getValue() {
      return this.selectedValue;
    }
  },
};
</script>

<style lang="scss">
.customerDate_input {
  width: 100% !important;
}
</style>
