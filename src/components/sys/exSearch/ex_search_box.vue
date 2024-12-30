<template>
  <div class="ex-search-box">
    <!-- 参与查询和表单, disabled用于表单渲染的时候权限判断 -->
    <el-form :inline="true" ref="ruleFormRef" :model="searchParams" class="ex-form-inline" label-width="100px"
      @submit.native.prevent>
      <el-row :gutter="20">
        <template v-for="(ele, index) in qiuckOptions" :key="index">
          <el-col :span="props.isForm ? (ele.formOccupy ? ele.formOccupy * 6 : 6) : (ele.occupy ? ele.occupy * 6 : 6)"
            style="padding-left: 0;">
            <el-form-item
              :label="props.isForm ? (ele.formCustomName || ele.defaultName) : (ele.customName || ele.defaultName)"
              :label-width="ele.labelWidth" :prop="ele.field" :rules="(ele.isEmpty && props.isForm) ? [{
                required: true,
                message: ``,
                trigger: 'blur',
              }] : []">
              <ex-dictSelect v-model="searchParams[ele.field]" :teleported="props.isForm"
                :disabled="pareDiabled(ele)" :placeholder="pareDiabled(ele) ? '' : ele.placeholder"
                :code="pareDict(ele)" v-if="pareDict(ele)">
              </ex-dictSelect>

              <ex-report-dialog-box v-else-if="pareshowTypeDialog(ele)" :formData="searchParams" :isForm="props.isForm"
                :editable="props.editable" :isAudited="props.isAudited" :disabled="pareDiabled(ele)"
                :rowSelection="pareRowSelection()" v-model="searchParams[ele.field]" @handleReport="handleReport"
                @handleMainChange="handleMainChange" :source="pareApiData(ele)">
              </ex-report-dialog-box>

              <ex-report-select-box v-else-if="pareshowTypeSelect(ele)" :formData="searchParams" :isForm="props.isForm"
                :editable="props.editable" :isAudited="props.isAudited" :disabled="pareDiabled(ele)"
                :rowSelection="pareRowSelection()" v-model="searchParams[ele.field]" @handleReport="handleReport"
                @handleMainChange="handleMainChange" :source="pareApiData(ele)">
                >
              </ex-report-select-box>

              <el-input v-model="searchParams[ele.field]" :disabled="pareDiabled(ele)" type="number"
                v-else-if="ele.javaType == 'BigDecimal' || ele.javaType == 'Long' || ele.javaType == 'Integer' || ele.javaType == 'Double'"
                :placeholder="pareDiabled(ele) ? '' : ele.placeholder" clearable @keyup.enter="search">
                <template #append v-if="ele.suffix">{{ ele.suffix }}</template> </el-input>

              <el-input v-model="searchParams[ele.field]" :disabled="pareDiabled(ele)"
                v-else-if="ele.javaType != 'Date'" :placeholder="pareDiabled(ele) ? '' : ele.placeholder" clearable
                @keyup.enter="search">
                <template #append v-if="ele.suffix">{{ ele.suffix }}</template> </el-input>

              <el-date-picker v-model="searchParams[ele.field]" :disabled="pareDiabled(ele)"
                v-else-if="ele.javaType == 'Date'" :placeholder="pareDiabled(ele) ? '' : ele.placeholder" type="date"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD" />

            </el-form-item>

          </el-col>
        </template>

        <el-col :span="4" v-if="!props.isForm">
          <el-form-item class="ex-btn">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
            <el-button :icon="Filter" v-if="props.filter" @click="drawer = true" /> </el-form-item></el-col>
      </el-row>
    </el-form>
  </div>

  <!-- 仅参与用户查询 -->
  <el-drawer v-model="drawer" class="ex-search-drawer" :with-header="false" title="" direction="ttb">
    <el-form :inline="true" ref="ruleFormRefDrawer" :model="searchParams" class="ex-form-inline" label-width="100px"
      @submit.native.prevent>
      <el-row :gutter="20">
        <template v-for="(ele, index) in searchOptions" :key="index">
          <el-col :span="ele.occupy ? ele.occupy * 5 : 5" style="padding-left: 0;">

            <el-form-item :label="ele.customName || ele.defaultName" :prop="ele.field" :rules="(ele.isEmpty && props.isForm) ? [{
              required: true,
              message: ``,
              trigger: 'blur',
            }] : []">

              <ex-dictSelect v-model="searchParams[ele.field]" :teleported="props.isForm"
                :disabled="pareDiabled(ele)" :placeholder="pareDiabled(ele) ? '' : '请选择'" :code="pareDict(ele)"
                v-if="pareDict(ele)" />

              <ex-report-dialog-box v-else-if="pareshowTypeDialog(ele)" :formData="searchParams" :isForm="props.isForm"
                :editable="props.editable" :isAudited="props.isAudited" :disabled="pareDiabled(ele)"
                :rowSelection="pareRowSelection()" v-model="searchParams[ele.field]" @handleReport="handleReport"
                @handleMainChange="handleMainChange" :source="pareApiData(ele)" />

              <ex-report-select-box v-else-if="pareshowTypeSelect(ele)" :formData="searchParams" :isForm="props.isForm"
                :editable="props.editable" :isAudited="props.isAudited" :disabled="pareDiabled(ele)"
                :rowSelection="pareRowSelection()" v-model="searchParams[ele.field]" @handleReport="handleReport"
                @handleMainChange="handleMainChange" :source="pareApiData(ele)" />

              <el-input v-model="searchParams[ele.field]" :disabled="pareDiabled(ele)" type="number"
                v-else-if="ele.javaType == 'BigDecimal' || ele.javaType == 'Long' || ele.javaType == 'Integer' || ele.javaType == 'Double'"
                :placeholder="pareDiabled(ele) ? '' : '请输入'" clearable @keyup.enter="search" />

              <el-input v-model="searchParams[ele.field]" :disabled="pareDiabled(ele)"
                v-else-if="ele.javaType != 'Date'" :placeholder="pareDiabled(ele) ? '' : '请输入'" clearable
                @keyup.enter="search" />

              <el-date-picker v-model="searchParams[ele.field]" :disabled="pareDiabled(ele)"
                v-else-if="ele.javaType == 'Date'" :placeholder="pareDiabled(ele) ? '' : '请选择'" type="date"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </el-form-item>

          </el-col>
        </template>
        <el-col :span="4">
          <el-form-item class="ex-btn">
            <el-button type="primary" @click="searchDrawer">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { Filter } from "@element-plus/icons-vue";

