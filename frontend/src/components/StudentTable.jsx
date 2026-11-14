function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';
}

const colors = ['lavender', 'mint', 'peach', 'sky', 'rose'];

export default function StudentTable({ students, loading, deletingId, onDelete }) {
  if (loading) {
    return <div className="table-state"><span className="spinner dark" /> Loading student records…</div>;
  }

  if (students.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">▤</span>
        <h3>No students yet</h3>
        <p>Add your first student using the form to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>STUDENT</th><th>EMAIL ADDRESS</th><th>COURSE</th><th><span className="sr-only">Actions</span></th></tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student._id}>
              <td data-label="Student">
                <div className="student-cell">
                  <span className={`avatar ${colors[index % colors.length]}`}>{initials(student.name)}</span>
                  <span className="student-name">{student.name}</span>
                </div>
              </td>
              <td data-label="Email address" className="muted-cell">{student.email}</td>
              <td data-label="Course"><span className="course-pill">{student.course}</span></td>
              <td data-label="Actions" className="action-cell">
                <button className="delete-button" type="button" onClick={() => onDelete(student)} disabled={deletingId === student._id} aria-label={`Delete ${student.name}`}>
                  {deletingId === student._id ? <span className="spinner dark" /> : <><span aria-hidden="true">⌫</span><span className="delete-label">Delete</span></>}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
