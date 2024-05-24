<script setup lang="ts">
  import { getBusinessData } from '@/api';
  import { onMounted, ref } from 'vue';
  import Overview from '@/pages/dashboard/Overview.vue';

  const overviewData = ref(null);


  onMounted(async () => {
    try {
      const data = await getBusinessData();
      overviewData.value = data.data.data;
    } catch (error) {
      console.error('Failed to fetch business data:', error);
    }
  });
</script>

<template>
  <div class="workplace grid grid-rows-none gap-4 mt-xxs">
    <Overview :overviewData="overviewData" />
  </div>
</template>

<style scoped lang="less">
  .workplace {
  }

  #stepin-app .stepin-view.unbounded .stepin-layout-content .stepin-view-main .stepin-tabs-view-content-main {
    background-color: transparent;
    padding: 0px;
  }

</style>
