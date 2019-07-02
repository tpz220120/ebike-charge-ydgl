var app = getApp();
//地图展示附近100km之内的99个电站，无论地图缩放还是变大，如果中心点不变化不重新加载
Page({
  data: {
    cust_id: '',
    scale: 16,
    longitude: '',
    latitude: '',
    tipshow2:'0',
    markers: [],
    mainHeight: 500,
    sfjz: false,///刚开始数据是否加载完成，防止regionMap重复调用
    regionover: true,///一次regionMap结束后不能重复调用
    regionjd: '',//上一次移动的经度
    regionwd: '',//上一次移动的维度
    ifshow: false,
    info: {}, 
    inputVal:''
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
    this.showMainMap(e.detail.value, false);
  },

  onShow() {
    this.showMainMap(this.data.inputVal);
  },

  showMainMap: function (jdmc) {
    wx.showLoading();
    var that = this;
    var param = {
      longitude: '',
      latitude: '',
     org_no: app.globalData.user_org_no,
     name: jdmc,
     limit: 99,// 99个站点
     dis: 100,
   }

    // var insStDate = new Array();
    // var latitude = '30.280734';
    // var longitude = '120.124553';
    // // 地图中心的market
    // var marketc = new Object();
    // marketc.id = 'center';
    // //如果没有电站列表，显示华星世纪大楼的定位
    // marketc.latitude = latitude;
    // marketc.longitude = longitude;
    // marketc.width = 23;
    // marketc.height = 30;
    // marketc.iconPath = '/image/map-zc.png';
    // insStDate[0] = marketc;
    
    // var latitude2 = '30.280724';
    // var longitude2 = '120.123103';
    // // 地图中心的market
    // var marketc = new Object();
    // marketc.id = 'center2';
    // //如果没有电站列表，显示华星世纪大楼的定位
    // marketc.latitude = latitude2;
    // marketc.longitude = longitude2;
    // marketc.width = 23;
    // marketc.height = 30;
    // marketc.iconPath = '/image/map-yc.png';
    // insStDate[1] = marketc;

    // console.log(insStDate);
    // that.setData({
    //   //includePoints:includeDate,
    //   markers: insStDate,
    //   latitude: latitude,
    //   longitude: longitude
    // });

    // // 使用 wx.createMapContext 获取 map 上下文
    // that.mapCtx = wx.createMapContext('map');

    // that.setData({
    //   mainHeight: app.globalData.apiH,
    //   sfjz: true,
    // })

    //查找此运营商下面100km内所有的电站列表
    wx.request({
      url: app.httpUrl + '/cust/getCustListMap.x',
      data: param,
      success: (re) => {
        var latitude = '';
        var longitude = '';
        var insStDate = new Array();
        console.log(re.data);
        if (re.data != null && re.data.info.length != 0) {
          var st = re.data.info;
          var k = 0;
          for (var i = 0; i < st.length; i++) {
            var stDate = st[i];
            var market = new Object();
            market.id = stDate.id;
            market.latitude = stDate.wd;
            market.longitude = stDate.jd;
            if (latitude == '') {
              latitude = stDate.wd;
              longitude = stDate.jd;
            }
            market.width = 36;
            market.height = 45;
            if (stDate.events > 0) {
               market.iconPath = '/image/map-yc.png';
            } else {
               market.iconPath = '/image/map-zc.png';
            }

            insStDate[i] = market;
          }

          // 地图中心的market-默认第一个站点的经纬度坐标
          var marketc = new Object();
          marketc.id = 'center';
          marketc.latitude = latitude;
          marketc.longitude = longitude;
          marketc.width = 20;
          marketc.height = 33;
          marketc.iconPath = '/image/mark-dw.png';
          insStDate[st.length] = marketc;

        } else {
          //没有站点默认公司站点
          latitude = '30.280724';
          longitude = '120.123103';
          // 地图中心的market
          var marketc = new Object();
          marketc.id = 'center';
          //如果没有电站列表，显示华星世纪大楼的定位
          marketc.latitude = latitude;
          marketc.longitude = longitude;
          marketc.width = 20;
          marketc.height = 33;
          marketc.iconPath = '/image/mark-dw.png';
          insStDate[0] = marketc;
        }

        console.log(insStDate);
        that.setData({
          //includePoints:includeDate,
          markers: insStDate,
          latitude: latitude,
          longitude: longitude
        });

        // 使用 wx.createMapContext 获取 map 上下文
        that.mapCtx = wx.createMapContext('map');
        that.setData({
          mainHeight: app.globalData.apiH,
          sfjz: true,
        })
        wx.hideLoading();
      },
      fail: () => {
        // 根据自己的业务场景来进行错误处理
        wx.hideLoading();
      },
    });
  },
  regionchange(e) {
    // 上一次跟本次移动的经纬度一致的情况下，不重复调用
    console.log(e);
    // 注意：如果缩小或者放大了地图比例尺以后，请在 onRegionChange 函数中重新设置 data 的
    // scale 值，否则会出现拖动地图区域后，重新加载导致地图比例尺又变回缩放前的大小。
    if (e.type === 'end' && this.data.sfjz && this.data.regionover && e.causedBy === 'drag') {
      this.setData({
        regionover: false
      });
      wx.showLoading();
      var that = this;
      // 根据中心点获取坐标

      this.mapCtx.getCenterLocation({
        success: function (res) {
          var insStDate = new Array();
          wx.request({
            url: app.httpUrl + '/cust/getCustListMap.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
            data: {
              longitude: res.longitude,
              latitude: res.latitude,
              org_no: app.globalData.user_org_no,
              name: that.data.inputVal,
              limit: 99,// 99个站点
              dis: 100,// 100km
            },
            success: (re) => {
              if (re.data != null && re.data.info.length != 0) {
                var st = re.data.info;
                for (var i = 0; i < st.length; i++) {
                  var stDate = st[i];
                  var market = new Object();
                  market.id = stDate.id;
                  market.latitude = stDate.wd;
                  market.longitude = stDate.jd;
                  market.width = 36;
                  market.height = 45;
                  if (stDate.events > 0) {
                    market.iconPath = '/image/map-yc.png';
                  } else {
                    market.iconPath = '/image/map-zc.png';
                  }
                  insStDate[i] = market;
                }

                // 地图中心的market-默认第一个站点的经纬度坐标
                var marketc = new Object();
                marketc.id = 'center';
                marketc.latitude = res.latitude;
                marketc.longitude = res.longitude;
                marketc.width = 20;
                marketc.height = 33;
                marketc.iconPath = '/image/mark-dw.png';
                insStDate[st.length] = marketc;
              } else {
                // 地图中心的market
                var marketc = new Object();
                marketc.id = 'center';
                //如果没有电站列表，显示华星世纪大楼的定位
                marketc.latitude = res.latitude;
                marketc.longitude = res.longitude;
                marketc.width = 20;
                marketc.height = 33;
                marketc.iconPath = '/image/mark-dw.png';
                insStDate[0] = marketc;
              }

              console.log(insStDate);
              wx.hideLoading();
              that.setData({
                markers: insStDate,
                longitude: res.longitude,
                latitude: res.latitude,
                regionover: true,
              });
            },
            fail: () => {
              // 根据自己的业务场景来进行错误处理
              wx.hideLoading();
            },
          });
        }
      })
    }
  },

  goList(e) {
    wx.navigateTo({ url: 'mainlist/mainlist'});
  },

  goDetail(e) {
    app.globalData.ce_cust_id = this.data.cust_id;
    app.globalData.ce_cust_name = this.data.info.name;
    wx.switchTab({ url: 'main_user'});
  },
  markertap(e) {
    //根据id查找电站名称以及插座的状况
    var cust_id = e.markerId;
    if (cust_id != 'center') {
      this.setData({
        tipshow2: '1',
      });
      var  that= this;
      wx.request({
        url: app.httpUrl + '/cust/getCustInfo.x',
        data: {
          cust_id: cust_id
        },
        success: (re) => {
          if (re.data != null) {
            that.setData({
              info:re.data.info,
              cust_id: cust_id,
              tipshow: '1'
            });
          }
        },
        fail: () => {
          // 根据自己的业务场景来进行错误处理
        },
      });
    }
  },
  tap(e) {
    this.setData({
      tipshow2: '0'
    });
  },
});
