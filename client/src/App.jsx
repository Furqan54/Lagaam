import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Intro from './components/effects/Intro.jsx';
import Home from './pages/Home.jsx';
import Videos from './pages/Videos.jsx';
import Documentaries from './pages/Documentaries.jsx';
import Podcasts from './pages/Podcasts.jsx';
import Shorts from './pages/Shorts.jsx';
import Watch from './pages/Watch.jsx';
import About from './pages/About.jsx';
import Support from './pages/Support.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
    <Intro />
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="videos" element={<Videos />} />
        <Route path="documentaries" element={<Documentaries />} />
        <Route path="podcasts" element={<Podcasts />} />
        <Route path="shorts" element={<Shorts />} />
        <Route path="watch/:id" element={<Watch />} />
        <Route path="about" element={<About />} />
        <Route path="support" element={<Support />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </>
  );
}
