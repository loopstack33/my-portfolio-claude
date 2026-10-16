import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  GitBranch,
  Link,
  Mail,
  Globe2,
  Menu,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------------ */
/*  Design tokens                                                           */
/* ------------------------------------------------------------------------ */

const COLORS = {
  bg: "#08090D",
  bgPanel: "#0F1119",
  bgPanelSoft: "#12141D",
  border: "rgba(237,238,243,0.09)",
  borderStrong: "rgba(237,238,243,0.16)",
  text: "#EDEEF3",
  muted: "#878C9C",
  mutedSoft: "#5C6070",
  accent: "#4E7CFF",
  accentSoft: "rgba(78,124,255,0.14)",
  accent2: "#7C6CFF",
};

const FONT_DISPLAY = "'Space Grotesk', 'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "'Plus Jakarta Sans', -apple-system, sans-serif";

/* ------------------------------------------------------------------------ */
/*  Data                                                                    */
/* ------------------------------------------------------------------------ */

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const STATS = [
  { value: 20, suffix: "+", label: "Projects shipped" },
  { value: 6, suffix: "", label: "Years building software" },
  { value: 100, suffix: "%", label: "Flutter-first mindset" },
  { value: 8, suffix: "+", label: "APIs designed & shipped" },
];

const SKILLS = [
  { name: "Flutter", group: "Mobile" },
  { name: "Dart", group: "Mobile" },
  { name: "iOS", group: "Mobile" },
  { name: "Android", group: "Mobile" },
  { name: "GetX", group: "Mobile" },
  { name: "Xcode", group: "Mobile" },
  { name: "Firebase", group: "Backend" },
  { name: "Node.js", group: "Backend" },
  { name: "FastAPI", group: "Backend" },
  { name: "PostgreSQL", group: "Backend" },
  { name: "Supabase", group: "Backend" },
  { name: "REST APIs", group: "Backend" },
  { name: "Google Maps", group: "Tools" },
  { name: "Git", group: "Tools" },
];

const PROJECTS = [
  {
    name: "myUTS",
    category: "Fleet & Logistics",
    description: "Vehicle tracking and task management application for coordinating field teams in real time.",
    detail: "myUTS gives dispatch teams a live view of every vehicle in the field. Background location tracking keeps positions current even when the app is minimized, while a task layer lets managers assign, reorder and close out jobs without leaving the map.",
    tech: ["Flutter", "Maps", "GPS", "Background Tracking", "APIs"],
    accent: "#4E7CFF",
  },
  {
    name: "myUIC",
    category: "Insurance",
    description: "Policy management application built for a regional insurance provider and its agents.",
    detail: "myUIC handles policy lookups, claims initiation and secure document exchange for an insurance provider's mobile-first customers. Authentication and data access were built around strict role separation between agents and policyholders.",
    tech: ["Flutter", "REST APIs", "Firebase", "Authentication"],
    accent: "#7C6CFF",
  },
  {
    name: "mySGI",
    category: "Business Operations",
    description: "Internal business application connecting field staff to a central operations backend.",
    detail: "mySGI streamlines day-to-day operations for a distributed workforce, syncing structured data between mobile clients and a central service so nothing gets lost between the field and the office.",
    tech: ["Flutter", "API Integration", "Backend"],
    accent: "#4E7CFF",
  },
  {
    name: "BlazeBite POS",
    category: "Retail / POS",
    description: "Point-of-sale system built for the pace of a fast-food kitchen.",
    detail: "BlazeBite POS was designed around speed at the counter: order entry, kitchen routing and end-of-day reconciliation all run through one interface tuned for high-volume, low-latency use.",
    tech: ["Flutter", "Backend", "Database", "POS"],
    accent: "#7C6CFF",
  },
  {
    name: "Hungry Spot",
    category: "Food Delivery",
    description: "Food ordering application connecting local restaurants with nearby customers.",
    detail: "Hungry Spot lets customers browse local menus, track orders on a live map and check out through a secure, authenticated flow — built to feel fast on mid-range devices.",
    tech: ["Flutter", "REST APIs", "Maps", "Authentication"],
    accent: "#4E7CFF",
  },
  {
    name: "United Labs",
    category: "Healthcare",
    description: "Mobile application built for a diagnostics and lab-results provider.",
    detail: "United Labs gives patients a straightforward way to book tests and view results the moment they're ready, backed by a Firebase layer handling auth and real-time status updates.",
    tech: ["Flutter", "APIs", "Firebase"],
    accent: "#7C6CFF",
  },
];

