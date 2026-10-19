import type { Student } from '../types';

interface Props {
  students: Student[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export function StudentList({ students, selectedId, onSelect, onDelete }: Props) {
  if (students.length === 0) {
    return <p className="empty">No hay estudiantes registrados.</p>;
  }

  return (
    <ul className="student-list">
      {students.map(student => (
        <li
          key={student.id}
          className={`student-item${student.id === selectedId ? ' selected' : ''}`}
        >
          <button
            type="button"
            className="student-name-btn"
            onClick={() => onSelect(student.id)}
          >
            {student.firstname} {student.lastname}
          </button>
          <button
            type="button"
            className="btn-delete"
            onClick={() => onDelete(student.id)}
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}
