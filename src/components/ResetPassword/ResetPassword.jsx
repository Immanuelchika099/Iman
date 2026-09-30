import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./ResetPassword.css";

const RESET_REDIRECT =
  "https://iman-chika.vercel.app/iman-notifications/reset-password";

function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error || !data.session) {
        setState("invalid");
        setMessage(
          "This password recovery link is invalid or has expired. Request a new one from the notification login page."
        );
      } else {
        setReady(true);
        setState("ready");
      }
    }

    checkRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY" && session) {
        setReady(true);
        setState("ready");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8) {
      setState("error");
      setMessage("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setState("error");
      setMessage("The passwords do not match.");
      return;
    }

    setState("updating");
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setState("error");
      setMessage(error.message);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setState("success");
    setMessage("Your password has been updated. You can now unlock notifications.");

    window.setTimeout(() => {
      window.location.assign("/iman-notifications");
    }, 1400);
  }

  return (
    <main className="notification-setup reset-password">
      <div className="notification-setup__inner">
        <a href="/" className="notification-setup__back">
          ← BACK TO PORTFOLIO
        </a>

        <span className="notification-setup__kicker">
          PRIVATE NOTIFICATION SETUP
        </span>

        <h1>
          NEW
          <br />
          <em>PASSWORD.</em>
        </h1>

        {state === "checking" && (
          <p className="notification-setup__message">
            Checking your recovery link...
          </p>
        )}

        {state === "invalid" && (
          <>
            <p className="notification-setup__message">{message}</p>
            <a
              className="notification-setup__button reset-password__link"
              href="/iman-notifications"
            >
              BACK TO LOGIN <span aria-hidden="true">→</span>
            </a>
          </>
        )}

        {ready && state !== "success" && (
          <form
            className="notification-setup__login-form reset-password__form"
            onSubmit={handleSubmit}
          >
            <input
              className="notification-setup__otp reset-password__input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="NEW PASSWORD"
              aria-label="New password"
              autoFocus
            />

            <input
              className="notification-setup__otp reset-password__input"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="CONFIRM PASSWORD"
              aria-label="Confirm password"
            />

            <button
              className="notification-setup__button"
              type="submit"
              disabled={
                !password || !confirmPassword || state === "updating"
              }
            >
              {state === "updating" ? "UPDATING..." : "UPDATE PASSWORD"}
              <span aria-hidden="true">→</span>
            </button>

            {state === "error" && (
              <p className="notification-setup__message">{message}</p>
            )}
          </form>
        )}

        {state === "success" && (
          <div className="notification-setup__success">
            <span>✓</span>
            <p>{message}</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default ResetPassword;
