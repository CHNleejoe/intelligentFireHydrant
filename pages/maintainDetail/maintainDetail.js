// pages/tradEquipmentDetail/tradEquipmentDetail.js
var util = require('../../utils/util.js');
var api = require('../../net/api.js');
var http = require('../../net/http.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailInfo: {},
        options: {},
        /**
         * 数据是否正在加载中，避免数据多次加载
         */
        loadingData: false

    },
    /**
     * 
     * @param {event} options 
     */
    previewImages: function(event) {
        const that = this;

        let detailItem = event.currentTarget.dataset.detailitem,
            current = String(event.currentTarget.dataset.current)

        console.log(event)
        wx.previewImage({
            urls: detailItem.maintainPhotosList,
            current
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.loadData(options)
        this.setData({
            options: options
        })
    },

    /**
     * 加载数据
     */
    loadData: function(options, callback) {
        var that = this;
        var url = api.maintainDetailInfoForTraditionDevice
        let maintainId = options.maintainId ? options.maintainId : that.data.options.maintainId

        http.get(url, {
            maintainId,
        }, res => {
            console.log('maintainDetailInfoForTraditionDevice', res)
            res.b.maintainDeviceList.map(i => {
                i.maintainPhotos == '' && (i.maintainPhotosList = []);
                (!i.maintainPhotos) && (i.maintainPhotosList = []);
                i.maintainPhotos && i.maintainPhotos != '' && (i.maintainPhotosList = i.maintainPhotos.split(','))
            })
            that.setData({
                detailInfo: res.b
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
        setTimeout(function() {
            that.loadData(false, () => {
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
})