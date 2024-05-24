<template>
  <div>
    <h2>订单信息</h2>
    <a-table :dataSource="orderData" :columns="columns" @rowClick="handleTable" :pagination="pagination" @change="tableChange" >
    </a-table>

    <a-modal v-model:visible="dialogVisible" title="订单信息" width="53%" @ok="handleOk" @cancel="handleCancel">
      <a-form :model="diaForm" labelCol="{ span: 5 }" wrapperCol="{ span: 16 }">
        <a-form-item label="订单号">{{ diaForm.number }}</a-form-item>
        <a-form-item label="下单时间">{{ diaForm.orderTime }}</a-form-item>
        <a-form-item label="用户名">{{ diaForm.consignee }}</a-form-item>
        <a-form-item label="手机号">{{ diaForm.phone }}</a-form-item>
        <a-form-item label="地址">{{ diaForm.address }}</a-form-item>
        <a-form-item label="备注">{{ diaForm.remark }}</a-form-item>
        <a-table :dataSource="diaForm.orderDetailList" :columns="detailColumns" pagination="false" />
        <a-form-item label="菜品小计">￥{{ diaForm.amount - 6 - diaForm.packAmount }}</a-form-item>
        <a-form-item label="派送费">￥6</a-form-item>
        <a-form-item label="打包费">￥{{ diaForm.packAmount }}</a-form-item>
        <a-form-item label="合计">￥{{ diaForm.amount }}</a-form-item>
        <a-form-item label="支付渠道">{{ diaForm.payMethod === 1 ? '微信支付' : '支付宝支付' }}</a-form-item>
        <a-form-item label="支付时间">{{ diaForm.checkoutTime }}</a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:visible="cancelDialogVisible" :title="cancelDialogTitle + '原因'" @ok="confirmCancel" @cancel="handleCancel">
      <a-form :model="cancelForm" labelCol="{ span: 5 }" wrapperCol="{ span: 16 }">
        <a-form-item label="原因">
          <a-select v-model:value="cancelReason" placeholder="'请选择' + cancelDialogTitle + '原因'">
            <a-select-option v-for="item in cancelReasonList" :key="item.value" :value="item.label">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="cancelReason === '自定义原因'" label="自定义原因">
          <a-input v-model:value="remark" type="textarea" :placeholder="'请填写原因（限20字内）'" maxlength="20" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { getOrderDetailPage, queryOrderDetailById, completeOrder, deliveryOrder, orderCancel, orderReject, orderAccept } from '@/api/order';

  const activeIndex = ref(0);
  const dialogVisible = ref(false);
  const cancelDialogVisible = ref(false);
  const diaForm = reactive({});
  const orderData = ref([]);
  const columns = [
    { title: '订单号', dataIndex: 'number' },
    { title: '订单菜品', dataIndex: 'orderDishes' },
    { title: '地址', dataIndex: 'address' },
    { title: '预计送达时间', dataIndex: 'estimatedDeliveryTime', sorter: true },
    { title: '实收金额', dataIndex: 'amount' },
    { title: '备注', dataIndex: 'remark' },
    { title: '操作', dataIndex: 'operation', scopedSlots: { customRender: 'operation' } },
  ];
  const detailColumns = [
    { title: '菜品名称', dataIndex: 'name' },
    { title: '数量', dataIndex: 'number' },
    { title: '价格', dataIndex: 'amount' },
  ];
  const cancelReasonList = [
    { label: '订单量较多，暂时无法接单', value: 1 },
    { label: '菜品已销售完，暂时无法接单', value: 2 },
    { label: '餐厅已打烊，暂时无法接单', value: 3 },
    { label: '自定义原因', value: 0 },
  ];

  function handleTable(row) {
    queryOrderDetailById({ orderId: row.id }).then(response => {
      diaForm.value = response.data;
      dialogVisible.value = true;
    });
  }

  function handleClass(index) {
    activeIndex.value = index;
  }

  function handleOk() {
    dialogVisible.value = false;
  }

  function handleCancel() {
    dialogVisible.value = false;
    cancelDialogVisible.value = false;
  }

  function confirmCancel() {
    const reason = cancelReason.value === '自定义原因' ? remark.value : cancelReason.value;
    // 调用取消订单或拒单接口
  }
</script>

<style scoped>
  .conTab {
    display: flex;
    list-style: none;
  }
  .conTab li {
    padding: 10px;
    cursor: pointer;
  }
  .conTab li.active {
    background-color: #1890ff;
    color: #fff;
  }
</style>
