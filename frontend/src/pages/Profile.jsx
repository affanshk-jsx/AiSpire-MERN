// frontend/src/pages/Profile.jsx
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import './Profile.css';

// Endpoints (change if backend differs)
const EP_ME        = '/api/users/me';
const EP_MY_APPTS  = '/api/appointments/my';
const EP_MY_ASSESS = '/api/assessments/my';

// helpers
const pretty = (str) =>
  (str ?? '')
    .toString()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const normalizeAppointment = (raw) => {
  if (!raw || typeof raw !== 'object') return { status: 'pending' };

  const id =
    raw._id ?? raw.id ?? raw.appointmentId ?? raw.reference ?? undefined;

  const dateLike =
    raw.date ?? raw.appointmentDate ?? raw.scheduledFor ?? raw.scheduledAt ?? raw.when ?? raw.createdAt ?? null;

  let date = dateLike;
  let time =
    raw.time ?? raw.slot ?? raw.appointmentTime ?? raw.startTime ?? raw.timeSlot ?? null;

  if (!time && dateLike) {
    const d = new Date(dateLike);
    if (!Number.isNaN(d.getTime())) {
      time = d.toLocaleTimeString();
      date = d.toISOString();
    }
  }

  const mode = raw.mode ?? raw.type ?? raw.channel ?? raw.locationType ?? 'online';

  const s = (raw.status ?? '').toString().toLowerCase().trim();
  let status = 'pending';
  if (raw.isCancelled || raw.cancelled || s === 'cancelled' || s === 'canceled') status = 'cancelled';
  else if (raw.completed || raw.isCompleted || s === 'completed' || s === 'done') status = 'completed';
  else if (raw.confirmed || raw.isConfirmed || raw.approved || s === 'confirmed' || s === 'approved') status = 'confirmed';
  else if (s) status = s;

  const notes = raw.notes ?? raw.reason ?? raw.description ?? raw.message ?? '';

  return { id, date, time, mode, status, notes };
};

const normalizeAssessment = (q) => {
  if (!q || typeof q !== 'object') return { title: 'Assessment', total: 100 };
  const id = q._id ?? q.id;
  const title = q.title ?? q.name ?? 'Assessment';
  const total = q.total ?? q.max ?? 100;
  const score = q.score ?? q.result ?? null;
  const takenAt = q.takenAt ?? q.createdAt ?? null;
  return { id, title, total, score, takenAt };
};

const Avatar = ({ name }) => {
  const initials = useMemo(() => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    const f = parts[0]?.[0] || '';
    const l = parts[1]?.[0] || '';
    return (f + (l || '')).toUpperCase();
  }, [name]);
  return <div className="pf-avatar">{initials}</div>;
};

const Chip = ({ children, variant = 'default' }) => (
  <span className={`pf-chip pf-chip--${variant}`}>{children}</span>
);

