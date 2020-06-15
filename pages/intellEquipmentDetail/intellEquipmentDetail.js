// pages/equipmentDetail/equipmentDetail.js
import * as echarts from '../../ec-canvas/echarts';
var chartLine = null;
var util = require('../../utils/util.js');

function getOption(xData, data_cur, data_his) {
    var option = {
        backgroundColor: "#fff",
        color: ["#37A2DA", "#f2960d", "#67E0E3", "#9FE6B8"],
        title: {
            text: '实时运行速度',
            textStyle: {
                fontWeight: '500',
                fontSize: 15,
                color: '#000'
            },
            x: 'center',
            y: '0'
        },
        legend: {
            data: ['今日', '昨日'],
            right: 10
        },
        grid: {
            top: '15%',
            left: '1%',
            right: '8%',
            bottom: '15rpx',
            containLabel: true
        },
        tooltip: {
            show: true,
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xData || [],
            axisLabel: {
                interval: 11,
                formatter: function(value, index) {
                    return value.substring(0, 2) * 1;
                },
                textStyle: {
                    fontsize: '10px'
                }
            }
        },
        yAxis: {
            x: 'center',
            name: 'km/h',
            type: 'value',
            min: 0,
            max: 120
        },
        series: [{
            name: '今日',
            zIndex: 2,
            type: 'line',
            smooth: true,
            symbolSize: 0,
            data: data_cur || [],
            markLine: {
                data: [{
                    name: 'Y 轴值为 100 的水平线',
                    yAxis: 10
                }, ]
            }
        }, {
            name: '昨日',
            zIndex: 1,
            type: 'line',
            smooth: true,
            symbolSize: 0,
            data: data_his || [],
            markLine: {
                data: [{
                    name: 'Y 轴值为 100 的水平线',
                    yAxis: 90
                }, ]
            }
        }]
    };
    return option;
}

function initChart(canvas, width, height) {
    // return 2
    //初始化echarts元素，绑定到全局变量，方便更改数据
    chartLine = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(chartLine);

    //可以先不setOption，等数据加载好后赋值，
    //不过那样没setOption前，echats元素是一片空白，体验不好，所有我先set。
    var xData = [1, 2, 3, 4, 5]; // x轴数据 自己写
    var option = getOption(xData);
    chartLine.setOption(option);
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,

        time: new Date(),

        ecLine: {
            onInit: initChart
        }
    },

    /**
     * 
     * @param {*} options 
     */

    onClick(event) {
        console.log(event.detail)
        wx.showToast({
            title: `点击标签 ${event.detail.title}`,
            icon: 'none',
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var time = util.formatTimeWithoutHMS(new Date());
        // 再通过setData更改Page()里面的data，动态更新页面的数据
        this.setData({
            time: time
        });
    },

    /**
     * 改变时间
     */
    addOrReduceDate(event) {
        let flag = event.target.dataset.flag
        const that = this;
        var dateTime = new Date(that.data.time)
        if (flag == 1) {
            dateTime = dateTime.setDate(dateTime.getDate() + 1);
        } else if (flag == 0) {
            dateTime = dateTime.setDate(dateTime.getDate() - 1);
        }
        dateTime = new Date(dateTime);
        var time = util.formatTimeWithoutHMS(dateTime);
        // 再通过setData更改Page()里面的data，动态更新页面的数据
        that.setData({
            time: time
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        //ajax请求好数据后，调用获取option函数，传一些数据，
        //然后用全局变量echarts元素chartLine 来 setOption即可。
        // 三个参数： x轴数据，第一条线数据，第二条数据。 随意，echarts就跟正常用随便写就行
        // 随便写几个假数据
        // /*
        var xData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        var data_cur = [55, 67, 66, 78, 55, 67, 66, 78, 55, 67, 66, 78, 55, 67, 66, 78, 55, 67, 66, 78, 65, 66, 65, 54];
        var data_his = [67, 66, 78, 65, 66, 65, 54, 67, 66, 78, 65, 66, 65, 54, 67, 66, 78, 65, 66, 65, 54, 67, 66, 78];
        // 方法一：
        // var option = getOption(xData, data_cur, data_his);
        // chartLine.setOption(option);
        // 方法二：
        //如果上面初始化时候，已经chartLine已经setOption了，
        //那么建议不要重新setOption，官方推荐写法，重新赋数据即可。
        console.error(this.data.active)
        setTimeout(function() {
                console.error(chartLine)

                chartLine.setOption({
                    xAxis: {
                        data: xData
                    },
                    series: [{
                        data: data_cur
                    }, {
                        data: data_his
                    }]
                });
            }, 10)
            // */
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {


    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },


})