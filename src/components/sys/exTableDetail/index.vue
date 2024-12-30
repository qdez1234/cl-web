<template>
  <div class="ex-page-container">
    <div class="ex-action">
      <div class="ex-action-box-left"></div>
      <div class="ex-action-box-right">
        <btnBox :GridRenderBtnConfig="GridRenderBtnConfig" :editable="editable" :isAudited="this.isAudited"
          @handleClick="handleClick" />
      </div>
    </div>
    <div class="ex-table-page-body">
      <AgTable ref="gridRef" @handleRowDataChange="handleRowDataChange" :gridColDefs="GridColDefs"
        rowSelection="multiple" :suppressRowClickSelection="true" :gridData="GridTableData"
        :gridKey="$route.path + '/' + GridTableId" @handleCellClick="handleClick" />
    </div>

      <ex-report-dialog-box ref="dialogReport" rowSelection="multiple" :isForm="true"  v-if="dialogVisibilit"
      @handleReport="handleInsert" :source="sourceData"  :isReport="true"/> 

    <ex-change-box :formOptions="GridFormOptions" ref="changeRef"  @handleChange="GridHandleChange" />

  </div>
</template>

<script>
import btn from './btn.vue'
import { GridMixin } from '@/Mixin/GridTableDetailMixin.js';
export default {
  components: {
    btnBox: btn
  },
  mixins: [GridMixin],
};
</script>