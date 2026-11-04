import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The demo used port 5173; the React app uses 5174 so both can run side by side.
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, strictPort: true },
});
