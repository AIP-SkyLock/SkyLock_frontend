'use client';

import { ThemeProvider } from '@/contexts/theme-provider';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';
import { queryClient } from './query-context';
import { QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider store={store}>
              {children}
          </ReduxProvider>
        </QueryClientProvider>
      </ThemeProvider>
    // </AuthProvider>
  );
}
