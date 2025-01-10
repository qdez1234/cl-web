<template>
  <div class="renderBox">
    <div class="left">
      <div class="conponents-list">
        <div class="components" v-for="(item, index) in listMapList" :key="index">
          <div class="title">
            {{ item.title }}
          </div>
          <div class="component">
            <draggable class="components-draggable" :list="item.list" :move="checkMove" :clone="cloneComponent"
              :group="{ name: item.name, pull: 'clone', put: false }">
              <template #item="{ element }">
                <div class="components-item">
                  <span>{{ element.label }}</span>
                  <i :class="['iconfont', element.icon]"></i>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="page-card-box">
        <el-tabs type="border-card" class="card" v-model="pageLabel" @tab-click="handleTabsClick"
          @tab-remove="handleDeleteDialog">
          <el-tab-pane v-for="(item, index) in tabList" :closable="item.closable" :key="item.name"
            :label="parseFlag(item, index)" :name="item.name"></el-tab-pane>
        </el-tabs>
        <div class="btn-position-box">
          <el-button type="primary" @click="handleBack">返回</el-button>
          <el-button type="primary" @click="handleSettingLanguage">配置语言</el-button>
          <el-button type="info" @click="dialogFormVisible = true">新增弹窗</el-button>
          <el-button type="success" @click="handleSave($event, true)">保存并返回</el-button>
          <el-button type="success" @click="handleSave">保存</el-button>
        </div>
      </div>
      <div class="page-content-box">

        <div class="left-content">
          <draggable v-model="drawingListSet" group="componentsGroupContainer" class="drawing-board left">
            <template #item="{ element: outerElement }">
              <div class="template">
                <!-- 节点树 -->
                <div :class="['draggableContainer', activedId == outerElement.id ? 'activedDraggable' : '']"
                  @click="handleSelect(outerElement)" v-if="computedComponent(outerElement, ['ex-tree'])">
                  <div class="floatIcon" @click="handleDelete(outerElement.id)">
                    <i :class="['iconfont', 'icon-shanchu']"></i>
                  </div>
                  <div @click="handleChildSelect(outerElement)"
                    :class="[activedChildId == outerElement.id ? 'draggableColBgc' : '']" style="height: 100%;">
                    <ex-tree :params="outerElement"></ex-tree>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        <div class="right-content">
          <draggable v-model="drawingListSet" group="componentsGroupContainer" class="drawing-board">
            <template #item="{ element: outerElement }">
              <div class="template">
                <!-- 表单start -->
                <div :class="['draggableContainer', activedId == outerElement.id ? 'activedDraggable' : '']"
                  @click="handleSelect(outerElement)" v-if="outerElement.modelType == 'form'">
                  <div class="floatIcon" @click="handleDelete(outerElement.id)">
                    <i :class="['iconfont', 'icon-shanchu']"></i>
                  </div>
                  <el-form class="ex-form-inline" :inline="true" :label-width="outerElement.labelWidth"
                    :label-position="outerElement.labelPosition">

                    <draggable v-model="outerElement.children" group="form" class="draggableChild"
                      :item-key="outerElement.id">
                      <template #item="{ element }">

                        <el-col :span="computedSpan(element, outerElement)" @click="handleChildSelect(element)"
                          :class="['draggableCol', activedChildId == element.id ? 'draggableColBgc' : '']">

                          <div class="floatChildIcon" @click.stop="handleDeleteChild(element.id)">
                            <i :class="['iconfont', 'icon-shanchu']"></i>
                          </div>

                          <el-form-item :label="computeLabel(element)" :label-width="element.labelWidth">
                            <component :is="element['modelType']" v-model="element['defaultValue']"
                              v-if="computedComponent(element, ['ex-input', 'ex-date', 'ex-dateRange', 'ex-button', 'ex-dictSelect', 'ex-img', 'ex-tree-select'])"
                              :params="element" @update:methods='updateMethods' />
                            <ex-report v-if="computedComponent(element, ['ex-report'])" v-model="element['config']"
                              :params="element" />
                          </el-form-item>
                        </el-col>

                      </template>
                    </draggable>
                  </el-form>
                </div>
                <!-- 表单end -->


                <!-- grid表格start -->
                <div :class="['draggableContainer', activedId == outerElement.id ? 'activedDraggable' : '']"
                  @click="handleSelect(outerElement)" v-if="computedComponent(outerElement, ['ex-grid'])">
                  <div class="floatIcon" @click="handleDelete(outerElement.id)">
                    <i :class="['iconfont', 'icon-shanchu']"></i>
                  </div>
                  <div @click="handleChildSelect(outerElement)"
                    :class="[activedChildId == outerElement.id ? 'draggableColBgc' : '']">
                    <AgTable class="AgTable" ref="gridRef" :style="{ height: outerElement.gridHeight + 'px' }"
                      :paging="true" :gridColDefs="outerElement.gridColDefs.filter(ele => ele.isShow)" :gridData="[{}]"
                      :suppressRowClickSelection="true" />
                  </div>
                </div>

                <!-- tabs表格start -->
                <div :class="['draggableContainer renderTabs', activedId == outerElement.id ? 'activedDraggable' : '']"
                  @click="handleSelect(outerElement)" v-if="outerElement.modelType == 'ex-tabs'">
                  <div class="floatIcon" @click="handleDelete(outerElement.id)">
                    <i :class="['iconfont', 'icon-shanchu']"></i>
                  </div>
                  <el-tabs v-model="tabsName" class="demo-tabs">
                    <draggable v-model="outerElement.children" group="form" class="draggableChild"
                      :item-key="outerElement.id">
                      <template #item="{ element }">
                        <el-tab-pane :label="element.label" :name="element.id" v-if="element.modelType == 'ex-table'">
                          <div class="floatIcon" @click.stop="handleDeleteChild(element.id)">
                            <i :class="['iconfont', 'icon-shanchu']"></i>
                          </div>
                          <div @click="handleChildSelect(element)"
                            :class="[activedChildId == element.id ? 'draggableColBgc' : '']">
                            <AgTable class="AgTable" ref="gridRef" :style="{ height: element.gridHeight + 'px' }"
                              :paging="true" :gridActions="element.actionGroup"
                              :gridColDefs="element.gridColDefs.filter(ele => ele.isShow)" :gridData="[{}]"
                              :suppressRowClickSelection="true" />
                          </div>
                        </el-tab-pane>
                      </template>
                    </draggable>
                  </el-tabs>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <div class="right">
      <el-tabs v-model="activeName" class="tabs" :stretch="true">
        <el-tab-pane label="组件属性" name="first">
          <el-form style="max-width: 600px" status-icon label-width="auto" class="demo-ruleForm">
            <ComponentAttribues v-if="activedChildId != null" v-model="componentParams" :modelType="activeType"
              :componentModel="componentModel" />
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="容器属性" name="second">
          <el-form style="max-width: 600px" status-icon label-width="auto" class="demo-ruleForm">
            <BoxAttribues v-if="activedId != null" v-model="boxParams" :modelType="activeType" />
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog v-model="dialogFormVisible" draggable title="弹窗属性" width="60%">
      <el-form :model="addTabForm" style="padding: 15px;" label-width="90">
        <el-row style="padding: 8px;">
          <el-col :span="12">
            <el-form-item label="页面">
              <el-select v-model="addTabForm.page" style="width: 100%;">
                <el-option label="列表页" value="main" />
                <el-option label="详情页" value="dtail" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="弹窗标题">
              <el-input v-model="addTabForm.label" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding: 8px;">
          <el-col :span="12">
            <el-form-item label="弹窗宽度">
              <el-input v-model="addTabForm.width" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="弹窗高度">
              <el-input v-model="addTabForm.height" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding: 8px;">
          <el-col :span="12">
            <el-form-item label="详情API">
              <el-input v-model="addTabForm.detailAPI" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新增API">
              <el-input v-model="addTabForm.addAPI" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding: 8px;">
          <el-col :span="12">
            <el-form-item label="修改API">
              <el-input v-model="addTabForm.editAPI" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="点击窗口外关闭" label-width="120">
              <el-switch v-model="addTabForm.close" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding: 8px;">
          <el-col :span="12">
            <el-form-item label="确定按钮本文" label-width="120">
              <el-input v-model="addTabForm.confirmTxt" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="取消按钮本文" label-width="120">
              <el-input v-model="addTabForm.cancelTxt" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding: 8px;">
          <el-col :span="12">
            <el-form-item label="提交事件" label-width="120">
              <el-input v-model="addTabForm.code" :autosize="{ minRows: 3, maxRows: 10 }" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddDialog">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { deleteNode, findNode } from "@/utils"
