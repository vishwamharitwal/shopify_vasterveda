/**
 * VastrVeda - Haute Couture (Jaipur Atelier)
 * Smooth Interactions & Cart Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initCartDrawer();
  initWishlist();
});

/* Sticky Header on Scroll */
function initHeaderScroll() {
  const header = document.querySelector('.header-wrapper');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
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
        submitBtn.innerHTML = '<span>Adding...</span>';
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
          await updateCartDrawer();
          openCart();
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

/* Refresh Cart Drawer Count */
async function updateCartDrawer() {
  try {
    const res = await fetch('/cart.js');
    const cart = await res.json();
    
    const countBubbles = document.querySelectorAll('.cart-count-bubble');
    countBubbles.forEach((bubble) => {
      bubble.textContent = cart.item_count;
    });
  } catch (err) {
    console.error('Failed to update cart count', err);
  }
}

/* Wishlist Toggle */
function initWishlist() {
  document.querySelectorAll('.product-wishlist-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      const isSaved = btn.classList.contains('active');
      btn.style.color = isSaved ? '#C5A880' : '';
    });
  });
}
