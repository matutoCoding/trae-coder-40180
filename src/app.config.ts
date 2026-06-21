export default defineAppConfig({
  pages: [
    'pages/practice/index',
    'pages/library/index',
    'pages/mistakes/index',
    'pages/mine/index',
    'pages/practice-detail/index',
    'pages/material-detail/index',
    'pages/mistake-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#6366F1',
    navigationBarTitleText: 'AI客服训练',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F3FF'
  },
  tabBar: {
    color: '#6B7280',
    selectedColor: '#6366F1',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/practice/index',
        text: '情景练习'
      },
      {
        pagePath: 'pages/library/index',
        text: '素材库'
      },
      {
        pagePath: 'pages/mistakes/index',
        text: '错题本'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
