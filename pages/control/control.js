var app = getApp();
var sliderWidth = 65; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["未执行", "执行"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    winfo: [],
    wcount: 0,
    yinfo: [],
    ycount: 0,
    wid: 0,
    delBtnWidth: 180,//删除按钮宽度单位（rpx）
    items: [],
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
    this.getControlList(e.detail.value);
  },

  onLoad: function () {
    var that = this;
    //this.tempData();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth * 0.8 / that.data.tabs.length - sliderWidth),
          sliderOffset: res.windowWidth * 0.8 / that.data.tabs.length * that.data.activeIndex,
          wid: res.windowWidth
        });
      }
    });
  },
  onShow() {
    this.getControlList("");
  },

  getControlList:function(name){
    var that = this;
    wx.showLoading();
    wx.request({
      url: app.httpUrl + '/control/getControlList.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        cust_id: app.globalData.ce_cust_id,
        name:name
      },

      success: (re) => {
        // 授权成功并且服务器端登录成功
        that.setData({
          winfo: re.data.winfo,
          wcount: re.data.wcount,
          yinfo: re.data.yinfo,
          ycount: re.data.ycount
        });
        console.log(that.data);
        wx.hideLoading();
      },
      fail: () => {
        wx.hideLoading();
      },
    });
  },

  tabClick: function (e) {
    console.log(e.currentTarget.offsetLeft);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft - this.data.wid * 0.2,
      activeIndex: e.currentTarget.id
    });
  },

  //删除事件
  doAction: function (e) {
    var type = e.currentTarget.dataset.type;
    var content="";
    var sfall;
    if(type == '1'){
      content = '确认要全部断开吗？';
      sfall = true;
    }else{
      content = '确认要断开此对象吗？';
      sfall = false;
    }
    wx.showModal({
      title: '提示',
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.httpUrl + '/control/controlKg.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
            data: {
              id: e.currentTarget.dataset.id,
              sfall: sfall
            },
            success: (re) => {
              wx.showModal({
                title: '提示',
                content: '断开成功',
                showCancel:false
              });
            },
            fail: () => {
              //wx.hideLoading();
            },
          });
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

});
