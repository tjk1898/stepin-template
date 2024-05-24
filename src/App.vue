<template>

  <a-config-provider :getPopupContainer="getPopupContainer">
    <ThemeProvider is-root v-bind="themeConfig" :apply-style="false">
      <stepin-view
        system-name="Hehe"
        logo-src="@/assets/vue.svg"
        :class="`${contentClass}`"
        :user="user"
        :navMode="navigation"
        :useTabs="useTabs"
        :themeList="themeList"
        v-model:show-setting="showSetting"
        v-model:theme="theme"
        @themeSelect="configTheme"
      >
        <template #headerActions>
          <HeaderActions @showSetting="showSetting = true" />
        </template>
        <template #pageFooter>
          <PageFooter />
        </template>
        <template #themeEditorTab>
          <a-tab-pane tab="其它" key="other">
            <Setting />
          </a-tab-pane>
        </template>
      </stepin-view>
    </ThemeProvider>
  </a-config-provider>
  <login-modal :unless="['/login']" />
</template>

<script lang="ts" setup>
  import { computed, onBeforeMount, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs, useAccountStore, useMenuStore, useSettingStore } from '@/store';
  import avatar from '@/assets/avatar.png';
  import { HeaderActions, PageFooter } from '@/components/layout';
  import Setting from './components/setting';
  import { LoginModal } from '@/pages/login';
  import { configTheme, themeList } from '@/theme';
  import { ThemeProvider } from 'stepin';
  import { useDashboardStore } from '@/store/dashboard';

  const { logout, profile } = useAccountStore();

  const { navigation, useTabs, theme, contentClass } = storeToRefs(useSettingStore());
  const themeConfig = computed(() => themeList.find((item) => item.key === theme.value)?.config ?? {});

  const showSetting = ref(false);
  const router = useRouter();

  const accountStore = useAccountStore();
  const menuStore = useMenuStore();
  // const dashboardStore = useDashboardStore();

  // 使用计算属性定义用户对象，以确保响应式更新
  const user = computed(() => ({
    name: accountStore.account?.username || '',
    avatar: accountStore.account?.avatar || avatar,
    menuList: [],
  }));

  async function initialize() {

    // 1. 获取路由
    await menuStore.getMenuList();

    // 2. 获取Dashboard信息
    // if (accountStore.logged) {
    //   dashboardStore.initializeStore();
    // }

    // 3. 定义user
    user.value.menuList = [
      { title: '个人中心', key: 'personal', icon: 'UserOutlined', onClick: () => router.push('/profile') },
      { title: '设置', key: 'setting', icon: 'SettingOutlined', onClick: () => (showSetting.value = true) },
      { type: 'divider' },
      {
        title: '退出登录',
        key: 'logout',
        icon: 'LogoutOutlined',
        onClick: () => logout(),
      },
    ];
  }

  // 4. 在组件挂载前初始化
  onBeforeMount(() => {
    initialize();
  });

  function getPopupContainer() {
    return document.querySelector('.stepin-layout');
  }
</script>

<style lang="less">
  .stepin-view {
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      border-radius: 4px;
      background-color: theme('colors.primary.500');
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: theme('colors.primary.400');

      &:hover {
        background-color: theme('colors.primary.500');
      }
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
      border-radius: 4px;
      background: theme('backgroundColor.layout');
    }
  }

  html {
    height: 100vh;
    overflow-y: hidden;
  }

  body {
    margin: 0;
    height: 100vh;
    overflow-y: hidden;
  }

  .stepin-img-checkbox {
  @apply transition-transform;

    &:hover {
    @apply scale-105 ~ "-translate-y-[2px]";
    }

    img {
    @apply shadow-low rounded-md transition-transform;
    }
  }
</style>
