function initNavbar() {
  try {
    // Search toggle (kept from your original)
    const searchToggle = document.getElementById('navSearchToggle');
    const searchBox = document.getElementById('navSearchBox');
    const searchInput = document.getElementById('navSearchInput');

    if (searchToggle && searchBox) {
      searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        searchBox.classList.toggle('visible');
        if (searchBox.classList.contains('visible')) {
          setTimeout(() => searchInput && searchInput.focus(), 0);
        }
      });

      // Close search when clicking outside
      document.addEventListener('click', function(e) {
        if (!searchBox.contains(e.target) && !searchToggle.contains(e.target)) {
          searchBox.classList.remove('visible');
        }
      });

      // Close search on Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchBox.classList.contains('visible')) {
          searchBox.classList.remove('visible');
        }
      });
    }

    // Close any open mega when clicking outside (works with Bootstrap's "show" class)
    document.addEventListener('click', function(e) {
      // if click target is inside any .dc-dropdown-mega or on a dropdown-toggle, do nothing
      const insideMega = e.target.closest('.dc-dropdown-mega, .dropdown-toggle');
      if (!insideMega) {
        document.querySelectorAll('.dc-dropdown-mega.show').forEach(menu => {
          // Use Bootstrap's Dropdown instance if available to properly close
          try {
            const parent = menu.closest('.dropdown');
            if (parent && parent.querySelector('[data-bs-toggle="dropdown"]')) {
              const ddToggleEl = parent.querySelector('[data-bs-toggle="dropdown"]');
              const ddInstance = bootstrap.Dropdown.getInstance(ddToggleEl);
              if (ddInstance) {
                ddInstance.hide();
                return;
              }
            }
          } catch (err) { /* ignore bootstrap calls if unavailable */ }

          // fallback: remove classes
          menu.classList.remove('show');
          const parent = menu.closest('.dropdown');
          if (parent) parent.classList.remove('show');
        });
      }
    });

    console.log('Navbar initialized');
  } catch (err) {
    console.error('Navbar initialization error:', err);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', initNavbar);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initNavbar();
}

function initHeroSection1() {
  const form = document.getElementById('hero1SignupForm');
  if (!form) return; // Exit if form not found

  const emailInput = document.getElementById('hero1Email');
  const passwordInput = document.getElementById('hero1Password');
  const submitBtn = document.getElementById('hero1SubmitBtn');
  const inputs = [emailInput, passwordInput];

  // Initial state: Disable submit button
  submitBtn.disabled = true;

  // Validate a single input field
  function validateInput(input) {
    if (input.validity.valid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      return false;
    }
  }

  // Validate all form fields
  function validateForm() {
    let isValid = true;
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    submitBtn.disabled = !isValid;
    return isValid;
  }

  // Real-time validation on input
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      validateInput(this);
      validateForm();
    });

    // Validate on blur
    input.addEventListener('blur', function() {
      validateInput(this);
    });
  });

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating Account...';
      
      // Simulate API call
      setTimeout(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Start Learning for Free';
        
        // Redirect on success
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      // Show validation errors
      inputs.forEach(input => validateInput(input));
    }
  });

  // Initialize form validation
  validateForm();
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initHeroSection1);

// Handle cases where script is loaded after DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroSection1);
} else {
  initHeroSection1();
}

