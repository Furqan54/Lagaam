import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { thumb } from '../data/data.js';

/**
 * Home hero: a rotating ring of real video thumbnails around a glowing wireframe knot.
 * Mouse = parallax and hover, scroll = extra spin, click = open that video.
 * `items` must be a stable array (module constant or memoised) or the scene restarts.
 */
export default function HeroScene({ items, onPick }) {
  const canvasRef = useRef(null);
  const tipRef = useRef(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  useEffect(() => {
    const canvas = canvasRef.current;
    const tip = tipRef.current;
    const hero = canvas.parentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (err) {
      console.warn('3D hero disabled (no WebGL):', err);
      return undefined; // the page still works without the scene
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0d, 0.045);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 1.4, 11.5);

    const world = new THREE.Group(); // shifted right on wide screens so the text has room
    scene.add(world);

    /* ---- Thumbnail ring ---- */
    const ring = new THREE.Group();
    world.add(ring);

    const W = 3.2, H = 1.8, R = 4.1;
    const planeGeo = new THREE.PlaneGeometry(W, H);
    const frameGeo = new THREE.PlaneGeometry(W + 0.14, H + 0.14);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    let disposed = false;
    const textures = [];
    const materials = [];
    const meshes = [];

    items.forEach((item, i) => {
      const a = (i / items.length) * Math.PI * 2;
      const pivot = new THREE.Group();
      pivot.position.set(Math.sin(a) * R, Math.sin(i * 1.9) * 0.35, Math.cos(a) * R);
      pivot.rotation.y = a;

      const mat = new THREE.MeshBasicMaterial({ color: 0x23232b, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(planeGeo, mat);
      const frameMat = new THREE.MeshBasicMaterial({ color: 0xe5301f, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.z = -0.02;
      pivot.add(frame, mesh);
      ring.add(pivot);

      mesh.userData = { item, pivot, frameMat };
      meshes.push(mesh);
      materials.push(mat, frameMat);

      loader.load(
        thumb(item.id),
        (tex) => {
          if (disposed) { tex.dispose(); return; }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          textures.push(tex);
          mat.map = tex;
          mat.color.set(0xffffff);
          mat.needsUpdate = true;
        },
        undefined,
        () => { /* keep the dark placeholder if a thumbnail fails to load */ }
      );
    });

    /* ---- Centre knot and glow ---- */
    const knotGeo = new THREE.TorusKnotGeometry(1.15, 0.34, 180, 24);
    const knot = new THREE.Mesh(knotGeo, new THREE.MeshBasicMaterial({ color: 0xe5301f, wireframe: true, transparent: true, opacity: 0.55 }));
    const coreGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const core = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0xff7a1a, wireframe: true }));
    world.add(knot, core);

    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 128;
    const g = glowCanvas.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,122,26,.85)');
    grad.addColorStop(0.35, 'rgba(229,48,31,.32)');
    grad.addColorStop(1, 'rgba(229,48,31,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.scale.setScalar(8);
    world.add(glow);

    /* ---- Input ---- */
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const mouse = { x: 0, y: 0 };
    let hovered = null;

    const pickAt = (e) => {
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(meshes, false)[0];
      return hit ? hit.object : null;
    };

    const onWindowMove = (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onCanvasMove = (e) => {
      hovered = pickAt(e);
      canvas.style.cursor = hovered ? 'pointer' : 'default';
      if (hovered) {
        const r = hero.getBoundingClientRect();
        tip.textContent = hovered.userData.item.title;
        tip.style.left = `${e.clientX - r.left}px`;
        tip.style.top = `${e.clientY - r.top}px`;
      }
      tip.classList.toggle('show', !!hovered);
    };
    const onCanvasLeave = () => { hovered = null; tip.classList.remove('show'); };
    const onCanvasClick = (e) => {
      const hit = pickAt(e);
      if (hit) pickRef.current?.(hit.userData.item);
    };
    window.addEventListener('pointermove', onWindowMove, { passive: true });
    canvas.addEventListener('pointermove', onCanvasMove);
    canvas.addEventListener('pointerleave', onCanvasLeave);
    canvas.addEventListener('click', onCanvasClick);

    /* ---- Resize ---- */
    const resize = () => {
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const wide = camera.aspect > 1.15;
      world.position.set(wide ? Math.min(6.7, camera.aspect * 3.8) : 0, wide ? 0.4 : 1.8, 0);
      world.scale.setScalar(wide ? 1 : 0.72);
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    resize();

    /* ---- Loop (paused while the hero is off-screen) ---- */
    let last = performance.now();
    let t = 0;
    let spin = 0;
    let speed = reduced ? 0 : 0.14;

    const frame = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      const targetSpeed = reduced ? 0 : hovered ? 0.015 : 0.14;
      speed += (targetSpeed - speed) * Math.min(dt * 3, 1);
      spin += dt * speed;
      const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);

      ring.rotation.y = spin + scroll * 1.1 + mouse.x * 0.28;
      world.rotation.x += ((mouse.y * 0.07 + scroll * 0.1) - world.rotation.x) * Math.min(dt * 3, 1);
      camera.position.x += (mouse.x * 0.9 - camera.position.x) * Math.min(dt * 2, 1);
      camera.position.y += (1.4 - mouse.y * 0.5 - camera.position.y) * Math.min(dt * 2, 1);
      camera.lookAt(world.position.x * 0.2, 0, 0);

      knot.rotation.x = t * 0.25;
      knot.rotation.y = t * 0.35;
      core.rotation.y = -t * 0.6;
      core.rotation.x = t * 0.4;
      glow.material.opacity = 0.8 + Math.sin(t * 1.6) * 0.2;

      meshes.forEach((m) => {
        const on = m === hovered;
        const s = m.userData.pivot.scale.x;
        m.userData.pivot.scale.setScalar(s + ((on ? 1.14 : 1) - s) * Math.min(dt * 8, 1));
        m.userData.frameMat.color.setHex(on ? 0xff7a1a : 0xe5301f);
      });

      renderer.render(scene, camera);
    };

    const start = () => { last = performance.now(); renderer.setAnimationLoop(frame); };
    const stop = () => renderer.setAnimationLoop(null);
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(hero);
    start();

    return () => {
      disposed = true;
      stop();
      visibility.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onWindowMove);
      canvas.removeEventListener('pointermove', onCanvasMove);
      canvas.removeEventListener('pointerleave', onCanvasLeave);
      canvas.removeEventListener('click', onCanvasClick);
      planeGeo.dispose();
      frameGeo.dispose();
      knotGeo.dispose();
      coreGeo.dispose();
      glowTex.dispose();
      glow.material.dispose();
      knot.material.dispose();
      core.material.dispose();
      materials.forEach((m) => m.dispose());
      textures.forEach((tx) => tx.dispose());
      renderer.dispose();
    };
  }, [items]);

  return (
    <>
      <canvas ref={canvasRef} id="heroCanvas" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-tip" ref={tipRef} aria-hidden="true" />
    </>
  );
}
