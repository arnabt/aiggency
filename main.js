// ===== Scroll-based fade-in animations =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Apply fade-up class to all major sections
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll(
    '.section-label, .section-title, .section-subtitle, ' +
    '.problem-card, .driver-card, .approach-card, ' +
    '.capability-card, .result-card, .fit-card, .team-card, ' +
    '.about-title, .about-line, .about-body, ' +
    '.cta-title, .cta-subtitle, ' +
    '.badge, .hero-title, .hero-subtitle, .hero-buttons, ' +
    '.process-flow, .orbit-diagram, .comparison-table, .comparison-labels'
  );

  animatedElements.forEach((el, index) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(index % 6) * 0.08}s`;
    observer.observe(el);
  });

  // Header background on scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.borderBottomColor = 'rgba(30, 41, 59, 0.8)';
    } else {
      header.style.borderBottomColor = 'rgba(30, 41, 59, 0.5)';
    }
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// ===== Hero constellation network background =====
function createHeroNetwork() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.right = '0';
  canvas.style.width = '60%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0.25';
  
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let animationId;
  const points = [];
  const numPoints = 40;

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function initPoints() {
    points.length = 0;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1
      });
    }
  }

  function draw() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    // Update positions
    points.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });

    // Draw connections
    const maxDist = 150;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.3;
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw points
    points.forEach(p => {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    animationId = requestAnimationFrame(draw);
  }

  resize();
  initPoints();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationId);
    resize();
    initPoints();
    draw();
  });
}

createHeroNetwork();
