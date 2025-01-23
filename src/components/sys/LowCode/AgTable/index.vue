<template>
  <div class="container">

    <div :class="['actionBox', props.PageDisabled ? 'pageNone' : '']">
      <template v-for="(btn, index) in props.gridActions" :key="index">
        <template v-if="btn.config && Object.keys(btn.config).length > 0">
          <ex-report :params="btn" model="report" @update:report="HandleUpdateReport"
            :PageDisabled="props.PageDisabled" />
        </template>
        <template v-else>
          <ex-button :params="btn" :NoMethodsList="true" @update:methods='updateMethods'></ex-button>
        </template>
      </template>
    </div>

    <div class="grid ag-theme-quartz" ref="agGridRef">
      <ag-grid-vue :class="['aggrid_Root']" @grid-ready="onGridReady" :rowSelection="rowSelection"
        :onFirstDataRendered="onFirstDataRendered" :rowData="rowData" :gridOptions="gridOptions"
        :columnDefs="props.gridColDefs" :rowGroupPanelShow="rowGroupPanelShow" :defaultColDef="defaultColDef"
        :enableRangeSelection="enableRangeSelection" :suppressAggFuncInHeader="suppressAggFuncInHeader"
        :suppressRowClickSelection="suppressRowClickSelection" :localeText="AG_GRID_LOCALE_CN"
        @rowSelected="HandleSeleChange" @columnMoved="onColumnChanged" :treeData="props.gridGroup"
        :getDataPath="getDataPath" :autoGroupColumnDef="autoGroupColumnDef" @columnResized="onColumnChanged"
        @columnVisible="onColumnChanged" @onColumnPinned="onColumnChanged" @sort-changed="onFilterChanged"
        @filter-changed="onFilterChanged" @sortChanged="onColumnChanged" @cellClicked="HandleCellEdit" v-bind="$attrs">
      </ag-grid-vue>
      <div class="aggrid_pagination" v-if="paging">
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :total="pageTotal"
          :page-sizes="[50, 100, 200]" layout="total,sizes, prev, pager, next" @size-change="onPaginationChanged"
          @current-change="onPaginationChanged" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, onBeforeUnmount, reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import request from "@/utils/request";

import { $action } from "../action/index.js"

import { useRoute, useRouter } from "vue-router";

import { getCurrentInstance } from 'vue';

import { AgGridVue } from "@ag-grid-community/vue3";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AdvancedFilterModule } from "@ag-grid-enterprise/advanced-filter";
import { GridChartsModule } from "@ag-grid-enterprise/charts-enterprise";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { SparklinesModule } from "@ag-grid-enterprise/sparklines";
import { StatusBarModule } from "@ag-grid-enterprise/status-bar";

import { addAncestors } from "../config/index.js"

// 中文翻译
import AG_GRID_LOCALE_CN from "./Language/zh-CN";
// 操作按钮
import ActionButtons from "./cell-renderers/ActionButtons.vue";
// 下拉框
import CustomSelectEditor from "./cell-renderers/CustomSelectEditor.vue";
// 下拉框
import CustomSelectDict from "./cell-renderers/CustomSelectDict.vue";
// 日期控件
import CustomDate from "./cell-renderers/CustomDate.vue";
// 日期时间空间
import CustomDateTime from "./cell-renderers/CustomDateTime.vue";

import CustomLinkText from "./cell-renderers/CustomLinkText.vue";

import CustomDict from "./cell-renderers/CustomDict.vue";

import CustomCheck from "./cell-renderers/CustomCheck.vue";

import CustomDialogReport from "./cell-renderers/CustomDialogReport.vue";

const instance = getCurrentInstance();

const route = useRoute()

const router = useRouter()

