import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  enablePortfolioPush,
  getPortfolioPushStatus,
} from "../../lib/pushNotifications";
import "./NotificationSetup.css";

const ADMIN_EMAIL = "imanwahmed367@gmail.com";

function NotificationSetup() {
  const [authState, setAuthState] = useState("checking");
  const [userEmail, setUserEmail] = useState("");
  const [loginState, setLoginState] = useState("");
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) return;

    const originalManifest = manifestLink.getAttribute("href");

    manifestLink.setAttribute(
      "href",
      "/iman-notifications.webmanifest?admin=1"
    );

    return () => {
      if (originalManifest) {
        manifestLink.setAttribute("href", originalManifest);
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const { data, error } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error || !data.user) {
        setAuthState("signed_out");
        setStatus("disabled");
        return;
      }

      const email = data.user.email?.toLowerCase() || "";

      if (email !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        setAuthState("unauthorized");
        setStatus("disabled");
        return;
      }

      setUserEmail(data.user.email || ADMIN_EMAIL);
      setAuthState("authorized");

      try {
        setStatus(await getPortfolioPushStatus());
      } catch {
        setStatus("unsupported");
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function sendLoginLink() {
    setLoginState("sending");

    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: {
        emailRedirectTo: `${window.location.origin}/iman-notifications`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setLoginState(error.message);
      return;
    }

    setLoginState("sent");
  }

  async function enable() {
    setMessage("");
    setStatus("checking");

    try {
      await enablePortfolioPush();
      setStatus("enabled");
      setMessage(
        "You're all set. I'll notify this device when a new project inquiry arrives."
      );
    } catch (error) {
      setStatus("error");
      setMessage(error?.message || "Could not enable notifications.");
    }
  }

  if (authState === "checking") {
    return (
      <main className="notification-setup">
        <div className="notification-setup__inner">
          <span className="notification-setup__kicker">
            PRIVATE NOTIFICATION SETUP
          </span>
          <h1>
            CHECKING
            <br />
            <em>ACCESS...</em>
          </h1>
        </div>
      </main>
    );
  }

  if (authState !== "authorized") {
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
            PRIVATE
            <br />
            <em>ACCESS.</em>
          </h1>

          {authState === "unauthorized" ? (
            <p className="notification-setup__message">
              This account is not authorized to access notification settings.
            </p>
          ) : (
            <p className="notification-setup__message">
              This area is only available to the portfolio owner.
            </p>
          )}

          {loginState === "sent" ? (
            <div className="notification-setup__success">
              <span>✓</span>
              <p>
                Login link sent. Check your email and open the link on this
                device.
              </p>
            </div>
          ) : (
            <button
              className="notification-setup__button"
              type="button"
              onClick={sendLoginLink}
              disabled={loginState === "sending"}
            >
              {loginState === "sending"
                ? "SENDING LOGIN LINK..."
                : "SEND ME A LOGIN LINK"}
              <span aria-hidden="true">→</span>
            </button>
          )}

          {loginState &&
            loginState !== "sent" &&
            loginState !== "sending" && (
              <p className="notification-setup__message">{loginState}</p>
            )}
        </div>
      </main>
    );
  }

  const isIos =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

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

        <p className="notification-setup__message">
          Signed in as {userEmail}
        </p>

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
            {status === "checking"
              ? "CHECKING..."
              : "ENABLE PUSH NOTIFICATIONS"}
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
