export interface Student {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  age: number;
  description: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  credits: number;
}

export interface CreateStudentDto {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  age: number;
  description: string;
  password: string;
}