const emit = defineEmits([
  "HandleCellClick",
  "HandleCellSelect",
  "HandleLinkTextClick",
  "HandleChange",
  "HandleSingSelect",
  "HandleRowSelect",
  "HandleRowDataChange",
  "HandleRowDataChange"
]);
const props = defineProps({
  grildUrl: {
    type: String,
    default: ""
  },
  gridMethdos: {
    type: String,
    default: "post"
  },
  gridActions: {
    type: Array,
    default: () => ([])
  },
  gridColDefs: {
    type: Array,
    default: () => ([])
  },
  grildFixedParams: {
    type: Object,
    default: () => ({})
  },
  gridKey: {
    type: String,
    default: ""
  },
  pageSize: {
    type: Number,
    default: 100
  },
  pageNum: {
    type: Number,
    default: 1
  },
  paging: {
    type: Boolean,
    default: true
  },
  PageDisabled: {
    type: Boolean,
  },
  gridGroup: {
    type: Boolean,
    default: false
  },
  gridRowKey: {
    type: String,
    default: 'id'
  },
  gridGroupParams: {
    type: Object,
    default: () => ({})
  }
})
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  AdvancedFilterModule,
  ColumnsToolPanelModule,
  // ExcelExportModule,
  FiltersToolPanelModule,
  GridChartsModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
  SetFilterModule,
  RichSelectModule,
  StatusBarModule,
  SparklinesModule,
]);


let paging = ref(props.paging)
// 范围搜索
const enableRangeSelection = true;

const rowSelection = "single";
//suppressRowClickSelection：如果true，单击时将不会选择行。
const suppressRowClickSelection = false;

// 最顶部的面板，展示分组那些汇总之类的, always总是显示， onlyWhenGrouping使用的时候显示， never从不显示
const rowGroupPanelShow = "onlyWhenGrouping";

// 是否在table字段头部显示聚合函数的名称 sum
const suppressAggFuncInHeader = true;

const agGridRef = ref(null)
// 存储当前正在编辑的单元格
const editingCell = ref(null);

// 初始化表头配置
const defaultColDef = {
  flex: 1,
  filter: true,
  minWidth: 150,
  enableRowGroup: true,
  enableValue: false,
};

/**
 * 配置分组path
 * @param data 
 */
const getDataPath = function (data) {
  // 如果 ancestors 为 '0' 或空，返回当前节点的路径
  if (!data.pathAncestors || data.pathAncestors == '') {
    return [data[props.gridRowKey]];
  }

  // 根据 ancestors 构建层级路径
  let ancestors = data.pathAncestors;
  let path = ancestors.split(',');
  path.push(data[props.gridRowKey]);
  return path;
};
/**
 * 配置分组字段是哪个
 */
const autoGroupColumnDef = ref({
  headerName: props.gridGroupParams.headerName,
  field: props.gridGroupParams.field,
  cellRendererParams: {
    suppressCount: true
  }
})
/**
 * id节点标识
 * @param params 
 */
 const getRowId = (params) => {
  let key = params.data[props.gridRowKey]
  if (key !== undefined && key !== null) {
    return String(key)
  }
  // 处理没有 id 的情况，比如使用行索引
  return params.data.uuid;
};


// 表格数据字段
const rowData = ref([]);

// 显式指定 gridApi 的类型为 GridApi 或 null
const gridApi = ref(null);

// 请求参数
let queryParams = ref({})
// 分页数量
let pageSize = ref(props.pageSize);
// 分页数
let pageNum = ref(props.pageNum);

//总条数
let pageTotal = ref(0)

/* 表头改变数据处理 */
const onColumnChanged = (params) => {
  if (params.source == "uiColumnResized" || params.source == "uiColumnMoved" || params.source == 'autosizeColumns' || params.source == 'toolPanelUi' || params.source == 'columnMenu') {
    const columnState = params.api.getColumnState();
    localStorage.setItem(
      `agGridColumnState${props.gridKey}`,
      JSON.stringify(columnState)
    );
  }
};
/**
 * 数据刷过滤排序
 * @param params 
 */
const onFilterChanged = (params) => {
  nextTick(() => {
    gridApi.value.refreshCells({ force: true });
  })
}
/**
 * 分组默认展开二级
 */
