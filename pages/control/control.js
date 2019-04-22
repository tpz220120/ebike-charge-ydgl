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
    console.log(222);
    //this.showMainMap(e.detail.value, false);
  },

  //测试临时数据
  tempData: function () {
    var list = [
      {
        name: "旭旭宝宝",
        kqbz: "0",
        txt: "早于启用时间启用早于启用时间启用早于启用时间启用。早于启用时间启用早于早于启用时间启用早于早于启用时间启用早于"
      },
      {
        name: "AABB",
        kqbz: "1",
        txt: "微信小程序|联盟（wxapp-union.com）"
      }

    ];

    this.setData({
      items: list
    });

  },
  onLoad: function () {
    var that = this;
    this.tempData();
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
    var that = this;
    //wx.showLoading();
    wx.request({
      url: app.httpUrl + '/yysXcxUserCenter/initGdcl.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        org_no: app.globalData.user_org_no
      },

      success: (re) => {
        that.setData({
          wcount: 2,
          ycount: 2
        });
        // // 授权成功并且服务器端登录成功
        // that.setData({
        //   winfo: re.data.winfo,
        //   wcount: re.data.wcount,
        //   yinfo: re.data.yinfo,
        //   ycount: re.data.ycount
        // });
        // console.log(that.data);
        //wx.hideLoading();    
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

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = app.touch._touchstart(e, this.data.items)
    this.setData({
      items: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = app.touch._touchmove(e, this.data.items);
    this.setData({
      items: data
    })
  },

  //删除事件
  del: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认要删除此条信息么？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.data.items.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            items: that.data.items
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

});
