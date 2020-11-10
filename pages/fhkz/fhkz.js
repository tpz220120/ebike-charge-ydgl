var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    cust_name:'',
    sel_name: '',
    sel_id: '',
    sel:0,
    mode_name: '',
    count:0,
    info: {},
    modalList:[],
    custList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      cust_name: app.globalData.ce_cust_name
    })
    wx.request({
      url: app.httpUrl + '/cust/initKt.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        id: app.globalData.ce_cust_id
      },

      success: (re) => {
        console.log(re.data);
        // 授权成功并且服务器端登录成功
        this.setData({
          info: re.data.ktinfo,
          custList: re.data.info,
          modalList:re.data.modalList,
          count: re.data.count,
          sel_name: re.data.sel_name,
          sel_id: re.data.sel_id,
        });

        wx.hideLoading();
      },
      fail: () => {
        wx.hideLoading();
      },
    });
  },

  // 根据空调id获取状态
  sel(id){
    wx.request({
      url: app.httpUrl + '/cust/initKtInfo.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        id: id
      },

      success: (re) => {
        console.log(re.data);
        // 授权成功并且服务器端登录成功
        this.setData({
          info: re.data.ktinfo
        });
      },
      fail: () => {
      },
    });
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var sel = e.detail.value;
    this.setData({
      sel_name: this.data.custList[sel].name,
      sel_id: this.data.custList[sel].id,
      sel
    })

    // 切换用户获取状态
    this.sel(this.data.custList[sel].id);
  },

  bindPickerChangeM: function (e) {
    console.log('picker mode发送选择改变，携带值为', e.detail.value);
    var sel = e.detail.value;
    this.setData({
      ['info.modeName']: this.data.modalList[sel].name,
      ['info.mode']: this.data.modalList[sel].id
    })

    // 切换用户获取状态
    this.send("mode");
  },

  changePower(){
    if(this.data.info.power == '1'){
      this.setData({
        ['info.power']:'0'
      })
    }else{
      this.setData({
        ['info.power']: '1'
      })
    }

    this.send("power");
  },

  changeMode(e) {
    var t =  e.currentTarget.dataset.t;
    console.log(t);
    var temp = this.data.info.temp;
    if(t == 'plus'){
      if (temp == 16){
          wx.showModal({
            title: '提示',
            content: '温度不能低于16度！',
            showCancel:false
          })
      }else{
        this.setData({
          ['info.temp']: parseInt(temp) - 1
        })
      }
    }else{
      if (temp == 30) {
        wx.showModal({
          title: '提示',
          content: '温度不能高于30度！',
          showCancel: false
        })
      } else {
        this.setData({
          ['info.temp']: parseInt(temp) + 1
        })
      }
    }

    this.send("temp");
  },

  changeWind(e) {
    var t = e.currentTarget.dataset.t;
    console.log(t);
    var wind = this.data.info.wind;
    if (t == 'plus') {
      if (wind == 0) {
        
      } else {
        this.setData({
          ['info.wind']: parseInt(wind) - 1
        })
      }
    } else {
      if (wind == 3) {
        
      } else {
        this.setData({
          ['info.wind']: parseInt(wind) + 1
        })
      }
    }

    this.send("wind");
  },

  send(key){
    var param = {
      key:key,
      power: this.data.info.power,
      mode: this.data.info.mode,
      temp: this.data.info.temp,
      wind: this.data.info.wind,
      swing: this.data.info.swing
    }
    console.log(param);
    wx.request({
      url: app.httpUrl + '/cust/controlKt.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: param,
      success: (re) => {
        console.log(re.data);
        
      },
      fail: () => {
      },
    });
  }
})