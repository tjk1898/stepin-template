<template>
  <ThemeProvider :color="{ middle: { 'bg-base': '#f9e9f9' } }">
    <div ref="demo" class="demo p-8 mb-4">这是一个Demo，我们可以添加很多这样的页面</div>
  </ThemeProvider>
</template>

<script lang="ts" setup>
  import { ThemeProvider } from 'stepin';
</script>
