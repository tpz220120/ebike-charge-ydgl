var app = getApp();
Page({
  data: {
    username:'',
    pas:'',
  },
  onLoad(option) {
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
            app.globalData.org_no = re.data.org_no;
            app.globalData.user_name = re.data.user_name;
            app.globalData.org_name = re.data.org_name;

            console.log('login');
            if (re.data.org_no == app.globalData.pt_org_no){
                app.globalData.sfpt = '1';
                app.globalData.org_no = '';//如果是平台登录的话
                wx.navigateTo({ url: '../main/main'});
            }else{
              wx.switchTab({
                url: '../main/main_user',
              });
            }
            
            
          } else  {
            wx.showModal({
              content: '用户名和密码不正确',
              showCancel: false
            })
          }
        },
        fail: () => {
        },
    });
	},
});