// scripts/heroSection3.js
// Filtering + "show more" logic for heroSection3
(function () {
  function initHeroSection3() {
    console.log("Initializing hero3 course filtering");

    const filterButtons = Array.from(document.querySelectorAll('.hero3-filter-btn'));
    const courseCards = Array.from(document.querySelectorAll('.hero3-course-card'));
    const exploreBtn = document.querySelector('.hero3-explore-btn');
    const coursesGrid = document.querySelector('.hero3-courses-grid');

    if (!filterButtons.length || !courseCards.length || !coursesGrid) {
      console.warn('Required elements not found for hero3 course filtering');
      return;
    }

    // Create show more wrapper + button
    const showMoreWrap = document.createElement('div');
    showMoreWrap.className = 'hero3-show-more-wrap';
    const showMoreBtn = document.createElement('button');
    showMoreBtn.className = 'hero3-show-more-btn';
    showMoreBtn.type = 'button';
    showMoreWrap.appendChild(showMoreBtn);

    // Insert after courses grid
    coursesGrid.parentNode.insertBefore(showMoreWrap, coursesGrid.nextSibling);

    const PAGE_LIMIT = 6;
    let showingAll = false;
    let currentFilter = 'all';

    function getFilteredCards(filter) {
      if (filter === 'all') return courseCards.slice();
      return courseCards.filter(card => {
        const attr = card.getAttribute('data-category');
        const cats = attr ? attr.split(/\s+/) : [];
        return cats.indexOf(filter) !== -1;
      });
    }

    function applyFilter(filter) {
      currentFilter = filter;
      const filtered = getFilteredCards(filter);

      // Hide all, then unhide filtered ones (paging applied below)
      courseCards.forEach(card => card.classList.add('hero3-hidden'));

      if (!showingAll) {
        filtered.forEach((card, idx) => {
          if (idx < PAGE_LIMIT) {
            card.classList.remove('hero3-hidden');
          }
        });
      } else {
        filtered.forEach(card => card.classList.remove('hero3-hidden'));
      }

      // Show or hide the Show More control
      if (filtered.length > PAGE_LIMIT) {
        showMoreWrap.style.display = 'block';
        showMoreBtn.textContent = showingAll ? 'Show Less' : 'Show More';
      } else {
        showMoreWrap.style.display = 'none';
      }
    }

    // Wire up filter buttons
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('hero3-filter-active'));
        btn.classList.add('hero3-filter-active');
        showingAll = false;
        applyFilter(btn.getAttribute('data-filter'));
      });
    });

    // Show more toggle
    showMoreBtn.addEventListener('click', () => {
      showingAll = !showingAll;
      applyFilter(currentFilter);
      showMoreBtn.textContent = showingAll ? 'Show Less' : 'Show More';
    });

    // Optional explore button action
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        // replace with a real router action if needed
        window.alert('Exploring full catalog...');
      });
    }

    // Unhide all cards initially to avoid flicker; then apply initial filter
    courseCards.forEach(card => card.classList.remove('hero3-hidden'));

    const initialBtn = document.querySelector('.hero3-filter-btn.hero3-filter-active') ||
                       document.querySelector('.hero3-filter-btn[data-filter="all"]');
    const startFilter = initialBtn ? initialBtn.getAttribute('data-filter') : 'all';
    if (initialBtn) {
      // make sure the active class is set in DOM
      filterButtons.forEach(b => b.classList.remove('hero3-filter-active'));
      initialBtn.classList.add('hero3-filter-active');
    }
    applyFilter(startFilter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSection3);
  } else {
    initHeroSection3();
  }
})();

