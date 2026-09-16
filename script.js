document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const themeToggle = document.querySelector('.theme-toggle');

  // Mobile navigation
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Theme toggle
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') body.classList.add('light-mode');
  updateThemeIcon();
  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    localStorage.setItem('portfolio-theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    updateThemeIcon();
  });
  function updateThemeIcon() {
    if (themeToggle) themeToggle.textContent = body.classList.contains('light-mode') ? '☀' : '◐';
  }

  // Scroll reveal
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('visible'));
  }

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count) || 0;
      const duration = 1000;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: .7 });
  counters.forEach(c => countObserver.observe(c));

  // Project grid/list toggle
  const projectGrid = document.getElementById('projectGrid');
  document.querySelectorAll('.view-toggle button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      projectGrid?.classList.toggle('list-view', button.dataset.view === 'list');
    });
  });

  // Project category filter
  const projectCards = document.querySelectorAll('.project-card');
  document.querySelectorAll('.filter').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // Map / data switch
  const mapView = document.getElementById('mapView');
  const dataView = document.getElementById('dataView');
  document.querySelectorAll('[data-map-mode]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-map-mode]').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      const dataMode = button.dataset.mapMode === 'data';
      mapView?.classList.toggle('hidden', dataMode);
      dataView?.classList.toggle('hidden', !dataMode);
    });
  });

  // Data table search/filter
  const tableSearch = document.getElementById('tableSearch');
  const yearFilter = document.getElementById('yearFilter');
  const rows = document.querySelectorAll('#dataTable tbody tr');
  function filterTable() {
    const query = (tableSearch?.value || '').toLowerCase().trim();
    const year = yearFilter?.value || 'all';
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowYear = row.cells[0]?.textContent.trim();
      row.style.display = (text.includes(query) && (year === 'all' || rowYear === year)) ? '' : 'none';
    });
  }
  tableSearch?.addEventListener('input', filterTable);
  yearFilter?.addEventListener('change', filterTable);

  // Gallery lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
  };
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const image = item.dataset.image;
      if (lightbox && lightboxImage) {
        lightboxImage.src = image || item.querySelector('img')?.src || '';
        lightboxImage.alt = item.querySelector('img')?.alt || 'Gallery image';
        if (lightboxCaption) lightboxCaption.textContent = item.dataset.caption || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      }
    });
  });
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // Gentle hero image parallax
  const parallax = document.querySelector('.parallax');
  if (parallax && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - .5) * 5;
      const y = (e.clientY / window.innerHeight - .5) * 5;
      parallax.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg) rotate(2deg)`;
    }, { passive: true });
  }
});


// Graceful handling for optional portfolio media.
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    const parent = img.parentElement;
    img.style.display = 'none';
    parent?.classList.add('placeholder');
  }, { once: true });
});
document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', e => e.preventDefault());
});
