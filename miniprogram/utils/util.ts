/** 数字补零，用于时间格式化（padStart 保证两位） */
export const formatNumber = (n: number): string => {
  return n.toString().padStart(2, '0')
}

/** 将 Date 格式化为 yyyy/mm/dd hh:mm:ss */
export const formatTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}