/* heroSection9.js — robust responsive carousel (3 / 2 / 1 visible) - hs9-prefixed */
(function () {
  'use strict';

  // --- utilities ---
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const debounce = (fn, wait = 100) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };

  // --- DOM refs ---
  const viewport = document.getElementById('hs9-carousel');
  if (!viewport) return console.warn('Carousel: #hs9-carousel not found.');

  const cardsList = viewport.querySelector('.hs9-cards');
  if (!cardsList) return console.warn('Carousel: .hs9-cards not found inside #hs9-carousel.');

  let cards = Array.from(cardsList.children);
  const prevBtn = document.querySelector('.hs9-nav.hs9-nav-prev') || document.querySelector('.hs9-nav-prev');
  const nextBtn = document.querySelector('.hs9-nav.hs9-nav-next') || document.querySelector('.hs9-nav-next');
  const dotsWrap = document.getElementById('hs9-dots');

  // --- state ---
  let visible = 3;            // how many cards visible (desktop default)
  let startIndex = 0;         // index of first visible card (0..maxStartIndex)
  let cardWidth = 320;        // computed card width in px
  let gap = 18;               // gap between cards (will read from CSS if possible)
  let maxStartIndex = Math.max(0, cards.length - visible);

  // breakpoints (you can tweak)
  function calcVisibleByBreakpoint(w = window.innerWidth) {
    if (w >= 1100) return 3;
    if (w >= 740) return 2;
    return 1;
  }

  // try to read CSS gap from the cards flex container (modern browsers support it)
  function readGap() {
    try {
      const cs = getComputedStyle(cardsList);
      const g = cs.getPropertyValue('gap') || cs.getPropertyValue('column-gap') || '';
      if (g) {
        const parsed = parseFloat(g);
        if (!Number.isNaN(parsed)) return parsed;
      }
    } catch (e) { /* ignore */ }
    return 18;
  }

  // sets avatar colors/initials if needed (keeps earlier behavior)
  function assignAvatarColorsAndInitials() {
    const palette = ['#f7c744', '#00e07e', '#ff7a9f', '#7cc4ff', '#ffd97a', '#9b8cff'];
    cards.forEach((card, i) => {
      const avatar = card.querySelector('.hs9-avatar');
      if (!avatar) return;
      const color = card.dataset.color || palette[i % palette.length];
      // initials: prefer data-initials, fallback to first letter of author
      const initials = card.dataset.initials ||
        (card.querySelector('.hs9-author') ? card.querySelector('.hs9-author').textContent.trim()[0].toUpperCase() : '');
      avatar.style.background = color;
      avatar.style.color = '#fff';
      avatar.setAttribute('data-initials', initials);
    });
  }

  // compute card width so visible cards fit but don't exceed sensible max/min
  function computeCardWidth() {
    const vpWidth = Math.max(0, viewport.clientWidth);
    gap = readGap();
    const visibleCount = visible;
    const maxCard = 420; // matches CSS variable-ish
    const minCard = 240;
    // space available for cards after subtracting gaps between them
    const totalGapWidth = gap * (visibleCount - 1);
    const tentative = Math.floor((vpWidth - totalGapWidth) / visibleCount);
    // clamp between min and max
    return clamp(tentative, minCard, maxCard);
  }

  // apply layout: set flex-basis for cards and compute maxStartIndex
  function applyLayout() {
    // recalc visible
    visible = calcVisibleByBreakpoint(window.innerWidth);
    cardWidth = computeCardWidth();
    if (!cards || !cards.length) return;

    cards.forEach(c => {
      c.style.flex = `0 0 ${cardWidth}px`;
      c.style.maxWidth = `${cardWidth}px`;
    });

    maxStartIndex = Math.max(0, cards.length - visible);
    startIndex = clamp(startIndex, 0, maxStartIndex);
    // update position and controls
    updatePosition(false /*animate?*/);
    renderDots();
    updateNavButtons();
  }

  // compute transform and apply
  function updatePosition(animate = true) {
    // ensure animation class toggled
    if (animate) {
      cardsList.style.transition = 'transform .45s cubic-bezier(.2,.95,.25,1)';
    } else {
      cardsList.style.transition = 'none';
    }
    const shift = startIndex * (cardWidth + gap);
    cardsList.style.transform = `translateX(${-shift}px)`;
    // update dots active state
    updateActiveDot();
  }

  // navigation helpers
  function pageCount() {
    // number of pages when stepping by visible cards
    return Math.max(1, Math.ceil(cards.length / visible));
  }
  function currentPageIndex() {
    return Math.floor(startIndex / visible);
  }

  function goToStartIndex(i) {
    startIndex = clamp(i, 0, maxStartIndex);
    updatePosition(true);
    updateNavButtons();
  }

  function goToPage(page) {
    const p = clamp(page, 0, pageCount() - 1);
    goToStartIndex(p * visible);
  }

  function nextPage() {
    goToStartIndex(startIndex + visible);
  }
  function prevPage() {
    goToStartIndex(startIndex - visible);
  }

  // update arrow button disabled state
  function updateNavButtons() {
    if (prevBtn) prevBtn.disabled = startIndex <= 0;
    if (nextBtn) nextBtn.disabled = startIndex >= maxStartIndex;
  }

  // dots rendering (one dot per page)
  function renderDots() {
    if (!dotsWrap) return;
    const pages = pageCount();
    // reuse existing nodes where possible
    const existing = Array.from(dotsWrap.children);
    if (existing.length === pages) {
      // ensure aria labels and handlers exist
      existing.forEach((btn, i) => {
        btn.setAttribute('aria-label', `Go to page ${i + 1}`);
        btn.onclick = () => goToPage(i);
      });
      updateActiveDot();
      return;
    }
    // recreate
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hs9-dot' + (i === currentPageIndex() ? ' active' : '');
      btn.setAttribute('aria-label', `Go to page ${i + 1}`);
      btn.addEventListener('click', () => goToPage(i));
      dotsWrap.appendChild(btn);
    }
    updateActiveDot();
  }

  function updateActiveDot() {
    if (!dotsWrap) return;
    const activeIndex = currentPageIndex();
    Array.from(dotsWrap.children).forEach((d, i) => {
      d.classList.toggle('active', i === activeIndex);
      d.setAttribute('aria-current', i === activeIndex ? 'true' : 'false');
    });
  }

  // keyboard support (left/right)
  function setupKeyboard() {
    viewport.setAttribute('tabindex', '0'); // ensure focusable
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextPage();
      }
    });
  }

  // pointer / touch swipe - pointer-based detection (works for mouse/touch)
  function getClientX(e) {
    if (typeof e.clientX === 'number') return e.clientX;
    if (e.touches && e.touches[0] && typeof e.touches[0].clientX === 'number') {
      return e.touches[0].clientX;
    }
    if (e.changedTouches && e.changedTouches[0] && typeof e.changedTouches[0].clientX === 'number') {
      return e.changedTouches[0].clientX;
    }
    return 0;
  }

  function setupSwipe() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const threshold = 40; // px

    function onPointerDown(e) {
      if (e.isPrimary === false || (e.pointerType === 'mouse' && e.button !== 0)) return;
      isDragging = true;
      startX = getClientX(e);
      currentX = startX;
      viewport.style.cursor = 'grabbing';
      cardsList.style.transition = 'none';
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      currentX = getClientX(e) || currentX;
      const delta = currentX - startX;
      const maxDrag = Math.min(cardWidth * visible, viewport.clientWidth / 2);
      const liveShift = -startIndex * (cardWidth + gap) + Math.max(-maxDrag, Math.min(maxDrag, -delta));
      cardsList.style.transform = `translateX(${liveShift}px)`;
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      viewport.style.cursor = '';
      const delta = startX - currentX;
      if (Math.abs(delta) > threshold) {
        if (delta > 0) nextPage(); else prevPage();
      } else {
        updatePosition(true);
      }
    }

    viewport.addEventListener('pointerdown', (e) => { try { onPointerDown(e); } catch (err) {} }, { passive: true });
    window.addEventListener('pointermove', (e) => { if (isDragging) onPointerMove(e); }, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // touch fallback
    viewport.addEventListener('touchstart', (e) => { try { onPointerDown(e); } catch (err) {} }, { passive: true });
    viewport.addEventListener('touchmove', (e) => { if (isDragging) onPointerMove(e); }, { passive: true });
    viewport.addEventListener('touchend', (e) => { try { onPointerUp(e); } catch (err) {} }, { passive: true });
  }

  // handle prev/next button wiring
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); prevPage(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); nextPage(); });

  // respond to window resize (debounced)
  const debouncedLayout = debounce(() => {
    cards = Array.from(cardsList.children);
    visible = calcVisibleByBreakpoint(window.innerWidth);
    applyLayout();
  }, 120);

  window.addEventListener('resize', debouncedLayout);

  // ResizeObserver on the viewport
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(debounce(() => {
      cards = Array.from(cardsList.children);
      visible = calcVisibleByBreakpoint(window.innerWidth);
      applyLayout();
    }, 80));
    ro.observe(viewport);
  }

  // MutationObserver to detect dynamic addition/removal of cards
  if ('MutationObserver' in window) {
    const mo = new MutationObserver(debounce((mutations) => {
      cards = Array.from(cardsList.children);
      assignAvatarColorsAndInitials();
      visible = calcVisibleByBreakpoint(window.innerWidth);
      applyLayout();
    }, 80));
    mo.observe(cardsList, { childList: true, subtree: false });
  }

  // initial boot sequence (ensure measurements after first paint)
  function boot() {
    cards = Array.from(cardsList.children);
    assignAvatarColorsAndInitials();
    visible = calcVisibleByBreakpoint(window.innerWidth);
    applyLayout();
    setupKeyboard();
    setupSwipe();
    // set ARIA roles / labels for accessibility
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-roledescription', 'carousel');
    // create dots here if missing
    if (dotsWrap) renderDots();
  }

  // call boot on next animation frame
  window.requestAnimationFrame(boot);

  // expose a minimal API on the element (useful for testing / external controls)
  try {
    viewport.carousel = {
      next: nextPage,
      prev: prevPage,
      goToIndex: goToStartIndex,
      goToPage: goToPage,
      refresh: () => { cards = Array.from(cardsList.children); applyLayout(); }
    };
  } catch (e) { /* non-critical */ }

})();
