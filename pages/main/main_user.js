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
    ec: {
      lazyLoad: true // 延迟加载
    },
    ecLine: {
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
    this.getData(); //获取数据
  },

  //充电收入与充电次数曲线
  getData: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height + 30
      });

      this.setOption(chart);

      return chart;
    });

    // 电站建设情况饼图
    this.echartsComponnetPie.init((canvas, width, height) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height + 30
      });

      this.setPieOption(chart);
      return chart;
    });

    wx.hideLoading();
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

    this.echartsComponnet.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height + 30
      });
      this.setOption(chart);
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
    wx.request({
      url: app.httpUrl + '/yysTab/getCdqs.x',
      data: {
        orgno: app.globalData.user_org_no,
        type: that.data.type
      },
      success: (re) => {
        console.log(re.data);
        var interval;

        if (that.data.type == 'month') {
          interval = 3;
        } else if (that.data.type == 'day'){
          interval = 4;
        } else {
          interval = 1;
        }
        var option = {
          //color: ["#37A2DA", "#67E0E3"],
          legend: {
            data: ['充电次数'],
            top: 10,
            left: 'center',
            z: 100
          },
          grid: {
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
              axisLabel: {
                interval: interval
              },
              data: re.data.cdqsNums//['周一','周二','周三','周四','周五','周六','周日']
            }
          ],
          yAxis: {
            x: 'center',
            type: 'value',
            splitNumber: 3,
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
            data: [],
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

      }
    });
  },

  setPieOption: function (chart) {
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: "{b}: {c}个插座"
      },
      legend: {
        orient: 'vertical',
        left: '50%',
        top: '5%',
        itemGap: 18,
        data: ['使用中', '未使用', '正在检修', '不可用/离线'],
        textStyle: {
          color: '#646464',
          fontSize: 12
        }
      },
      series: [
        {
          type: 'pie',
          center: ['22%', '40%'],
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
              name: '使用中', value: 1, itemStyle: {
                normal: { color: '#65C0FD' }
              }
            },
            {
              name: '未使用', value: 1, itemStyle: {
                normal: { color: '#76ECC0' }
              }
            },
            {
              name: '正在检修', value: 3, itemStyle: {
                normal: { color: '#FFDA61' }
              }
            },
            {
              name: '不可用/离线', value: 5, itemStyle: {
                normal: { color: '#FF8166' }
              }
            }
          ]
        }
      ]
    };
    chart.setOption(option);
  },
})