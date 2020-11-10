import * as echarts from '../../ec-canvas/echarts';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'buro',//运营商节点
    date: '',//年月日
    yhs: '0',//当日用户数
    zgfh: '0',//当日最高负荷
    gksy: '0',//当日管理收益
    ydl_day: '0',//当日用电量
    ydl_month: '0',//当月用电量
    ydl_year: '0',//当年用电量
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
    console.log(2222);
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
    console.log(1313);
    this.echartsComponnet = this.selectComponent('#mychart-dom-bar');
    this.echartsComponnet2 = this.selectComponent('#mychart-dom-bar2');
    this.showBaseData();//展示基础数据
    this.getData(); //展示曲线数据
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
        content: '此功能待发布，敬请期待！',
        showCancel:false,
      })
    } else if (type == 'alarm') {
      wx.showModal({
        title: '提示',
        content: '此功能待发布，敬请期待！',
        showCancel: false,
      })
    }
  },
  //基础数据展示
  showBaseData: function () {
    var that = this;
    wx.request({
      url: app.httpUrl + '/main/getMainD.x',
      data: {
        org_no: app.globalData.user_org_no,
        type: that.data.type
      },
      success: (re) => {
          that.setData({
            yhs: re.data.yhzs,//当日用户数
            zgfh: re.data.ELOAD_MAX_CURRDAY,//当日最高负荷
            gksy: re.data.PROFIT_ESMGMT_CURRMON,//当日管理收益
            ydl_day: re.data.ECONS_CURRDAY,//当日用电量
            ydl_month: re.data.ECONS_CURRMON,//当月用电量
            ydl_year: re.data.ECONS_CURRYER,//当年用电量
          })
      }
    });
  },

  //实时负荷和管控收益趋势
  getData: function () {
    //实时负荷曲线图
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      this.setOption(chart);

      return chart;
    });

    // 管控收益柱状图
    this.echartsComponnet2.init((canvas, width, height) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      this.setOptionBar(chart);
      return chart;
    });
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
            offset: 0.5, color: '#5996FF' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.1)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      }
    };

    var that = this;
    chart.showLoading(
      {
        text: '正在加载中',
        color: '#5996FF',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
      }
    );
    //获取x轴y轴的数据
    wx.request({
      url: app.httpUrl + '/main/getSSfhLine.x',
      data: {
        orgno: app.globalData.user_org_no,
        type: that.data.type
      },
      success: (re) => {
        console.log(re.data);
        chart.hideLoading(); 
        var info = re.data;    
        this.setData({
          zgfh:info.zgfh
        })
        var option = {
          color: ["#5996FF"],
          legend: {
            show:false,
            top: 10,
            left: 'center',
            z: 100
          },
          grid: {
            top:'5%',
            left: '3%',
            right: '3%',
            bottom:'2%',
            containLabel: true
          },

          tooltip: {
            trigger: 'axis',
            position: function (p) {
              // 位置回调
              // console.log && console.log(p);
              return [p[0] - 50, p[1] - 10];
            },
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },

          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              // axisLabel: {
              //   interval: interval
              // },
              data: info.ssfhNums,
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
          //y轴数据有空时("",null等)，会出现点击空界面显示空白的情况
          series: [{
            type: 'line',
            smooth: true,
            data: info.lineDate,
            itemStyle: {
              normal: {
                color: '#5996FF',
              }
            },
            lineStyle: {
              normal: {
                color: '#5996FF',
              }
            },
            areaStyle: areaStyle,
          }]
        };

        chart.setOption(option);
      },
      fail: (re) => {
        chart.hideLoading(); 
      }
    });
  },
  setOptionBar: function (chart) {
    var that = this;
    //获取x轴y轴的数据
    chart.showLoading(
      {
        text: '正在加载中',
        color: '#5996FF',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
      }
    );
    wx.request({
      url: app.httpUrl + '/main/getGksyBar.x',
      data: {
        orgno: '1200000001',//app.globalData.user_org_no,
        type: that.data.type
      },
      success: (re) => {
        console.log(re.data);
        chart.hideLoading();
        var info = re.data;
        var option = {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            position: function (p) {
              // 位置回调
              // console.log && console.log(p);
              return [p[0] - 30, p[1] - 10];
            },
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: '5%',
            left: '3%',
            right: '3%',
            bottom: '5%',
            containLabel: true
          },

          xAxis: [
            {
              type: 'category',
              data: info.gksyNums,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          //y轴数据又空时("",null等)，会出现点击空界面显示空白的情况
          series: [
            {type: 'bar',
            data: info.barDate,
            barWidth: '60%'
          }]
        };

        chart.setOption(option);
      }
    });
  },
})