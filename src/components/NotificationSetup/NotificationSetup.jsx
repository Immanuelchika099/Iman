import { useEffect, useState } from "react";
import {
  enablePortfolioPush,
  getPortfolioPushStatus,
} from "../../lib/pushNotifications";
import "./NotificationSetup.css";

function NotificationSetup() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkStatus() {
      try {
        const current = await getPortfolioPushStatus();
        setStatus(current);
      } catch {
        setStatus("unsupported");
      }
    }

    checkStatus();
  }, []);

  async function enable() {
    setMessage("");
    setStatus("checking");

    try {
      await enablePortfolioPush();
      setStatus("enabled");
      setMessage("You're all set. I'll notify this device when a new project inquiry arrives.");
    } catch (error) {
      setStatus("error");
      setMessage(error?.message || "Could not enable notifications.");
    }
  }

  const isIos =
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream;

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  return (
    <main className="notification-setup">
      <div className="notification-setup__inner">
        <a href="/" className="notification-setup__back">
          ← BACK TO PORTFOLIO
        </a>

        <span className="notification-setup__kicker">
          PRIVATE NOTIFICATION SETUP
        </span>

        <h1>
          GET NOTIFIED
          <br />
          <em>WHEN THEY REACH OUT.</em>
        </h1>

        {isIos && !isStandalone && (
          <div className="notification-setup__note">
            <strong>On iPhone:</strong> add this website to your Home Screen
            first. Then open the Home Screen version and come back to this
            page to enable notifications.
          </div>
        )}

        {status === "enabled" ? (
          <div className="notification-setup__success">
            <span>✓</span>
            <p>Notifications are enabled on this device.</p>
          </div>
        ) : (
          <button
            className="notification-setup__button"
            type="button"
            onClick={enable}
            disabled={status === "checking" || (isIos && !isStandalone)}
          >
            {status === "checking" ? "CHECKING..." : "ENABLE PUSH NOTIFICATIONS"}
            <span aria-hidden="true">→</span>
          </button>
        )}

        {status === "unsupported" && (
          <p className="notification-setup__message">
            This browser does not support web push notifications.
          </p>
        )}

        {status === "denied" && (
          <p className="notification-setup__message">
            Notifications are blocked for this site. Allow them in your
            browser settings and try again.
          </p>
        )}

        {status === "error" && (
          <p className="notification-setup__message">{message}</p>
        )}

        {message && status === "enabled" && (
          <p className="notification-setup__message">{message}</p>
        )}
      </div>
    </main>
  );
}

export default NotificationSetup;