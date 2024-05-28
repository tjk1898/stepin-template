<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { deleteDish, dishCategoryList, dishStatusByStatus, getDishPage } from '@/api/dish';

  const router = useRouter();
  const input = ref('');
  const counts = ref(0);
  const page = ref(1);
  const pageSize = ref(10);
  const checkList = ref([]);
  const tableData = ref([]);
  const dishCategorys = ref([]);
  const categoryId = ref('');
  const dishStatus = ref('');
  const isSearch = ref(false);

  const columns = ref([
    { title: '菜品名称', dataIndex: 'name', key: 'name' },
    { title: '图片', dataIndex: 'image', key: 'image', slots: { customRender: 'image' } },
    { title: '菜品分类', dataIndex: 'categoryName', key: 'categoryName' },
    { title: '售价', dataIndex: 'price', key: 'price', slots: { customRender: 'price' } },
    { title: '售卖状态', dataIndex: 'status', key: 'status', slots: { customRender: 'status' } },
    { title: '最后操作时间', dataIndex: 'updateTime', key: 'updateTime' },
    { title: '操作', dataIndex: 'operation', key: 'operation', slots: { customRender: 'operation' } },
  ]);


  const handleCurrentChange = (current: number) => {
    page.value = current;
    init();
  };

  const handleTableChange = (pagination: any) => {
    page.value = pagination.current;
    pageSize.value = pagination.pageSize;
    init();
  };

  const handleSizeChange = (current: number, page_Size: number) => {
    pageSize.value = page_Size;
    init();
  };


  const paginationConfig = reactive({
    current: page.value,
    pageSize: pageSize.value,
    total: counts.value,
    onChange: handleCurrentChange,
    onShowSizeChange: handleSizeChange,
  });

  const fetchDishes = async () => {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      name: input.value || undefined,
      categoryId: categoryId.value || undefined,
      status: dishStatus.value || undefined,
    };
    try {
      const res = await getDishPage(params);
      if (res.data.code === 1) {
        tableData.value = res.data.data.records;
        counts.value = Number(res.data.data.total);
        paginationConfig.current = page.value;
        paginationConfig.total = counts.value;
      }
    } catch (err) {
      message.error('请求出错了：' + err.message);
    }
  };

  function getDishCategoryList() {
    dishCategoryList({
      type: 1,
    })
      .then(res => {
        if (res && res.data && res.data.code === 1) {
          this.dishCategorys = (
            res.data &&
            res.data.data &&
            res.data.data
          ).map(item => {
            return { value: item.id, label: item.name };
          });
        }
      })
      .catch(() => {
      });
  }

  const fetchCategories = async () => {
    try {
      const res = await dishCategoryList({ type: 1 });
      if (res.data.code === 1) {
        dishCategorys.value = res.data.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        }));
      }
    } catch (err) {
      message.error('请求出错了：' + err.message);
    }
  };

  const init = (is_Search = false) => {
    isSearch.value = is_Search;
    fetchDishes();
  };

  const addDishtype = (id: string) => {
    if (id === 'add') {
      router.push({ path: '/dish/add' });
    } else {
      router.push({ path: '/dish/add', query: { id } });
    }
  };

  const deleteHandle = async (type, id) => {
    try {
      const res = await deleteDish(type === '批量' ? checkList.value.join(',') : id);
      if (res.data.code === 1) {
        message.success('删除成功！');
        init();
      } else {
        message.error(res.data.msg);
      }
    } catch (err) {
      message.error('请求出错了：' + err.message);
    }
  };

  const statusHandle = async (record) => {
    let params = { id: record.id, status: record.status ? '0' : '1' };
    try {
      const res = await dishStatusByStatus(params);
      if (res.data.code === 1) {
        message.success('菜品状态已经更改成功！');
        init();
      } else {
        message.error(res.data.msg);
      }
    } catch (err) {
      message.error('请求出错了：' + err.message);
    }
  };

  const handleSelectionChange = (selectedRowKeys: any) => {
    checkList.value = selectedRowKeys;
  };

  onMounted(() => {
    init();
    fetchCategories();
  });
</script>

<template>
  <div>
    <div class="flex justify-between mb-4">
      <div class="flex space-x-2">
        <a-input-search
          v-model:value="input"
          placeholder="搜索菜品"
          style="margin-bottom: 16px; width: 200px"
          @search="init"
        />

        <a-select
          v-model:value="categoryId"
          placeholder="选择分类"
          style="margin-bottom: 16px; width: 200px"
          @change="init"
        >
          <a-select-option value="">全部分类</a-select-option>
          <a-select-option v-for="item in dishCategorys" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
      <div class="flex space-x-2">
        <a-button
          type="primary"
          style="margin-bottom: 16px"
          @click="addDishtype('add')"
        >
          新建菜品
        </a-button>

        <a-button
          type="danger"
          style="margin-bottom: 16px; margin-left: 8px"
          @click="deleteHandle('批量', null)"
          :disabled="checkList.length === 0"
        >
          批量删除
        </a-button>
      </div>
    </div>
    <a-table
      :columns="columns"
      :dataSource="tableData"
      rowKey="id"
      :pagination="paginationConfig"
      @change="handleTableChange"
      :row-selection="{selectedRowKeys: checkList, onChange: handleSelectionChange}"
    >
      <template #image="{ text, record }">
        <a-image
          style="width: 80px; height: 40px; border: none; cursor: pointer"
          :src="record.image"
          fallback="./../../assets/noImg.png"
        />
      </template>

      <template #price="{ text, record }">
        <span>￥{{ (record.price).toFixed(2) }}</span>
      </template>

      <template #status="{ text, record }">
        <div :class="{ 'tableColumn-status': true, 'stop-use': String(record.status) === '0' }">
          {{ String(record.status) === '0' ? '停售' : '启售' }}
        </div>
      </template>

      <template #operation="{ text, record }">
        <a-button type="link" @click="addDishtype(record.id)">修改</a-button>
        <a-popconfirm
          title="确定删除这个菜品吗？"
          @confirm="deleteHandle('单删', record.id)"
          ok-text="确定"
          cancel-text="取消"
        >
          <a-button type="link" danger>删除</a-button>
        </a-popconfirm>
        <a-popconfirm
          title="确定更改这个菜品的状态吗？"
          @confirm="statusHandle(record)"
          ok-text="确定"
          cancel-text="取消"
        >
          <a-button
            type="link"
            :class="{ 'blueBug': record.status == '0', 'delBut': record.status != '0' }"
          >
            {{ record.status == '0' ? '启售' : '停售' }}
          </a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>


<style scoped>
  .tableColumn-status {
    &.stop-use {
      color: red;
    }
  }
</style>
