<template>
  <div>
     <svg-icon icon-class="question-line" @click="goto" />
  </div>
</template>

<script setup>
const url = ref('https://junle.org');

function goto() {
  window.open(url.value)
}
</script>