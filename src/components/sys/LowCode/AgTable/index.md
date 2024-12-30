 ```bash
 # 文本编辑器
 editable: true // 默认使用文本框编辑器
 cellEditor: "agTextCellEditor", 
  # 大文本框编辑器
 cellEditor: 'agTextAreaCellEditor'
 # 数字编辑器
 cellEditor: "agNumberCellEditor", 
 # 复选框编辑器
 headerCheckboxSelection: true,  //头部出现全选框
 cellEditor: 'agCheckboxCellEditor' 
 # 下拉框选项
cellEditor: 'agSelectCellEditor', 
cellEditorParams: {
    values: ['USA', 'Canada', 'Mexico'] // 下拉框选项
  }
 # 配置日期格式等
  cellEditor: 'agDateCellEditor',
  cellEditorParams: {
  }

  ```

 ```bash
 filter: false, //隐藏过滤条件
 suppressMenu: true, // 隐藏菜单
 pinned: "right",
 ```

  ```bash
  #cellRenderer 和  cellRendererParams是直接渲染展示
  {
    headerName: "下拉框配置",
    field: "source",
    minWidth: 180,
    cellRenderer: "CustomSelectEditor",
    cellRendererParams: {
      options: [
           {id:1,value:'字典'},
           {id:2,value:'数据导入'}
      ],
    },
  },
  #cellEditor 是编辑的时候才渲染的组件
  {
    headerName: "默认值",
    field: "default",
    editable: true,
    minWidth: 180,
    editable: true,
    cellEditor: "agTextCellEditor",
  },

//   {
//     headerName: "操作",
//     pinned: "right",
//     filter: false, //隐藏过滤条件
//     width: 80,
//     suppressMenu: true, // 隐藏菜单
//     cellRenderer: "ActionButtons",
//     cellRendererParams: (params) => {
//       // 根据行数据动态生成按钮配置
//       return {
//         buttonConfig: [
//           {
//             key: "edit",
//             label: "修改",
//             action: "edit",
//             show: proxy.$auth.hasPermi("base:company:edit"),
//           },
//           {
//             key: "delete",
//             label: "删除",
//             action: "delete",
//             show: proxy.$auth.hasPermi("base:company:remove"),
//           },
//         ],
//       };
//     },
//   },

 ```