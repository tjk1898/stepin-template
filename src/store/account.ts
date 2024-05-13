import { defineStore } from 'pinia';
import http from './http';
import { Response } from '@/types';
import { useMenuStore } from './menu';
import { useAuthStore } from '@/plugins';
import { useLoadingStore } from './loading';

export interface Profile {
  account: Account;
  permissions: string[];
  role: string;
}
export interface Account {
  username: string;
  avatar: string;
  gender: number;
}

export type TokenResult = {
  token: string;
  expires: number;
};
export const useAccountStore = defineStore('account', {
  state() {
    return {
      account: {} as Account,
      permissions: [] as string[],
      role: '',
      logged: true,
    };
  },
  actions: {
    /**
     * 处理用户登录请求，并根据响应结果执行相应的操作，包括:
     * 1. 设置用户登录状态
     * 2. 授权信息
     * 3. 获取用户菜单列表
     *
     * @param username
     * @param password
     */
    async login(username: string, password: string) {
      return http
        .request<TokenResult, Response<TokenResult>>('/login', 'post_json', { username, password })
        .then(async (response) => {
          if (response.code === 0) {
            this.logged = true;
            http.setAuthorization(`Bearer ${response.data.token}`, new Date(response.data.expires));
            await useMenuStore().getMenuList();
            return response.data;
          } else {
            return Promise.reject(response);
          }
        });
    },
    async logout() {
      return new Promise<boolean>((resolve) => {
        localStorage.removeItem('stepin-menu');
        http.removeAuthorization();
        this.logged = false;
        resolve(true);
      });
    },
    async profile() {
      const { setAuthLoading } = useLoadingStore();
      setAuthLoading(true);
      return http
        .request<Account, Response<Profile>>('/account', 'get')
        .then((response) => {
          if (response.code === 0) {
            const { setAuthorities } = useAuthStore();
            const { account, permissions, role } = response.data;
            this.account = account;
            this.permissions = permissions;
            this.role = role;
            setAuthorities(permissions);
            return response.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setAuthLoading(false));
    },
    setLogged(logged: boolean) {
      this.logged = logged;
    },
  },
});
