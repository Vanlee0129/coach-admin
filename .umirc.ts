import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '共享助教',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '人员管理',
      path: '/manage',
      component: './Manage',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      layout: false,
    },
  ],
  define: {
    'process.env.SUPABASE_URL': process.env.SUPABASE_URL,
    'process.env.SUPABASE_KEY': process.env.SUPABASE_KEY,
  },
  npmClient: 'npm',
});
