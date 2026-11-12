import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The HTML demo used port 5173; the React app uses 5180 so both can run side by side
// (5174 is often taken by other Vite projects).
export default defineConfig({
  plugins: [react()],
  server: { port: 5180, strictPort: true },
});
