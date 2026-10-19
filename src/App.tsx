import { ThemeProvider } from './context/ThemeContext';
import { StudentsPage } from './pages/StudentsPage';

function App() {
  return (
    <ThemeProvider>
      <StudentsPage />
    </ThemeProvider>
  );
}

export default App;
