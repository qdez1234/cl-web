<template>
  <div :class="['tagBox', props.disabled ? 'disabled' : '']" @click="handleOpen" v-if="!props.isReport">
    <div class="left">
      <el-tag v-for="(tag, index) in tags" @close="handleDel(tag)" :key="index" closable>
        {{ echoText(tag) }}
      </el-tag>
    </div>
    <div class="right">
      <el-icon class="icon-arrow">
        <ArrowDownBold />
      </el-icon>
    </div>
  </div>
  <el-select popper-class="exReportSelectPopper" ref="selectRef" :automatic-dropdown="true" class="exReportSelect"
    v-model="tags" multiple>
    <template #tag>
      <el-tag v-for="(tag, index) in tags" @close="handleDel(tag)" :key="index" closable>
        {{ echoText(tag) }}
      </el-tag>
    </template>
    <template #header>
      <div class="search">
        <ex-search-box v-model:queryParams='queryParams' :filter="false" :qiuckOptions='qiuckOptions'
          @search="getList" />
      </div>
      <div class="tagsBox">
        <el-tag v-for="(tag, index) in tagsBefore" @close="handleDelBefore(tag)" :key="index" closable>
          {{ echoText(tag) }}
        </el-tag>
      </div>
      <AgTable class="AgTable" :grildParams="queryParams" :grildFixedParams="fixedParams" ref="gridRef"
        :rowSelection="props.rowSelection" :paging="true" :gridColDefs="gridColDefs" :suppressRowClickSelection="true"
        :grildUrl="props.source.dataApi" :gridKey="route.path + 'exReportSelect'" @handleChange="setValue"
        @handleRowSelect="handleRowSelect" />
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-select>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  source: {
    type: Object,
  },
  /**当前双向数据绑定的值 */
  value: {
    type: [String, Number],
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  rowSelection: {
    type: String,
    default: "multiple"
  },
  // 表单默认数据
  formData: {
    type: Object,
    default: {}
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
  //是否做导入
  isReport: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['handleReport', 'handleMainChange', 'update:modelValue']);

let queryParams = ref({})
let fixedParams = ref({})
const route = useRoute();
const router = useRouter();
const gridRef = ref(null);
const selectRef = ref(null)

watch(
  () => props.formData,
  (newValue) => {   //根据导出字段,映射自身字段数据
    handleInitTags()
  }
);
//回显字段数组
let echoFiled = props.source.data.filter(ele => ele.echo).map(ele => ele.field)

// 主键字段数据
let sqlFiled = props.source.data.filter(ele => ele.sql).map(ele => ele.field)

let mainFiled = sqlFiled[0]   //主键字段

let mainReportFiled = props.source.data.filter(ele => ele.sql).map(ele => ele.report)[0]  //主键导出字段

// 导出字段
let reportFiled = props.source.data.filter(ele => ele.report).map(ele => {
  return {
    reportField: ele.report,    //导出字段
    currentField: ele.field    //当前字段
  }
})

//label展示标签
let tags = Object.keys(props.formData).length === 0 ? ref([]) : ref([JSON.parse(JSON.stringify(props.formData))])
//弹窗选择框标签
let tagsBefore = ref([])
onMounted(() => {
  handleFixedParams()
  handleInitTags()
})
// 初始化标签内容
const handleInitTags = () => {
  if (props.formData[mainReportFiled] && props.formData[mainReportFiled] != '') {   //数据包含标签内容才需要赋值
    let obj = {}
    reportFiled.forEach((ele) => {
      obj[ele.currentField] = props.formData[ele.reportField]
    })
    tags.value = [obj]
  }
}
//处理固定参数
const handleFixedParams = () => {
  let pm = props.isForm ? props.source.formParams : props.source.searchParams
  const params = new URLSearchParams(pm);
  params.forEach((value, key) => {
    fixedParams.value[key] = value ? value : null; // 将空字符串转换为 null
  });
}
// 查询列表
let qiuckOptions = props.source.data
  .filter((ele) => ele.isSearch)
  .sort((a, b) => a.sequence - b.sequence); // 升序排序：年龄从小到大

// 自定义方法: 获取单元格渲染器
const getCellRenderer = (ele) => {
  if (ele.dictionary && ele.dictionary != "") {
    return 'CustomDict'
  }
  return null;
}
// 自定义方法: 获取单元格渲染器参数
const getCellRendererParams = (ele) => {
  if (ele.dictionary && ele.dictionary != "") {  // 字典
    return { dict_key: ele.dictionary };
  }
  return null;
}

// 渲染的字段
let gridColDefs = props.source.data.filter((ele) => ele.isShow).sort((a, b) => a.sequence - b.sequence).map((ele) => {
  return {
    headerName: ele.customName || ele.defaultName,
    field: ele.field,
    editable: false,
    cellEditor: 'agTextCellEditor',
    cellRenderer: getCellRenderer(ele),
    cellRendererParams: getCellRendererParams(ele),
  };
})

gridColDefs.unshift({
  headerName: "",
  field: "",
  minWidth: 30,
  width: 30,
  checkboxSelection: true,
  headerCheckboxSelection: false,
  filter: false, //隐藏过滤条件
  suppressMenu: true, // 隐藏菜单
})


/** aggrid初始化获取数据 */
const getList = () => {
  nextTick(() => {
    gridRef.value.gridLoadData();
  });
};

/** 根据回显字段回显本文 */
const echoText = (row) => {
  return echoFiled.map(ele => row[ele]).join(',')
}

/** 根据主键字段返回字段绑定值 */
const echoSql = () => {
  let sqlStr = tags.value.map(row => {
    return row[mainFiled]
  }).join(",")
  let list = {
    [mainReportFiled]: sqlStr == "" ? null : sqlStr
  }
  if (!props.isForm) list[mainReportFiled + 's'] = sqlStr == "" ? null : sqlStr    //ids仅用于查询使用
  emit('handleMainChange', list)
  // emit("update:modelValue", sqlStr)
}
/** 根据导出字段返回导出值 */
const echoReport = () => {
  let list = tags.value.map(row => {
    // 使用reduce来创建一个包含指定字段的对象
    let rt = {}
    reportFiled.map((ele) => {
      rt[ele.reportField] = row[ele.currentField]
    })
    return rt
  });
  emit("handleReport", list)
}
/** 开启弹窗 */
const handleOpen = () => {
  if (props.disabled) return
  tagsBefore.value = [...tags.value]
  selectRef.value.focus()
  setValue()
}
/** 关闭弹窗 */
const handleClose = () => {
  selectRef.value.blur()
}
/** 确定选中 */
const handleSubmit = () => {
  tags.value = [...tagsBefore.value]
  echoSql()
  echoReport()
  handleClose()
}

/** 选中事件触发 */
const handleRowSelect = (rows) => {
  if (rows.isSelected && props.rowSelection == 'multiple') tagsBefore.value.push(rows.rowData)
  else if (rows.isSelected && props.rowSelection == 'single') tagsBefore.value[0] = rows.rowData
  else tagsBefore.value = tagsBefore.value.filter(ele => ele[mainFiled] != rows.rowData[mainFiled])
}
/** 选择框弹出删除 */
const handleDelBefore = (tag) => {
  gridRef.value.HandleGridApi().forEachNode((node) => {
    let isSelect = node.data[mainFiled] == tag[mainFiled]
    if (isSelect) node.setSelected(false);
  });
  tagsBefore.value = tagsBefore.value.filter(ele => ele[mainFiled] != tag[mainFiled])
}
/** label展示回显，删除 */
const handleDel = (tag) => {
  if (props.disabled) return
  tags.value = tags.value.filter(ele => ele[mainFiled] != tag[mainFiled])
  echoSql()
  echoReport()
}

/*  根据tagsBefore回显选中数据 */
const setValue = () => {
  setTimeout(() => {
    gridRef.value.HandleGridApi().forEachNode((node) => {
      let isSelect = tagsBefore.value.find(ele => ele[mainFiled] == node.data[mainFiled])
      if (isSelect) node.setSelected(true);
      else node.setSelected(false);
    });
  }, 50)
};
defineExpose({
  setValue,
});
</script>

<style scoped lang="scss">
.content {
  height: 60vh;
  display: flex;
  flex-direction: column;
}

.search {
  .form-inline {
    display: flex;
  }

  :deep(.el-col) {
    flex: 1;
    max-width: 40%;
  }
}

.exReportSelect {
  position: absolute;
  z-index: -999;
}

.tagBox {
  display: flex;
  height: 30px;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--el-border-color);
  cursor: pointer;
  width: 100%;

  .el-tag {
    margin-right: 5px;
    margin-bottom: 8px;
  }

  .left {
    flex-grow: 1;
    /* 左侧内容自适应宽度 */
    height: 100%;
    overflow: hidden;
    display: flex;
    padding: 2px 0 0 5px;
  }

  .right {
    width: 20px;
  }
}

.tagsBox {
  max-height: 80px;
  overflow-y: auto;
  max-width: 820px;
  padding-bottom: 10px;

  .el-tag {
    margin-right: 5px;
  }
}

.AgTable {
  height: 350px !important;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.disabled {
  background: var(--el-disabled-bg-color) !important;
}
</style>
<style lang="scss">
.exReportSelectPopper {
  .el-select-dropdown__header {
    padding-bottom: 0;
  }

  .el-select-dropdown__empty {
    display: none;
  }

  .el-select-dropdown__footer {
    border: none;
  }
}
</style>