export default function Profile() {
  const { token, user: cachedUser, loading: authLoading } = useContext(AuthContext);

  const [profile, setProfile] = useState(cachedUser || null);
  const [appointments, setAppointments] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setErr('You are not logged in.');
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr('');

        const meReq   = cachedUser ? Promise.resolve({ data: cachedUser }) : api.get(EP_ME, { signal: ctrl.signal });
        const apptReq = api.get(EP_MY_APPTS, { signal: ctrl.signal });
        const quizReq = api.get(EP_MY_ASSESS, { signal: ctrl.signal });

        const [meRes, apptRes, assessRes] = await Promise.all([meReq, apptReq, quizReq]);

        setProfile(meRes.data || null);
        setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
        setAssessments(Array.isArray(assessRes.data) ? assessRes.data : []);
      } catch (e) {
        // ignore aborts in dev
        const isCancel =
          e?.code === 'ERR_CANCELED' ||
          e?.name === 'AbortError' ||
          (typeof e?.message === 'string' && e.message.toLowerCase().includes('cancel'));
        if (!isCancel) {
          const msg = e?.response?.data?.message || e?.message || 'Failed to load profile.';
          setErr(msg);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, token]);

  if (authLoading || loading) return <div className="container">Loading profile…</div>;
  if (err) return <div className="container" style={{ color: 'red' }}>{err}</div>;
  if (!profile) return <div className="container">No profile data.</div>;

  const joined = profile.createdAt ? new Date(profile.createdAt) : null;

  return (
    <div className="container pf-wrap">
      {/* Header */}
      <div className="pf-header card">
        <div className="pf-header-left">
          <Avatar name={profile.name || profile.fullName || 'User'} />
          <div>
            <h1 className="pf-name">{profile.name || profile.fullName || 'User'}</h1>
            <p className="pf-email">{profile.email}</p>
            {profile.role && (
              <Chip variant={profile.role === 'admin' ? 'warn' : 'ok'}>{profile.role}</Chip>
            )}
          </div>
        </div>
        <div className="pf-header-right">
          <div className="pf-kv">
            <span className="pf-k">User ID</span>
            <span className="pf-v mono">{profile._id || profile.id || '-'}</span>
          </div>
          <div className="pf-kv">
            <span className="pf-k">Joined</span>
            <span className="pf-v">{joined ? joined.toLocaleDateString() : '-'}</span>
          </div>
        </div>
      </div>

      {/* Account summary */}
      <div className="pf-grid">
        <div className="card pf-summary">
          <h2>Account</h2>
          <ul className="pf-list">
            <li><span>Name</span><strong>{profile.name || '-'}</strong></li>
            <li><span>Email</span><strong className="mono">{profile.email}</strong></li>
            {profile.phone && <li><span>Phone</span><strong className="mono">{profile.phone}</strong></li>}
            {profile.role && <li><span>Role</span><strong>{profile.role}</strong></li>}
          </ul>
        </div>

        <div className="card pf-summary">
          <h2>Stats</h2>
          <ul className="pf-list">
            <li><span>Total Appointments</span><strong>{appointments.length}</strong></li>
            <li><span>Total Assessments</span><strong>{assessments.length}</strong></li>
          </ul>
        </div>
      </div>

      {/* Appointments */}
      <div className="card">
        <div className="pf-section-head"><h2>My Appointments</h2></div>

        {(!appointments || appointments.length === 0) ? (
          <div className="pf-empty">No appointments yet.</div>
        ) : (
          <div className="pf-table-wrap">
            <table className="pf-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Notes / ID</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((raw) => {
                  const a = normalizeAppointment(raw);
                  const dateStr = a.date ? new Date(a.date).toLocaleDateString() : '-';
                  const timeStr = a.time || '-';
                  const modeStr = pretty(a.mode);
                  const statusStr = pretty(a.status);

                  return (
                    <tr key={a.id || `${dateStr}-${timeStr}-${modeStr}`}>
                      <td>{dateStr}</td>
                      <td className="mono">{timeStr}</td>
                      <td>{modeStr}</td>
                      <td>
                        <span
                          className={`pf-chip ${
                            a.status === 'confirmed'
                              ? 'pf-chip--ok'
                              : a.status === 'cancelled'
                              ? 'pf-chip--bad'
                              : a.status === 'completed'
                              ? 'pf-chip--warn'
                              : 'pf-chip--default'
                          }`}
                        >
                          {statusStr}
                        </span>
                      </td>
                      <td className="mono">{a.notes || a.id || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assessments */}
      <div className="card">
        <div className="pf-section-head"><h2>My Assessments</h2></div>

        {(!assessments || assessments.length === 0) ? (
          <div className="pf-empty">No assessments yet.</div>
        ) : (
          <div className="pf-table-wrap">
            <table className="pf-table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Score</th>
                  <th>Taken On</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((q) => {
                  const item = normalizeAssessment(q);
                  const when = item.takenAt ? new Date(item.takenAt).toLocaleString() : '-';
                  const score = item.score == null ? '-' : `${item.score} / ${item.total}`;
                  return (
                    <tr key={item.id || `${item.title}-${when}`}>
                      <td>{item.title}</td>
                      <td className="mono">{score}</td>
                      <td>{when}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
