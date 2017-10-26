module.exports = {
    OK: 200,
    FAIL_PARAM: 400,//参数出错
    FAIL: 500,

    ENTRY: {
        FA_TOKEN_INVALID: 1001,//TOKEN为空
        FA_TOKEN_EXPIRE: 1002,//TOKEN失效
        FA_USER_NOT_EXIST: 1003,//用户不存在
        FA_TOKEN_ILLEGAL: 1004,//token不合法
        FA_USER_ILLEGAL: 1005//不是当前用户
    },

    GATE: {
        FA_NO_SERVER_AVAILABLE: 2001,//没有空闲的服务
        FA_NO_USERID: 2002//uid为空
    },

    CHAT: {
        FA_CHANNEL_CREATE: 3001,//创建channel失败
        FA_CHANNEL_NOT_EXIST: 3002,//channel不存在
        FA_UNKNOWN_CONNECTOR: 3003,//未知的连接
        FA_USER_NOT_ONLINE: 3004//用户不在线
    },

    AREA: {
        FA_NOT_NORMAL_PASS: 4001, //普通关卡没有全部通过
        FA_NOT_CD_TIME: 4002, //没有到冷却时间
        FA_NOT_stars: 4003, //没有到冷却时间
        FA_NOT_strength: 4004 //没有到冷却时间
    },

    CONNECTOR: {
        FA_LONG_NICKNAME: 5001,//用户名太长
        FA_ILLEGAL_NICKNAME: 5002,//词汇太敏感了哟
        FA_REPEAT_NICKNAME:5003//昵称已占用
    }

};