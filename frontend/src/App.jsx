import { useCallback, useEffect, useState } from 'react';
import { createStudent, deleteStudent, getStudents } from './api/students.js';
import StudentForm from './components/StudentForm.jsx';
import StudentTable from './components/StudentTable.jsx';

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      setStudents(await getStudents());
      setNotice(null);
    } catch (error) {
      setNotice({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  async function handleAdd(student) {
    setAdding(true);
    setNotice(null);
    try {
      const created = await createStudent(student);
      setStudents((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNotice({ type: 'success', message: `${created.name} was added successfully.` });
      return true;
    } catch (error) {
      setNotice({ type: 'error', message: error.message });
      return false;
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(student) {
    setDeletingId(student._id);
    setNotice(null);
    try {
      await deleteStudent(student._id);
      setStudents((current) => current.filter((item) => item._id !== student._id));
      setNotice({ type: 'success', message: `${student.name} was removed.` });
    } catch (error) {
      setNotice({ type: 'error', message: error.message });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#main" aria-label="CampusDesk home">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></span>
          <span>campus<span className="brand-light">desk</span></span>
        </a>
        <div className="topbar-right"><span className="status-dot" /> Student administration</div>
      </header>

      <main id="main" className="main-content">
        <section className="welcome-row">
          <div>
            <div className="breadcrumb">WORKSPACE <span>/</span> STUDENTS</div>
            <h1>Student overview<span className="title-period">.</span></h1>
            <p className="subtitle">A clear view of your student community.</p>
          </div>
          <div className="total-card">
            <span className="total-icon" aria-hidden="true">♧</span>
            <div><span className="total-label">TOTAL STUDENTS</span><strong>{loading ? '—' : students.length.toString().padStart(2, '0')}</strong></div>
          </div>
        </section>

        {notice && (
          <div className={`notice ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
            <span className="notice-icon" aria-hidden="true">{notice.type === 'error' ? '!' : '✓'}</span>
            <span>{notice.message}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message">×</button>
          </div>
        )}

        <div className="content-grid">
          <section className="records-panel" aria-labelledby="records-title">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">DIRECTORY</span>
                <h2 id="records-title">All students <span className="count-badge">{students.length}</span></h2>
              </div>
              <button className="refresh-button" type="button" onClick={loadStudents} disabled={loading} aria-label="Refresh student list" title="Refresh list">↻</button>
            </div>
            <StudentTable students={students} loading={loading} deletingId={deletingId} onDelete={handleDelete} />
            <div className="panel-footer"><span>Showing {loading ? '—' : students.length} {students.length === 1 ? 'record' : 'records'}</span><span><i /> LIVE DIRECTORY</span></div>
          </section>

          <aside className="form-panel"><StudentForm onAdd={handleAdd} busy={adding} /></aside>
        </div>

        <footer className="page-footer"><span>CampusDesk <span className="footer-dot">·</span> Student management</span><span>BUILT FOR BETTER LEARNING</span></footer>
      </main>
    </div>
  );
}
