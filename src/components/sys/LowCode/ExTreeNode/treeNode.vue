<template>
    <li>
      <label>
        <input
          type="checkbox"
          :checked="checked"
          :indeterminate="indeterminate"
          @change="toggleCheckbox"
        />
        {{ node.label }}
      </label>
      <ul v-if="node.children && node.children.length > 0">
        <TreeNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :checked="child.checked"
          :indeterminate="isIndeterminate(child)"
          @update:checked="updateChecked(child, $event)"
        />
      </ul>
    </li>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    node: {
      type: Object,
      required: true
    },
    checked: {
      type: Boolean,
      required: true
    },
    indeterminate: {
      type: Boolean,
      required: true
    }
  });
  
  const emit = defineEmits(['update:checked']);
  
  const toggleCheckbox = () => {
    emit('update:checked', !props.checked);
  };
  
  const isIndeterminate = (node) => {
    const children = node.children || [];
    const checkedCount = children.filter(child => child.checked).length;
    const allChecked = children.length === checkedCount;
    return !allChecked && checkedCount > 0;
  };
  
  </script>
  