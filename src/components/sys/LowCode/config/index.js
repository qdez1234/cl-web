export let commonAddAPI = '/api/common/add/'

export let commonDeleteAPI = '/api/common/remove/'

export let commonChangeAPI = '/api/common/edit/'

export let commonCaseAPI = '/api/common/finish/'

export let commonSearchAPI = '/api/common/listPage/'

export let commonDetailAPI = '/api/common/getInfo/'

export let commonAuditAPI = '/api/common/audit/'

export let commonStatusAPI = '/api/common/activate/'

export let commonReportAPI = '/api/common/export/'

export let commonUploadAPI = '/prod-api/common/uploadMinio'

export let fileAddress = 'http://192.168.18.166:88'

import app from "../../../../main";

// 自定义方法: 获取单元格编辑器
export function getCellEditor(ele) {
    if (ele.dictionary) return 'CustomSelectDict'
    switch (ele.dataType) {
        case 1:
            return "agTextCellEditor";
        case 2:
            return "agNumberCellEditor";
        case 3:
            return ele.isReadonly ? "agTextCellEditor" : "CustomDateTime";
        case 4:
            return 'agCheckboxCellEditor';
        default:
            return 'agTextCellEditor';
    }
}
/**
 * 获取单元格渲染器
 * @param {*} ele 
 * @returns 
 */
export function getCellRenderer(ele) {
    if (ele.dictionary) return 'CustomDict'
    if (ele.report) {
        ele.editable = false
        return 'CustomDialogReport'
    }
    switch (ele.dataType) {
        case 1:
            return "agTextCellEditor";
        case 2:
            return "agNumberCellEditor";
        case 3:
            return null;
        case 4:
            ele.editable = false
            return 'CustomCheck';
        default:
            return null;
    }
}
/**
 * 获取单元格渲染器参数
 * @param {*} ele 
 * @returns 
 */
export function getCellRendererParams(ele) {
    if (ele.dictionary) return { dict_key: ele.dictionary }
    if (ele.report) return { source: ele.report }
    return null;
}
export function processList(ele) {
    const route = app.config.globalProperties.$route
    let check = {
        headerCheckboxSelection: true,  // 在表头显示多选框
        isReadonly: true,
        isShow: true,
        checkboxSelection: true,        // 行前显示多选框
        width: 50,
        filter: false, // 隐藏过滤条件
        suppressMenu: true, // 隐藏菜单
        minWidth: 70
    };
    let order = {
        headerName: "序号",
        isReadonly: true,
        isShow: true,
        valueGetter: (params) => {
            return params.node.rowIndex + 1
        },
        filter: false, // 隐藏过滤条件
        suppressMenu: true, // 隐藏菜单
        minWidth: 70
    };

    ele.gridColDefs.unshift(order)
    ele.gridColDefs.unshift(check)
    ele.gridColDefs.forEach(child => {
        if (child.headerName == '操作') return
        // aggrid新增 valueGetter 值的计算表达式
        if (child.expression) {
            child.valueGetter = (params) => {
                try {
                    // 使用 Function 构造函数动态生成表达式
                    const expression = new Function('params', 'route', `${child.expression}`);
                    return expression(params.data, route); // 执行表达式并返回结果
                } catch (e) {
                    console.error('Error evaluating expression:', e);
                    return '表达式错误'; // 返回自定义错误信息
                }
            };
        }
        child.editable = !child.isReadonly
        if (child.decimals) {
            child.cellRenderer = (params) => {
                let decimals = Number(child.decimals || 0)
                try {
                    let NVALUE = Number(params.value)
                    return NVALUE.toFixed(decimals);
                } catch (e) {
                    return params.value
                }
            }
        } else {
            child.cellRenderer = getCellRenderer(child)
        }
        child.tooltipField = child.field
        child.headerClass = child.isEmpty ? 'agRequire' : '',
            child.cellClassRules = {
                'ag-cell-error': params => (!params.value || params.value === "") && child.isEmpty // 如果单元格值为空，设置红色样式
            },
            child.cellEditor = getCellEditor(child)
        child.cellEditorParams = getCellRendererParams(child)
        child.cellRendererParams = getCellRendererParams(child)
    });
}
export function processExpressions(list) {
    list.forEach(item => {
        if (item.modelType == 'ex-grid' || item.modelType == 'ex-table') processList(item)
        if (item.children) {
            processExpressions(item.children); // 注意：子项也需要以数组的形式传递
        }
    });
    return list; // 返回更新后的 list
}
/**
 * 将查询字符串转换为对象
 * @param {string} queryString - 输入的查询字符串，例如 "name='123'&age='1232'"
 * @returns {object} - 转换后的对象，例如 { name: '123', age: '1232' }
 */
export function parseQueryString(queryString) {
    const result = {};

    // 检查输入是否合法
    if (!queryString || typeof queryString !== 'string') {
        return result;
    }

    // 分割并处理每个键值对
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');

        if (key && value) {
            // 去掉首尾空格并去除单引号
            result[key.trim()] = value.replace(/'/g, '').trim();
        }
    });

    return result;
}
// 自定义排序函数
export function sorted(data, key) {
    let dt = [...data].sort((a, b) => {
        // 如果 a 和 b 都没有 key，保持它们原来的顺序
        if (a[key] === undefined && b[key] === undefined) return 0;

        // 如果 a 没有 key，排到后面
        if (a[key] === undefined) return 1;

        // 如果 b 没有 key，排到后面
        if (b[key] === undefined) return -1;

        // 如果 a 或 b 是 null 或 undefined，认为它们排在后面
        if (a[key] === null || a[key] === undefined) return 1;
        if (b[key] === null || b[key] === undefined) return -1;

        // 转换 key 对应的值为数字，如果可能的话
        const valueA = typeof a[key] === 'string' ? parseFloat(a[key]) : a[key];
        const valueB = typeof b[key] === 'string' ? parseFloat(b[key]) : b[key];

        // 如果 a 和 b 都有 key，按升序排序
        return valueA - valueB;
    });
    return dt
}
/**
 * 扁平化树结构，转换成树结构
 * @param {*} flatData 
 * @returns 
 */
export function buildTree(departmentData) {
    const map = {}; // 用于存储每个部门的引用
    const tree = []; // 最终的树结构

    // 1. 创建一个映射表，将每个部门按 `id` 存入 map
    departmentData.forEach(item => {
        item.disabled = item.status == '0' ? true : false
        map[item.id] = { ...item, children: [] }; // 为每个部门初始化 `children` 数组
    });

    // 2. 遍历部门数据，构建树结构
    departmentData.forEach(item => {
        if (item.parentId == "0") {
            // 如果 `parentId` 为 "0"，说明是根节点，直接放入树结构中
            tree.push(map[item.id]);
        } else {
            // 否则，将该部门添加到它的父部门的 `children` 数组中
            if (map[item.parentId]) {
                map[item.parentId].children.push(map[item.id]);
            }
        }
    });
    return tree;
}
