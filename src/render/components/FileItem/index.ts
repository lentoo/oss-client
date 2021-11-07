export function converFileSize(size: number): string {
  if (!size) {
    return "未知";
  }
  const unitArr = new Array(
    "字节",
    "KB",
    "MB",
    "GB",
    "TB",
    "PB",
    "EB",
    "ZB",
    "YB"
  );
  let index = 0;

  index = Math.floor(Math.log(size) / Math.log(1024));
  let displaySize = (size / Math.pow(1024, index)).toFixed(1); //保留的小数位数
  return displaySize + unitArr[index];
}

export function converFileDate(ms: number): string {
  const now = Date.now();
  const dayMs = 1000 * 60 * 60 * 24;
  const date = new Date(ms);

  function padZero(num: number): string {
    return num < 10 ? "0" + num : num + "";
  }

  if (now - ms < dayMs) {
    return `今天 ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
  }
  if (now - ms < 2 * dayMs) {
    return `昨天 ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
  }
  if (now - ms < 3 * dayMs) {
    return `前天 ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
  }
  return `${date.getFullYear()}年${padZero(date.getMonth() + 1)}月${padZero(
    date.getDate()
  )}日 ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
}