import { inputConfig, actionConfig, tabConfig, reportConfig, gridConfig } from "./config.js"
import draggable from 'vuedraggable';
import ComponentAttribues from "./components/componentAttribues.vue"
import BoxAttribues from "./components/boxAttribues.vue"
import { ElMessage } from 'element-plus'
import { getModel, addModel,updateModel } from "@/api/system/config";
import { commonSearchAPI, commonChangeAPI, commonAddAPI, commonDetailAPI } from "../../config/index.js"
import { v4 as uuidv4 } from "uuid";
const route = useRoute()
const router = useRouter()
const drawingListSet = ref([])
let dialogFormVisible = ref(false)
let tabList = ref([
  { label: '列表页', name: "main", content: [], closable: false },
  { label: '详情页', name: 'detail', content: [], closable: false }
])
let addTabForm = ref({
  label: '',
  content: [],
  closable: true,
  width: '',
  name: "",
  height: '',
  close: false,
  page: 'main',
  detailAPI: `${commonDetailAPI + route.query.businessModelCode}`,
  addAPI: `${commonAddAPI + route.query.businessModelCode}`,
  editAPI: `${commonChangeAPI + route.query.businessModelCode}`,
  confirmTxt: '确定',
  cancelTxt: '取消',
  code: 'this.HandleConfirm()'
})
let activeName = ref("first")
let tabsName = ref("first")
let activedId = ref(null)
let activeType = ref(null)
let componentModel = ref(null)
let activedChildId = ref(null)
let componentParams = ref({})
let boxParams = ref({})
let pageLabel = ref("main")
const listMapList = [
  {
    title: '输入型组件',
    list: inputConfig,
    name: 'form',
  },
  {
    title: '操作型控件',
    list: actionConfig,
    name: 'form',
  },
  {
    title: 'AG表格控件',
    list: tabConfig,
    name: 'form',
  },
  {
    title: '导入型控件',
    list: reportConfig,
    name: 'form',
  },
  {
    title: '容器型控件',
    list: gridConfig,
    name: 'componentsGroupContainer'
  },
]
/**
 * 组件拖拽,防止同一个分组相互拖拽
 * @param evt 
 */
