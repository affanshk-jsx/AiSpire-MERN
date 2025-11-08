// frontend/src/pages/Appointment.jsx
import React, { useState } from 'react';
import api from '../lib/api';

export default function Appointment() {
  const [form, setForm] = useState({
    date: '',
    time: '',
    mode: 'online',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (!form.date || !form.time) {
      setErr('Please select date and time.');
      return;
    }

    setSubmitting(true);
    try {
      // POST /api/appointments with Bearer token (api client adds it)
      const res = await api.post('/api/appointments', {
        date: form.date,
        time: form.time,
        mode: form.mode,
        notes: form.notes
      });

      setMsg('Appointment booked successfully!');
      setForm({ date: '', time: '', mode: 'online', notes: '' });
      console.log('Booked:', res.data);
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.message ||
        'Failed to book appointment.';
      setErr(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <div className="page-header">
        <h1>Book Appointment</h1>
        <p>Select a date and time to schedule with our counselor.</p>
      </div>

      {msg && <div style={{ background:'#ebfff1', color:'#1b7f3a', padding:12, borderRadius:10, marginBottom:12 }}>{msg}</div>}
      {err && <div style={{ background:'#ffefef', color:'#b00020', padding:12, borderRadius:10, marginBottom:12 }}>{err}</div>}

      <form onSubmit={onSubmit} className="card" style={{ padding:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <label htmlFor="date" style={{ display:'block', fontWeight:600, marginBottom:6 }}>Date</label>
            <input id="date" name="date" type="date" value={form.date} onChange={onChange} required style={{ width:'100%', padding:'10px 12px', border:'1px solid #d7dee6', borderRadius:10 }} />
          </div>
          <div>
            <label htmlFor="time" style={{ display:'block', fontWeight:600, marginBottom:6 }}>Time</label>
            <input id="time" name="time" type="time" value={form.time} onChange={onChange} required style={{ width:'100%', padding:'10px 12px', border:'1px solid #d7dee6', borderRadius:10 }} />
          </div>
        </div>

        <div style={{ marginTop:16 }}>
          <label htmlFor="mode" style={{ display:'block', fontWeight:600, marginBottom:6 }}>Mode</label>
          <select id="mode" name="mode" value={form.mode} onChange={onChange} style={{ width:'100%', padding:'10px 12px', border:'1px solid #d7dee6', borderRadius:10 }}>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="phone">Phone</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div style={{ marginTop:16 }}>
          <label htmlFor="notes" style={{ display:'block', fontWeight:600, marginBottom:6 }}>Notes (optional)</label>
          <textarea id="notes" name="notes" rows="3" value={form.notes} onChange={onChange} style={{ width:'100%', padding:'10px 12px', border:'1px solid #d7dee6', borderRadius:10 }} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop:16 }}>
          {submitting ? 'Booking…' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}
