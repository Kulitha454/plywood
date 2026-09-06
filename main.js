/**
 * Plywood Sandakelum - Main JavaScript
 * Handles:
 * 1. Mobile Navigation & Hamburger Toggle
 * 2. Dark / Light Mode Theme Toggle
 * 3. Back-to-Top Smooth Scroll
 * 4. Contact & Quote Request Form with Client-Side Success State
 * 5. Google Analytics 4 (GA4) Event Instrumentation & Console Debugger
 */

(function () {
  'use strict';

  // --- GA4 Helper & Debug Console Logger ---
  function trackEvent(eventName, params) {
    var eventData = params || {};
    // Log to console for easy developer inspection and debugging
    console.groupCollapsed(
      '%c[GA4 Event] ' + eventName,
      'color: #d99b26; font-weight: bold; font-family: monospace; font-size: 11px;'
    );
    console.table(eventData);
    console.groupEnd();

    // Send to GA4 dataLayer / gtag if loaded
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventData);
    } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...eventData
      });
    }
  }

  // Expose trackEvent globally if needed
  window.trackGA4Event = trackEvent;

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNavigation();
    initBackToTop();
    initContactForm();
    initAnalyticsTracking();
  });

  // --- 1. Theme Toggle (Dark / Light Mode) ---
  function initTheme() {
    var storedTheme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var activeTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', activeTheme);
    updateThemeToggleButtons(activeTheme);

    var themeButtons = document.querySelectorAll('.theme-toggle');
    themeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeToggleButtons(next);

        trackEvent('select_content', {
          content_type: 'theme_toggle',
          item_id: next
        });
      });
    });
  }

  function updateThemeToggleButtons(theme) {
    var themeButtons = document.querySelectorAll('.theme-toggle');
    themeButtons.forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      var icon = btn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    });
  }

  // --- 2. Mobile Navigation & Hamburger Menu ---
  function initNavigation() {
    var menuBtn = document.getElementById('menu-btn') || document.getElementById('menu');
    var nav = document.querySelector('nav');
    var navList = document.querySelector('.ul');

    if (!menuBtn || !nav) return;

    // Ensure accessibility attributes
    menuBtn.setAttribute('role', 'button');
    menuBtn.setAttribute('tabindex', '0');
    menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    menuBtn.setAttribute('aria-expanded', 'false');

    function toggleMenu(open) {
      var isExpanded = nav.classList.contains('nav-open');
      var shouldOpen = typeof open === 'boolean' ? open : !isExpanded;

      if (shouldOpen) {
        nav.classList.add('nav-open');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.classList.add('is-active');
      } else {
        nav.classList.remove('nav-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.classList.remove('is-active');
      }
    }

    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Keyboard support (Enter or Space)
    menuBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });

    // Close when clicking nav links
    if (navList) {
      navList.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          toggleMenu(false);
        });
      });
    }

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('nav-open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
        toggleMenu(false);
        menuBtn.focus();
      }
    });
  }

  // --- 3. Back to Top Smooth Scroll ---
  function initBackToTop() {
    var ptop = document.getElementById('ptop');
    if (!ptop) return;

    ptop.setAttribute('role', 'button');
    ptop.setAttribute('tabindex', '0');
    ptop.setAttribute('aria-label', 'Scroll back to top of page');

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      trackEvent('select_content', {
        content_type: 'scroll_to_top',
        item_id: 'footer_ptop'
      });
    }

    ptop.addEventListener('click', scrollToTop);
    ptop.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToTop();
      }
    });
  }

  // --- 4. Contact & Quote Request Form ---
  function initContactForm() {
    var form = document.getElementById('quote-form');
    if (!form) return;

    var successCard = document.getElementById('form-success-card');
    var formContainer = document.getElementById('quote-form-container');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var nameInput = document.getElementById('form-name');
      var phoneInput = document.getElementById('form-phone');
      var productInput = document.getElementById('form-product');
      var messageInput = document.getElementById('form-message');

      var customerName = nameInput ? nameInput.value.trim() : 'Customer';
      var customerPhone = phoneInput ? phoneInput.value.trim() : '';
      var selectedProduct = productInput ? productInput.value : 'General Inquiry';
      var messageText = messageInput ? messageInput.value.trim() : '';

      // Trigger GA4 recommended primary conversion event: generate_lead
      trackEvent('generate_lead', {
        currency: 'LKR',
        value: 1,
        lead_type: 'quote_request',
        product_interest: selectedProduct,
        customer_name: customerName,
        phone_provided: Boolean(customerPhone)
      });

      // Show friendly tactile success state
      if (successCard) {
        var summaryElem = document.getElementById('success-summary');
        if (summaryElem) {
          summaryElem.textContent =
            'Thank you, ' + customerName + '! Your quote request for "' +
            selectedProduct +
            '" has been recorded. Our Ganemulla warehouse team will call you at ' +
            customerPhone + ' shortly.';
        }
        form.style.display = 'none';
        successCard.style.display = 'block';
        successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      var resetBtn = document.getElementById('btn-reset-form');
      if (resetBtn) {
        resetBtn.onclick = function () {
          form.reset();
          if (successCard) successCard.style.display = 'none';
          form.style.display = 'block';
        };
      }
    });
  }

  // --- 5. GA4 Interaction Tracking (Clicks & Views) ---
  function initAnalyticsTracking() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 5A. Track phone clicks: on every tel: link
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        var phoneNumber = this.getAttribute('href').replace('tel:', '').trim();
        var linkLocation = getLinkLocation(this);

        trackEvent('phone_click', {
          phone_number: phoneNumber,
          link_location: linkLocation,
          page_path: currentPage
        });
      });
    });

    // 5B. Track WhatsApp clicks
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(function (link) {
      link.addEventListener('click', function () {
        var linkLocation = getLinkLocation(this);

        trackEvent('whatsapp_click', {
          phone_number: '+94741502503',
          link_location: linkLocation,
          page_path: currentPage
        });
      });
    });

    // 5C. Track navigation link clicks (select_content)
    document.querySelectorAll('nav .nav_links, footer .flinks').forEach(function (link) {
      link.addEventListener('click', function () {
        var linkText = (this.textContent || '').trim().toLowerCase();
        var href = this.getAttribute('href') || '';

        trackEvent('select_content', {
          content_type: 'navigation',
          item_id: linkText || href
        });
      });
    });

    // 5D. Track Product Card Impressions (view_item) via IntersectionObserver
    var productCards = document.querySelectorAll('.sec4div, .product-card');
    if (productCards.length > 0 && 'IntersectionObserver' in window) {
      var viewedProducts = new Set();

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var card = entry.target;
              var titleElem = card.querySelector('.divhead, .cardhead, h2, h3');
              var productName = titleElem ? titleElem.textContent.trim() : 'Plywood Product';

              if (!viewedProducts.has(productName)) {
                viewedProducts.add(productName);

                trackEvent('view_item', {
                  item_id: productName.toLowerCase().replace(/\s+/g, '_'),
                  item_name: productName,
                  item_category: 'Plywood & Engineered Boards',
                  page_path: currentPage
                });
              }
            }
          });
        },
        { threshold: 0.5 }
      );

      productCards.forEach(function (card) {
        observer.observe(card);

        // Also track card clicks (select_item)
        card.addEventListener('click', function (e) {
          // If clicked a button inside or the card itself
          var titleElem = card.querySelector('.divhead, .cardhead, h2, h3');
          var productName = titleElem ? titleElem.textContent.trim() : 'Plywood Product';

          trackEvent('select_item', {
            item_id: productName.toLowerCase().replace(/\s+/g, '_'),
            item_name: productName,
            item_category: 'Plywood & Engineered Boards',
            page_path: currentPage
          });
        });
      });
    }
  }

  // Helper to identify context of click
  function getLinkLocation(element) {
    if (element.closest('header')) return 'header';
    if (element.closest('footer')) return 'footer';
    if (element.closest('.sec1bottom, .quick-contact-ribbon')) return 'contact_ribbon';
    if (element.closest('.threecards, .contact-card-grid')) return 'contact_cards';
    return 'page_body';
  }
})();
