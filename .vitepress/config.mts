import { defineConfig } from 'vitepress'

const base = process.env.BASE_PATH || '/'

export default defineConfig({
  title: 'neePaaS 开发手册',
  description: '面向新人开发的 neePaaS 场景化操作指南',
  base,
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: undefined,
    nav: [
      { text: '首页', link: '/' },
      { text: '目录索引', link: '/00-目录与快速索引' },
      { text: '调试排查', link: '/02-调试日志与常见报错排查手册' }
    ],
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '目录与快速索引', link: '/00-目录与快速索引' }
        ]
      },
      {
        text: '基础开发',
        items: [
          { text: '01 闪用前端插件', link: '/01-闪用前端插件操作说明' },
          { text: '02 调试日志与常见报错排查', link: '/02-调试日志与常见报错排查手册' },
          { text: '03 表单数据增删改查', link: '/03-表单数据增删改查操作说明' },
          { text: '04 字段组件与常用组件', link: '/04-字段组件与常用组件操作说明' },
          { text: '05 表格与列表组件', link: '/05-表格与列表组件操作说明' }
        ]
      },
      {
        text: '复杂表单',
        items: [
          { text: '06 迭代器组件', link: '/06-迭代器组件操作说明' },
          { text: '07 子表操作', link: '/07-子表操作说明' },
          { text: '08 外键过滤与弹窗选择', link: '/08-外键过滤与弹窗选择操作说明' },
          { text: '09 表单校验与业务规则', link: '/09-表单校验与业务规则操作说明' }
        ]
      },
      {
        text: '页面与权限',
        items: [
          { text: '10 页面跳转与父子页面通信', link: '/10-页面跳转与父子页面通信操作说明' },
          { text: '11 用户角色权限与登录信息', link: '/11-用户角色权限与登录信息操作说明' }
        ]
      },
      {
        text: '集成与移动端',
        items: [
          { text: '12 后端插件与前后端调用', link: '/12-后端插件与前后端调用操作说明' },
          { text: '13 接口请求与第三方系统对接', link: '/13-接口请求与第三方系统对接操作说明' },
          { text: '14 文件图片 Excel 导入导出', link: '/14-文件图片Excel导入导出操作说明' },
          { text: '15 移动端开发', link: '/15-移动端开发操作说明' }
        ]
      }
    ],
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})
