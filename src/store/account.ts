import { defineStore } from 'pinia';
import { useMenuStore } from './menu';
import { useAuthStore } from '@/plugins';
import { useLoadingStore } from './loading';
import { login, queryEmployeeById } from '@/api/employee';


// 用户个人信息接口
export interface Profile {
  account: Account;  // 用户账户信息
  permissions: string[];  // 权限列表
  role: string;  // 角色
}

// 定义了一个接口 Account，包含了 username、avatar 和 gender 三个属性
export interface Account {
  id: string,       // id
  username: string;  // 用户名
  avatar: string;  // 头像
  gender: number;  // 性别（0代表未知，1代表男性，2代表女性）
}

// 令牌结果类型
export type TokenResult = {
  token: string;  // 令牌
  expires: number;  // 过期时间
};


export const useAccountStore = defineStore('account', {
  state() {
    return {
      account: JSON.parse(localStorage.getItem('account') || '{}') as Account,
      permissions: JSON.parse(localStorage.getItem('permissions') || '[]') as string[],
      role: localStorage.getItem('role') || '',
      logged: JSON.parse(localStorage.getItem('logged') || 'false'),
      token: localStorage.getItem('token') || '',
    };
  },
  actions: {
    setAccount(account) {
      this.account = account;
      localStorage.setItem('account', JSON.stringify(account));
    },
    setPermissions(permissions) {
      this.permissions = permissions;
      localStorage.setItem('permissions', JSON.stringify(permissions));
    },
    setRole(role) {
      this.role = role;
      localStorage.setItem('role', role);
    },
    setLogged(logged) {
      this.logged = logged;
      localStorage.setItem('logged', JSON.stringify(logged));
    },
    setToken(newToken: string) {
      this.token = newToken; // 更新 token 的值
      localStorage.setItem('token', newToken); // 更新 localStorage 中的 token
    },
    clearAccount() {
      this.account = {} as Account;
      this.permissions = [];
      this.role = '';
      this.logged = false;
      this.token = '';
      localStorage.removeItem('account');
      localStorage.removeItem('permissions');
      localStorage.removeItem('role');
      localStorage.removeItem('logged');
      localStorage.removeItem('token');
    },
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
      try {
        const { data } = await login({ username, password }); // 调用登录接口
        if (String(data.code) === '1') { // 判断登录结果
          this.setLogged(true); // 设置登录状态为true
          this.setToken(data.data.token);
          this.setRole(data.data.role);
          this.setAccount({
            id: data.data.id,
            username: data.data.name,
            avatar: data.data.avatar,
            gender: data.data.gender,
          });
          await useMenuStore().getMenuList(); // 获取菜单列表

          return data.data; // 返回登录成功的数据
        } else {
          return Promise.reject(data.msg); // 返回登录失败的错误信息
        }
      } catch (error) {
        return Promise.reject(error); // 返回其他异常情况下的错误信息
      }
    },
    async logout() {
      return new Promise<boolean>((resolve) => {
        localStorage.removeItem('stepin-menu');
        this.clearAccount();
        resolve(true);
      });
    },

    async profile() {
      const { setAuthLoading } = useLoadingStore();
      setAuthLoading(true);
      try {
        if (this.logged === null || this.logged === false || this.account === null) {
          return null;
        } else {
          const response = await queryEmployeeById(this.account.id); // 传入合适的ID
          if (response.data.code === 1) {
            const { setAuthorities } = useAuthStore();
            const { id, userName, name, avatar, gender, permissions, role } = response.data.data; // 返回值是data.data

            this.setAccount({ id, userName, avatar, gender });

            this.setPermissions(permissions);

            this.setRole(role);

            setAuthorities(permissions);
            return response.data.data;
          } else {
            return Promise.reject(response);
          }
        }
      } finally {
        setAuthLoading(false);
      }
    },
  },
});