const TIMELINE = [
  { year: "2023", title: "Started Flutter Development", desc: "Began building production Flutter apps after several years of native mobile work, drawn to the speed of a single codebase." },
  { year: "2024", title: "Flutter & API Development", desc: "Took ownership of end-to-end delivery — designing REST APIs alongside the mobile clients that consume them." },
  { year: "2025", title: "Mobile Application Development", desc: "Shipped a run of production apps across logistics, insurance and food delivery, each with its own backend." },
  { year: "2026", title: "Full-Stack / Flutter Development", desc: "Now working across the full stack — Flutter front ends, FastAPI and Node services, and the databases behind them." },
];

const PRINCIPLES = [
  { n: "01", title: "Understand", desc: "Understand the problem before writing a single line of code. Most bad software starts with a skipped conversation." },
  { n: "02", title: "Design", desc: "Build interfaces that are intuitive and purposeful, with no screen left unconsidered." },
  { n: "03", title: "Develop", desc: "Write scalable, maintainable and production-ready code that the next developer can actually read." },
  { n: "04", title: "Refine", desc: "Test, optimize and continuously improve, because shipping is the start of the work, not the end." },
];

const TECH_MARQUEE = ["Flutter", "Dart", "Firebase", "Node.js", "FastAPI", "PostgreSQL", "Supabase", "REST API", "Google Maps", "Git", "iOS", "Android"];

/* ------------------------------------------------------------------------ */
/*  Utility hooks                                                           */
/* ------------------------------------------------------------------------ */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setReduced(e.matches);
    };

    mq.addEventListener("change", handler);

    return () => {
      mq.removeEventListener("change", handler);
    };
  }, []);

  return reduced;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  return isTouch;
}

/* ------------------------------------------------------------------------ */
/*  Global style injection (fonts + fine-grained CSS the utility set can't  */
/*  express)                                                                 */
/* ------------------------------------------------------------------------ */

function GlobalStyles() {
useEffect(() => {
  const link = document.createElement("link");

  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap";

  document.head.appendChild(link);

  return () => {
    document.head.removeChild(link);
  };
}, []);

  return (
    <style>{`
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; background: ${COLORS.bg}; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(28px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; } to { opacity: 1; }
      }
      @keyframes revealMask {
        from { clip-path: inset(0 0 100% 0); }
        to { clip-path: inset(0 0 0% 0); }
      }
      @keyframes floatSlow {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes pulseGlow {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
      @keyframes spinSlow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes growLine {
        from { height: 0%; } to { height: 100%; }
      }
      @keyframes marqueeReverse {
        from { transform: translateX(-50%); }
        to { transform: translateX(0); }
      }
      @keyframes bgDrift {
        0%, 100% { background-position: 50% 18%, 0 0; }
        50% { background-position: 56% 26%, 0 0; }
      }
      @keyframes bob {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-7px); }
      }
      @keyframes arrowSlide {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(5px); }
      }

      ::selection { background: ${COLORS.accent}; color: white; }

      .reveal {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
      }
      .reveal.in { opacity: 1; transform: translateY(0); }

      a, button { font-family: ${FONT_BODY}; }

      .noise-overlay {
        position: fixed; inset: 0; pointer-events: none; z-index: 3;
        opacity: 0.035; mix-blend-mode: overlay;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }

      .grid-overlay {
        position: absolute; inset: 0; pointer-events: none;
        background-image:
          linear-gradient(${COLORS.border} 1px, transparent 1px),
          linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px);
        background-size: 64px 64px;
        mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 85%);
      }

      .glass {
        background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012));
        border: 1px solid ${COLORS.border};
        backdrop-filter: blur(20px);
      }

      .btn-primary {
        background: ${COLORS.text};
        color: ${COLORS.bg};
        font-weight: 600;
        transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease;
      }
      .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(78,124,255,0.25); }

      .btn-ghost {
        background: transparent;
        color: ${COLORS.text};
        border: 1px solid ${COLORS.borderStrong};
        transition: border-color 0.35s ease, background 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1);
      }
      .btn-ghost:hover { border-color: ${COLORS.accent}; background: ${COLORS.accentSoft}; transform: translateY(-2px); }

      .nav-link {
        position: relative; color: ${COLORS.muted}; text-decoration: none;
        transition: color 0.3s ease;
      }
      .nav-link::after {
        content: ""; position: absolute; left: 0; bottom: -4px; height: 1px; width: 0;
        background: ${COLORS.accent}; transition: width 0.35s cubic-bezier(0.16,1,0.3,1);
      }
      .nav-link:hover { color: ${COLORS.text}; }
      .nav-link:hover::after { width: 100%; }

      .stat-card, .skill-node, .project-card, .principle-card {
        transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease, box-shadow 0.45s ease;
      }
      .skill-node:hover {
        transform: translateY(-6px);
        border-color: ${COLORS.accent};
        box-shadow: 0 20px 40px -20px rgba(78,124,255,0.35);
      }
      .project-card:hover {
        border-color: ${COLORS.borderStrong};
        box-shadow: 0 30px 60px -30px rgba(0,0,0,0.6);
      }
      .project-card .card-arrow { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
      .project-card:hover .card-arrow { animation: arrowSlide 1.1s ease-in-out infinite; }

      .marquee-track {
        display: flex; width: max-content;
        animation: marquee 32s linear infinite;
      }
      .marquee-wrap:hover .marquee-track { animation-play-state: paused; }

      .skills-marquee-wrap {
        overflow: hidden;
        -webkit-mask-image: linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
        mask-image: linear-gradient(90deg, transparent, black 6%, black 94%, transparent);
      }
      .skills-marquee-track {
        display: flex; width: max-content; gap: 14px;
      }
      .skills-marquee-track.dir-left { animation: marquee 46s linear infinite; }
      .skills-marquee-track.dir-right { animation: marqueeReverse 56s linear infinite; }
      .skills-marquee-wrap:hover .skills-marquee-track { animation-play-state: paused; }
      .skill-node-float { animation: bob 5s ease-in-out infinite; }
      .skill-node-float:hover { animation-play-state: paused; }

      .hero-surface {
        background:
          radial-gradient(ellipse 80% 60% at 50% 20%, #10131d 0%, ${COLORS.bg} 65%);
        background-size: 140% 140%, cover;
        animation: bgDrift 18s ease-in-out infinite;
      }

      .btn-primary .icon-slide, .btn-ghost .icon-slide { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); display: inline-flex; }
      .btn-primary:hover .icon-slide, .btn-ghost:hover .icon-slide { transform: translateX(5px); }

      .scroll-cue-line { transform-origin: top; animation: scrollCue 2s ease-in-out infinite; }
      @keyframes scrollCue {
        0%, 100% { transform: scaleY(1); opacity: 0.5; }
        50% { transform: scaleY(0.55); opacity: 1; }
      }

      .magnetic-btn { transition: transform 0.25s ease; }

      .scrollbar-hide::-webkit-scrollbar { display: none; }

      @media (prefers-reduced-motion: reduce) {
        .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }

      @media (max-width: 860px) {
        .hide-mobile { display: none !important; }
      }
      @media (min-width: 861px) {
        .hide-desktop { display: none !important; }
      }
    `}</style>
  );
}