const { proxy } = getCurrentInstance();

const emit = defineEmits(["search", "update:queryParams"]);

const route = useRoute();

const routeStatus = route.query.status

const props = defineProps({
  qiuckOptions: {     //渲染数据对象,快捷查询
    type: Array,
    required: true,
  },
  searchOptions: {     //渲染数据对象
    type: Array,
    required: false,
    default: []
  },
  queryParams: {     //当前数据
    type: Object,
    required: true,
  },
  // 是否是表单渲染
  isForm: {
    type: Boolean,
    default: false
  },
  // 是否审核
  isAudited: {
    type: String || Number,
    default: 0
  },
  //是否能编辑
  editable: {
    type: Boolean,
    default: true
  },
  //是否明细
  hasDetail: {
    type: Boolean,
    default: false
  },
  filter: {
    type: Boolean,
    default: true
  },
}
);
const ruleFormRef = ref(null)
const ruleFormRefDrawer = ref(null)
let searchParams = ref(props.queryParams)
let drawer = ref(false)
watch(
  () => props.queryParams,
  (newValue) => {
    searchParams.value = newValue
  }
);
/* 解析code */
const pareDict = (row) => {
  if (row.dictionary) {
    return row.dictionary
  }
  if (row.source) {
    let source = JSON.parse(row.source)
    if (source.sourceType == 1) {   //字典
      return source.sourceData
    }
  }
  return undefined
}
/* 解析API数据来源 */
const pareApiData = (row) => {
  if (row.source) {
    let source = JSON.parse(row.source)
    if (source.sourceType == 2) {   //API数据导入
      return source.sourceData
    }
  }
  return false
}
/* 解析API数据来源 0 下拉框  1 弹窗 */
const pareshowTypeSelect = (row) => {
  if (row.source) {
    let source = JSON.parse(row.source)
    if (source.sourceType == 2 && source.sourceData.showType == 0) {   //API数据导入
      return true
    }
  }
  return false
}

/* 解析API数据来源 0 下拉框  1 弹窗 */
const pareshowTypeDialog = (row) => {
  if (row.source) {
    let source = JSON.parse(row.source)
    if (source.sourceType == 2 && source.sourceData.showType == 1) {   //API数据导入
      return true
    }
  }
  return false
}
/* 解析表单情况是否只读 */
const pareDiabled = (row) => {
  if (!props.editable || routeStatus == 4) return true  //没有编辑权限
  if (props.hasDetail && row.isLock) return true   //主表存在明细, isLock为true不能修改
  if ((row.isReadonly && props.isForm) || props.isAudited == 1) return true
  return false
}
/* 是否表单,表单单选 */
const pareRowSelection = () => {
  if (props.isForm) return "single"
  return "multiple"
}
/* 数据导出,根据主键字段导出*/
const handleMainChange = (data) => {
  Object.keys(data).map(ele => {
    searchParams.value[ele] = data[ele]
  })
}
/* 数据导出,表单修改的时候才需要进行数据修改关联导出,只作用于明细导出 */
const handleReport = (data) => {
  if (!props.isForm) return
  let row = data[0]
  if (row) {
    let rowKeys = Object.keys(row)
    let searchKeys = props.searchOptions.map(ele => ele.field)
    rowKeys.forEach((key, index) => {
      searchParams.value[key] = row[key]
    });
  }
}

/* 所有查询 */
const searchDrawer = () => {
  ruleFormRefDrawer.value.validate((valid) => {
    if (valid) {
      emit("update:queryParams", searchParams.value);
      emit("search", searchParams.value);
    } else {
      console.log('error submit!')
    }
  })
}
/* 快捷查询 */
const search = () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      emit("update:queryParams", searchParams.value);
      emit("search", searchParams.value);
    } else {
      console.log('error submit!')
    }
  })
};

/* 重置 */
const resetQuery = () => {
  /** 重置按钮操作 */
  searchParams.value = {};
  search();
};
/* 校验是否通过必填 */
const searchValid = () => {
  return ruleFormRef.value.validate((valid) => {
    if (valid) {
      return true
    } else {
      return false
    }
  })
}
defineExpose({
  searchValid,
});
</script>

<style lang="scss">
.ex-search-drawer {
  height: auto !important
}

.ex-search {
  .el-overlay {
    position: absolute;
    overflow: visible;
    height: 95vh;
  }
}
</style>