const checkMove = (evt) => {
  return evt.from !== evt.to;
};
/**
 * 表单控件,拖拽
 * @param obj 
 * @param a 
 */
const onEnd = (obj, a) => {
  if (obj.from !== obj.to) {

  }
}
/**
 * 组件复制
 * @param origin 
 */
const cloneComponent = (origin) => {
  const clone = JSON.parse(JSON.stringify(origin))
  clone.modelType == 'ex-grid' ? clone.API = `${commonSearchAPI + route.query.businessModelCode}` : ''
  clone.id = uuidv4()
  return clone
}
/**
 * 选中容器组件
 * @param id 
 */
const handleSelect = (row) => {
  if (activedId.value != row.id) activedChildId.value = null
  activedId.value = row.id
  activeType.value = row.modelType
  boxParams.value = row
}
/**
 * 选中子组件
 * @param id 
 */
const handleChildSelect = (element) => {
  activedChildId.value = element.id
  componentModel.value = element.modelType
  componentParams.value = findNode(drawingListSet.value, 'children', element.id)
}
/**
 * 删除容器组件
 * @param id 
 */
const handleDelete = (id) => {
  drawingListSet.value = drawingListSet.value.filter(ele => ele.id != id)
}

/**
 * 删除容器里面的组件
 * @param id 
 */
const handleDeleteChild = (id) => {
  if (activedChildId.value == id) {
    activedChildId.value = null
  }
  drawingListSet.value = deleteNode(drawingListSet.value, 'children', id)
}

/**
 * 计算占位
 * @param row 
 */
