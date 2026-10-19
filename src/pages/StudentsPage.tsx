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
    // TODO: Llama removeStudent(id) para eliminar el estudiante.
    //       Si tenía seleccionado ese estudiante, limpia selectedId.
    //       Maneja el error con try/catch.
  };

  const handleCreated = (student: Student) => {
    // TODO: Agrega el estudiante creado a la lista usando pushStudent.
    //       Selecciónalo automáticamente (setSelectedId).
  };

  // TODO: Muestra un estado de carga si loading es true
  // TODO: Muestra un error si error no es null
  // TODO: El header con ThemeToggle ya está renderizado abajo.
  //       Agrega el resto del layout con:
  //       - Lista de estudiantes (StudentList) con los props correctos
  //       - Detalle del estudiante seleccionado (StudentDetail)
  //       - Formulario de creación (StudentForm) con handleCreated
  return (
    <div className="page">
      <header className="page-header">
        <h1>Estudiantes</h1>
        <ThemeToggle />
      </header>
      <p>TODO: implementar el layout</p>
    </div>
  );
}
