import * as echarts from '../../ec-canvas/echarts';
var app = getApp();
// pages/main/main_user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    type: 'day',
    jType: 'cons',
    zgfh: '0',//当日最高负荷
    gksy: '0',//当日管理收益
    ydl_day: '0',//当日用电量
    ydrl: '0',
    addr: '',
    dl_j: '0',
    dl_f: '0',
    dl_p: '0',
    dl_g: '0',
    events:-1,
    ec: {
      lazyLoad: true // 延迟加载
    },
    ecLine: {
      lazyLoad: true // 延迟加载
    },
    ecLine2: {
      lazyLoad: true // 延迟加载
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      id: app.globalData.ce_cust_id
    });

    wx.setNavigationBarTitle({
      title: app.globalData.ce_cust_name
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.echartsComponnet = this.selectComponent('#mychart-dom-bar');
    this.echartsComponnetPie = this.selectComponent('#mychart-dom-bar2');
    this.echartsComponnetBar = this.selectComponent('#mychart-dom-bar3');
    this.showBaseData();
    this.getData(); //获取数据
  },

  //基础数据展示
  showBaseData: function () {
    var that = this;
    wx.request({
      url: app.httpUrl + '/main/getMainD.x',
      data: {
        org_no: this.data.id,
        type: that.data.jType
      },
      success: (re) => {
        console.log(re.data);
        that.setData({
          ydrl: re.data.ydrl,//用电容量
          zgfh: re.data.ELOAD_MAX_CURRDAY,//当日最高负荷
          gksy: re.data.PROFIT_ESMGMT_CURRMON,//当日管理收益
          ydl_day: re.data.ECONS_CURRDAY,//当日用电量
          addr: re.data.addr,//地址
          events: re.data.events,//管控是否正常--有无异常外事件产生
        })
      }
    });
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

    // 电量情况展示
    this.echartsComponnetPie.init((canvas, width, height) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height + 30
      });

      this.setPieOption(chart,this.data.type);
      return chart;
    });

    // 管控收益柱状图
    this.echartsComponnetBar.init((canvas, width, height) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      this.setOptionBar(chart);
      return chart;
    });
  },

  // 年月切换时候
  reLine(e) {
    wx.showLoading({
      title: '正在加载中',
    })
    var type = e.currentTarget.dataset.type;
    this.setData({
      type: type,
    })

    this.echartsComponnetPie.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height + 30
      });
      this.setPieOption(chart, type);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      wx.hideLoading();
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
    // 获取x轴y轴的数据
    wx.request({
      url: app.httpUrl + '/main/getSSfhLine.x',
      data: {
        orgno: that.data.id,
        type: that.data.jType
      },
      success: (re) => {
        chart.hideLoading();
        var info = re.data;
        var option = {
          color: ["#5996FF"],
          legend: {
            show: false,
            top: 10,
            left: 'center',
            z: 100
          },
          grid: {
            top: '5%',
            left: '3%',
            right: '3%',
            bottom: '2%',
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
      }
    });
  },

  setPieOption: function (chart,dayType) {
    var that = this;
    wx.request({
      url: app.httpUrl + '/main/getDlPie.x',
      data: {
        orgno: that.data.id,
        type: that.data.jType,
        dayType:dayType
      },
      success: (re) => {
        console.log(re.data);
        if (re.data != null && re.data!= ''){
          that.setData({
            dl_j: re.data.dl_j,
            dl_f: re.data.dl_f,
            dl_p: re.data.dl_p,
            dl_g: re.data.dl_g
          })
        }    
        var option = {
          tooltip: {
            trigger: 'item',
            position: ['20%', '50%'],
            formatter: "{b}: {c}kWh"
          },

          series: [
            {
              type: 'pie',
              center: ['50%', '40%'],
              radius: '70%',
              label: {
                normal: {
                  show: false
                  // position: 'outside',
                  // color: '#646464',
                  // formatter: '{d}%',
                  // fontFamily: 'NotoSansHans-Regular',
                  // fontSize: 12
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              x: '5%',
              data: [
                {
                  name: '尖', value: that.data.dl_j, itemStyle: {
                    normal: { color: '#3090FF' }
                  }
                },
                {
                  name: '峰', value: that.data.dl_f, itemStyle: {
                    normal: { color: '#49F5A9' }
                  }
                },
                {
                  name: '平', value: that.data.dl_p, itemStyle: {
                    normal: { color: '#F6E16A' }
                  }
                },
                {
                  name: '谷', value: that.data.dl_g, itemStyle: {
                    normal: { color: '#F6AF6A' }
                  }
                }
              ]
            }
          ]
        };
        chart.setOption(option);
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
        orgno: that.data.id,
        type: that.data.jType
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
            {
              type: 'bar',
              data: info.barDate,
              barWidth: '60%'
            }]
        };

        chart.setOption(option);
      }
    });
  },
  goHome(e) {
    wx.redirectTo({
      url: 'main',
    });
  },
})