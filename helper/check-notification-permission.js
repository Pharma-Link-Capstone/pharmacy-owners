export default function checkNotificationPermission() {
  if (!("Notification" in window)) {
    // Browser doesn't support notifications
    console.warn("This browser does not support desktop notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    // Permission already granted
    return true;
  } else if (Notification.permission !== "denied") {
    // Permission not yet granted or denied, request permission
    return new Promise((resolve) => {
      Notification.requestPermission().then((permission) => {
        resolve(permission === "granted");
      });
    });
  } else {
    // Permission explicitly denied
    console.warn("Notification permission denied");
    // return false;
  }
}
