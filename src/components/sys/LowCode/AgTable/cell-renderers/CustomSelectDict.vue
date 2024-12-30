<template>
    <el-select v-model="selectedValue" filterable @change="onChange" class="select-cell" style="height: 100%;">
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
      // 选中的值
      selectedValue: this.params.value,
      // 字典选项
      options: []
    };
  },
  mounted() {
    // 初始化时加载字典数据
    this.loadDictOptions();
  },
  methods: {
    // 加载字典数据的方法
    async loadDictOptions() {
      const dict_key = this.params.dict_key;
      this.options = await this.getDictValue(dict_key);
    },

    // 当选中项变化时的回调
    onChange(value) {
      const { data, colDef } = this.params;
      // 调用父组件的 HandleCellSelect 方法，传递字段和数据
      this.params.context.componentParent.HandleCellSelect(colDef.field, data);
    },

    // 必须实现 getValue 方法，用于 AG Grid 获取返回编辑后的值
    getValue() {
      return this.selectedValue;
    }
  },
  watch: {
    // 监听 props 的变化，并同步 selectedValue
    'params.value': function (newValue) {
      this.selectedValue = newValue;
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
