export let inputConfig = [
    {
        icon: 'icon-danhangshurukuang',
        modelType: 'ex-input',
        field: '',
        label: "输入框",
        labelWidth: "",
        suffix: "",
        defaultValue: '',
        placeholder: "",
        occupy: 1,
        isEmpty: false,
        isLock: false,
        isReadonly: false,
        isCopy: false,
        isShow: false,
        methdoOptions: [],
        methdoList: [],
        type: "string",
        size: "default",
        typeOptions: [{ label: '本文框', value: 'string' }, { label: '数字框', value: 'number' }],
    },
    {
        icon: 'icon-riqikongjian',
        modelType: 'ex-date',
        field: '',
        label: "日期框",
        labelWidth: "",
        suffix: "",
        defaultValue: '',
        placeholder: "",
        occupy: 1,
        isEmpty: false,
        isLock: false,
        isReadonly: false,
        isCopy: false,
        isShow: false,
        methdoOptions: [],
        methdoList: [],
        type: "date",
        size: "default",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        typeOptions: [
            { label: 'year', value: 'year' },
            { label: 'month', value: 'month' },
            { label: 'date', value: 'date' },
        ],
    },
    {
        icon: 'icon-riqikongjian',
        modelType: 'ex-dateRange',
        field: '',
        label: "日期范围框",
        labelWidth: "",
        suffix: "",
        defaultValue: '',
        placeholder: "",
        occupy: 1,
        isEmpty: false,
        isLock: false,
        isReadonly: false,
        isCopy: false,
        isShow: false,
        methdoOptions: [],
        methdoList: [],
        type: "daterange",
        size: "default",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        typeOptions: [
            { label: 'yearrange', value: 'yearrange' },
            { label: 'monthrange', value: 'monthrange' },
            { label: 'daterange', value: 'daterange' },
        ],
    },
]

export let actionConfig = [
    {
        icon: 'icon-button',
        modelType: 'ex-button',
        label: "按钮",
        occupy: 1,
        methdoOptions: [],
        methdoList: [],
        type: "primary",
        iconType: "",
        expression: "",
        authentication: "",
        size: "default",
        typeOptions: [
            { label: 'primary', value: 'primary' },
            { label: 'success', value: 'success' },
            { label: 'warning', value: 'warning' },
            { label: 'danger', value: 'danger' },
            { label: 'info', value: 'info' },
            { label: 'text', value: 'text' },
        ],
    },
    {
        icon: 'icon-shangchuantupian',
        modelType: 'ex-img',
        field: '',
        label: "图片上传",
        labelWidth: "",
        occupy: 1,
        isEmpty: false,
        isReadonly: false,
        isCopy: false,
        isShow: false,
        limit: 1,
        maxSize: 3
    },
]

export let reportConfig = [
    {
        icon: 'icon-xialakuang',
        modelType: 'ex-dictSelect',
        field: '',
        label: "字典框",
        labelWidth: "",
        suffix: "",
        defaultValue: '',
        placeholder: "",
        occupy: 1,
        isEmpty: false,
        isLock: false,
        isReadonly: false,
        isCopy: false,
        isShow: false,
        methdoOptions: [],
        methdoList: [],
        type: "string",
        size: "default",
    },
    {
        icon: 'icon-xialakuang',
        modelType: 'ex-report',
        field: '',
        label: "数据导入",
        labelWidth: "",
        suffix: "",
        defaultValue: '',
        placeholder: "",
        occupy: 1,
        isEmpty: false,
        isLock: false,
        isReadonly: false,
        isCopy: false,
        isShow: false,
        methdoOptions: [],
        methdoList: [],
        type: "string",
        size: "default",
        config: "",
    },
    {
        icon: 'icon-tree-select',
        modelType: 'ex-tree-select',
        API: "",
        propsLabel: '',
        code: "",
        field: '',
        label: "下拉树",
        labelWidth: "",
        defaultValue: '',
        placeholder: "",
        occupy: 1,
        isEmpty: false,
        isLock: false,
        isReadonly: false,
        isCopy: false,
        isShow: false,
        multiple:false,
        type: "string",
        size: "default",
    },
]

export let tabConfig = [
    {
        label: "表格",
        icon: 'icon-biaoge',
        modelType: 'ex-table',
        gridFlex: true,
        gridHeight: 300,
        typeOptions: [
            { label: 'primary', value: 'primary' },
            { label: 'success', value: 'success' },
            { label: 'warning', value: 'warning' },
            { label: 'danger', value: 'danger' },
            { label: 'info', value: 'info' },
            { label: 'text', value: 'text' },
        ],
        gridColDefs: [],
        btnGroup: [],
        actionGroup: [],
        propsName: '',
        API: "",
        model: "",
        rowSelection: 'single',
        isGroup:false,
        isGroupParams:{}
    },
]

export let gridConfig = [
    {
        label: "表单",
        icon: 'icon-biaodan',
        modelType: 'form',
        labelPosition: "right",
        methdoOptions: [],
        methdoList: [],
        labelWidth: 80,
        children: []
    },
    {
        label: "grid",
        icon: 'icon-biaoge',
        modelType: 'ex-grid',
        propsName: '',
        gridFlex: true,
        gridHeight: 300,
        typeOptions: [
            { label: 'primary', value: 'primary' },
            { label: 'success', value: 'success' },
            { label: 'warning', value: 'warning' },
            { label: 'danger', value: 'danger' },
            { label: 'info', value: 'info' },
            { label: 'text', value: 'text' },
        ],
        gridColDefs: [],
        btnGroup: [],
        actionGroup: [],
        API: "",
        model: "",
        rowSelection: 'single',
        isGroup:false,
        isGroupParams:{}
    },
    {
        icon: 'icon-node-tree',
        modelType: 'ex-tree',
        field: '',
        label: "节点树",
        API: "",
        propsLabel: '',
        code: "",
    },
    {
        label: "tabs",
        icon: 'icon-biaoge',
        modelType: 'ex-tabs',
        children: []
    },

]

