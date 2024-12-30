<template>
  <div class="ex-page-container">
    <div class="ex-search" v-show="GridShowSearch">
      <ex-search-box v-model:queryParams='GrildQueryParams' :qiuckOptions='GridQiuckOptions' :searchOptions="GrildSearchOptions"
        :isForm="false" @search="GridGetList" />
    </div>

    <div class="ex-action">
      <div class="ex-action-box-left"></div>
      <div class="ex-action-box-right">
        <ex-action-box :renderBtnConfig="GridRenderBtnConfig"  @handleCellClick="GridHandleCellClick">
        </ex-action-box>
        <right-toolbar v-model:showSearch="GridShowSearch" @queryTable="GridGetList" @update:settings="GridHandleSetting"
          @update:toolPanel="GridHandleToolPanel" :gridSetting="true"></right-toolbar>
      </div>
    </div>

    <div class="ex-table-page-body">
      <AgTable ref="gridRef" :gridColDefs="GridColDefs" rowSelection="multiple" :suppressRowClickSelection="true"
        :grildUrl="GrildUrl"  :grildParams="GrildQueryParams"  :gridImKeyParams="GridImKeyParams"
        :gridKey="$route.path + '/' + GridTableId" @handleCellClick="GridHandleCellClick" />
    </div>

    <ex-change-box :formOptions="GridFormOptions" :editable="dialogEditAble" ref="changeRef" @handleChange="GridHandleChange" />

  </div>
</template>

<script>
import { GridMixin } from '@/Mixin/GridMixin.js';
export default {
  mixins: [GridMixin],
};
</script>