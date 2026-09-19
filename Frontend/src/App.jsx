import { BrowserRouter } from 'react-router-dom';
import ProjectRoutes from './Route.jsx';
import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
      <ProjectRoutes />
    </BrowserRouter>

    </div>
  );
}

export default App;