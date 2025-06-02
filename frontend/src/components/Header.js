import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Repozeum (neNexus)</Navbar.Brand>
        <Nav className="ms-auto">
          {isAuthenticated ? (
            <Button variant="outline-light" onClick={handleLogout}>
              Выйти
            </Button>
          ) : (
            <Button variant="outline-light" onClick={handleLogin}>
              Войти
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}