const expanda = () => {
  const rootNode = gridApi.value.getDisplayedRowAtIndex(0);
  if (rootNode) {
    rootNode.setExpanded(true);
  }
  gridApi.value.forEachNode((node) => {
    if (node.level <= 2) {
      node.setExpanded(true);
    }
  })
}

/**
 * 表头还原数据处理
 */
const restoreColumnState = () => {
  const savedState = localStorage.getItem(`agGridColumnState${props.gridKey}`);
  if (savedState) {
    gridApi.value.applyColumnState({
      state: JSON.parse(savedState),
      applyOrder: true,
    });
  } else {
    gridApi.value.sizeColumnsToFit();
  }
};

/**
 * 初始化配置表格
 */
let gridOptions = reactive({
  context: {
    componentParent: null, // 需要在 setup 函数中设置
  },
  minWidth: 100,
  headerHeight: 38,
  rowHeight: 38,
  components: {
    ActionButtons: ActionButtons,
    CustomSelectEditor: CustomSelectEditor,
    CustomDate: CustomDate,
    CustomDateTime: CustomDateTime,
    CustomLinkText: CustomLinkText,
    CustomDict: CustomDict,
    CustomSelectDict: CustomSelectDict,
    CustomDialogReport: CustomDialogReport,
    CustomCheck: CustomCheck
  },
  groupUseEntireRow: true,
  suppressHorizontalScroll: false, // 允许水平滚动
  enableBrowserTooltips: true,
  suppressHeaderKeyboardEvent: true, // 允许 HTML 格式化的内容
  getRowId,
})

/**
 * 
 * @param params aggrid表格加载完毕
 */
const onGridReady = (params) => {
  gridApi.value = params.api;
  // 给表格配置参数，设置数据来源
  gridOptions.context.componentParent = {
    HandleCellClick,
    HandleCellSelect,
    HandleLinkTextClick,
    HandleGetPageDisabled
  }
  HandleLoadData()
}

/**
 * 数据初次加载完毕
 */
const onFirstDataRendered = () => {
  restoreColumnState();
  expanda()
};

/**
 * 处理分页变化
 * @param params 
 */
const onPaginationChanged = (params) => {
  sendDataAPI(); // 根据需要调用数据获取方法
};

/**
 * 新增一行数据,并且聚焦,编辑新增的一行
 * @param row 
 */
const HandleAddRowAndSelect = (row = {}) => {
  // 获取当前聚焦的单元格信息
  const focusedCell = gridApi.value.getFocusedCell();
  // 如果有聚焦的单元格，并且符合取消条件，取消聚焦
  if (focusedCell) {
    gridApi.value.clearFocusedCell();
  }
  // 创建新行对象
  const newRow = { uuid: uuidv4() };
  props.gridColDefs.map((ele) => {
    if ((ele.cellEditor || ele.cellRenderer) == "agCheckboxCellEditor")
      newRow[ele.field] = row[ele.field] || ele.defaultValue || false;
    else if (ele.cellRenderer == "CustomSelectEditor")
      newRow[ele.field] = row[ele.field] || ele.cellRendererParams.default || null;
    else newRow[ele.field] = row[ele.field] || ele.defaultValue || null;
  });
  // 新增一行数据
  const res = gridApi.value.applyTransaction({ add: [newRow] });
  emit("HandleRowDataChange")
  const newRowNode = res.add[0];

  if (newRowNode) {
    // 取消选中所有行
    gridApi.value.deselectAll();

    // 选中新添加的行
    newRowNode.setSelected(true);

    // 取消之前的聚焦事件

    // 如果之前有聚焦的单元格，将焦点设置到新行的相应列
    if (focusedCell) {
      gridApi.value.ensureIndexVisible(newRowNode.rowIndex); // 确保新行可见
      gridApi.value.setFocusedCell(
        newRowNode.rowIndex,
        focusedCell.column.getId()
      );
      // 模拟双击聚焦单元格，即启动编辑模式
      gridApi.value.startEditingCell({
        rowIndex: newRowNode.rowIndex,
        colKey: focusedCell.column.getId(),
      });
    } else {
      // 设置焦点和编辑状态
      const firstColumnId = props.gridColDefs[0].field; // 获取第一列的字段名
      // 如果没有聚焦的单元格，设置新行的第一个单元格为聚焦状态
      gridApi.value.setFocusedCell(newRowNode.rowIndex, firstColumnId);
      // 启动编辑模式
      gridApi.value.startEditingCell({
        rowIndex: newRowNode.rowIndex,
        colKey: firstColumnId,
      });
    }
  }
};
/**
 * 获取页面是否编辑状态
 */
