import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './font.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary'
import { lazy } from 'react';
const ErrorFallback = lazy(() => import("@/pages/ErrorFallback.tsx"));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
        },
    },
});
createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <BrowserRouter>
            <ErrorBoundary fallback={<ErrorFallback />} onReset={() => {
                window.location.replace("/")
            }}>
                <App />
            </ErrorBoundary>
        </BrowserRouter>
    </QueryClientProvider>
);
