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
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

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

  async function sendLoginCode() {
    setLoginState("sending");

    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      setLoginState(error.message);
      return;
    }

    setLoginState("code_sent");
  }

  async function verifyLoginCode(event) {
    event.preventDefault();

    const cleanOtp = otp.replace(/\D/g, "");

    if (cleanOtp.length < 6) {
      setLoginState("Enter the verification code from your email.");
      return;
    }

    setLoginState("verifying");

    const { error } = await supabase.auth.verifyOtp({
      email: ADMIN_EMAIL,
      token: cleanOtp,
      type: "email",
    });

    if (error) {
      setLoginState(error.message);
      return;
    }

    setLoginState("verified");
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

          <p className="notification-setup__message">
            {authState === "unauthorized"
              ? "This account is not authorized to access notification settings."
              : "This area is only available to the portfolio owner."}
          </p>

          {loginState === "code_sent" ? (
            <form
              className="notification-setup__login-form"
              onSubmit={verifyLoginCode}
            >
              <div className="notification-setup__success">
                <span>✓</span>
                <p>
                  Verification code sent. Check your email and enter the code
                  below on this device.
                </p>
              </div>

              <input
                className="notification-setup__otp"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                aria-label="Email verification code"
                autoFocus
              />

              <button
                className="notification-setup__button"
                type="submit"
                disabled={loginState === "verifying" || otp.length < 6}
              >
                {loginState === "verifying" ? "VERIFYING..." : "VERIFY CODE"}
                <span aria-hidden="true">→</span>
              </button>

              <button
                className="notification-setup__resend"
                type="button"
                onClick={sendLoginCode}
                disabled={loginState === "sending" || loginState === "verifying"}
              >
                SEND A NEW CODE
              </button>
            </form>
          ) : (
            <button
              className="notification-setup__button"
              type="button"
              onClick={sendLoginCode}
              disabled={loginState === "sending"}
            >
              {loginState === "sending"
                ? "SENDING CODE..."
                : "SEND ME A LOGIN CODE"}
              <span aria-hidden="true">→</span>
            </button>
          )}

          {loginState &&
            loginState !== "code_sent" &&
            loginState !== "sending" &&
            loginState !== "verifying" &&
            loginState !== "verified" && (
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
            <strong>One step first:</strong> add this website to your Home
            Screen, then open the Home Screen version. You can complete the
            login and enable notifications there.
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