const HandleGetPageDisabled = () => {
  return props.PageDisabled
}
/**
 *单元格点击事件 
 */
const HandleCellEdit = (event) => {
  if (props.PageDisabled) event.api.stopEditing()
}
/**
 * 下拉框数据发生更改变动
 * @param field 
 * @param row 
 */
const HandleCellSelect = (field, row) => {
  emit("HandleCellSelect", field, row);
};

/**
 * link文字配置点击
 * @param field 
 * @param row 
 * @param rowIndex 
 */
const HandleLinkTextClick = (field, row, rowIndex) => {
  emit("HandleLinkTextClick", field, row, rowIndex);
};
/**
 * 
 * @param event 单机单元格之外停止编辑
 */
const HandleOutsideClick = (event) => {
  if (agGridRef.value && !event.target.closest('.ag-center-cols-container') && !event.target.closest('.el-date-picker') && !event.target.closest('.ag-popup-editor') && !event.target.closest('#ActionButtons')) {
    gridApi.value.stopEditing(); // 停止编辑
  }
};

/**
 * 配置API数据来源
 */
const sendDataAPI = () => {
  if (props.grildUrl == "" || !props.grildUrl) return
  let pm = { ...queryParams.value, ...props.grildFixedParams, pageSize: pageSize.value, pageNum: pageNum.value }
  gridApi.value?.showLoadingOverlay();
  rowData.value = []
  request({
    url: props.grildUrl,
    method: props.gridMethdos,
    params: props.gridMethdos == 'get' ? pm : {},
    data: props.gridMethdos == 'post' ? pm : {},
  }).then((res) => {
    let data = res.rows || res.data;
    pageTotal.value = res.total
    // 开启扁平化分组
    if (props.gridGroup) data = addAncestors(data, props.gridRowKey)
    console.log(data,'数据')
    rowData.value = data
    gridApi.value.refreshCells();
    emit("HandleChange", res.data);
  });
};
/**-------------------------- agrid按钮点击方法start--------------------------**/
let selectRow = {
  id: '',
  audited: '',
  status: '',
  code: ''
}
const $parent = instance?.proxy.$parent;

/**
 * 获取gridAPI
 */
const HandleGridApi = () => {
  return gridApi.value
};
/**
 * 传入参数请求数据
 * @param query 
 */
const HandleQueryData = (query = {}) => {
  queryParams.value = query
  HandleLoadData()
}
/**
 * 无需参数请求数据
 */
const HandleLoadData = () => {
  if (pageNum.value === 1) sendDataAPI();
  else gridApi.value.paginationGoToPage(0);
};
/**
 * 配置表格数据
 * @param rows 
 */
const HandleSetData = (rows = []) => {
  rows.forEach((ele) => {
    ele.uuid ? "" : (ele.uuid = uuidv4());
  });
  rowData.value = rows;
  paging.value = false
};

/**
 * 选中cehckbox触发获取选中行事件
 * @param event 
 */
const HandleSeleChange = (event) => {
  const isUserInitiated = !!event.event; // 如果是用户操作，该值为 true
  if (!isUserInitiated) return
  const rowData = event.data; // 当前行的数据
  const rowIndex = event.rowIndex; // 当前行的索引
  const isSelected = event.node.isSelected(); // 是否被选中
  const selectedRows = {
    rowData,
    rowIndex,
    isSelected
  }
  emit("HandleRowSelect", selectedRows);
};

