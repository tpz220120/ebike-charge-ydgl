// pages/plan/plan_add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'1',
    sel_id:'',
    sel_name:'请选择对象',
    time:'21:00',
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
})