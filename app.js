
//import touch from 'pages/plan/touch.js'//新加

App({
  httpUrl: 'https://xcx.ebike-charge.com/iesms-xcx',//生产
  //httpUrl: 'https://xcxbeta.ebike-charge.com/iesms-xcx',//测试
  //httpUrl: 'https://iesmsappletbeta.ebike-charge.com/iesms-xcx',
  // let 区块内部参数定义，只在定义的地方生效
  // var 可不初始化调用，不初始化默认为undefined 可以修改
  // const 不可修改参数定义，要初始化
  globalData: {
    hasLogin: false,
    sfpt: '',//平台级别运营商区分，非空情况下为平台
    apiW: 0,
    apiH: 0,
    user_org_no: '',
    user_org_name: '',
    user_no: '',
    user_name: '',//用户名
    expiredTime: 0,
    pt_org_no: '12',
    ce_cust_id:'',//'20174508665077775', // 用户id
    ce_cust_name: '',//'涂培忠测试222', // 用户名称
  },
 // touch: new touch(),//新加,
  onLaunch: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.apiW = res.windowWidth;
        this.globalData.apiH = res.windowHeight - 40;
      }
    })
  },
})