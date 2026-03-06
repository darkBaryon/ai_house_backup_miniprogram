// logs.ts
import { formatTime } from '../../utils/util'

/** 单条日志展示项 */
interface LogItem {
  date: string
  timeStamp: number
}

Page({
  data: {
    logs: [] as LogItem[],
  },

  onLoad() {
    console.log('[CustomerApp] onLoad triggered')
  },

  onShow() {
    console.log('[CustomerApp] onShow triggered, loading logs from cache')
    const raw: number[] = wx.getStorageSync('logs') || []
    const logs: LogItem[] = raw.map((timeStamp: number) => ({
      date: formatTime(new Date(timeStamp)),
      timeStamp,
    }))
    this.setData({ logs })
    console.log('[CustomerApp] onShow done, logs count:', logs.length)
  },
})
