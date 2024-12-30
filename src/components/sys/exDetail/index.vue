<template>
  <div class="ex-page-container">
    <div class="ex-action">
      <div class="ex-action-box-left">
        {{ title }}
      </div>
      <div class="ex-action-box-right">
        <ex-action-box :isForm="true" :editable="editable" :renderBtnConfig="renderBtnConfig"
          v-model:queryParams='queryParams' @handleCellClick="handleCellClick"></ex-action-box>
      </div>
    </div>

    <div class="ex-search mainForm scrollBar">
      <ex-search-box v-model:queryParams='queryParams' ref="exSearchBoxRef" :searchOptions="formOptions"
        :qiuckOptions='formOptions' :isForm="true" :editable="editable" :hasDetail="hasDetail"
        :isAudited="queryParams.audited" />
    </div>

    <div class="ex-table-page-body">
      <div class="tabBox">
        <el-tabs v-model="active">
          <template v-for="item in tableList" :key="item.tableId">
            <el-tab-pane :label="item.name" :name="item.tableId"></el-tab-pane>
          </template>
        </el-tabs>
      </div>

      <template v-for="item in tableList" :key="item.tableId">
        <div class="contentBox" v-show="active == item.tableId">
          <ex-table-detail-box @handleRowDataChange="handleRowDataChange" :ref="'table' + item.tableId"
            :editable="editable" :isAudited="queryParams.audited" :GridLabel="item.name" @GridRefresh="init"
            :GridOptions="item.data"
            :GridTableData="queryParams[item.propName]" :GridTableId="item.tableId" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { GridMixin } from '@/Mixin/GridMixinDetail.js';
export default {
  mixins: [GridMixin],
};
</script>
<style scoped lang="scss">
.filter-container {
  overflow: visible;
  border: 0;
  margin-bottom: 12px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.mainForm {
  max-height: 50%;
  overflow-y: auto;
}

.ex-table-page-body {
  flex-direction: column;
  padding: 0 6px;
  background: white;
}

.ex-action {
  background: white;
  border-bottom: 1px dashed var(--el-border-color);
}

.contentBox {
  flex: 1;
}

::v-deep {
  .ex-page-container {
    background: white;
    padding: 6px;
    box-shadow: none
  }

  .ex-action-box-left {
    font-size: 14px;
    padding-left: 10px
  }

  .ex-action {
    background: white;
  }
}
</style>
<style lang="scss">
.tabBox {
  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__nav-wrap::after {
    height: 1px;
  }
}
</style>