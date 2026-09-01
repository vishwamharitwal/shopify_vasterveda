/**
 * VastrVeda - Royal Ethnic Couture (Jaipur Heritage)
 * Core Theme JavaScript & GSAP Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initGSAPAnimations();
  initCartDrawer();
  initQuickView();
  initProductWishlist();
});

/* Sticky Header on Scroll */
function initHeaderScroll() {
  const header = document.querySelector('.header-wrapper');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* GSAP Animations & ScrollTrigger */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Entrance
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
  
  if (document.querySelector('.hero-badge')) {
    heroTimeline
      .from('.hero-badge', { y: 20, opacity: 0, delay: 0.2 })
      .from('.hero-title', { y: 40, opacity: 0, duration: 1.1 }, '-=0.6')
      .from('.hero-description', { y: 30, opacity: 0 }, '-=0.7')
      .from('.hero-cta-group', { y: 20, opacity: 0 }, '-=0.7')
      .from('.hero-arch-frame', { scale: 0.92, opacity: 0, duration: 1.2 }, '-=1')
      .from('.hero-floating-card', { x: -30, opacity: 0, duration: 0.8 }, '-=0.5');
  }

  // Section Headers Scroll Reveal
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.royal-heading-wrapper').forEach((heading) => {
      gsap.from(heading, {
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
      });
    });

    // Category Cards Stagger
    if (document.querySelector('.category-grid')) {
      gsap.from('.category-card', {
        scrollTrigger: {
          trigger: '.category-grid',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }

    // Product Cards Stagger
    if (document.querySelector('.product-grid')) {
      gsap.from('.product-card', {
        scrollTrigger: {
          trigger: '.product-grid',
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }

    // Heritage Story Parallax Reveal
    if (document.querySelector('.heritage-story-section')) {
      gsap.from('.heritage-story-content', {
        scrollTrigger: {
          trigger: '.heritage-story-section',
          start: 'top 75%',
        },
        x: -40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.heritage-gallery-frame', {
        scrollTrigger: {
          trigger: '.heritage-story-section',
          start: 'top 75%',
        },
        x: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    }
  }
}

/* Ajax Cart Drawer Logic */
function initCartDrawer() {
  const cartTriggers = document.querySelectorAll('[data-cart-trigger]');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-drawer-overlay');
  const cartCloseBtns = document.querySelectorAll('[data-cart-close]');

  function openCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  cartTriggers.forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  }));

  cartCloseBtns.forEach((btn) => btn.addEventListener('click', closeCart));
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Quick Add To Cart Form Handling (Shopify Ajax API)
  document.querySelectorAll('form[action*="/cart/add"]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Adding to Bag...</span>';
        submitBtn.disabled = true;
      }

      try {
        const formData = new FormData(form);
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        });

        if (response.ok) {
          // Update cart count and open drawer
          await updateCartDrawer();
          openCart();
        } else {
          console.error('Error adding to cart');
        }
      } catch (err) {
        console.error('Cart Ajax error:', err);
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  });
}

/* Refresh Cart Drawer HTML */
async function updateCartDrawer() {
  try {
    const res = await fetch('/cart.js');
    const cart = await res.json();
    
    // Update badge count
    const countBubbles = document.querySelectorAll('.cart-count-bubble');
    countBubbles.forEach((bubble) => {
      bubble.textContent = cart.item_count;
    });
  } catch (err) {
    console.error('Failed to update cart count', err);
  }
}

/* Quick View Modal */
function initQuickView() {
  const modal = document.querySelector('.quick-view-modal');
  const modalOverlay = document.querySelector('.quick-view-overlay');
  const closeBtns = document.querySelectorAll('[data-modal-close]');
  const triggerBtns = document.querySelectorAll('[data-quick-view-handle]');

  function closeModal() {
    if (modal && modalOverlay) {
      modal.classList.remove('active');
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const handle = btn.getAttribute('data-quick-view-handle');
      if (!handle) return;

      try {
        const res = await fetch(`/products/${handle}?view=quickview`);
        if (res.ok) {
          const html = await res.text();
          const target = document.querySelector('.quick-view-content-target');
          if (target) {
            target.innerHTML = html;
            if (modal && modalOverlay) {
              modal.classList.add('active');
              modalOverlay.classList.add('active');
              document.body.style.overflow = 'hidden';
            }
          }
        }
      } catch (err) {
        console.error('Quick view fetch error:', err);
      }
    });
  });

  closeBtns.forEach((btn) => btn.addEventListener('click', closeModal));
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
}

/* Wishlist Toggle */
function initProductWishlist() {
  document.querySelectorAll('.product-wishlist-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      const isSaved = btn.classList.contains('active');
      btn.style.color = isSaved ? '#D4AF37' : '';
    });
  });
}
