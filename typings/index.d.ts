/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    token: string
    userInfo?: WechatMiniprogram.UserInfo,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}
