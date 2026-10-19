# Lab Semana 11 — Frontend React con TypeScript

**Curso:** Desarrollo Basado en Plataformas (CS2031) — UTEC, Ciclo 2026-2  
**Profesor:** Javier Olivares

---

## Objetivo

Implementar el frontend en React + TypeScript de una aplicación CRUD de estudiantes que se conecta a la API REST de Spring Boot ya provista. Al terminar el lab, la aplicación permitirá:

- Listar todos los estudiantes registrados.
- Ver el detalle de un estudiante (campos completos + cursos matriculados).
- Crear un nuevo estudiante mediante un formulario con validación.
- Eliminar un estudiante de la lista.
- Cambiar entre modo claro y oscuro (tema).

---

## 1. Prerrequisitos

| Requisito | Verificación |
|-----------|-------------|
| Node.js `20.19+` o `22.12+` (requerido por Vite 8) | `node -v` |
| npm 9 o superior | `npm -v` |
| JDK 26 (para levantar el backend) | `java -version` |

---

## 2. Conectar el backend y el frontend

Este lab usa **dos repositorios separados**: el backend (Spring Boot, ya implementado) y este frontend (React, por implementar). Antes de tocar código, practica levantar ambos y comprueba que se comunican correctamente — esa conexión es, en sí misma, parte del objetivo del lab.

### 2.1 Levanta el backend primero

En una terminal aparte:

```bash
git clone https://github.com/CS2031-DBP/cs2031-2026-2-week11-backend.git
cd cs2031-2026-2-week11-backend
./mvnw spring-boot:run
```

Espera a ver `Started LabWeek11BackendApplication` en la consola. El servidor queda en `http://localhost:8080`. **Deja esa terminal abierta** — el backend debe seguir corriendo mientras trabajas en el frontend.

**Verifica que responde** antes de seguir, abriendo en el navegador (o con `curl`):

```
http://localhost:8080/student
```

Deberías ver un JSON con 3 estudiantes (Ana, Carlos, Lucía). Si no carga nada, el backend no está corriendo — revisa esa terminal.

### 2.2 Configura y levanta el frontend

En otra terminal:

```bash
cd cs2031-2026-2-week11-lab
npm install

# Crea el archivo .env.local en la raíz con:
echo "VITE_API_URL=http://localhost:8080" > .env.local

npm run dev
```

La app queda en **http://localhost:5173**.

> `.env.local` no está en el repo (está en `.gitignore`); créalo tú. Si cambias esta variable, reinicia `npm run dev` — Vite no recarga `.env*` en caliente.

### 2.3 Verifica la conexión

Con ambos corriendo, abre `http://localhost:5173`. Como los componentes de este repo todavía tienen `// TODO` sin resolver, la UI no mostrará la lista de estudiantes todavía — eso es normal. Para confirmar que la conexión en sí funciona (independientemente de tu código), abre las DevTools (`F12`) → pestaña **Network** y revisa:

- Hay una petición a `http://localhost:8080/student` (la dispara `useStudents.ts`, que ya está implementado y corre apenas monta la página).
- Su respuesta trae el JSON de los 3 estudiantes.
- No hay errores en la pestaña **Console** (en particular, nada de CORS).

Si esa petición sale con status `200` y el JSON correcto, backend y frontend ya están conectados — el resto del lab es completar los componentes para que esos datos se vean en pantalla.

### 2.4 Problemas comunes

| Síntoma | Causa probable |
|---|---|
| `ERR_CONNECTION_REFUSED` en Network | El backend no está corriendo, o escucha en otro puerto. |
| Error de CORS en consola | Verifica que accedes al frontend por `http://localhost:5173` (no `127.0.0.1:5173`); el backend ya trae `CorsConfig` permitiendo cualquier origen. |
| La request sale a `undefined/student` | Falta `.env.local`, o la variable no se llama exactamente `VITE_API_URL`. |
| Cambiaste `.env.local` y no pasa nada | Reinicia `npm run dev` (`Ctrl+C` y vuelve a correrlo). |

---

## 3. Estructura del proyecto

```
src/
├── types.ts                        # Interfaces TypeScript
├── api.ts                          # Funciones de acceso a la API (axios)
├── App.tsx                         # Componente raiz — YA IMPLEMENTADO
├── main.tsx                        # Punto de entrada — YA IMPLEMENTADO
├── context/
│   └── ThemeContext.tsx            # Contexto de tema — YA IMPLEMENTADO
├── hooks/
│   └── useStudents.ts              # Hook de estado global de estudiantes — YA IMPLEMENTADO
├── components/
│   ├── ThemeToggle.tsx             # Boton de cambio de tema — POR IMPLEMENTAR (Tarea 1)
│   ├── StudentList.tsx             # Lista de estudiantes — POR IMPLEMENTAR (Tarea 2)
│   ├── StudentDetail.tsx           # Detalle de estudiante — POR IMPLEMENTAR (Tarea 3)
│   └── StudentForm.tsx             # Formulario de creacion — POR IMPLEMENTAR (Tarea 4)
└── pages/
    └── StudentsPage.tsx            # Pagina principal — POR IMPLEMENTAR (Tarea 5)
```

