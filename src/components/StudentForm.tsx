import { useState } from 'react';
import type { Student, CreateStudentDto } from '../types';
import { createStudent } from '../api';

interface Props {
  onCreated: (student: Student) => void;
}

const emptyForm: CreateStudentDto = {
  firstname: '', lastname: '', email: '',
  phone: '', age: 0, description: '', password: ''
};

export function StudentForm({ onCreated }: Props) {
  const [form, setForm] = useState<CreateStudentDto>(emptyForm);
  const [error, setError] = useState<string | null>(null); // para errores de validación y de API
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'age' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Valida que todos los campos estén completos (age debe ser >= 1).
    //       Muestra un error si falta alguno.
    // TODO: Llama createStudent(form) para crear el estudiante en el backend.
    // TODO: Si tiene éxito, llama onCreated(student) y resetea el formulario a emptyForm.
    // TODO: Si falla, muestra un mensaje de error.
    // TODO: Usa el estado `submitting` para deshabilitar el botón mientras se procesa.
  };

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      {/* TODO: Renderiza inputs controlados para: firstname, lastname, email,
               phone, age, description (textarea), password */}
      {/* TODO: Muestra el mensaje de error si existe */}
      {/* TODO: Botón submit deshabilitado mientras submitting sea true */}
      <button type="submit" disabled={submitting}>Crear Estudiante</button>
    </form>
  );
}
