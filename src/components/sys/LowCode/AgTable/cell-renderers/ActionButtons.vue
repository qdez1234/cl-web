<template>
  <div id="ActionButtons">
    <template v-for="(btn, index) in params.buttonConfig" :key="index">
      <template v-if="pareBtn(btn)">
        <el-button text @click="handleClick(btn)" v-if="btn.authentication==''" :type="btn.type">{{ btn.label }}
        </el-button>
        <el-button text @click="handleClick(btn)" v-else v-hasPermi="pareAuthenTication(btn.authentication)" :type="btn.type">{{ btn.label }}
        </el-button>
      </template>

    </template>

  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const props = defineProps({
  params: Object
});
let { status, audited, finishStatus } = props.params.data

const handleClick = (btn) => {
  let { code, fun } = btn
  props.params.context.componentParent.HandleCellClick(code, props.params, fun);
};
/**
 * 鉴权解析
 */
const pareAuthenTication = (authentication) => {
   return authentication.split(',')
}
/**
 * 解析自定义代码
 * @param btn 
 */
const pareBtn = (btn) => {
  if (btn.expression) {
    const expression = new Function('params','route',`${btn.expression}`);
    return expression(props.params.data,route)
  }
  return true
}

</script>

<style lang="scss">
#ActionButtons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  .el-button {
    margin-left: 3px !important;
    min-width: 40px;
  }
}
</style>
