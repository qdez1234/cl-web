<template>
  <el-select v-model="selectedValue" clearable filterable @change="onChange" class="select-cell" style="height: 100%;">
    <el-option v-for="(option, index) in options" :key="index" :label="option.label" :value="option.value" />
  </el-select>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedValue: this.params.value, // 绑定的值
      options: this.params.options || [] // 下拉选项
    };
  },
  watch: {
    // 监听 props.params.value 的变化
    'params.value'(newValue) {
      this.selectedValue = newValue;
    },
    // 监听 props.params.options 的变化
    'params.options'(newValue) {
      this.options = newValue;
    }
  },
  methods: {
    onChange(value) {
      const { data, colDef } = this.params;
      data[colDef.field] = value; // 更新字段的值
      this.params.context.componentParent.HandleCellSelect(colDef.field, data); // 通知父组件处理
    },
    // 必须实现 getValue 方法，用于 AG Grid 获取返回编辑后的值
    getValue() {
      return this.selectedValue;
    }
  }
};
</script>

<style scoped>
.select-cell {
  width: 100%;
  box-sizing: border-box;
}
</style>
