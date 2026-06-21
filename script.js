/* ==========================================================================
   MediaMarkt Header Clone Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Element Selectors ---
  const storeSelector = document.getElementById('store-selector');
  const storeInput = document.querySelector('.mm-header__store-input');
  const storeSearchBtn = document.querySelector('.mm-btn--search');
  const storeNameText = document.querySelector('.mm-header__store-name');
  
  const categoriesDropdown = document.getElementById('categories-dropdown');
  const categoriesBtn = document.querySelector('.mm-header__categories-btn');
  
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');

  // --- Store Selector Interaction ---
  if (storeSelector) {
    storeSelector.addEventListener('click', (e) => {
      // Toggle only when clicking the trigger area directly, not inside dropdown inputs/content
      if (e.target.closest('.mm-header__store-trigger')) {
        storeSelector.classList.toggle('is-open');
        // Close category dropdown if open
        if (categoriesDropdown) categoriesDropdown.classList.remove('is-open');
      }
    });

    // Handle mock store search selection
    if (storeSearchBtn && storeInput) {
      const handleStoreSearch = () => {
        const query = storeInput.value.trim();
        if (query) {
          storeNameText.textContent = `MM ${query}`;
          storeSelector.classList.remove('is-open');
          storeInput.value = '';
        } else {
          storeInput.focus();
        }
      };

      storeSearchBtn.addEventListener('click', handleStoreSearch);
      storeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleStoreSearch();
        }
      });
    }
  }

  // --- Categories Dropdown Toggle (Desktop Nav) ---
  if (categoriesBtn && categoriesDropdown) {
    categoriesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = categoriesDropdown.classList.toggle('is-open');
      categoriesBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      // Close store dropdown if open
      if (storeSelector) storeSelector.classList.remove('is-open');
    });
  }

  // --- Mobile Drawer Interaction ---
  if (mobileMenuToggle && mobileDrawer) {
    const openDrawer = () => {
      mobileDrawer.classList.add('is-open');
      mobileDrawer.classList.remove('invisible');
      document.body.style.overflow = 'hidden'; // Disable scroll on main content
    };

    const closeDrawer = () => {
      mobileDrawer.classList.remove('is-open');
      mobileDrawer.classList.add('invisible');
      document.body.style.overflow = ''; // Restore scrolling
    };

    mobileMenuToggle.addEventListener('click', openDrawer);
    if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeDrawer);
    if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeDrawer);
  }

  // --- Global Click Handler (Close panels when clicking outside) ---
  document.addEventListener('click', (e) => {
    // Close store dropdown if clicked outside the store selector component
    if (storeSelector && !storeSelector.contains(e.target)) {
      storeSelector.classList.remove('is-open');
    }
    
    // Close categories dropdown if clicked outside the categories dropdown component
    if (categoriesDropdown && !categoriesDropdown.contains(e.target)) {
      categoriesDropdown.classList.remove('is-open');
      if (categoriesBtn) {
        categoriesBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // --- Category Nav Horizontal Scrolling ---
  const scrollWrapper = document.getElementById('nav-scroll-wrapper');
  const arrowLeft = document.getElementById('nav-arrow-left');
  const arrowRight = document.getElementById('nav-arrow-right');

  if (scrollWrapper && arrowLeft && arrowRight) {
    const scrollItems = scrollWrapper.querySelectorAll('.mm-header__nav-scroll-item');

    const updateArrows = () => {
      const scrollLeft = scrollWrapper.scrollLeft;
      const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;

      // Show/hide left arrow
      if (scrollLeft <= 5) {
        arrowLeft.style.opacity = '0';
        arrowLeft.style.visibility = 'hidden';
      } else {
        arrowLeft.style.opacity = '1';
        arrowLeft.style.visibility = 'visible';
      }

      // Show/hide right arrow
      if (scrollLeft >= maxScroll - 5) {
        arrowRight.style.opacity = '0';
        arrowRight.style.visibility = 'hidden';
      } else {
        arrowRight.style.opacity = '1';
        arrowRight.style.visibility = 'visible';
      }
    };

    const getScrollPosition = (direction) => {
      const currentScroll = scrollWrapper.scrollLeft;
      
      // Find the index of the first item currently visible on the left edge
      let firstVisibleIndex = 0;
      for (let i = 0; i < scrollItems.length; i++) {
        if (scrollItems[i].offsetLeft >= currentScroll - 2) {
          firstVisibleIndex = i;
          break;
        }
      }

      if (direction === 'right') {
        // Move two items to the right
        const targetIndex = Math.min(scrollItems.length - 1, firstVisibleIndex + 2);
        return scrollItems[targetIndex].offsetLeft;
      } else {
        // Move two items to the left
        const targetIndex = Math.max(0, firstVisibleIndex - 2);
        return scrollItems[targetIndex].offsetLeft;
      }
    };

    arrowRight.addEventListener('click', () => {
      const targetScroll = getScrollPosition('right');
      scrollWrapper.scrollTo({ left: targetScroll, behavior: 'smooth' });
    });

    arrowLeft.addEventListener('click', () => {
      const targetScroll = getScrollPosition('left');
      scrollWrapper.scrollTo({ left: targetScroll, behavior: 'smooth' });
    });

    // Event listeners
    scrollWrapper.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    
    // Run initial state update
    setTimeout(updateArrows, 100);
  }

  // --- Search Input Submit handler (Mock Search) ---
  const searchForm = document.querySelector('.mm-header__search-form');
  const searchInput = document.querySelector('.mm-header__search-input');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        alert(`Buscando: "${query}"`);
        searchInput.value = '';
        searchInput.blur();
      }
    });
  }

  // --- Add to Cart Interaction ---
  const cartBadge = document.getElementById('cart-badge');
  const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
  let cartCount = 0;

  if (addToCartButtons.length > 0 && cartBadge) {
    addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productName = button.getAttribute('data-product-name');
        
        cartCount++;
        cartBadge.textContent = cartCount;
        cartBadge.classList.remove('hidden');
        
        // Micro-animation on the badge
        cartBadge.style.transform = 'scale(1.2)';
        setTimeout(() => {
          cartBadge.style.transform = 'scale(1)';
        }, 150);
      });
    });
  }

  // --- Sorting Dropdown Interaction ---
  const sortSelect = document.getElementById('sort-select');
  const selectedSortText = document.getElementById('selected-sort-text');

  if (sortSelect && selectedSortText) {
    sortSelect.addEventListener('change', (e) => {
      selectedSortText.textContent = e.target.options[e.target.selectedIndex].text;
    });
  }

  // --- Promo Description Expand/Collapse ---
  const btnTogglePromo = document.getElementById('btn-toggle-promo');
  const promoTextMore = document.getElementById('promo-text-more');
  const togglePromoText = document.getElementById('toggle-promo-text');
  const togglePromoPath = document.getElementById('toggle-promo-path');

  if (btnTogglePromo && promoTextMore && togglePromoText && togglePromoPath) {
    btnTogglePromo.addEventListener('click', () => {
      const isHidden = promoTextMore.classList.toggle('hidden');
      if (isHidden) {
        togglePromoText.textContent = 'Mostrar más';
        togglePromoPath.setAttribute('d', 'M19.5 8.25l-7.5 7.5-7.5-7.5');
      } else {
        togglePromoText.textContent = 'Mostrar menos';
        togglePromoPath.setAttribute('d', 'M4.5 15.75l7.5-7.5 7.5 7.5');
      }
    });
  }
});


