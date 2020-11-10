var app = getApp();
Page({
  data: {
    username:'',
    pas:'',
  },
  onLoad(option) {
    this.setData({
      username: wx.getStorageSync('iesms_user_no'),
      pas: wx.getStorageSync('iesms_user_pas')
    })
  },

  bindKeyInputPhone(e){
    this.setData({
      username: e.detail.value,
    });
  },

  bindKeyInputYzm(e){
      this.setData({
        pas: e.detail.value,
      });
  },
	
  bindPhone_submit:function(){
		var param={
      username: this.data.username,
      pas:this.data.pas
		}
    wx.showLoading({
      title: '登录中',
    })
    wx.request({
      url: app.httpUrl + '/user/login.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: param,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method:'GET',
        success: (re) => {
          console.log(re);
          var that = this;
          if(re.data.status == '-1'){
            wx.showModal({
              content: '用户不存在',
              showCancel: false
            })
          } else if (re.data.status == '-2'){
            wx.showModal({
              content:'密码不正确',
              showCancel: false
            })
          } else if (re.data.status == '0'){
            app.globalData.hasLogin=true;
            app.globalData.user_no = re.data.user_no;
            app.globalData.user_org_no = re.data.org_no;
            app.globalData.user_name = re.data.user_name;
            app.globalData.user_org_name = re.data.org_name;

            // 存储到内存中
            wx.setStorageSync('iesms_user_no', re.data.user_no);
            wx.setStorageSync('iesms_user_pas', this.data.pas);

            console.log('login');
            //如果是运营商级别的登录的话，直接跳转到运营商首页，否则到用户首页
            // if (re.data.org_no == app.globalData.pt_org_no){
            app.globalData.sfpt = '1';
            wx.switchTab({
              url: '../main/main_user',
            });
            // }else{
            //   app.globalData.sfpt = '1';
            //   app.globalData.org_no = '';//如果是平台登录的话
            //   wx.switchTab({
            //     url: '../main/main_user',
            //   });
            // }   
          } else  {
            wx.showModal({
              content: '用户名和密码不正确',
              showCancel: false
            })
          }

          wx.hideLoading();
        },
        fail: () => {
          wx.hideLoading();
        },
    });
	},
});
