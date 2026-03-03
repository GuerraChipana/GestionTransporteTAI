import AppRouter from './routes/AppRouter';
import { Toaster } from 'sonner';

export default function App() {
    return (
        <>
            {/* Tus rutas principales */}
            <AppRouter />

            {/* 2. Colocas el Toaster de manera global */}
            <Toaster position="top-right" richColors closeButton />
        </>
    );
}