/**
 * 获取选中行数据
 */
const HandleGetSelectRow = () => {
  const selectedNodes = gridApi.value.getSelectedNodes();
  const rowsData = selectedNodes.map((node) => node.data) || [];
  return rowsData
}

/**
 * 删除选中行数据
 */
const HandleDeleteSelectRows = () => {
  // 获取当前选中的行节点
  const selectedNodes = gridApi.value.getSelectedNodes();
  // 如果没有选中的行，直接返回
  if (selectedNodes.length === 0) {
    return;
  }
  // 提取需要删除的行数据
  const rowsToDelete = selectedNodes.map((node) => node.data);
  // 删除选中的行
  gridApi.value.applyTransaction({ remove: rowsToDelete });
  emit("HandleRowDataChange")
};
/**
 * 新增批量数据
 * @param rows 
 */
const HandleAddRows = (rows = []) => {
  rows.forEach(ele => ele.uuid = uuidv4())
  gridApi.value.applyTransaction({ add: rows });
}
/**
 * 获取所有行数据
 */
const HandleGetData = () => {
  const allRowData = [];
  gridApi.value.forEachNode((node) => {
    allRowData.push(node.data);
  });
  return allRowData;
};
/**
 * 获取所有行复制数据
 */
const HandleGetCopyData = () => {
  const allRwData = [];
  gridApi.value.forEachNode((node) => {
    allRwData.push(node.data);
  });

  // 过滤出需要复制的字段
  let list = props.gridColDefs
    .filter(ele => ele.isShow && ele.isCopy)
    .map(ele => ele.field);

  let copyForm = allRwData.map(obj => {
    // 使用 reduce 来从每行数据中提取字段
    const filteredObj = list.reduce((acc, key) => {
      if (key in obj) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});

    // 如果 filteredObj 是空对象，则不返回它
    return Object.keys(filteredObj).length > 0 ? filteredObj : null;
  });

  // 过滤掉 null 的项
  return copyForm.filter(item => item !== null);
};
/**
 * 切换列工具面板
 */
const HandleToggleColumnToolPanel = () => {
  gridApi.value.showColumnChooser('columns');
};


/*  操作按钮点击方法 */
const HandleCellClick = (code, params, fun = 0) => {
  selectRow = params.data
  if (fun) {
    emit('HandleCellClick', fun, params)
    return
  }
  eval(code)
};

/**
 * 
 * 批量删除
 */
const HandleBatchDelete = () => {
  const ids = HandleGetSelectRow().map(item => item.id).join(',');
  $action.HandleDelete({ id: ids }, '批量删除', HandleLoadData)
}
/**
 *  点击删除按钮删除
 */
const HandleDelete = () => {
  $action.HandleDelete({ id: selectRow.id }, '删除', HandleLoadData)
}
/**
 * 批量审核/反审核
 */
const HandleBatchAudit = (audited = 1) => {
  const ids = HandleGetSelectRow().map(item => item.id).join(',');
  let txt = audited == 1 ? '批量审核' : '批量反审核'
  $action.HandleAudit({ id: ids, audited }, txt, HandleLoadData)
}
/**
 * 审核
 */
const HandleAudit = (audited = 1) => {
  let txt = audited == 1 ? '审核' : '反审核'
  $action.HandleAudit({ id: selectRow.id, audited }, txt, HandleLoadData)
}

/**
 * 批量启用/停用
 */
const HandleBatchstatus = (status = 1) => {
  const ids = HandleGetSelectRow().map(item => item.id).join(',');
  let txt = status == 1 ? '批量启用' : '批量停用'
  $action.HandleStatus({ id: ids, status }, txt, HandleLoadData)
}
/**
 * 停用/启用
 */
const HandleStatus = (status = 1) => {
  let txt = status == 1 ? '启用' : '停用'
  $action.HandleStatus({ id: selectRow.id, status }, txt, HandleLoadData)
}
/**
 * 结案/反结案
 */
