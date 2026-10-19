import axios from 'axios';
import type { Student, Course, CreateStudentDto } from './types';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const getStudents = () =>
  api.get<Student[]>('/student').then(r => r.data);

export const getStudent = (id: number) =>
  api.get<Student>(`/student/${id}`).then(r => r.data);

export const createStudent = (data: CreateStudentDto) =>
  api.post<Student>('/student', data).then(r => r.data);

export const deleteStudent = (id: number) =>
  api.delete(`/student/${id}`);

export const getStudentCourses = (id: number) =>
  api.get<Course[]>(`/student/${id}/courses`).then(r => r.data);

export const getCourses = () =>
  api.get<Course[]>('/course').then(r => r.data);
