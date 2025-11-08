// frontend/src/pages/AdminDashboard.jsx
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Tab = {
  CAREERS: 'careers',
  APPTS: 'appointments',
  USERS: 'users',
  ASMT: 'assessments',
};

const useAuthHeader = () => {
  const { token, user } = useContext(AuthContext);
  return useMemo(() => {
    const t = token || user?.token || localStorage.getItem('token');
    return { Authorization: `Bearer ${t}` };
  }, [token, user]);
};

const AdminDashboard = () => {
  const headers = useAuthHeader();
  const [tab, setTab] = useState(Tab.CAREERS);

  return (
    <div className="container admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: 12, margin: '12px 0 24px' }}>
        <button onClick={() => setTab(Tab.CAREERS)}>Careers</button>
        <button onClick={() => setTab(Tab.APPTS)}>Appointments</button>
        <button onClick={() => setTab(Tab.USERS)}>Users</button>
        <button onClick={() => setTab(Tab.ASMT)}>Assessments</button>
      </div>

      {tab === Tab.CAREERS && <CareersPanel headers={headers} />}
      {tab === Tab.APPTS && <AppointmentsPanel headers={headers} />}
      {tab === Tab.USERS && <UsersPanel headers={headers} />}
      {tab === Tab.ASMT && <AssessmentsPanel headers={headers} />}
    </div>
  );
};

/* ================= Careers ================= */

const CareersPanel = ({ headers }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', avgSalary: '', skillsText: '' });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      setErr('');
      setLoading(true);
      const { data } = await axios.get('/api/admin/careers', { headers });
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      avgSalary: form.avgSalary,
      skills: form.skillsText.split(',').map(s => s.trim()).filter(Boolean),
    };
    await axios.post('/api/admin/careers', payload, { headers });
    setForm({ title: '', description: '', avgSalary: '', skillsText: '' });
    load();
  }, [form, headers, load]);

  const update = useCallback(async (id, patch) => {
    await axios.put(`/api/admin/careers/${id}`, patch, { headers });
    load();
  }, [headers, load]);

  const remove = useCallback(async (id) => {
    await axios.delete(`/api/admin/careers/${id}`, { headers });
    load();
  }, [headers, load]);

  if (loading) return <p>Loading careers…</p>;
  if (err) return <p style={{ color: 'red' }}>Error: {err}</p>;

  return (
    <div className="card">
      <h2>Careers</h2>

      <form onSubmit={create} style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
        <input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <input placeholder="Avg Salary" value={form.avgSalary} onChange={e => setForm(f => ({ ...f, avgSalary: e.target.value }))} />
        <input placeholder="Skills (comma separated)" value={form.skillsText} onChange={e => setForm(f => ({ ...f, skillsText: e.target.value }))} />
        <button type="submit">Create</button>
      </form>

      <div className="pf-table-wrap">
        <table className="pf-table">
          <thead>
            <tr><th>Title</th><th>Salary</th><th>Skills</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.avgSalary || '-'}</td>
                <td>{Array.isArray(c.skills) ? c.skills.join(', ') : '-'}</td>
                <td>
                  <button onClick={() => update(c._id, { title: prompt('New title', c.title) || c.title })}>Edit</button>
                  <button onClick={() => remove(c._id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4}>No careers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= Appointments ================= */

const AppointmentsPanel = ({ headers }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      setErr('');
      setLoading(true);
      const { data } = await axios.get('/api/admin/appointments', { headers });
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = useCallback(async (id, status) => {
    await axios.patch(`/api/admin/appointments/${id}/status`, { status }, { headers });
    load();
  }, [headers, load]);

  const remove = useCallback(async (id) => {
    await axios.delete(`/api/admin/appointments/${id}`, { headers });
    load();
  }, [headers, load]);

  if (loading) return <p>Loading appointments…</p>;
  if (err) return <p style={{ color: 'red' }}>Error: {err}</p>;

  return (
    <div className="card">
      <h2>Appointments</h2>
      <div className="pf-table-wrap">
        <table className="pf-table">
          <thead>
            <tr><th>When</th><th>User</th><th>Email</th><th>Mode</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map(a => (
              <tr key={a._id}>
                <td>{a.date ? new Date(a.date).toLocaleString() : '-'}</td>
                <td>{a.user?.name || a.name || '-'}</td>
                <td>{a.user?.email || a.email || '-'}</td>
                <td>{a.mode || '-'}</td>
                <td>{a.status}</td>
                <td>
                  <select defaultValue={a.status} onChange={e => updateStatus(a._id, e.target.value)}>
                    <option>pending</option>
                    <option>confirmed</option>
                    <option>cancelled</option>
                    <option>completed</option>
                  </select>
                  <button onClick={() => remove(a._id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6}>No appointments.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= Users ================= */

const UsersPanel = ({ headers }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      setErr('');
      setLoading(true);
      const { data } = await axios.get('/api/admin/users', { headers });
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    load();
  }, [load]);

  const changeRole = useCallback(async (id, role) => {
    await axios.patch(`/api/admin/users/${id}/role`, { role }, { headers });
    load();
  }, [headers, load]);

  if (loading) return <p>Loading users…</p>;
  if (err) return <p style={{ color: 'red' }}>Error: {err}</p>;

  return (
    <div className="card">
      <h2>Users</h2>
      <div className="pf-table-wrap">
        <table className="pf-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td className="mono">{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <select defaultValue={u.role} onChange={e => changeRole(u._id, e.target.value)}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4}>No users.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= Assessments ================= */

const AssessmentsPanel = ({ headers }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      setErr('');
      setLoading(true);
      const { data } = await axios.get('/api/admin/assessments', { headers });
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = useCallback(async (id) => {
    await axios.delete(`/api/admin/assessments/${id}`, { headers });
    load();
  }, [headers, load]);

  if (loading) return <p>Loading assessments…</p>;
  if (err) return <p style={{ color: 'red' }}>Error: {err}</p>;

  return (
    <div className="card">
      <h2>Assessments</h2>
      <div className="pf-table-wrap">
        <table className="pf-table">
          <thead>
            <tr><th>User</th><th>Score</th><th>Result</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map(r => (
              <tr key={r._id}>
                <td>{r.user?.name || '-'}</td>
                <td>{r.score ?? '-'}</td>
                <td>{r.result || '-'}</td>
                <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                <td><button onClick={() => remove(r._id)} style={{ color: 'red' }}>Delete</button></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5}>No assessments.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