/* ------------------------------------------------------------------------ */
/*  Custom cursor                                                            */
/* ------------------------------------------------------------------------ */

function CustomCursor() {
  const isTouch = useIsTouch();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [variant, setVariant] = useState("default");
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

 useEffect(() => {
  if (isTouch) return;

  const move = (e: MouseEvent) => {
    pos.current = {
      x: e.clientX,
      y: e.clientY,
    };

    if (dotRef.current) {
      dotRef.current.style.transform =
        `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }

    const target = e.target;

    if (target instanceof Element) {
      if (target.closest("[data-cursor='project']")) {
        setVariant("project");
      } else if (
        target.closest("a, button, [data-cursor='hover']")
      ) {
        setVariant("hover");
      } else {
        setVariant("default");
      }
    }
  };

  window.addEventListener("mousemove", move);

  let raf: number;

  const tick = () => {
    ring.current.x +=
      (pos.current.x - ring.current.x) * 0.18;

    ring.current.y +=
      (pos.current.y - ring.current.y) * 0.18;

    if (ringRef.current) {
      ringRef.current.style.transform =
        `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
    }

    raf = requestAnimationFrame(tick);
  };

  tick();

  return () => {
    window.removeEventListener("mousemove", move);
    cancelAnimationFrame(raf);
  };
}, [isTouch]);

  if (isTouch) return null;

  const ringSize = variant === "project" ? 92 : variant === "hover" ? 56 : 28;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed", top: 0, left: 0, width: 6, height: 6, borderRadius: "50%",
          background: COLORS.accent, zIndex: 9999, pointerEvents: "none",
          boxShadow: `0 0 12px ${COLORS.accent}`,
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed", top: 0, left: 0, width: ringSize, height: ringSize, borderRadius: "50%",
          border: `1px solid ${variant === "default" ? COLORS.borderStrong : COLORS.accent}`,
          background: variant === "project" ? "rgba(78,124,255,0.08)" : "transparent",
          zIndex: 9998, pointerEvents: "none",
          transition: "width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, background 0.3s ease",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {variant === "project" && (
          <span style={{ fontSize: 10, letterSpacing: 1, color: COLORS.text, fontFamily: FONT_BODY, whiteSpace: "nowrap" }}>
            VIEW PROJECT →
          </span>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------------ */
/*  3D Scene (hero background)                                               */
/* ------------------------------------------------------------------------ */

function Scene3D() {
  const mountRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const coreGeo = new THREE.IcosahedronGeometry(1.5, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.accent),
      metalness: 0.9,
      roughness: 0.18,
      flatShading: true,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const wireGeo = new THREE.IcosahedronGeometry(1.72, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(COLORS.accent2),
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    group.add(wire);

    // particles
    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 3.4 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);
    const light1 = new THREE.PointLight(new THREE.Color(COLORS.accent), 12, 20);
    light1.position.set(3, 2, 4);
    scene.add(light1);
    const light2 = new THREE.PointLight(new THREE.Color(COLORS.accent2), 8, 20);
    light2.position.set(-3, -2, 3);
    scene.add(light2);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let scrollY = window.scrollY;
    // Tracks whether the canvas is actually on screen. Once the hero has
    // scrolled away we stop scheduling frames entirely so this loop can't
    // compete with the main thread (and cause scroll jank) further down
    // the page, like in the Contact section.
    let isVisible = true;

    const handleMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    // Cheap, passive scroll read — always kept live (not gated on
    // visibility) so the very first frame after scrolling back into
    // view already has the right offset instead of snapping.
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    if (!reducedMotion) {
      window.addEventListener("mousemove", handleMouse);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let raf;
    const clock = new THREE.Clock();

    const renderOnce = () => renderer.render(scene, camera);

    const animate = () => {
      const t = clock.getElapsedTime();
      targetRotY = mouseX * 0.5;
      targetRotX = mouseY * 0.3;

      group.rotation.y += (targetRotY - group.rotation.y) * 0.04 + 0.0022;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.04;
      wire.rotation.y -= 0.0012;
      particles.rotation.y += 0.0006;

      group.position.y = -scrollY * 0.0009;
      group.position.z = Math.min(scrollY * 0.0015, 1.4);
      const s = 1 + Math.sin(t * 0.6) * 0.02;
      group.scale.set(s, s, s);

      renderer.render(scene, camera);
      // Only keep the loop alive while the canvas is actually visible.
      if (isVisible) raf = requestAnimationFrame(animate);
    };

    if (reducedMotion) {
      renderOnce();
    } else {
      animate();
    }

    // Pause on scroll-away, resume on scroll-back — this is the actual
    // fix for the page feeling like it "jumps" or scrolls too fast once
    // you're past the hero: the render loop was previously running for
    // the entire session, even many sections away.
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !reducedMotion) {
          cancelAnimationFrame(raf);
          animate();
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(mount);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(raf);
      } else if (!reducedMotion) {
        visibilityObserver.takeRecords();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(raf);
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [reducedMotion]);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />;
}

/* ------------------------------------------------------------------------ */
/*  Nav                                                                      */
/* ------------------------------------------------------------------------ */

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: scrolled ? "14px 32px" : "26px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled ? "rgba(8,9,13,0.6)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <span
          onClick={() => goTo("home")}
          style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 18, color: COLORS.text, cursor: "pointer", letterSpacing: 0.5 }}
        >
          USTI <span style={{ color: COLORS.accent }}>DEV</span>
        </span>

        <div className="hide-mobile" style={{ display: "flex", gap: 36 }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              className="nav-link"
              style={{ fontSize: 14, fontFamily: FONT_BODY }}
              onClick={(e) => { e.preventDefault(); goTo(item.id); }}
              href={`#${item.id}`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          className="hide-mobile btn-ghost"
          onClick={() => goTo("contact")}
          style={{ padding: "9px 18px", fontSize: 13.5, borderRadius: 4, cursor: "pointer" }}
        >
          Let&rsquo;s talk →
        </button>

        <button
          className="hide-desktop"
          onClick={() => setMenuOpen(true)}
          style={{ background: "none", border: "none", color: COLORS.text, cursor: "pointer" }}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      <div
        style={{
          position: "fixed", inset: 0, zIndex: 200, background: COLORS.bg,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start",
          padding: "0 32px",
          transform: menuOpen ? "translateY(0)" : "translateY(-100%)",
          opacity: menuOpen ? 1 : 0,
          transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <button
          onClick={() => setMenuOpen(false)}
          style={{ position: "absolute", top: 26, right: 28, background: "none", border: "none", color: COLORS.text, cursor: "pointer" }}
          aria-label="Close menu"
        >
          <X size={26} />
        </button>
        {NAV_ITEMS.map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => { e.preventDefault(); goTo(item.id); }}
            style={{
              fontFamily: FONT_DISPLAY, fontSize: 38, color: COLORS.text, textDecoration: "none",
              padding: "12px 0", opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateX(0)" : "translateX(-24px)",
              transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.05 + 0.1}s`,
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------------ */
/*  Hero                                                                     */
/* ------------------------------------------------------------------------ */

function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const step = (base) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${base}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${base}s`,
  });

  return (
    <section
      id="home"
      className="hero-surface"
      style={{
        position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column",
        justifyContent: "center", overflow: "hidden",
      }}
    >
      <div className="grid-overlay" />
      <Scene3D />

      <div style={{ position: "relative", zIndex: 2, padding: "0 32px", maxWidth: 1180, margin: "0 auto", width: "100%" }}>
        <div style={{ ...step(0.05), display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 10px ${COLORS.accent}`, animation: "pulseGlow 2.4s ease-in-out infinite" }} />
          <span style={{ fontSize: 12.5, letterSpacing: 2.2, color: COLORS.muted, fontFamily: FONT_BODY, textTransform: "uppercase" }}>
            Flutter Developer · Mobile Engineer · Full-Stack
          </span>
        </div>

        <h1
          style={{
            ...step(0.16),
            fontFamily: FONT_DISPLAY, fontWeight: 600, color: COLORS.text, margin: 0,
            fontSize: "clamp(3rem, 8vw, 8.6rem)", lineHeight: 1.02, letterSpacing: "-0.02em",
            maxWidth: 980,
          }}
        >
          Building digital
          <br />
          <span style={{ color: COLORS.muted }}>experiences that move.</span>
        </h1>

        <p style={{ ...step(0.3), fontFamily: FONT_BODY, fontSize: "clamp(1rem, 1.6vw, 1.2rem)", color: COLORS.muted, maxWidth: 560, marginTop: 32, lineHeight: 1.6 }}>
          I design and develop high-performance mobile and web applications with Flutter, modern backend technologies, and thoughtful user experiences.
        </p>

        <div style={{ ...step(0.42), display: "flex", gap: 16, marginTop: 44, flexWrap: "wrap" }}>
          <button
            className="btn-primary magnetic-btn"
            onClick={() => scrollTo("projects")}
            style={{ padding: "16px 30px", borderRadius: 4, border: "none", fontSize: 14.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            View my work <span className="icon-slide"><ArrowRight size={16} /></span>
          </button>
          <button
            className="btn-ghost magnetic-btn"
            onClick={() => scrollTo("contact")}
            style={{ padding: "16px 30px", borderRadius: 4, fontSize: 14.5, cursor: "pointer" }}
          >
            Let&rsquo;s work together
          </button>
        </div>
      </div>

      <div
        style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 2,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: loaded ? 0.6 : 0, transition: "opacity 1s ease 1s",
        }}
      >
        <span className="scroll-cue-line" style={{ width: 1, height: 34, background: `linear-gradient(${COLORS.muted}, transparent)`, transform: "translateX(0)" }} />
        <span style={{ fontSize: 10.5, letterSpacing: 1.5, color: COLORS.mutedSoft, fontFamily: FONT_BODY, textTransform: "uppercase" }}>Scroll</span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/*  About                                                                    */
/* ------------------------------------------------------------------------ */

function Counter({ value, suffix, active }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  return (
    <span style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(2.4rem, 4vw, 3.4rem)", color: COLORS.text, fontWeight: 600 }}>
      {display}{suffix}
    </span>
  );
}

function About() {
  const [ref, inView] = useInView(0.3);

  return (
    <section id="about" style={{ padding: "160px 32px", position: "relative" }} ref={ref}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 60 }}>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
            <h2
              className={`reveal ${inView ? "in" : ""}`}
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(2.2rem, 4.4vw, 4rem)", color: COLORS.text, margin: 0, lineHeight: 1.08 }}
            >
              More than
              <br />
              just code.
            </h2>
            <p
              className={`reveal ${inView ? "in" : ""}`}
              style={{ transitionDelay: "0.15s", fontFamily: FONT_BODY, fontSize: "1.08rem", color: COLORS.muted, lineHeight: 1.75, alignSelf: "center", maxWidth: 480 }}
            >
              I&rsquo;m a software developer focused on building reliable, scalable and visually polished digital products. My primary expertise is Flutter application development, while I also work across backend systems, APIs, databases and deployment.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: COLORS.border, border: `1px solid ${COLORS.border}`, marginTop: 40 }}>
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`stat-card reveal ${inView ? "in" : ""}`}
                style={{ transitionDelay: `${0.2 + i * 0.08}s`, background: COLORS.bg, padding: "36px 28px" }}
              >
                <Counter value={s.value} suffix={s.suffix} active={inView} />
                <div style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: COLORS.muted, marginTop: 10 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/*  Skills                                                                   */
/* ------------------------------------------------------------------------ */

function SkillCard({ skill, i }) {
  return (
    <div
      className="skill-node skill-node-float glass"
      data-cursor="hover"
      style={{
        padding: "22px 26px", borderRadius: 4, cursor: "default", flex: "0 0 auto", minWidth: 168,
        animationDelay: `${(i % 6) * 0.4}s`,
        animationDuration: `${4.5 + (i % 4) * 0.5}s`,
      }}
    >
      <div style={{ fontSize: 10.5, letterSpacing: 1.5, color: COLORS.mutedSoft, textTransform: "uppercase", marginBottom: 10, fontFamily: FONT_BODY }}>
        {skill.group}
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, color: COLORS.text, fontWeight: 500, whiteSpace: "nowrap" }}>{skill.name}</div>
    </div>
  );
}

function Skills() {
  const [ref, inView] = useInView(0.15);

  const half = Math.ceil(SKILLS.length / 2);
  const rowA = [...SKILLS.slice(0, half), ...SKILLS.slice(0, half)];
  const rowB = [...SKILLS.slice(half), ...SKILLS.slice(half)];

  return (
    <section id="skills" style={{ padding: "120px 0", background: COLORS.bgPanel, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }} ref={ref}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 56 }}>
          <h2 className={`reveal ${inView ? "in" : ""}`} style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(2rem, 3.6vw, 3rem)", color: COLORS.text, margin: 0 }}>
            Tools of the trade
          </h2>
          <p className={`reveal ${inView ? "in" : ""}`} style={{ transitionDelay: "0.1s", fontFamily: FONT_BODY, color: COLORS.muted, maxWidth: 380, margin: 0 }}>
            The languages, frameworks and services I reach for most, across mobile and backend. Hover to pause.
          </p>
        </div>
      </div>

      <div className={`reveal ${inView ? "in" : ""}`} style={{ transitionDelay: "0.15s", display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="skills-marquee-wrap">
          <div className="skills-marquee-track dir-left">
            {rowA.map((skill, i) => (
              <SkillCard key={`a-${skill.name}-${i}`} skill={skill} i={i} />
            ))}
          </div>
        </div>
        <div className="skills-marquee-wrap">
          <div className="skills-marquee-track dir-right">
            {rowB.map((skill, i) => (
              <SkillCard key={`b-${skill.name}-${i}`} skill={skill} i={i + 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/*  Projects                                                                 */
/* ------------------------------------------------------------------------ */

function ProjectCard({ project, index, onOpen }) {
  const [ref, inView] = useInView(0.15);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  };
  const handleLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in" : ""}`}
      style={{ transitionDelay: `${(index % 2) * 0.12}s` }}
    >
      <div
        ref={cardRef}
        className="project-card glass"
        data-cursor="project"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={() => onOpen(project)}
        style={{
          borderRadius: 6, padding: 0, overflow: "hidden", cursor: "pointer",
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div
          className="skill-node-float"
          style={{
            height: 220, position: "relative", overflow: "hidden",
            background: `linear-gradient(135deg, ${project.accent}22, #0000 60%), radial-gradient(circle at 30% 20%, ${project.accent}33, transparent 55%)`,
            borderBottom: `1px solid ${COLORS.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            animationDelay: `${(index % 4) * 0.5}s`,
            animationDuration: `${6 + (index % 3)}s`,
          }}
        >
          <div
            style={{
              width: 148, height: 300, borderRadius: 20, border: `1px solid ${COLORS.borderStrong}`,
              background: COLORS.bg, position: "relative", boxShadow: `0 30px 60px -20px ${project.accent}30`,
              transform: `translateY(${tilt.x * 1.4}px) translateX(${tilt.y * 1.2}px)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 44, height: 4, borderRadius: 4, background: COLORS.border }} />
            <div style={{ position: "absolute", top: 34, left: 12, right: 12, bottom: 20, borderRadius: 8, background: `linear-gradient(160deg, ${project.accent}25, ${COLORS.bgPanelSoft})`, border: `1px solid ${COLORS.border}` }}>
              <div style={{ padding: 14 }}>
                <div style={{ width: "70%", height: 8, borderRadius: 4, background: project.accent, opacity: 0.7, marginBottom: 8 }} />
                <div style={{ width: "45%", height: 6, borderRadius: 4, background: COLORS.borderStrong, marginBottom: 16 }} />
                {[0, 1, 2].map((r) => (
                  <div key={r} style={{ width: "100%", height: 36, borderRadius: 6, background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.border}`, marginBottom: 8 }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 26px 30px" }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: project.accent, textTransform: "uppercase", marginBottom: 10, fontFamily: FONT_BODY }}>
            {project.category}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: COLORS.text, margin: 0, fontWeight: 600 }}>{project.name}</h3>
            <span className="card-arrow" style={{ display: "inline-flex" }}><ArrowUpRight size={20} color={COLORS.muted} /></span>
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, color: COLORS.muted, lineHeight: 1.6, margin: "0 0 18px" }}>{project.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.tech.map((t) => (
              <span key={t} style={{ fontSize: 11.5, padding: "5px 10px", borderRadius: 4, border: `1px solid ${COLORS.border}`, color: COLORS.mutedSoft, fontFamily: FONT_BODY }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const open = !!project;
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, background: "rgba(6,7,10,0.75)", backdropFilter: "blur(12px)",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.4s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass"
        style={{
          maxWidth: 640, width: "100%", maxHeight: "84vh", overflowY: "auto", borderRadius: 8,
          padding: "44px 40px", position: "relative",
          transform: open ? "scale(1) translateY(0)" : "scale(0.94) translateY(16px)",
          transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", color: COLORS.muted, cursor: "pointer" }}
          aria-label="Close"
        >
          <X size={22} />
        </button>
        {project && (
          <>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: project.accent, textTransform: "uppercase", marginBottom: 14, fontFamily: FONT_BODY }}>
              {project.category}
            </div>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 38, color: COLORS.text, margin: "0 0 20px", fontWeight: 600 }}>{project.name}</h3>
            <p style={{ fontFamily: FONT_BODY, fontSize: 15.5, color: COLORS.muted, lineHeight: 1.75, marginBottom: 26 }}>{project.detail}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.tech.map((t) => (
                <span key={t} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 4, border: `1px solid ${COLORS.border}`, color: COLORS.text, fontFamily: FONT_BODY }}>
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Projects() {
  const [ref, inView] = useInView(0.1);
  const [selected, setSelected] = useState(null);

  return (
    <section id="projects" style={{ padding: "160px 32px" }} ref={ref}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <h2 className={`reveal ${inView ? "in" : ""}`} style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(2.2rem, 4.2vw, 3.6rem)", color: COLORS.text, margin: "0 0 16px" }}>
            Selected work
          </h2>
          <p className={`reveal ${inView ? "in" : ""}`} style={{ transitionDelay: "0.1s", fontFamily: FONT_BODY, fontSize: 16, color: COLORS.muted, maxWidth: 460, margin: 0 }}>
            A collection of applications and digital products I&rsquo;ve worked on.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 28 }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} onOpen={setSelected} />
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/*  Experience timeline                                                      */
/* ------------------------------------------------------------------------ */

function TimelineItem({ item, index }) {
  const [ref, inView] = useInView(0.3);
  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 28, position: "relative", paddingBottom: index === TIMELINE.length - 1 ? 0 : 64 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 12, height: 12, borderRadius: "50%", marginTop: 6,
            background: inView ? COLORS.accent : COLORS.bgPanelSoft,
            border: `2px solid ${inView ? COLORS.accent : COLORS.borderStrong}`,
            boxShadow: inView ? `0 0 16px ${COLORS.accent}` : "none",
            transition: "all 0.5s ease", zIndex: 2,
          }}
        />
      </div>
      <div className={`reveal ${inView ? "in" : ""}`}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.accent, marginBottom: 8, letterSpacing: 1 }}>{item.year}</div>
        <h4 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: COLORS.text, margin: "0 0 10px", fontWeight: 600 }}>{item.title}</h4>
        <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: COLORS.muted, lineHeight: 1.7, maxWidth: 520, margin: 0 }}>{item.desc}</p>
      </div>
    </div>
  );
}

function Experience() {
  const [headRef, headIn] = useInView(0.3);
  return (
    <section id="experience" style={{ padding: "160px 32px", background: COLORS.bgPanel, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 ref={headRef} className={`reveal ${headIn ? "in" : ""}`} style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(2.2rem, 4vw, 3.2rem)", color: COLORS.text, margin: "0 0 64px" }}>
          Experience
        </h2>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 45, top: 6, bottom: 6, width: 1, background: COLORS.border }} />
          {TIMELINE.map((item, i) => (
            <TimelineItem key={item.year} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/*  Philosophy — How I Build                                                 */
/* ------------------------------------------------------------------------ */

function Philosophy() {
  const [ref, inView] = useInView(0.1);
  return (
    <section style={{ padding: "160px 32px" }} ref={ref}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <h2 className={`reveal ${inView ? "in" : ""}`} style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(2.2rem, 4.2vw, 3.6rem)", color: COLORS.text, margin: "0 0 60px" }}>
          How I build
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 1, background: COLORS.border, border: `1px solid ${COLORS.border}` }}>
          {PRINCIPLES.map((p, i) => (
            <div key={p.n} className={`principle-card reveal ${inView ? "in" : ""}`} style={{ transitionDelay: `${i * 0.1}s`, background: COLORS.bg, padding: "40px 30px" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.accent, marginBottom: 24 }}>{p.n}</div>
              <h4 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: COLORS.text, margin: "0 0 14px", fontWeight: 600 }}>{p.title}</h4>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, color: COLORS.muted, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/*  Tech marquee                                                             */
/* ------------------------------------------------------------------------ */

function TechMarquee() {
  const items = [...TECH_MARQUEE, ...TECH_MARQUEE];
  return (
    <section className="marquee-wrap scrollbar-hide" style={{ padding: "56px 0", borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, overflow: "hidden", background: COLORS.bgPanel }}>
      <div className="marquee-track">
        {items.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "0 36px", whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 30, color: i % TECH_MARQUEE.length === 0 ? COLORS.text : COLORS.mutedSoft, fontWeight: 500 }}>{t}</span>
            <span style={{ marginLeft: 36, color: COLORS.accent, opacity: 0.6 }}>◆</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/*  Contact                                                                  */
/* ------------------------------------------------------------------------ */

function MagneticButton({ children, style, ...props }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    setOffset({ x, y });
  };
  const reset = () => setOffset({ x: 0, y: 0 });
  return (
    <button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ ...style, transform: `translate(${offset.x}px, ${offset.y}px)` }}
      {...props}
    >
      {children}
    </button>
  );
}

function Contact() {
  const [ref, inView] = useInView(0.3);
  const links = [
    { icon: Mail, label: "Email", href: "mailto:hello@ustidev.com" },
    { icon: GitBranch, label: "GitHub", href: "https://github.com" },
    { icon: Link, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: Globe2, label: "Portfolio", href: "#" },
  ];

  return (
    <section id="contact" style={{ padding: "180px 32px", position: "relative", overflow: "hidden" }} ref={ref}>
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.accent}18, transparent 70%)`, filter: "blur(20px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <h2 className={`reveal ${inView ? "in" : ""}`} style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(2.4rem, 6vw, 5rem)", color: COLORS.text, margin: "0 0 24px", lineHeight: 1.08 }}>
          Have an idea?
          <br />
          Let&rsquo;s build it.
        </h2>
        <p className={`reveal ${inView ? "in" : ""}`} style={{ transitionDelay: "0.12s", fontFamily: FONT_BODY, fontSize: 16.5, color: COLORS.muted, maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.7 }}>
          Whether you&rsquo;re building a mobile application, launching a new product, or need help bringing an idea to life, let&rsquo;s talk.
        </p>

        <div className={`reveal ${inView ? "in" : ""}`} style={{ transitionDelay: "0.22s" }}>
          <MagneticButton
            className="btn-primary"
            style={{ padding: "18px 34px", borderRadius: 4, border: "none", fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
            onClick={() => (window.location.href = "mailto:hello@ustidev.com")}
          >
            Start a conversation <ArrowRight size={17} />
          </MagneticButton>
        </div>

        <div className={`reveal ${inView ? "in" : ""}`} style={{ transitionDelay: "0.3s", display: "flex", justifyContent: "center", gap: 34, marginTop: 64, flexWrap: "wrap" }}>
          {links.map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.muted, textDecoration: "none", fontFamily: FONT_BODY, fontSize: 14 }} className="nav-link">
              <Icon size={16} /> {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/*  Footer                                                                   */
/* ------------------------------------------------------------------------ */

function Footer() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer style={{ padding: "32px", borderTop: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: COLORS.text }}>USTI DEV</span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.mutedSoft }}>Built with a Flutter mindset & modern technology.</span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.mutedSoft }}>© 2026</span>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed", bottom: 28, right: 28, width: 44, height: 44, borderRadius: "50%",
          background: COLORS.bgPanel, border: `1px solid ${COLORS.borderStrong}`, color: COLORS.text,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 90,
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", pointerEvents: visible ? "auto" : "none",
        }}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}

/* ------------------------------------------------------------------------ */
/*  Scroll progress                                                          */
/* ------------------------------------------------------------------------ */

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((window.scrollY / docHeight) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 150, pointerEvents: "none" }}>
      <div
        style={{
          height: "100%", width: `${progress}%`,
          background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accent2})`,
          boxShadow: `0 0 8px ${COLORS.accent}`,
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/*  App                                                                      */
/* ------------------------------------------------------------------------ */

export default function App() {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, fontFamily: FONT_BODY, position: "relative", minHeight: "100vh" }}>
      <GlobalStyles />
      <ScrollProgress />
      <div className="noise-overlay" />
      <CustomCursor />
      <NavBar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Philosophy />
      <TechMarquee />
      <Contact />
      <Footer />
    </div>
  );
}
