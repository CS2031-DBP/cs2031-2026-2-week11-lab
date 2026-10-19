import type { Student } from '../types';

interface Props {
  students: Student[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export function StudentList({ students, selectedId, onSelect, onDelete }: Props) {
  // TODO: Si no hay estudiantes, muestra un mensaje "No hay estudiantes registrados."

  // TODO: Renderiza una <ul> con un <li> por cada estudiante.
  //       Cada item debe:
  //       - Resaltar si su id === selectedId (añade clase CSS 'selected')
  //       - Tener un botón para seleccionar el estudiante (llama onSelect)
  //       - Tener un botón para eliminar el estudiante (llama onDelete)
  return (
    <ul>
      {/* TODO: mapea students para renderizar un <li> por cada estudiante */}
    </ul>
  );
}
