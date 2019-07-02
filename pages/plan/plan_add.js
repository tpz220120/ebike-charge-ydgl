var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    status:'1',
    sel_id:'',
    sel_name:'请选择对象',
    ce_cust_id: '',
    ce_res_id: '',
    ce_res_class: '',
    time:'21:00',
    id:'',
    weeks:[
      { name:'星期一',value:'1',checked:true},
      { name: '星期二', value: '2', checked: true },
      { name: '星期三', value: '3', checked: true },
      { name: '星期四', value: '4', checked: true },
      { name: '星期五', value: '5', checked: true },
      { name: '星期六', value: '6', checked: false },
      { name: '星期日', value: '7', checked: false },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    //如果是编辑情况下则加载编辑内容
    if (options.id){
      this.setData({
        id: options.id
      })
      wx.showLoading();
      var that = this;
      wx.request({
        url: app.httpUrl + '/plan/getPlanById.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          id: options.id
        },
        success: (re) => {
          console.log(re.data);
          var res = re.data.info;
          // // 授权成功并且服务器端登录成功
          that.setData({
            status: res.onoff_action,
            sel_id: res.ce_point_id,
            sel_name: res.p_name,
            time: res.onoff_time,
          });
          // 时间处理
          that.setWeek(res);
          console.log(that.data)
          wx.hideLoading();
        },
        fail: () => {
          wx.hideLoading();
        },
      });
    }
  },

  setWeek:function(res){
    var week = [];
    
    var week = res.week1;
    var checked = 'weeks[0].checked';
    if (week == '1') {
      this.setData({
        [checked]: true
      })
    }else{
      this.setData({
        [checked]: false
      })
    }

    week = res.week2;
    checked = 'weeks[1].checked';
    if (week == '1') {
      this.setData({
        [checked]: true
      })
    } else {
      this.setData({
        [checked]: false
      })
    }

    week = res.week3;
    checked = 'weeks[2].checked';
    if (week == '1') {
      this.setData({
        [checked]: true
      })
    } else {
      this.setData({
        [checked]: false
      })
    }

    week = res.week4;
    checked = 'weeks[3].checked';
    if (week == '1') {
      this.setData({
        [checked]: true
      })
    } else {
      this.setData({
        [checked]: false
      })
    }

    week = res.week5;
    checked = 'weeks[4].checked';
    if (week == '1') {
      this.setData({
        [checked]: true
      })
    } else {
      this.setData({
        [checked]: false
      })
    }

    week = res.week6;
    checked = 'weeks[5].checked';
    if (week == '1') {
      this.setData({
        [checked]: true
      })
    } else {
      this.setData({
        [checked]: false
      })
    }

    week = res.week7;
    checked = 'weeks[6].checked';
    if (week == '1') {
      this.setData({
        [checked]: true
      })
    } else {
      this.setData({
        [checked]: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  changeStatus(e) {
   this.setData({
     status:e.currentTarget.dataset.flag
   })
  },
   week_sel(e) {
     var index = e.currentTarget.dataset.index;
     var checked = 'weeks[' + index + '].checked';
     console.log(e.currentTarget.dataset.checked);
      this.setData({
        [checked]: !e.currentTarget.dataset.checked
      })
  },

  goSel(e) {
      wx.navigateTo({
        url: 'selTree/selTree',
      })
  },
  
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  savePlan: function (e){
    if(this.data.sel_id == ''){
      wx.showModal({
        title: '提示',
        content: '请选择对象！',
        showCancel:false
      })

    }else{
        //日期处理
        var weekParm='';
        for(var i=0;i<this.data.weeks.length;i++){
          var w = this.data.weeks[i];
          if(w.checked){
            weekParm +="1";
          }else{
            weekParm +="0";
          }
        }
      console.log(weekParm);
      // 没选择重复日期情况下
      if (weekParm == '0000000'){
        wx.showModal({
          title: '提示',
          content: '请至少选择一周的一天！',
          showCancel: false
        })
      }else{
        var param = {org_no: app.globalData.org_no,
          ce_point_id: this.data.sel_id,
          name: this.data.sel_name,
          ce_cust_id: this.data.ce_cust_id,
          ce_res_id: this.data.ce_res_id,
          ce_res_class: this.data.ce_res_class,
          time: this.data.time,
          status: this.data.status,
          week: weekParm,
          id: this.data.id
        }

        console.log(param);
        wx.request({
          url: app.httpUrl + '/plan/addPlan.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
          data: param,
          success: (re) => {
            console.log(re.data);
            if(re.data.status == 'success'){
              wx.showModal({
                title: '提示',
                content: '保存成功！',
                showCancel: false,
                success:(re)=>{
                    wx.navigateBack({
                      delta: 1  // 返回上一级页面。
                    })
                }
              })
            }else{
              wx.showModal({
                title: '提示',
                content: '保存失败，请联系管理员！',
                showCancel: false
              })
            }
          },
          fail: () => {
            wx.showModal({
              title: '提示',
              content: '保存失败，请联系管理员！',
              showCancel: false
            })
          },
        });
      }
    }
  }
})