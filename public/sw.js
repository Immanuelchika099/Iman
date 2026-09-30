self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "IMAN", body: event.data?.text() || "New portfolio activity." };
  }

  const title = data.title || "IMAN";
  const options = {
    body: data.body || "You have a new portfolio update.",
    badge: data.badge || undefined,
    icon: data.icon || undefined,
    data: data.data || { url: "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const target = event.notification?.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => "focus" in client);
      if (existing) {
        existing.navigate(target);
        return existing.focus();
      }

      return self.clients.openWindow(target);
    })
  );
});