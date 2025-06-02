import {BrowserRouter, Route, Routes} from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';

import './App.css';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App min-vh-100 d-flex flex-column">
      <main className="flex-grow-1">
        <BrowserRouter>
          <AuthProvider>
            <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<h1>НЕ НАЙДЕНО!</h1>} />
              </Routes>
          </AuthProvider>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
