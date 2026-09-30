import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  enablePortfolioPush,
  getPortfolioPushStatus,
} from "../../lib/pushNotifications";
import "./NotificationSetup.css";
import NotificationDashboard from "../NotificationDashboard/NotificationDashboard";

const ADMIN_EMAIL = "imanwahmed367@gmail.com";

function NotificationSetup() {
  const [authState, setAuthState] = useState("checking");
  const [userEmail, setUserEmail] = useState("");
  const [loginState, setLoginState] = useState("");
  const [resetState, setResetState] = useState("");
  const [password, setPassword] = useState("");
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

  async function signIn() {
    setLoginState("signing_in");

    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    if (error) {
      setLoginState(error.message);
      return;
    }

    setLoginState("signed_in");
    setPassword("");
  }

  async function handleLogin(event) {
    event.preventDefault();
    await signIn();
  }

  async function sendPasswordReset() {
    setResetState("sending");

    const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
      redirectTo:
        "https://iman-chika.vercel.app/iman-notifications/reset-password",
    });

    if (error) {
      setResetState(error.message);
      return;
    }

    setResetState("sent");
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
              : "Enter your private access password to continue."}
          </p>

          <form
            className="notification-setup__login-form"
            onSubmit={handleLogin}
          >
            <input
              className="notification-setup__otp"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="••••••••••••"
              aria-label="Private access password"
              autoFocus
            />

            <button
              className="notification-setup__button"
              type="submit"
              disabled={!password || loginState === "signing_in"}
            >
              {loginState === "signing_in"
                ? "CHECKING..."
                : "UNLOCK NOTIFICATIONS"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <button
            className="notification-setup__resend"
            type="button"
            onClick={sendPasswordReset}
            disabled={resetState === "sending"}
          >
            {resetState === "sending" ? "SENDING..." : "FORGOT PASSWORD?"}
          </button>

          {resetState === "sent" && (
            <p className="notification-setup__message">
              Recovery email sent. Open the newest email and use the reset link.
            </p>
          )}

          {resetState && resetState !== "sending" && resetState !== "sent" && (
            <p className="notification-setup__message">{resetState}</p>
          )}

          {loginState &&
            loginState !== "signing_in" &&
            loginState !== "signed_in" && (
              <p className="notification-setup__message">{loginState}</p>
            )}
        </div>
      </main>
    );
  }

  return <NotificationDashboard userEmail={userEmail} onSignOut={() => supabase.auth.signOut()} />;