const computedSpan = (row) => {
  let occupy = row.occupy * 6
  if (row.modelType == 'ex-button') occupy = 2
  return occupy
}
/**
 * 计算label
 * @param row 
 */
const computeLabel = (row) => {
  let label = row.label
  if (row.modelType == 'ex-button') label = ''
  return label
}
/**
 * 标题新增表示
 */
const parseFlag = (item, index) => {
  if (item.name == 'main') return `${item.label} - A`
  if (item.name == 'detail') return `${item.label} - B`
  if (item.page == 'main') return `${item.label} - A${index-2}`
  if (item.page == 'detail') return `${item.label} - B${index-2}`
}
/**
 * 计算是否在当前组件里面
 * @param model 
 */
const computedComponent = (row, model = []) => {
  return model.includes(row['modelType'])
}

/**
 * tabs页面切换
 * @param name 
 */
watch(() => drawingListSet.value, (newVal) => {
  let pg = tabList.value.find(ele => ele.name == pageLabel.value)
  pg.content = newVal
}, { deep: true })
/**
 * tab切换
 * @param ele 
 */
const handleTabsClick = (ele) => {
  let pg = tabList.value.find(item => item.name == ele.props.name)
  if (pageLabel.value == ele.props.name && (pageLabel.value != 'main' && pageLabel.value != 'detail')) {   //同一个tab相互点击,开启弹窗展示
    addTabForm.value = pg
    dialogFormVisible.value = true
  }
  pageLabel.value = ele.props.name
  drawingListSet.value = pg.content
}
/**
 * 子组件触发执行方法函数
 * @str 目标执行函数字符串
 */
const updateMethods = (str) => {
  if (route.path == '/system/render/config') return
  eval(str)
}
/**
 * 新增弹窗页签
 */
const handleAddDialog = () => {
  if (addTabForm.value.name != '') {
    let index = tabList.value.findIndex(ele => ele.name == addTabForm.value.name)
    tabList.value[index] = { ...tabList.value[index], ...addTabForm.value };
  } else {
    tabList.value.push(Object.assign({}, addTabForm.value, { name: uuidv4() }))
  }
  dialogFormVisible.value = false
  addTabForm.value = {
    label: '',
    content: [],
    closable: true,
    width: '',
    name: "",
    height: '',
    close: false,
    page: 'main',
    detailAPI: `${commonDetailAPI + route.query.businessModelCode}`,
    addAPI: `${commonAddAPI + route.query.businessModelCode}`,
    editAPI: `${commonChangeAPI + route.query.businessModelCode}`,
    confirmTxt: '确定',
    cancelTxt: '取消',
    code: 'this.HandleConfirm()'
  }
}
/**
 * 删除弹窗页签
 */
const handleDeleteDialog = (name) => {
  let index = tabList.value.findIndex(ele => ele.name == name) - 1
  let props = { name: tabList.value[index].name }
  tabList.value = tabList.value.filter(ele => ele.name != name)
  if (pageLabel.value == name) {
    handleTabsClick({ props: props })
  }
}
/**
 * 返回
 */
const handleBack = () => {
  router.go(-1)
}
/**
 * 语言环境配置
 */
 const handleSettingLanguage =()=>{
  window.open(
  `${window.location.origin}/system/render/language`,
  "_blank"
);
}
/**
 * 保存数据
 */
const handleSave = async (e, back = false) => {
  let dialogList = tabList.value.filter(ele => ele.name != 'main').filter(ele => ele.name != 'detail')
  let pgMain = tabList.value.find(ele => ele.name == 'main')
  let pgDetai = tabList.value.find(ele => ele.name == 'detail')
  pageConfig.value.source = JSON.stringify({ main: pgMain.content || [], detail: pgDetai.content || [], dialogList: dialogList || [] })
  pageConfig.value.menuId = route.query.id
  let res = {}
  if(pageConfig.value.id){
    res = await updateModel(pageConfig.value)
  }else{
     res = await addModel(pageConfig.value)
  }
  if(res.code==200){
    ElMessage.success(res.msg)
    back ? handleBack() : ''
  }

}
/**
 * 初始化获取模型配置数据
 */
