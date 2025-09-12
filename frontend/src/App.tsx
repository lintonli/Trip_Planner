import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
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
  const [tripData, setTripData] = useState<TripResponse | null>(null);

  const handleTripPlanned = (response: TripResponse) => {
    setTripData(response);
  };

  const handleBackToPlanner = () => {
    setTripData(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ minHeight: '100vh', py: 2 }}>
        {tripData ? (
          <TripResults tripData={tripData} onBack={handleBackToPlanner} />
        ) : (
          <TripPlanner onTripPlanned={handleTripPlanned} />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
