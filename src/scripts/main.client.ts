/* ── PRAXIS EDGE — CLIENT SCRIPT ── */
/* Custom cursor, hero canvas, typewriter, stat counters, scroll tracker,
   scroll-reveal, scroll-fill headings, work toggle, FAQ, contact form. */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ── CURSOR ── */
const cur = document.getElementById('cur') as HTMLElement | null;
const ring = document.getElementById('cur-ring') as HTMLElement | null;
if (cur && ring && finePointer && !reducedMotion) {
  document.body.classList.add('has-custom-cursor');
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  document.addEventListener(
    'mousemove',
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top = my + 'px';
    },
    { passive: true }
  );
  (function animRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a,button,.svc,.wc,.lc,.tc,.hcard').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cg'), { passive: true });
    el.addEventListener('mouseleave', () => document.body.classList.remove('cg'), { passive: true });
  });
}

/* ── HERO CANVAS ── */
const cv = document.getElementById('hcv') as HTMLCanvasElement | null;
if (cv) {
  const ctx = cv.getContext('2d');
  const heroEl = cv.parentElement as HTMLElement;
  let W = 0,
    H = 0;
  const pts = Array.from({ length: 80 }, () => ({
    x: 0,
    y: 0,
    r: Math.random() * 2 + 0.4,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    a: Math.random() * 0.45 + 0.08,
  }));
  function resizeCanvas() {
    W = cv!.width = heroEl.offsetWidth;
    H = cv!.height = heroEl.offsetHeight;
    pts.forEach((p) => {
      p.x = Math.random() * W;
      p.y = Math.random() * H;
    });
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });
  const orbs: [number, number, number, number][] = [
    [0.15, 0.2, 180, 0.07],
    [0.75, 0.25, 220, 0.06],
    [0.5, 0.6, 160, 0.05],
    [0.88, 0.75, 130, 0.06],
    [0.3, 0.8, 140, 0.04],
  ];
  function drawCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${p.a})`;
      ctx.fill();
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;
    });
    const t = Date.now() * 0.0006;
    orbs.forEach(([ox, oy, or, oa], i) => {
      const x = ox * W + Math.sin(t + i * 1.5) * 45,
        y = oy * H + Math.cos(t + i * 1.2) * 32;
      const g = ctx.createRadialGradient(x, y, 0, x, y, or);
      g.addColorStop(0, `rgba(124,85,245,${oa})`);
      g.addColorStop(1, 'rgba(124,85,245,0)');
      ctx.beginPath();
      ctx.arc(x, y, or, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(drawCanvas);
  }
  if (!reducedMotion) drawCanvas();
}

/* ── TYPEWRITER ── */
const twEl = document.getElementById('tw');
if (twEl && !reducedMotion) {
  const words = [
    'deserves.',
    'has been waiting for.',
    'is ready to become.',
    'was always meant to be.',
  ];
  let wi = 0,
    ci = 0,
    del = false,
    paused = false;
  function type() {
    if (paused) {
      paused = false;
      setTimeout(type, 1500);
      return;
    }
    const w = words[wi];
    if (!del) {
      twEl!.textContent = w.slice(0, ++ci);
      if (ci === w.length) {
        del = true;
        paused = true;
      }
      setTimeout(type, 90);
    } else {
      twEl!.textContent = w.slice(0, --ci);
      if (ci === 0) {
        del = false;
        wi = (wi + 1) % words.length;
      }
      setTimeout(type, 55);
    }
  }
  setTimeout(type, 1800);
} else if (twEl) {
  twEl.textContent = 'deserves.';
}

/* ── STAT COUNTERS ── */
function runCounter(el: HTMLElement) {
  const target = +el.dataset.count!,
    steps = 80,
    interval = 1800 / steps;
  let n = 0;
  const t = setInterval(() => {
    n = Math.min(n + target / steps, target);
    el.textContent = Math.floor(n) + (n >= target ? '+' : '');
    if (n >= target) clearInterval(t);
  }, interval);
}
setTimeout(
  () => document.querySelectorAll<HTMLElement>('[data-count]').forEach(runCounter),
  reducedMotion ? 0 : 1400
);

/* ── UNIFIED SCROLL HANDLER ── */
const SR0 = 0.92,
  SR1 = 0.68;
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const srEls = document.querySelectorAll<HTMLElement>('[data-sr]');
const sfEls = document.querySelectorAll<HTMLElement>('[data-sf]');

const trackerSecs: { label: string; id: string; dot?: HTMLElement }[] = [
  { label: 'Top', id: 'hero-top' },
  { label: 'Marketing', id: 'mkt' },
  { label: 'Spaces', id: 'spaces' },
  { label: 'Work', id: 'work' },
  { label: 'Contact', id: 'contact' },
];
const tracker = document.getElementById('tracker');
const tprog = document.getElementById('tprog');
if (tracker && tprog) {
  trackerSecs.forEach((s) => {
    const w = document.createElement('div');
    w.className = 'tdw';
    const d = document.createElement('div');
    d.className = 'tdt';
    const l = document.createElement('div');
    l.className = 'tlbl';
    l.textContent = s.label;
    w.append(d, l);
    w.addEventListener('click', () =>
      document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
    );
    tracker.append(w);
    s.dot = d;
  });
}

function onScroll() {
  const vh = window.innerHeight,
    sy = window.scrollY;
  const dh = Math.max(1, document.documentElement.scrollHeight - vh);
  if (tprog) tprog.style.height = Math.min(100, (sy / dh) * 100) + '%';
  const mid = sy + vh * 0.45;
  let ai = 0;
  trackerSecs.forEach((s, i) => {
    const el = document.getElementById(s.id);
    if (el && el.offsetTop <= mid) ai = i;
  });
  trackerSecs.forEach((s, i) => s.dot?.classList.toggle('active', i === ai));
  srEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--p', clamp((SR0 - r.top / vh) / (SR0 - SR1)).toFixed(4));
  });
  sfEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    const ws = el.querySelectorAll<HTMLElement>('.w');
    const n = ws.length;
    if (!n) return;
    const bp = clamp((SR0 - r.top / vh) / (SR0 - SR1));
    ws.forEach((w, i) => {
      const wp = clamp((bp - i / n) / ((i + 1) / n - i / n));
      w.style.backgroundPosition = `calc(${(1 - wp) * 100}%) 0`;
    });
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
onScroll();

/* ── WORK TOGGLE ── */
const wtog = document.getElementById('wtog');
if (wtog) {
  wtog.addEventListener('click', () => {
    const ex = document.getElementById('we')!;
    const lbl = document.getElementById('wtl')!;
    const ico = document.getElementById('wti')!;
    const open = ex.classList.toggle('open');
    ex.setAttribute('aria-hidden', open ? 'false' : 'true');
    wtog.setAttribute('aria-expanded', open ? 'true' : 'false');
    lbl.textContent = open ? 'Show Less' : 'See More Work';
    ico.classList.toggle('rot', open);
    if (open) setTimeout(onScroll, 50);
  });
}

/* ── FAQ ── */
document.querySelectorAll<HTMLButtonElement>('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const body = btn.nextElementSibling as HTMLElement;
    const wasOpen = body.classList.contains('open');
    document.querySelectorAll<HTMLElement>('.faq-b.open').forEach((b) => {
      b.classList.remove('open');
      const q = b.previousElementSibling as HTMLElement;
      q.classList.remove('open');
      q.setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
      body.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── CONTACT FORM ── */
const form = document.getElementById('contact-form') as HTMLFormElement | null;
if (form) {
  const submit = document.getElementById('f-submit') as HTMLButtonElement;
  const status = document.getElementById('form-status') as HTMLElement;
  const setStatus = (msg: string, kind?: 'ok' | 'err') => {
    status.textContent = msg;
    status.classList.remove('ok', 'err');
    if (kind) status.classList.add(kind);
  };
  form.querySelectorAll<HTMLInputElement>('input,select,textarea').forEach((el) => {
    el.addEventListener('input', () => el.removeAttribute('aria-invalid'), { passive: true });
    el.addEventListener('change', () => el.removeAttribute('aria-invalid'), { passive: true });
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstInvalid: HTMLElement | null = null;
    form.querySelectorAll<HTMLInputElement>('[required]').forEach((el) => {
      if (!el.checkValidity()) {
        el.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = el;
      }
    });
    if (firstInvalid) {
      setStatus('Please fill in the highlighted fields.', 'err');
      (firstInvalid as HTMLElement).focus();
      return;
    }
    const keyInput = form.querySelector<HTMLInputElement>('[name="access_key"]')!;
    const key = keyInput.value;
    if (!key || key.startsWith('REPLACE_')) {
      const d = new FormData(form);
      const body = `Name: ${d.get('name')}\nInstitution: ${d.get('institution')}\nRole: ${d.get('role') || '-'}\nEmail: ${d.get('email')}\nInterest: ${d.get('interest')}\n\n${d.get('message')}`;
      window.location.href =
        'mailto:hello@praxisadvertising.com?subject=' +
        encodeURIComponent('Consultation request — ' + (d.get('institution') || 'Praxis Edge website')) +
        '&body=' +
        encodeURIComponent(body);
      setStatus(
        'Opening your email client. If nothing happens, email hello@praxisadvertising.com directly.',
        'ok'
      );
      return;
    }
    submit.disabled = true;
    const originalLabel = submit.textContent;
    submit.textContent = 'Sending…';
    setStatus('', undefined);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        form.reset();
        setStatus('Thank you. We will be in touch within one business day.', 'ok');
        if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form_id: 'contact' });
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch {
      setStatus(
        'Something went wrong. Please email hello@praxisadvertising.com directly.',
        'err'
      );
    } finally {
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  });
}

export {};
