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
    if (studentId === null) {
      return;
    }

    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón de fetch con cleanup enseñado en este lab (ver README)
    setLoading(true);
    Promise.all([getStudent(studentId), getStudentCourses(studentId)])
      .then(([s, c]) => {
        if (!cancelled) {
          setStudent(s);
          setCourses(c);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Error al cargar el estudiante');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [studentId]);

  if (studentId === null) {
    return <p className="empty">Selecciona un estudiante</p>;
  }

  if (loading) {
    return <p className="empty">Cargando...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!student) {
    return null;
  }

  return (
    <div className="student-detail card">
      <div className="detail-name">
        {student.firstname} {student.lastname}
      </div>

      <div className="detail-fields">
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span>{student.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Teléfono:</span>
          <span>{student.phone}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Edad:</span>
          <span>{student.age}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Descripción:</span>
          <span>{student.description}</span>
        </div>
      </div>

      <div className="courses-title">Cursos matriculados</div>
      {courses.length === 0 ? (
        <p className="empty">No tiene cursos matriculados.</p>
      ) : (
        <ul className="course-list">
          {courses.map(course => (
            <li key={course.id} className="course-item">
              <span>{course.name}</span>
              <span className="course-credits">{course.credits} créditos</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
