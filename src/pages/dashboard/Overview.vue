<template>

  <div class="grid grid-cols-12 gap-6">
    <mini-statistic-card class="card col-span-24 mdx:col-span-6 xlx:col-span-3"
                         title="hehe" value="32"
    />
    <mini-statistic-card class="card col-span-12 mdx:col-span-6 xlx:col-span-3"
                         title="hehe" value="32"
    />
    <mini-statistic-card class="card col-span-12 mdx:col-span-6 xlx:col-span-3"
                         title="hehe" value="32"
    />
    <mini-statistic-card class="card col-span-12 mdx:col-span-6 xlx:col-span-3"
                         title="hehe" value="32"
    />
    <mini-statistic-card class="card col-span-12 mdx:col-span-6 xlx:col-span-3"
                         title="hehe" value="32"
    />
  </div>

  <!--
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="homeTitle text-2xl font-bold">今日数据</h2>
      <span class="text-sm">
        <router-link to="statistics" class="text-blue-500 hover:underline">查看详细数据</router-link>
      </span>
    </div>
    <div class="text-center mb-4 text-lg font-semibold">
      {{ days[1] }}
    </div>
    <div class="overviewBox grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="bg-white p-4 shadow rounded-md flex flex-col items-center">
        <p class="tit text-gray-600">营业额</p>
        <p class="num text-xl font-semibold">¥ {{ overviewData.turnover }}</p>
      </div>
      <div class="bg-white p-4 shadow rounded-md flex flex-col items-center">
        <p class="tit text-gray-600">有效订单</p>
        <p class="num text-xl font-semibold">{{ overviewData.validOrderCount }}</p>
      </div>
      <div class="bg-white p-4 shadow rounded-md flex flex-col items-center">
        <p class="tit text-gray-600">订单完成率</p>
        <p class="num text-xl font-semibold">{{ (overviewData.orderCompletionRate * 100).toFixed(0) }}%</p>
      </div>
      <div class="bg-white p-4 shadow rounded-md flex flex-col items-center">
        <p class="tit text-gray-600">平均客单价</p>
        <p class="num text-xl font-semibold">¥ {{ overviewData.unitPrice }}</p>
      </div>
      <div class="bg-white p-4 shadow rounded-md flex flex-col items-center">
        <p class="tit text-gray-600">新增用户</p>
        <p class="num text-xl font-semibold">{{ overviewData.newUsers }}</p>
      </div>
    </div>
  </div>
  -->
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { getday } from '@/utils/formValidate';

  // Define props
  const props = defineProps<{
    overviewData: {
      turnover: number;
      validOrderCount: number;
      orderCompletionRate: number;
      unitPrice: number;
      newUsers: number;
    };
  }>();

  // Compute days using getday function
  const days = computed(() => getday());
</script>
<style scoped lang="less">

</style>