### Descripcion de cada archivo

#### `src/types.ts` — Ya implementado, no modificar

Define las interfaces TypeScript que se usan en todo el proyecto:

- **`Student`** — representa un estudiante: `id`, `firstname`, `lastname`, `email`, `phone`, `age`, `description`.
- **`Course`** — representa un curso: `id`, `name`, `description`, `credits`.
- **`CreateStudentDto`** — datos necesarios para crear un estudiante (incluye `password`, a diferencia de `Student`).

#### `src/api.ts` — Ya implementado, no modificar

Crea una instancia de axios apuntando a `VITE_API_URL` y exporta las siguientes funciones:

| Funcion | Descripcion |
|---------|-------------|
| `getStudents()` | Obtiene la lista completa de estudiantes (`GET /student`) |
| `getStudent(id)` | Obtiene un estudiante por su ID (`GET /student/:id`) |
| `createStudent(data)` | Crea un nuevo estudiante (`POST /student`) |
| `deleteStudent(id)` | Elimina un estudiante (`DELETE /student/:id`) |
| `getStudentCourses(id)` | Obtiene los cursos de un estudiante (`GET /student/:id/courses`) |
| `getCourses()` | Obtiene todos los cursos disponibles (`GET /course`) |

#### `src/context/ThemeContext.tsx` — Ya implementado, no modificar

Provee el contexto de tema con:

- **`ThemeProvider`** — componente que envuelve la aplicacion y gestiona el estado `'light' | 'dark'`. Aplica el atributo `data-theme` al elemento `<html>` para activar los estilos CSS.
- **`useTheme()`** — hook que retorna `{ theme, toggleTheme }`. Lanza un error si se usa fuera del `ThemeProvider`.

#### `src/hooks/useStudents.ts` — Ya implementado, no modificar

Hook que centraliza el estado de la lista de estudiantes. Retorna:

| Valor | Tipo | Descripcion |
|-------|------|-------------|
| `students` | `Student[]` | Lista actual de estudiantes |
| `loading` | `boolean` | `true` mientras se realiza la carga inicial |
| `error` | `string \| null` | Mensaje de error si la carga fallo |
| `removeStudent(id)` | `async (id: number) => void` | Llama a la API para eliminar y actualiza el estado local |
| `pushStudent(student)` | `(student: Student) => void` | Agrega un estudiante al final de la lista sin llamar a la API |

#### `src/App.tsx` — Ya implementado, no modificar

Envuelve toda la aplicacion con `ThemeProvider` y renderiza `StudentsPage`.

#### `src/main.tsx` — Ya implementado, no modificar

Punto de entrada de Vite que monta `<App />` en `StrictMode` sobre el elemento `#root`.

---

## 4. Tareas del lab

Los archivos marcados como **POR IMPLEMENTAR** contienen comentarios `// TODO` que guian lo que debes escribir. A continuacion se describen los criterios de aceptacion de cada tarea.

---

### Tarea 1 — `ThemeToggle` (`src/components/ThemeToggle.tsx`)

Implementa el boton que cambia el tema de la aplicacion.

**Criterios de aceptacion:**

- Usa `useTheme()` para obtener `theme` y `toggleTheme` del contexto.
- Renderiza un `<button>` que:
  - Muestra el texto `"🌙 Dark"` cuando el tema actual es `'light'`.
  - Muestra el texto `"☀️ Light"` cuando el tema actual es `'dark'`.
- Al hacer clic, llama a `toggleTheme()`.

**Ejemplo de resultado esperado:**

```tsx
// Cuando theme === 'light'  →  <button>🌙 Dark</button>
// Cuando theme === 'dark'   →  <button>☀️ Light</button>
```

---

### Tarea 2 — `StudentList` (`src/components/StudentList.tsx`)

Implementa la lista de estudiantes con soporte para seleccion y eliminacion.

**Props disponibles:**

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `students` | `Student[]` | Lista de estudiantes a mostrar |
| `selectedId` | `number \| null` | ID del estudiante actualmente seleccionado |
| `onSelect` | `(id: number) => void` | Callback al seleccionar un estudiante |
| `onDelete` | `(id: number) => void` | Callback al eliminar un estudiante |

**Criterios de aceptacion:**

- Si `students` esta vacio, muestra el mensaje: `"No hay estudiantes registrados."`
- Si hay estudiantes, renderiza una `<ul>` con un `<li>` por cada uno.
- Cada `<li>` debe:
  - Anadir la clase CSS `selected` si `student.id === selectedId`.
  - Mostrar el nombre completo del estudiante.
  - Tener un boton que llame a `onSelect(student.id)` al hacer clic.
  - Tener un boton que llame a `onDelete(student.id)` al hacer clic.

