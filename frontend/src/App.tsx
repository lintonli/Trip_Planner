import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import TripPlanner from './components/TripPlanner';
import TripResults from './components/TripResults';
import type { TripResponse } from './utils/types';

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
  const [tripData, setTripData] = useState<TripResponse | null>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('tripData');
    return saved ? JSON.parse(saved) : null;
  });

  // Save to localStorage whenever tripData changes
  useEffect(() => {
    if (tripData) {
      localStorage.setItem('tripData', JSON.stringify(tripData));
    } else {
      localStorage.removeItem('tripData');
    }
  }, [tripData]);

  const handleTripPlanned = (response: TripResponse) => {
    setTripData(response);
  };

  const handleBackToPlanner = () => {
    setTripData(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', width: '100%' }}>
        {tripData ? (
          <TripResults tripData={tripData} onBack={handleBackToPlanner} />
        ) : (
          <TripPlanner onTripPlanned={handleTripPlanned} />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
