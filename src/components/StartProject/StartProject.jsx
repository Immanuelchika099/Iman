import { useState } from "react";
import { supabase } from "../../lib/supabase";
import "./StartProject.css";

function StartProject() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setStatus("");
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const inquiry = {
      name: formData.get("name")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      project_type: formData.get("type")?.toString().trim(),
      budget: formData.get("budget")?.toString().trim(),
      timeline: formData.get("timeline")?.toString().trim(),
      description: formData.get("description")?.toString().trim(),
      details: formData.get("details")?.toString().trim() || null,
    };

    const { error } = await supabase
      .from("portfolio_project_inquiries")
      .insert(inquiry);

    if (error) {
      console.error("Project inquiry submission failed:", error);
      setStatus("Something went wrong. Please try again or send me an email.");
      setSubmitting(false);
      return;
    }

    form.reset();
    setStatus("Thanks — your project inquiry has been sent.");
    setSubmitting(false);
  }

  return (
    <main className="start-project">
      <div className="section-inner">
        <a className="start-project__back" href="/">
          ← BACK TO PORTFOLIO
        </a>

        <div className="start-project__intro">
          <span className="section-kicker">START A PROJECT</span>
          <h1>
            NEED A WEBSITE?
            <br />
            <em>LET'S BUILD IT.</em>
          </h1>
          <p>
            Tell me what you need to build — a website, web app, e-commerce
            experience or AI integration. Share the goal, the rough scope and
            what success looks like. I'll take a look and get back to you.
          </p>
        </div>

        <form className="start-project__form" onSubmit={submit}>
          <div className="start-project__row">
            <label>
              YOUR NAME
              <input name="name" required placeholder="Your name" />
            </label>

            <label>
              EMAIL ADDRESS
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>
          </div>

          <div className="start-project__row">
            <label>
              PROJECT TYPE
              <select name="type" defaultValue="" required>
                <option value="" disabled>
                  Select one
                </option>
                <option>Website</option>
                <option>Web Application</option>
                <option>E-commerce Website</option>
                <option>AI Integration</option>
                <option>Website + AI Integration</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              BUDGET RANGE
              <select name="budget" defaultValue="" required>
                <option value="" disabled>
                  Select a range
                </option>
                <option>₦150k — ₦300k</option>
                <option>₦300k — ₦500k</option>
                <option>₦500k — ₦1m</option>
                <option>₦1m+</option>
                <option>I'm not sure yet</option>
              </select>
            </label>
          </div>

          <label>
            TIMELINE
            <select name="timeline" defaultValue="Flexible">
              <option>As soon as possible</option>
              <option>2 — 4 weeks</option>
              <option>1 — 2 months</option>
              <option>2+ months</option>
              <option>Flexible</option>
            </select>
          </label>

          <label>
            DESCRIBE THE PROJECT
            <textarea
              name="description"
              required
              placeholder="What are you building? Who is it for? What should it help people do?"
            />
          </label>

          <label>
            ANYTHING ELSE? <span className="optional">(optional)</span>
            <textarea
              name="details"
              placeholder="References, existing ideas, features, links, or anything I should know."
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? "SENDING..." : "SEND PROJECT INQUIRY"}
            <span aria-hidden="true">→</span>
          </button>

          {status && <p className="start-project__status">{status}</p>}

          <div className="start-project__email">
            <span>DON'T LIKE FORMS?</span>
            <a href="mailto:imanwahmed367@gmail.com">
              SEND AN EMAIL <span aria-hidden="true">↗</span>
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}

export default StartProject;
