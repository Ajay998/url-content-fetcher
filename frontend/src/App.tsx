import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import UrlInput from './UrlContentFetcher';


function App() {
  return (
    <Router>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start', // allow scroll when content is tall
          minHeight: '100vh',
          backgroundColor: '#f0f0f0',
          paddingTop: '60px',
          paddingBottom: '60px',
        }}
      >
        {/* Navigation */}
        <nav style={{ marginBottom: '20px' }}>
          <Link
            to="/register"
            style={{
              marginRight: '20px',
              textDecoration: 'none',
              color: '#007bff',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            Register
          </Link>
          <Link
            to="/login"
            style={{
              textDecoration: 'none',
              color: '#007bff',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            Login
          </Link>
        </nav>

        {/* Page content container (auto height) */}
        <div>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/url-content-fetcher" element={<UrlInput />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
