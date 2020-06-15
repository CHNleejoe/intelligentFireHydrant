// pages/tradEquipmentDetail/tradEquipmentDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgs: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589189896791&di=f53aa084cbd55eb8e3816b92343f1084&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589189896791&di=bf0cdd8137d2094354f8615bcd4e3821&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F36%2F48%2F19300001357258133412489354717.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589189896788&di=7ab801368381109971090cca327e6c0a&imgtype=0&src=http%3A%2F%2Fi1.sinaimg.cn%2FIT%2F2010%2F0419%2F201041993511.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589189896788&di=e988899afe8b60f2b1e07b41d9ecb8a5&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F9vo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F3b292df5e0fe99257d8c844b34a85edf8db1712d.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589189896790&di=33ebf4041df00bb3b59158ca576fa003&imgtype=0&src=http%3A%2F%2Fb2-q.mafengwo.net%2Fs5%2FM00%2F91%2F06%2FwKgB3FH_RVuATULaAAH7UzpKp6043.jpeg'
        ],
        /**
         * 需要访问的url
         */
        urls: [
            'https://www.csdn.net/api/articles?type=more&category=home&shown_offset=0',
            'https://www.csdn.net/api/articles?type=new&category=arch',
            'https://www.csdn.net/api/articles?type=new&category=ai',
            'https://www.csdn.net/api/articles?type=new&category=newarticles'
        ],
        /**
         * 当前访问的url索引
         */
        currentUrlIndex: 0,
        /**
         * 获取到的文章
         */
        articles: [],
        /**
         * 控制上拉到底部时是否出现 "数据加载中..."
         */
        hidden: true,
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

        let detailItem = event.currentTarget.dataset.detailItem,
            current = String(event.currentTarget.dataset.current)
        console.log(event)
        wx.previewImage({
            urls: that.data.imgs,
            current
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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
     * 加载数据
     */
    loadData: function(tail, callback) {
        var that = this,
            urlIndex = that.data.currentUrlIndex;
        wx.request({
            url: that.data.urls[urlIndex],
            success: function(r) {
                var oldArticles = that.data.articles,
                    newArticles = tail ? oldArticles.concat(r.data.articles) : r.data.articles;
                that.setData({
                    articles: newArticles,
                    currentUrlIndex: (urlIndex + 1) >= that.data.urls.length ? 0 : urlIndex + 1
                });
                if (callback) {
                    callback();
                }
            },
            error: function(r) {
                console.info('error', r);
            },
            complete: function() {}
        });
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

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        console.info('onReachBottom');
        var hidden = this.data.hidden,
            loadingData = this.data.loadingData,
            that = this;
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

        setTimeout(function() {
            that.loadData(true, () => {
                that.setData({
                    hidden: true,
                    loadingData: false
                });
                wx.hideLoading();
            });
            console.info('上拉数据加载完成.');
        }, 1000);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})