const HandleCase = async (status = 1) => {
  if (status == 1) $parent.$refs.caseDialogRef.HandleOpen({ id: selectRow.id })
  if (status == 0) {
    let res = await $action.HandleCase({ id: selectRow.id, finishStatus: '0' })
    if (res.code == 200) HandleLoadData()
  }
}
/**
 * 编辑页面跳转
 * @param path 
 */
const HandleGoPage = (path, status) => {
  $action.HandleGoPage(path, { id: selectRow.id, status: status })
}
/**
 * 编辑页面弹窗修改
 * @param path 
 */
const HandleOpenEdit = (num = 0) => {
  $parent.$refs.exDialogRef[num].HandleOpen({ id: selectRow.id })
}
/**
 * 编辑页面弹窗查看
 * @param path 
 */
const HandleOpenView = () => {
  $parent.$refs.exDialogRef[0].HandleOpen({ id: selectRow.id }, true)
}
/**
 * 编辑页面导入
 */
const HandleUpdateReport = (data) => {
  HandleAddRows(data)
}
/**
 * 
 * @param data 
 */
const HandleCopyRow = (num = 0) => {
  $parent.$refs.exDialogRef[num].HandleOpen({ id: selectRow.id, copy: true })
}
/**
 * 校验结果
 */
const HandleValidate = () => {
  let validateList = props.gridColDefs.filter(ele => ele.isEmpty).map(ele => ele.field)
  let data = HandleGetData()
  return data.every(item => validateList.every(ele => item[ele] && item[ele] != ""))
}
/**
 * 更新事件code方法
 * @param code 
 */
const updateMethods = (code) => {
  eval(code)
}

onMounted(() => {
  document.addEventListener('click', HandleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', HandleOutsideClick);
});
/**-------------------------- agrid按钮点击方法end --------------------------**/

defineExpose({
  HandleLoadData,
  HandleQueryData,
  HandleGetData,
  HandleGetCopyData,
  HandleSetData,
  HandleDelete,
  HandleAudit,
  HandleStatus,
  HandleGoPage,
  HandleOpenEdit,
  HandleDeleteSelectRows,
  HandleAddRowAndSelect,
  HandleAddRows,
  HandleToggleColumnToolPanel,
  HandleGetSelectRow,
  HandleBatchDelete,
  HandleBatchAudit,
  HandleBatchstatus,
  HandleGridApi,
  HandleValidate,
  HandleOpenView,
  HandleCase,
  HandleCopyRow,
});
</script>


<style lang="scss">
@import "@ag-grid-community/styles/ag-grid.css";
@import "@ag-grid-community/styles/ag-theme-quartz.css";

.pageNone {
  display: none !important;
}

.ag-cell {
  user-select: text;
}
</style>
<style scoped lang="scss">
.actionBox {
  margin-bottom: 5px;
  display: flex;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:root {
  --layout-grid-header-height: 32px;
  --layout-grid-margin: 32px;
}

body {
  margin: 0;
}

.grid {
  --ag-value-change-value-highlight-background-color: #44ad4961;
  --ag-value-change-delta-down-color: rgb(255, 0, 92);
  --ag-value-change-delta-up-color: rgb(53, 182, 90);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ag-theme-quartz-dark {
  --ag-row-hover-color: #323a46;
}

@media screen and (max-width: 720px) {

  div.ag-theme-quartz,
  div.ag-theme-quartz-dark {
    --ag-font-size: 12px;
    --ag-grid-size: 6px;
  }
}

.ag-theme-quartz .ag-row-group,
.container {
  width: 100%;
}

.ag-theme-quartz .ag-value-change-value-highlight,
.ag-theme-quartz-dark .ag-value-change-value-highlight {
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-radius: 4px;
  margin-left: 4px;
}

.ag-right-aligned-cell {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.ticker-name {
  opacity: 0.8;
}

.aggrid_Root {
  flex: 1;
}

.aggrid_pagination {
  height: 36px;
  display: flex;
  align-content: center;
  justify-content: flex-end;
}
</style>
