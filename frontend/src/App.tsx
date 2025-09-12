import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TripPlanner from './components/TripPlanner';
import TripResults from './components/TripResults';
import './styles/custom.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <Routes>
            <Route path="/" element={<TripPlanner />} />
            <Route path="/results/:tripId" element={<TripResults />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
