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