---

### Tarea 3 — `StudentDetail` (`src/components/StudentDetail.tsx`)

Implementa el panel de detalle de un estudiante seleccionado.

**Props disponibles:**

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `studentId` | `number \| null` | ID del estudiante a mostrar, o `null` si no hay ninguno seleccionado |

**Criterios de aceptacion:**

- Si `studentId` es `null`, muestra el mensaje: `"Selecciona un estudiante"`.
- Si `studentId` tiene valor, usa `Promise.all` para realizar en paralelo:
  - `getStudent(studentId)` — datos del estudiante.
  - `getStudentCourses(studentId)` — cursos en los que esta matriculado.
- Mientras se cargan los datos, muestra `"Cargando..."`.
- Si ocurre un error, muestra el mensaje de error.
- Si la carga es exitosa, muestra:
  - Todos los campos del estudiante: nombre completo, email, telefono, edad, descripcion.
  - La lista de cursos matriculados con el nombre y los creditos de cada uno.

**Importante — patron de cleanup en `useEffect`:**

El `useEffect` debe retornar una funcion de cleanup que evite actualizaciones de estado en componentes desmontados. Usa una variable booleana `cancelled` para ello:

```tsx
useEffect(() => {
  let cancelled = false;

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

  return () => { cancelled = true; };
}, [studentId]);
```

---

### Tarea 4 — `StudentForm` (`src/components/StudentForm.tsx`)

Implementa el formulario controlado para crear un nuevo estudiante.

**Props disponibles:**

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `onCreated` | `(student: Student) => void` | Callback que se llama con el estudiante creado |

**El estado inicial del formulario (`emptyForm`) ya esta definido** con todos los campos en blanco / cero — no es necesario modificarlo.

**Criterios de aceptacion:**

- Renderiza inputs controlados (usando el estado `form`) para los 7 campos: `firstname`, `lastname`, `email`, `phone`, `age` (tipo `number`), `description` (puede ser `<textarea>`), `password`.
- El handler `handleChange` ya esta implementado — usalo en el atributo `onChange` de cada input.
- En `handleSubmit`, antes de llamar a la API:
  - Valida que ningun campo de texto este vacio.
  - Valida que `age >= 1`.
  - Si la validacion falla, muestra un mensaje descriptivo en el estado `error` y no continues.
- Si la validacion pasa:
  - Llama a `createStudent(form)`.
  - Si tiene exito: llama a `onCreated(student)` y resetea el formulario a `emptyForm`.
  - Si falla: muestra el error de la API en el estado `error`.
- Usa el estado `submitting` para deshabilitar el boton de envio mientras se procesa la peticion.
- Muestra el mensaje de error (`error`) cuando no sea `null`.

---

### Tarea 5 — `StudentsPage` (`src/pages/StudentsPage.tsx`)

Implementa la pagina principal que integra todos los componentes anteriores.

**El estado y el hook ya estan inicializados** en el archivo:

```tsx
const [selectedId, setSelectedId] = useState<number | null>(null);
const { students, loading, error, removeStudent, pushStudent } = useStudents();
```

**Criterios de aceptacion:**

**`handleDelete(id: number)`:**
- Llama a `removeStudent(id)` para eliminar el estudiante en la API y actualizar la lista.
- Si el estudiante eliminado era el actualmente seleccionado, limpia `selectedId` (ponlo en `null`).
- Maneja errores con `try/catch` (puedes mostrarlos en consola o en un estado de error).

**`handleCreated(student: Student)`:**
- Llama a `pushStudent(student)` para agregar el nuevo estudiante a la lista local.
- Selecciona automaticamente el nuevo estudiante llamando a `setSelectedId(student.id)`.

**Layout:**
- Si `loading` es `true`, muestra un indicador de carga (por ejemplo, `"Cargando estudiantes..."`).
- Si `error` no es `null`, muestra el error.
- El `<header>` con `<ThemeToggle />` ya esta renderizado — no lo elimines.
- Agrega el resto del layout con:
  - `<StudentList>` con los props: `students`, `selectedId`, `onSelect={setSelectedId}`, `onDelete={handleDelete}`.
  - `<StudentDetail>` con el prop `studentId={selectedId}`.
  - `<StudentForm>` con el prop `onCreated={handleCreated}`.

---

## 5. Recursos utiles

- [Documentacion oficial de React — Hooks](https://react.dev/reference/react)
- [React `useEffect`](https://react.dev/reference/react/useEffect)
- [Formularios controlados en React](https://react.dev/learn/sharing-state-between-components)
- [Manual de TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Documentacion de Axios](https://axios-http.com/docs/intro)
- [README del backend](../cs2031-2026-2-week11-backend/README.md) — instrucciones para levantar la API Spring Boot
