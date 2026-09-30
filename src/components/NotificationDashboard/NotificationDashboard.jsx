import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./NotificationDashboard.css";

function formatDate(value) {
  return new Intl.DateTimeFormat("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function InquiryCard({ inquiry, index, onDelete }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(event) {
    event.stopPropagation();
    if (!window.confirm("Delete this completed inquiry? This cannot be undone.")) return;
    setDeleting(true);
    try { await onDelete(inquiry.id); } finally { setDeleting(false); }
  }

  return (
    <article className={\`inquiry-card \${open ? "is-open" : ""}\`}>
      <button className="inquiry-card__header" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="inquiry-card__number">{String(index + 1).padStart(2, "0")}</span>
        <span className="inquiry-card__identity"><strong>{inquiry.name || "Unnamed client"}</strong><span>{inquiry.email || "No email provided"}</span></span>
        <span className="inquiry-card__tags">
          {inquiry.project_type && <span className="inquiry-tag">{inquiry.project_type}</span>}
          {inquiry.budget && <span className="inquiry-tag inquiry-tag--accent">{inquiry.budget}</span>}
          {inquiry.timeline && <span className="inquiry-tag">{inquiry.timeline}</span>}
        </span>
        <span className="inquiry-card__arrow" aria-hidden="true">{open ? "↗" : "↘"}</span>
      </button>

      <div className="inquiry-card__body">
        <div className="inquiry-card__grid">
          <div><span className="inquiry-label">SERVICE / PROJECT</span><p>{inquiry.project_type || "Not specified"}</p></div>
          <div><span className="inquiry-label">BUDGET RANGE</span><p>{inquiry.budget || "Not specified"}</p></div>
          <div><span className="inquiry-label">TIMELINE / URGENCY</span><p>{inquiry.timeline || "Not specified"}</p></div>
          <div><span className="inquiry-label">CONTACT</span><p>{inquiry.email || "Not specified"}</p></div>
        </div>
        <div className="inquiry-card__brief"><span className="inquiry-label">PROJECT BRIEF</span><p>{inquiry.description || "No project description provided."}</p></div>
        {inquiry.details && <div className="inquiry-card__brief"><span className="inquiry-label">ADDITIONAL DETAILS</span><p>{inquiry.details}</p></div>}
        <div className="inquiry-card__footer">
          <span>SUBMITTED {formatDate(inquiry.created_at)}</span>
          <button className="inquiry-delete" type="button" onClick={handleDelete} disabled={deleting}>{deleting ? "DELETING..." : "DELETE INQUIRY"}<span aria-hidden="true">×</span></button>
        </div>
      </div>
    </article>
  );
}

function NotificationDashboard({ userEmail, onSignOut }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInquiries = useCallback(async () => {
    setLoading(true); setError("");
    const { data, error: fetchError } = await supabase.from("portfolio_project_inquiries").select("id, name, email, project_type, budget, timeline, description, details, created_at").order("created_at", { ascending: false });
    if (fetchError) { setError(fetchError.message || "Could not load inquiries."); setLoading(false); return; }
    setInquiries(data || []); setLoading(false);
  }, []);

  useEffect(() => { loadInquiries(); }, [loadInquiries]);

  const stats = useMemo(() => ({ total: inquiries.length, latest: inquiries[0]?.created_at ? formatDate(inquiries[0].created_at) : "—", budgetCount: inquiries.filter((item) => item.budget).length }), [inquiries]);

  async function deleteInquiry(id) {
    const { error: deleteError } = await supabase.from("portfolio_project_inquiries").delete().eq("id", id);
    if (deleteError) { window.alert(deleteError.message || "Could not delete this inquiry."); return; }
    setInquiries((items) => items.filter((item) => item.id !== id));
  }

  return (
    <main className="notification-dashboard">
      <div className="notification-dashboard__glow notification-dashboard__glow--one" />
      <div className="notification-dashboard__glow notification-dashboard__glow--two" />
      <div className="notification-dashboard__inner">
        <header className="dashboard-header">
          <div><a href="/" className="dashboard-back">← IMAN</a><span className="dashboard-kicker">PRIVATE / CLIENT INBOX</span><h1>PROJECT<br /><em>INQUIRIES.</em></h1></div>
          <div className="dashboard-account"><span>SECURE ACCESS</span><strong>{userEmail}</strong><button type="button" onClick={onSignOut}>SIGN OUT</button></div>
        </header>
        <section className="dashboard-intro">
          <p>Every serious conversation starts here. Review what they want, what they can invest, and how soon they need it.</p>
          <div className="dashboard-stats"><div><span>INQUIRIES</span><strong>{String(stats.total).padStart(2, "0")}</strong></div><div><span>BUDGETS CAPTURED</span><strong>{String(stats.budgetCount).padStart(2, "0")}</strong></div><div><span>LATEST</span><strong>{stats.latest}</strong></div></div>
        </section>
        <section className="inquiry-list">
          <div className="inquiry-list__top"><span>ALL PROJECT INQUIRIES</span><button type="button" onClick={loadInquiries} disabled={loading}>{loading ? "LOADING..." : "REFRESH ↻"}</button></div>
          {loading ? <div className="dashboard-empty"><span>LOADING INQUIRIES...</span></div> : error ? <div className="dashboard-empty"><span>{error}</span><button type="button" onClick={loadInquiries}>TRY AGAIN</button></div> : inquiries.length === 0 ? <div className="dashboard-empty"><span>QUIET FOR NOW.</span><p>When someone reaches out, their project will appear here.</p></div> : inquiries.map((inquiry, index) => <InquiryCard key={inquiry.id} inquiry={inquiry} index={index} onDelete={deleteInquiry} />)}
        </section>
      </div>
    </main>
  );
}

export default NotificationDashboard;