let pageConfig = ref({source:"",menuId:''})
const handleInit = () => {
  getModel(route.query.businessModelCode).then(res => {
    pageConfig.value = res.data
    if (res.data.source) {
      let source = JSON.parse(res.data.source)
      let pgMain = tabList.value.find(ele => ele.name == 'main')
      let pgDetai = tabList.value.find(ele => ele.name == 'detail')
      pgMain.content = source.main
      pgDetai.content = source.detail
      tabList.value.push(...source.dialogList || [])
      handleTabsClick({ props: { name: 'main' } })
    }
  })
};

onMounted(() => {
  handleInit()
})
</script>

<style scoped lang="scss">
.el-form .el-form-item {
  margin-bottom: 4px;
}

.el-form--inline .el-form-item {
  margin-right: 10px;
}

.el-col {
  display: inline-block;
  padding-right: 10px;
}

.el-col-6 {
  width: 25%;
}

.el-col-12 {
  width: 50%;
}

.el-col-18 {
  width: 75%;
}

.el-col-24 {
  width: 100%;
}

.renderBox {
  height: 100%;
  display: flex;
  padding: 0 10px;

  i {
    font-size: 30px;
  }

  .left {
    display: flex;
    width: 260px;
    height: 100%;
    padding: 8px;
    border-right: 1px solid #787be87a;

    .conponents-list {
      width: 100%;

      .components {
        .title {
          user-select: none;
          /* 禁用文本选择 */
          font-size: 14px;
          padding: 10px 0;
        }

        .component {
          .components-item:hover {
            border: 1px dashed #787be87a;
            color: #787be8;
          }

          .components-draggable {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            flex-wrap: wrap;

            .components-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: #f6f7ff;
              font-size: 12px;
              cursor: move;
              width: 49%;
              padding: 0 5px;
              border: 1px dashed #f6f7ff;
              border-radius: 3px;
              margin-bottom: 10px;

              span {
                user-select: none;
                /* 禁用文本选择 */
                font-size: 14px;
                margin-right: 6px;
              }
            }
          }
        }
      }
    }
  }

  .center {
    width: 65%;
    border-right: 1px solid #787be87a;

    .page-card-box {
      width: 100%;
      position: relative;

      .card {
        border-bottom: none;

        .el-tabs__content {
          display: none;
        }
      }

      .btn-position-box {
        position: absolute;
        right: 10px;
        top: 4px;
      }
    }

    .page-content-box {
      display: flex;
      min-height: 80%;

      .right-content {
        flex: 1;
      }
    }

    .drawing-board {
      position: relative;
      width: 100%;
      height: calc(100% - 80px);
      padding: 20px;
      cursor: move;

      .draggableContainer {
        min-height: 100px;
        padding: 8px 12px;
        margin-bottom: 8px;
        position: relative;
        border: 1px dashed #787be87a;
        width: 100%;

        .floatIcon {
          color: red;
          cursor: pointer;
          position: absolute;
          right: -8px;
          top: -10px;
          background: white;
          display: none;

          i {
            font-size: 18px;
          }
        }

        &:hover {
          .floatIcon {
            display: inline-block;
          }
        }

        .draggableChild {
          min-height: 100px;

          .draggableCol {
            position: relative;
            padding-top: 3px;

            &:hover {
              .floatChildIcon {
                display: inline-block;
              }
            }

            .floatChildIcon {
              color: red;
              cursor: pointer;
              position: absolute;
              z-index: 999;
              right: -8px;
              top: -10px;
              background: white;
              display: none;

              i {
                font-size: 16px;
              }
            }
          }

        }

        .draggableGroups {
          display: flex;
          justify-content: end;

          .draggableCol {
            margin: 0 8px;
          }
        }
      }

      // 787be8
      .activedDraggable {
        border-color: #e50d0d;
      }
    }

    .drawing-board.left {
      padding: 0;
      border-right: 0;
      height: 100%;

    }
  }

  .right {
    flex: 1;
    padding: 8px;
  }
}

.draggableColBgc {
  border: 1px dashed #1a1fd3;
}

.template {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
</style>
<style lang="scss">
.renderTabs {
  .el-tabs__content {
    overflow: visible;
  }
}
</style>