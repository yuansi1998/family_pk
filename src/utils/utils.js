export function openClientApp(clientUrl) {
  if (/android/i.test(navigator.userAgent)) {
    window.JsCallback.getClientUrl(clientUrl);
  } else {
    try {
      window.webkit.messageHandlers.getClientUrl.postMessage(clientUrl);
    } catch (e) {
      console.log(e);
    }
  }
}

export const useCountdown = function(initialCount = 60) {
  let count = initialCount; // 当前倒计时值
  let state = false; // 当前状态是否在倒计时中
  const countDownText = () => {
    const h = Math.floor(count / 3600);
    const m = Math.floor((count - h * 3600) / 60);
    const s = count - h * 3600 - m * 60;
    let text = "";
    if (h > 0) {
      text += `${h} : `;
    }
    if (m > 0) {
      text += `${m} : `;
    }
    if (s >= 0) {
      const sText = s > 9 ? s : `0${s}`;
      text += `${sText}`;
    }
    return text;
  };
  let start = function(initCount, callback) {
    state = true;
    if (initCount > 0) {
      count = initCount;
    }
    if (!count) {
      count = initialCount;
    }
    const interval = setInterval(() => {
      if (count === 0) {
        clearInterval(interval);
        state = false;
      } else {
        count--;
      }
      callback(countDownText());
    }, 1000);
  };
  return {
    count,
    start,
    state,
  };
};
