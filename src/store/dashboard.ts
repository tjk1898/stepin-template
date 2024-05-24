import { defineStore } from 'pinia';
import { getBusinessData, getOrderData, getOverviewDishes, getSetMealStatistics } from '@/api/index'; // 假设接口在这里导出


export interface OrderData {
  waitingOrders: number;
  deliveredOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  allOrders: number;
}

export interface OverviewDishes {
  sold: number;
  discontinued: number;
}

export interface SetMealStatistics {
  sold: number;
  discontinued: number;
}

export interface BusinessData {
  turnover: number;
  validOrderCount: number;
  orderCompletionRate: number;
  unitPrice: number;
  newUsers: number;
}


export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    orderData: null as OrderData | null,
    overviewDishes: null as OverviewDishes | null,
    setMealStatistics: null as SetMealStatistics | null,
    businessData: null as BusinessData | null,
  }),
  actions: {
    async fetchOrderData() {
      try {
        const response = await getOrderData();
        this.orderData = response.data.data;

      } catch (error) {
        console.error('Failed to fetch order data:', error);
      }
    },
    async fetchOverviewDishes() {
      try {
        const response = await getOverviewDishes();
        this.overviewDishes = response.data.data;
      } catch (error) {
        console.error('Failed to fetch overview dishes:', error);
      }
    },
    async fetchSetMealStatistics() {
      try {
        const response = await getSetMealStatistics();
        this.setMealStatistics = response.data.data;
      } catch (error) {
        console.error('Failed to fetch set meal statistics:', error);
      }
    },
    async fetchBusinessData() {
      try {
        const response = await getBusinessData();
        this.businessData = response.data.data;
      } catch (error) {
        console.error('Failed to fetch business data:', error);
      }
    },
    initializeStore() {
      this.fetchOrderData();
      this.fetchOverviewDishes();
      this.fetchSetMealStatistics();
      this.fetchBusinessData();
    },
  },
});
