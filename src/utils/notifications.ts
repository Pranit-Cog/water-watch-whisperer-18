
export const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

export const showNotification = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('💧 Time to Hydrate!', {
      body: 'Don\'t forget to drink a glass of water to stay healthy and refreshed!',
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });

    setTimeout(() => notification.close(), 5000);
  }
};
