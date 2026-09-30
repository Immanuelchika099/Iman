import { supabase } from "./supabase";

const VAPID_PUBLIC_KEY =
  "BLXdfmCTq17Bbd6CGBsdmScM2YtR6Dk3q2SnaREwrUKc1jT5kg4EdkI3n5T_INhHNyDeEu8l23aY1Jb7os3BzMA";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function enablePortfolioPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications are not supported in this browser.");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const json = subscription.toJSON();

  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("The browser returned an incomplete push subscription.");
  }

  const { error } = await supabase
    .from("portfolio_push_subscriptions")
    .insert({
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    });

  if (error && !/duplicate key|unique constraint/i.test(error.message || "")) {
    throw error;
  }

  return subscription;
}

export async function getPortfolioPushStatus() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return "unsupported";
  }

  const permission = Notification.permission;

  if (permission === "denied") return "denied";

  const registration = await navigator.serviceWorker.getRegistration("/sw.js");

  if (!registration) return "disabled";

  const subscription = await registration.pushManager.getSubscription();
  return subscription ? "enabled" : "disabled";
}