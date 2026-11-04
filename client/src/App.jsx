import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Videos from './pages/Videos.jsx';
import Documentaries from './pages/Documentaries.jsx';
import Podcasts from './pages/Podcasts.jsx';
import Shorts from './pages/Shorts.jsx';
import Watch from './pages/Watch.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="videos" element={<Videos />} />
        <Route path="documentaries" element={<Documentaries />} />
        <Route path="podcasts" element={<Podcasts />} />
        <Route path="shorts" element={<Shorts />} />
        <Route path="watch/:id" element={<Watch />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
