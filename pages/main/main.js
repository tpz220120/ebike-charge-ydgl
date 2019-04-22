import * as echarts from '../../ec-canvas/echarts';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',//年月日
    ecLine2: {
      lazyLoad: true // 延迟加载
    },
    ecLine: {
      lazyLoad: true // 延迟加载
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var now = new Date();
    
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var clock = year + "年" + month + "月" + day + "日";

    this.setData({
      date: clock  //获取当前日期
    })
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.echartsComponnet = this.selectComponent('#mychart-dom-bar');
    this.echartsComponnet2 = this.selectComponent('#mychart-dom-bar2');
    this.getData(); //获取数据
  },

  goP(e){
    var type = e.currentTarget.dataset.type;
    console.log(type);
    if(type == 'home'){

    }else if(type == 'user'){
      wx.navigateTo({
        url: 'mainlist/mainlist',
      })
    } else if (type == 'analyse') {
      wx.showModal({
        title: '提示',
        content: '跳转到运营分析页面',
        showCancel:false,
      })
    } else if (type == 'alarm') {
      wx.showModal({
        title: '提示',
        content: '跳转到告警页面',
        showCancel: false,
      })
    }
  },

  //充电收入与充电次数曲线
  getData: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      this.setOption(chart);

      return chart;
    });

    // 电站建设情况饼图
    this.echartsComponnet2.init((canvas, width, height) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      this.setOption(chart);
      return chart;
    });

    wx.hideLoading();
  },

  setOption: function (chart) {
    var areaStyle = {
      normal: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0.5, color: '#66caff' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.1)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      }
    };

    var that = this;
    // 获取x轴y轴的数据
    // wx.request({
    //   url: app.httpUrl + '/yysTab/getCdqs.x',
    //   data: {
    //     orgno: app.globalData.user_org_no,
    //     type: that.data.type
    //   },
    //   success: (re) => {
    //     console.log(re.data);
        // var interval;

        // if (that.data.type == 'month') {
        //   interval = 3;
        // } else if (that.data.type == 'day') {
        //   interval = 4;
        // } else {
        //   interval = 1;
        // }
        var option = {
          color: ["#37A2DA", "#67E0E3"],
          legend: {
            show:false,
            data: ['充电次数'],
            top: 10,
            left: 'center',
            z: 100
          },
          grid: {
            top:'3%',
            left: '3%',
            right: '3%',
            bottom:'2%',
            containLabel: true
          },

          // tooltip: {
          //   show: true,
          //   trigger: 'axis'
          // },

          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              // axisLabel: {
              //   interval: interval
              // },
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
              //data: re.data.cdqsNums//['周一','周二','周三','周四','周五','周六','周日']
            }
          ],
          yAxis: {
            x: 'center',
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
            // show: false
          },
          //y轴数据又空时("",null等)，会出现点击空界面显示空白的情况
          series: [{
            name: '充电次数',
            type: 'line',
            smooth: true,
            data: [18, 36, 65, 30, 78, 40, 33],
            itemStyle: {
              normal: {
                color: '#58dbc5',
              }
            },
            lineStyle: {
              normal: {
                color: '#58dbc5',
              }
            },
            areaStyle: areaStyle,
          }]
        };

        chart.setOption(option);
  //     }
  // //   });
  },
})