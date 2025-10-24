import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './font.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {ErrorBoundary} from 'react-error-boundary'
import Notfound from './pages/NotFound.tsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
        },
    },
});
createRoot(document.getElementById('root')!).render(
    <ErrorBoundary fallback={<Notfound />} onReset={() => {
        window.location.replace("/")
    }}>
        <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </QueryClientProvider>
    </ErrorBoundary>
);
