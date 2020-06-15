Page({

    data: {
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

    onLoad: function(options) {
        this.loadData(false);
    },

    /**
     * 查看详情按钮
     * @param {*} event 事件元素
     * 
     */
    bindTurnDetail: function(event) {
        const dataItem = event.currentTarget.dataset.item
        console.log('bindTurnDetail', dataItem)
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
    }
})