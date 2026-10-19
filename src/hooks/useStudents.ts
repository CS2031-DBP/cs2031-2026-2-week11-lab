import { useState, useEffect } from 'react';
import type { Student } from '../types';
import { getStudents, deleteStudent } from '../api';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudents()
      .then(data => {
        setStudents(data);
        setError(null);
      })
      .catch(() => setError('Error al cargar estudiantes'))
      .finally(() => setLoading(false));
  }, []);

  const removeStudent = async (id: number) => {
    await deleteStudent(id);
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const pushStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  return { students, loading, error, removeStudent, pushStudent };
}
