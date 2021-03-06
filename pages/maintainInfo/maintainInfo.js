var util = require('../../utils/util.js');
var api = require('../../net/api.js');
var http = require('../../net/http.js');
const app = getApp()
Page({

    data: {
        pageNo: 1,
        pageSize: 10,
        maxCount: null,
        /**
         * 获取到的列表数据
         */
        listData: [],
        options: {},
        /**
         * 控制上拉到底部时是否出现 "数据加载中..."
         */
        hidden: true,
        /**
         * 数据是否正在加载中，避免数据多次加载
         */
        loadingData: false
    },

    onLoad: function(options) {
        this.loadData(false, options);
        this.setData({
            options: options
        })
    },

    /**
     * 查看详情按钮
     * @param {*} event 事件元素
     * 
     */
    bindTurnDetail: function(event) {
        const dataItem = event.currentTarget.dataset.item
        var url = '../maintainDetail/maintainDetail'
        wx.navigateTo({
            url: url + '?maintainId=' + dataItem.maintainId
        })
    },

    /**
     * 加载数据
     */
    loadData: function(tail, options, callback) {
        var that = this;
        var url = api.maintainInfoForTraditionDeviceByBuildingId
        let proprietorId = options.buildingId ? options.buildingId : that.data.options.buildingId,
            pageNo = that.data.pageNo,
            pageSize = that.data.pageSize;
        http.get(url, {
            proprietorId,
            // pageNo,
            // pageSize
        }, res => {
            console.log('maintainInfoForTraditionDeviceByBuildingId', res)
                // res.b.map(i => {
                //     i.status_label = util.parseDictionary(app, 'maintain_status', i.status)
                // })
            var oldListData = that.data.listData,
                newListData = tail ? oldListData.concat(res.b) : res.b;
            that.setData({
                listData: newListData,
                pageNo: ++pageNo,
                maxCount: res.b ? res.b.count : 0
            });
            if (callback) {
                callback();
            }
        })
    },

    /**
     * 监听用户下拉动作
     */
    onPullDownRefresh: function() {
        console.info('onPullDownRefresh');
        var loadingData = this.data.loadingData,
            that = this;
        if (loadingData) {
            return;
        }
        // 显示导航条加载动画
        wx.showNavigationBarLoading();
        // 显示 loading 提示框,在 ios 系统下，会导致顶部的加载的三个点看不见
        // wx.showLoading({
        //   title: '数据加载中...',
        // });
        that.setData({
            pageNo: 1
        })
        setTimeout(function() {
            that.loadData(false, {}, () => {
                that.setData({
                    loadingData: false
                });
                wx.stopPullDownRefresh();
                // wx.hideLoading();
                wx.hideNavigationBarLoading();
                console.info('下拉数据加载完成.');
            });
        }, 1000);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        return
        console.info('onReachBottom');
        var hidden = this.data.hidden,
            loadingData = this.data.loadingData,
            that = this;
        // if (that.data.listData.length >= that.data.maxCount) {
        //     this.setData({
        //         hidden: true,
        //         loadingData: false
        //     });
        //     return
        // }
        if (hidden) {
            this.setData({
                hidden: false
            });
            console.info(this.data.hidden);
        }
        if (loadingData) {
            return;
        }
        this.setData({
            loadingData: true
        });
        // 加载数据,模拟耗时操作

        wx.showLoading({
            title: '数据加载中...',
        });

        that.loadData(true, {}, () => {
            that.setData({
                hidden: true,
                loadingData: false
            });
            wx.hideLoading();
        });
        console.info('上拉数据加载完成.');
    }
})