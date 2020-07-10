const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeWithoutHMS = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-')
}
const formatTimeWithoutYMD = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 加载数据字典
 * @param {num} type 加载对应的数据字典并存储在全局对象之中
 * @param {object} obj 存储对象
 * @param {function} callback 存储对象
 */
const loadDictionary = function(type, obj, callback = null, that = null) {
    if (obj.globalData.dictionarys[type]) {
        if (callback) callback()
        return
    }
    var url = obj.globalData.requestLocation + '/dictionary/info/by/type'
    wx.showNavigationBarLoading();
    var data = { type: type }

    wx.request({
        url: url,
        data,
        header: {
            "content-type": "application/json;charset=UTF-8"
        },
        method: 'GET',
        success: function(res) {
            if (res.statusCode == 200 && res.data.h && res.data.h.code == 200) {
                obj.globalData.dictionarys[type] = res.data.b
                if (callback) {
                    callback()
                }
            } else {
                var errMsg;
                res.data.h ? errMsg = res.data.h.msg : res.errMsg
                wx.showToast({
                    title: errMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        },
        fail: function() {},
        complete: function(res) {
            wx.hideNavigationBarLoading();
        }
    })
}

/**
 * 
 * @param {object} app app对象
 * @param {string} t 用户类型
 * @param {string} s 解析数据的源字符串
 * return 对应的用户类型中文
 */
const parseDictionary = function(app, t, s) {
    if (!app.globalData.dictionarys[t]) return ''
    for (let i of app.globalData.dictionarys[t]) {
        if (i.value == s) {
            return i.name
        }
    }
}

/**
 * 
 * @param {string/number} t 用户类型
 * return 对应的用户类型中文
 */
const parseUserType = function(t) {
    switch (t) {
        case 1:
        case '1':
            return '政府单位'
        case 2:
        case '2':
            return '业主单位'
        case 3:
        case '3':
            return '物业单位'
        case 4:
        case '4':
            return '维修单位'
        default:
            return ''
    }
}

/**
 * 
 * @param {string/number} s 用户的审核状态
 * return 对应的审核状态中文
 */
const parseCertificationStatus = function(s) {
    switch (s) {
        case 1:
        case '1':
            return '未认证'
        case 2:
        case '2':
            return '认证中'
        case 3:
        case '3':
            return '完成认证'
        default:
            return ''
    }
}

/**
 * 
 * @param {string} mobile 手机号
 * return 返回true是正确手机号
 *        返回false是错误手机号
 */

const checkMobile = function(mobile) {
    if (!(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(mobile))) {
        console.log(mobile)
        return false;  
    }
    return true
}


const convert2TecentMap = function(lng, lat) {
    if (lng == '' && lat == '') {
        return {
            lng: '',
            lat: ''
        }
    }
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0
    var x = lng - 0.0065
    var y = lat - 0.006
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
    var qqlng = z * Math.cos(theta)
    var qqlat = z * Math.sin(theta)
    return {
        lng: qqlng,
        lat: qqlat
    }
}


module.exports = {
    formatTime: formatTime,
    formatTimeWithoutHMS: formatTimeWithoutHMS,
    parseUserType: parseUserType,
    parseCertificationStatus: parseCertificationStatus,
    loadDictionary: loadDictionary,
    parseDictionary: parseDictionary,
    checkMobile: checkMobile,
    formatTimeWithoutYMD: formatTimeWithoutYMD,
    convert2TecentMap: convert2TecentMap
}