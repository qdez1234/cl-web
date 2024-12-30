<template>
  <el-select 
      v-model="selectValue" 
      clearable 
      filterable
      v-bind="$attrs"
      >
    <el-option v-for="item in options" :key="item.typeCode" :label="item.typeName" :value="item.typeCode">
    </el-option>
  </el-select>

  <el-radio-group
    v-if="showModel == 'radio'"
      v-model="selectValue" 
      v-bind="$attrs"
  >
    <el-radio
    v-for="item in options" :key="item.typeCode" :label="item.typeName" :value="item.typeCode"
    ></el-radio>
  </el-radio-group>

  <el-radio-group
    v-if="showModel == 'radioButton'"
      v-model="selectValue" 
      v-bind="$attrs"
  >
    <el-radio-button
    v-for="item in options" :key="item.typeCode" :label="item.typeName" :value="item.typeCode"
    />
  </el-radio-group>



</template>

<script>
export default {
  data() {
    return {
      selectValue: '',
      options: [],
      dataMap:{}
    }
  },
  props: {
    groupKey: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    showModel: {
      type: String,
      default: "select" // checkbox radio
    }
  },
  watch: { 
    'selectValue'(val, old) {
      this.$emit('update:modelValue', val);
      this.$emit('handleSelect', this.dataMap[val])
    }    
  },
  
   mounted() {
     this.initOptions()

  },
  methods: {
    initOptions() {
      this.options=proxy.useDict(props.groupKey)[props.groupKey];
      this.dataMap = {}
          _this.options.forEach(r=>{
            _this.dataMap[r.typeCode] = r
          })
    }
    
  },

}
</script>

<style>

</style>
