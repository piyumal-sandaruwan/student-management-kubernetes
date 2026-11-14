import { useState } from 'react';

export default function StudentForm({ onAdd, busy }) {
  const [form, setForm] = useState({ name: '', email: '', course: '' });

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const added = await onAdd(form);
    if (added) setForm({ name: '', email: '', course: '' });
  }

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <span className="eyebrow">NEW RECORD</span>
          <h2>Add a student</h2>
        </div>
        <span className="form-icon" aria-hidden="true">＋</span>
      </div>
      <div className="form-fields">
        <label>
          Full name
          <input name="name" value={form.name} onChange={updateField} placeholder="e.g. Maya Chen" required />
        </label>
        <label>
          Email address
          <input name="email" type="email" value={form.email} onChange={updateField} placeholder="maya@example.com" required />
        </label>
        <label>
          Course
          <input name="course" value={form.course} onChange={updateField} placeholder="e.g. Computer Science" required />
        </label>
      </div>
      <button className="primary-button" type="submit" disabled={busy}>
        {busy ? <><span className="spinner" /> Adding student…</> : <>Add student <span aria-hidden="true">↗</span></>}
      </button>
      <p className="form-note"><span aria-hidden="true">⌁</span> All fields are required</p>
    </form>
  );
}
