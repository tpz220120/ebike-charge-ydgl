var app = getApp();
var sliderWidth = 65; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["开启", "关闭"],
    delBtnWidth: 180,//删除按钮宽度单位（rpx）
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    winfo: [],
    wcount: 0,
    yinfo: [],
    ycount: 0,
    wid: 0
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
    this.getPlan(e.detail.value);
  },

  onLoad: function () {
    var that = this;
    this.initEleWidth();
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
    this.getPlan("");
  },

  getPlan:function (name){
    var that = this;
    wx.showLoading();
    wx.request({
      url: app.httpUrl + '/plan/getPlanList.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        org_no: app.globalData.org_no,
        name:name
      },

      success: (re) => {
        console.log(re);
        // // 授权成功并且服务器端登录成功
        that.setData({
          winfo: re.data.winfo,
          wcount: re.data.wcount,
          yinfo: re.data.yinfo,
          ycount: re.data.ycount
        });
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

  addControl(){
    wx.navigateTo({
      url: 'plan_add',
    })
  },


  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var type = e.currentTarget.dataset.type;
      var list;

      if(type == 'kq'){
        list = this.data.winfo;
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          winfo: list
        });
      }else{
        list = this.data.yinfo;
        list[index].txtStyle = txtStyle;
        this.setData({
          yinfo: list
        });
      }
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var type = e.currentTarget.dataset.type;
      var list;

      if (type == 'kq') {
        list = this.data.winfo;
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          winfo: list
        });
      } else {
        list = this.data.yinfo;
        list[index].txtStyle = txtStyle;
        this.setData({
          yinfo: list
        });
      }
     
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件
  delItem: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除计划吗？',
      success(res) {
        if (res.confirm) {
          //获取列表中要删除项的下标
          var index = e.currentTarget.dataset.index;
          var type = e.currentTarget.dataset.type;
          var id = e.currentTarget.dataset.id;
          wx.request({
            url: app.httpUrl + '/plan/delPlan.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
            data: {
              id: id
            },
            success: (re) => {
              console.log(re);
              if (re.data.status == 'success') {
                if (type == 'kq') {
                  var list = that.data.winfo;
                  //移除列表中下标为index的项
                  list.splice(index, 1);
                  //更新列表的状态
                  that.setData({
                    winfo: list,
                    wcount: that.data.wcount - 1
                  });
                } else {
                  var list = that.data.yinfo;
                  //移除列表中下标为index的项
                  list.splice(index, 1);
                  //更新列表的状态
                  that.setData({
                    yinfo: list,
                    ycount: that.data.ycount - 1
                  });
                }
              } else {
                wx.showModal({
                  title: '提示',
                  content: '数据删除失败',
                  showCancel: false
                })
              }
            },
            fail: () => {
              wx.showModal({
                title: '提示',
                content: '删除失败',
                showCancel: false
              })
            },
          });
        } else if (res.cancel) {
          
        }
      }
    })
  },
  //测试临时数据
  showDetail: function (e) {
    wx.navigateTo({
      url: 'plan_add?id=' + e.currentTarget.dataset.id,
    })
  }
});
