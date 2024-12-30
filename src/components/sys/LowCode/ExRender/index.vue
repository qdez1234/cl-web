<template>
    <div class="ex-page-container">
        <div class="container-left">
            <template v-for="(outerElement, index) in pageConfig" :key="index">
                <ex-tree :params="outerElement" v-if="outerElement.modelType == 'ex-tree'"></ex-tree>
            </template>
        </div>
        <div class="container-right">
            <template v-for="(outerElement, index) in pageConfig" :key="index">
                <div class="ex-search" v-if="outerElement.modelType == 'form'">
                    <ex-form :outerElement="outerElement" :PageDisabled="PageDisabled" ref="exFormRef"
                        @update:methods="updateMethods" :outerData="form"></ex-form>
                </div>

                <div class="ex-table-page-body" v-if="outerElement.modelType == 'ex-grid'">
                    <AgTable class="AgTable" ref="gridRef" :paging="true" :PageDisabled="PageDisabled"
                        :gridColDefs="outerElement.gridColDefs.filter(ele => ele.isShow)"
                        :gridActions="outerElement.actionGroup" :gridKey="$route.path + outerElement.id"
                        :grildUrl="outerElement.API" :rowSelection="outerElement.rowSelection" :gridGroup="outerElement.isGroup" :gridGroupParams="outerElement.isGroupParams"
                        :suppressRowClickSelection="true" />
                </div>

                <div class="ex-table-page-body" v-if="outerElement.modelType == 'ex-tabs'">
                    <ex-tabs :outerElement="outerElement" :outerData="form" ref="tabs"
                        :PageDisabled="PageDisabled"></ex-tabs>
                </div>
            </template>
        </div>

        <template v-for="(config, index) in dialogConfig" :key="index">
            <ex-dialog ref="exDialogRef" :pageConfig="config" :PageDisabled="PageDisabled"></ex-dialog>
        </template>

        <caseDialog ref="caseDialogRef" />
    </div>
</template>

<script>
import { GridMixin } from './mixin.js';
export default {
    mixins: [GridMixin],
};
</script>