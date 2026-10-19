import { useState, useEffect } from 'react';
import type { Student, Course } from '../types';
import { getStudent, getStudentCourses } from '../api';

interface Props {
  studentId: number | null;
}

export function StudentDetail({ studentId }: Props) {
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Si studentId es null, limpia el estado (student=null, courses=[]) y retorna.
    // TODO: Usa Promise.all para obtener en paralelo:
    //       - getStudent(studentId)
    //       - getStudentCourses(studentId)
    // TODO: Maneja el estado loading y error.
    // TODO: Retorna una función de cleanup que cancele las actualizaciones de estado
    //       si el componente se desmonta antes de que termine la petición
    //       (tip: usa una variable booleana `cancelled`).
  }, [studentId]);

  // TODO: Si studentId es null, muestra "Selecciona un estudiante"
  // TODO: Si loading, muestra "Cargando..."
  // TODO: Si error, muestra el error
  // TODO: Muestra los datos del estudiante: nombre, email, teléfono, edad, descripción
  // TODO: Muestra la lista de cursos matriculados (nombre y créditos)
  // TODO: reemplaza este return con los renderizados condicionales descritos arriba
  return <div>Selecciona un estudiante</div>;
}
