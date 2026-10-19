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

    if (!form.firstname || !form.lastname || !form.email || !form.phone || !form.description || !form.password) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (form.age < 1) {
      setError('La edad debe ser mayor o igual a 1.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const student = await createStudent(form);
      onCreated(student);
      setForm(emptyForm);
    } catch {
      setError('Error al crear el estudiante.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="student-form form-section card" onSubmit={handleSubmit} noValidate>
      <div className="form-title">Crear Estudiante</div>

      <div className="form-group">
        <label htmlFor="firstname">Nombre</label>
        <input id="firstname" name="firstname" value={form.firstname} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="lastname">Apellido</label>
        <input id="lastname" name="lastname" value={form.lastname} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Teléfono</label>
        <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="age">Edad</label>
        <input id="age" name="age" type="number" value={form.age} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea id="description" name="description" value={form.description} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={submitting}>Crear Estudiante</button>
    </form>
  );
}
