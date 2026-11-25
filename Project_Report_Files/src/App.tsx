import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/store/AuthContext';
import { ThemeProvider } from '@/store/ThemeContext';
import { AppRouter } from '@/router';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
