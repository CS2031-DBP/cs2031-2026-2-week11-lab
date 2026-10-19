import { useState } from 'react';
import { useStudents } from '../hooks/useStudents';
import { ThemeToggle } from '../components/ThemeToggle';
import { StudentList } from '../components/StudentList';
import { StudentDetail } from '../components/StudentDetail';
import { StudentForm } from '../components/StudentForm';
import type { Student } from '../types';

export function StudentsPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { students, loading, error, removeStudent, pushStudent } = useStudents();

  const handleDelete = async (id: number) => {
    try {
      await removeStudent(id);
      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (err) {
      console.error('Error al eliminar estudiante', err);
    }
  };

  const handleCreated = (student: Student) => {
    pushStudent(student);
    setSelectedId(student.id);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Estudiantes</h1>
        <ThemeToggle />
      </header>

      {loading && <p className="empty">Cargando estudiantes...</p>}
      {error && <p className="error">{error}</p>}

      <div className="page-body">
        <div className="card">
          <div className="section-title">Lista de estudiantes</div>
          <StudentList
            students={students}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={handleDelete}
          />
        </div>

        <StudentDetail studentId={selectedId} />
      </div>

      <StudentForm onCreated={handleCreated} />
    </div>
  );
}
