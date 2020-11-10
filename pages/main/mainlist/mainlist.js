var app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    info: [],
    icount:0

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  confirm: function (e) {
    this.showStlist(e.detail.value, false);
  },

  onLoad(options) {
    console.log(options);
    if (typeof (options.name) != 'undefined'){
      var name = decodeURIComponent(options.name);// 解码
      console.log(name);
        this.setData({
          inputVal: name,
          inputShowed: true
        })
      this.showStlist(name, false);
    }else{
      this.showStlist('', false);
    }
   
  },

  showStlist(name, sfsx) {
    wx.showLoading({
      title: '正在加载中',
    })
    let that = this;
    console.log(app.globalData.user_org_no);
    wx.request({
      url: app.httpUrl + '/cust/getCustList.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        org_no: app.globalData.user_org_no,
        name: name,
        limit: 99// 99个站点
      },
      success: (re) => {
        console.log(re);

        that.setData({
          info: re.data.info,
          icount: re.data.icount
        })
        
        wx.hideLoading();
        if (sfsx) {
          wx.stopPullDownRefresh();
        }
      }
    });
  },
  goMain(e) {
    wx.navigateTo({ url: '../main_map'});
  },

  goUserMain(e) {
    app.globalData.ce_cust_id = e.currentTarget.dataset.id;
    app.globalData.ce_cust_name = e.currentTarget.dataset.name;
    wx.switchTab({ url: '../main_user' });
  },

  onPullDownRefresh() {
    this.showStlist(this.data.inputVal, true);
  },
});