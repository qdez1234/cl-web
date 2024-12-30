<template>
  <!-- 模板部分 -->
  <el-dialog draggable v-model="visible" width="50%" :fullscreen="fullscreen" :show-close="false" :close-on-click-modal="false">
    <!-- 弹窗头部 -->
    <template #header>
      <div class="custom-header">
        <span>{{title}}</span>
        <div class="right-btn">
          <!-- 全屏按钮 -->
          <el-icon @click="changeScreen"><FullScreen /></el-icon>
          <!-- 关闭按钮 -->
          <el-icon @click="close"><Close /></el-icon>
        </div>
      </div>
    </template>
    <!-- 弹窗中间body -->
    <el-scrollbar>
      <div :class="formBody">
        <!-- 这个一定要加 -->
        <slot name="dialog-body" />
      </div>
    </el-scrollbar>
    <!-- 弹窗底部 -->
    <template #footer>
      <slot name="dialog-footer" />
    </template>
  </el-dialog>
</template>

<script setup name="BDialog">
import { ref,computed } from "vue";
let props = defineProps({
  visble: {
    type: Boolean,
    require: true,
    default: false
  },
  title: {
    type: String,
    default: ""
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
});

const visible = ref(props.visble);//显示弹窗
//弹窗标题
const title = computed({
  get() {
    return props.title
  }
})
//是否全屏
const fullscreen = computed({
  get() {
    return props.fullscreen
  },
  set(value) {
    emits('update:fullscreen', value)
  }
});
const formBody = ref("form-body");//弹窗body部分css
let emits = defineEmits(['update:visble', 'update:fullscreen', 'saveSubmit']);

//全屏
const changeScreen = () => {
  if (fullscreen.value == true) {
    fullscreen.value = false;
    formBody.value = "form-body";
  } else {
    fullscreen.value = true;
    formBody.value = "form-body-new";
  }
}
//销毁
const close = () => {
  visible.value = false;
  emits('update:fullscreen', false)
  emits('update:visble', false);
}
</script>

<style scoped lang="scss">
  .custom-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 25px;
  }

  .custom-header .right-btn {
    height: 25px;
    cursor: pointer;
  }

  .custom-header .right-btn .el-icon {
    margin-left: 10px;
    height: 100%;
  }

  .custom-header .right-btn .el-icon:hover {
    color: rgb(167, 167, 167);
  }

  .form-body {
    padding: 10px;
    height: 500px;
  }

  .form-body-new {
    padding: 20px;
    height: 850px;
  }
  
</style>