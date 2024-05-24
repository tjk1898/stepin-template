/**
 * 获取当前时间段：凌晨、上午、中午、下午、晚上
 * @returns {string} 当前时间段
 */
export function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) {
    return '凌晨';
  } else if (hour < 12) {
    return '上午';
  } else if (hour < 14) {
    return '中午';
  } else if (hour < 18) {
    return '下午';
  } else {
    return '晚上';
  }
}

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化时间为 HH:mm:ss
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * 获取当前星期几
 * @returns {string} 当前星期几
 */
export function getDayOfWeek(): string {
  const days = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return days[new Date().getDay()];
}

/**
 * 检查当前时间是否是工作时间（周一到周五 9:00 到 18:00）
 * @returns {boolean} 是否是工作时间
 */
export function isWorkingTime(): boolean {
  const date = new Date();
  const day = date.getDay();
  const hour = date.getHours();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}
