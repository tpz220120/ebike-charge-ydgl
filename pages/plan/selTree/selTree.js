var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      treeData:[
        // { name: '客户1',id:'123',type:'cons',level:'1'},
        // {
        //   name: '客户2', id: '1234', type: 'cons', level: '1',childList:[
        //     { name: '区域1', id: '12344', type: 'buro', level: '2', childList: [
        //       { name: '区域容器1', id: '22345', type: 'space', level: '3', childList: [
        //         { name: '容器设备1', id: '32346', type: 'dev', level: '4', childList: [
        //           { name: '设备用能点22', id: '1232323', type: 'point', level: '5'},
        //         ]},
        //         { name: '容器用能点2', id: '32347', type: 'point', level: '4' }
        //       ]},
        //       { name: '区域设备1', id: '22346', type: 'dev', level: '3',},
        //       { name: '区域用能点1', id: '22347', type: 'point', level: '3' }
        //     ]},
        //     { name: '客户容器1', id: '12345', type: 'space', level: '2'},
        //     { name: '客户设备1', id: '12346', type: 'dev', level: '2'},
        //     { name: '客户用能点1', id: '12347', type: 'point', level: '2'}
        // ]},
        // { name: '客户3', id: '1235', type: 'cons', level: '1'},
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //获取树结构

    var that = this;
    wx.showLoading();
    wx.request({
      url: app.httpUrl + '/plan/findTree.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        id: app.globalData.ce_cust_id,
        name: app.globalData.ce_cust_name
      },

      success: (re) => {
        console.log(re.data.treeData);
        that.setData({
          treeData: re.data.treeData
        });
        wx.hideLoading();    
      },
      fail: () => {
        wx.hideLoading();
      },
    });

  },

  tapItem(e){
    console.log(e);
    if (e.detail.type != 'point'){
      wx.showModal({
        title: '提示',
        content: '请选择用能点节点对象',
        showCancel:false
      })
    }else{
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2];
      //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
      prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        sel_id: e.detail.itemid,
        sel_name: e.detail.name,
        ce_cust_id: e.detail.ce_cust_id,
        ce_res_id: e.detail.ce_res_id,
        ce_res_class: e.detail.ce_res_class
      })

      //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
      //最后就是返回上一个页面。
      wx.navigateBack({
        delta: 1  // 返回上一级页面。
      });
    }
  }
})