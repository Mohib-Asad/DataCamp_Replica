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
