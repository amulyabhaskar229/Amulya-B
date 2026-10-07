/**
 * Portfolio Interactive Scripts
 * Handles:
 * - Night / Light Mode Toggle using CSS media queries (prefers-color-scheme)
 *   with manual override & localStorage persistence
 * - Vertical Sidebar Navigation (left side) with smooth scrolling & IntersectionObserver active tracking
 * - Mobile vertical sidebar drawer toggle & overlay
 * - Interactive AI Dev Assistant Terminal Chat
 * - Dynamic Footer Year
 * - Contact Form Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. NIGHT MODE / THEME TOGGLE (CSS MEDIA QUERY DETECTED)
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const heroThemeToggle = document.getElementById('hero-theme-toggle');
  const btnResetTheme = document.getElementById('btn-reset-theme');
  const currentThemeLabel = document.getElementById('current-theme-name');
  const rootElement = document.documentElement;

  // Media query for system theme detection
  const systemDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');

  function updateThemeUI(activeTheme, isAutoSynced) {
    const isDark = activeTheme === 'dark';

    // Update Header Button
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeToggleBtn.setAttribute(
        'title',
        isDark ? 'Switch to light mode' : 'Switch to night mode'
      );
    }

    // Update Hero Toggle Widget
    if (currentThemeLabel) {
      const modeText = isDark ? 'Night' : 'Day';
      const statusSuffix = isAutoSynced ? 'Auto (OS Default)' : 'Manual Override';
      currentThemeLabel.innerHTML = `<strong>${modeText}</strong> <span style="opacity: 0.7; font-weight: normal; font-size: 0.8rem;">[${statusSuffix}]</span>`;
    }
  }

  function applyTheme(theme, isManual = false) {
    rootElement.setAttribute('data-theme', theme);
    if (isManual) {
      localStorage.setItem('portfolio-theme', theme);
    } else {
      localStorage.removeItem('portfolio-theme');
    }
    updateThemeUI(theme, !isManual);
  }

  // Initialize theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    applyTheme(savedTheme, true);
  } else {
    const detectedTheme = systemDarkMedia.matches ? 'dark' : 'light';
    applyTheme(detectedTheme, false);
  }

  // Toggle theme action
  function toggleTheme() {
    const currentTheme = rootElement.getAttribute('data-theme') || (systemDarkMedia.matches ? 'dark' : 'light');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (heroThemeToggle) heroThemeToggle.addEventListener('click', toggleTheme);

  if (btnResetTheme) {
    btnResetTheme.addEventListener('click', () => {
      const detectedTheme = systemDarkMedia.matches ? 'dark' : 'light';
      applyTheme(detectedTheme, false);
    });
  }

  systemDarkMedia.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  // =========================================================================
  // 2. VERTICAL LEFT SIDEBAR NAVIGATION & ACTIVE TRACKING
  // =========================================================================
  const sidebarNav = document.getElementById('sidebar-nav');
  const sidebarToggleBtn = document.getElementById('sidebar-mobile-toggle');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav-link');

  function openSidebar() {
    if (sidebarNav) sidebarNav.classList.add('is-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = window.innerWidth < 1024 ? 'hidden' : '';
  }

  function closeSidebar() {
    if (sidebarNav) sidebarNav.classList.remove('is-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      const isOpen = sidebarNav && sidebarNav.classList.contains('is-open');
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

  // Close sidebar on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarNav && sidebarNav.classList.contains('is-open')) {
      closeSidebar();
    }
  });

  // Smooth scroll and active state on click
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          targetSection.scrollIntoView({ behavior: 'smooth' });

          sidebarLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');

          if (window.innerWidth < 1024) {
            closeSidebar();
          }
        }
      }
    });
  });

  // Dynamic ScrollSpy using IntersectionObserver for Vertical Navbar
  const sectionIds = ['hero', 'about', 'skills', 'timeline', 'projects', 'testimonials', 'chat', 'contact'];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.id;
          sidebarLinks.forEach((link) => {
            const matches = link.getAttribute('href') === `#${activeId}` || link.dataset.section === activeId;
            if (matches) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
            } else {
              link.classList.remove('active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Top header mobile menu toggle (if present)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
    });
  }

  // =========================================================================
  // 3. INTERACTIVE TERMINAL CHAT ASSISTANT
  // =========================================================================
  const chatForm = document.getElementById('chat-form');
  const chatInputField = document.getElementById('chat-input-field');
  const chatMessagesArea = document.getElementById('chat-messages');
  const chatPromptChips = document.querySelectorAll('.chat-prompt-chip');

  const botResponses = {
    'stack': 'Amulya\'s primary stack includes TypeScript, Go (Golang), React/Next.js, PostgreSQL, Docker, Kubernetes, and AWS microservices with gRPC and GraphQL!',
    'hire': 'Yes! Amulya is currently open to full-time Software Engineering roles, contract consulting, and high-impact distributed systems work.',
    'project': 'Amulya\'s highlighted projects are: 1) Synapse DB (50k req/sec Raft telemetry engine), 2) DevPulse Analytics (real-time developer productivity), and 3) CloudForge CLI for multi-cloud deployments.',
    'anime': 'The visual inspiration draws from Makoto Shinkai\'s celestial skies (Your Name, Weathering with You) mixed with Ghost in the Shell and Cyberpunk neon HUD aesthetics!'
  };

  function appendChatMessage(sender, text, isBot = false) {
    if (!chatMessagesArea) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    bubble.innerHTML = `
      <div class="bubble-avatar">${isBot ? '🌸' : '👤'}</div>
      <div class="bubble-content">
        <p><strong>${sender}:</strong> ${text}</p>
        <time class="bubble-time">${timeString}</time>
      </div>
    `;

    chatMessagesArea.appendChild(bubble);
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
  }

  function handleUserQuery(query) {
    if (!query || !query.trim()) return;

    const cleanQuery = query.trim();
    appendChatMessage('You', cleanQuery, false);

    // =========================================================================
    // TODO: AI API INTEGRATION (e.g., OpenAI / Gemini)
    // =========================================================================
    // To make this chat truly intelligent, you would replace the hard-coded 
    // mock logic below with an API call to a backend server.
    // 
    // Example:
    // fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: cleanQuery })
    // })
    // .then(res => res.json())
    // .then(data => appendChatMessage("Amulya's Assistant", data.reply, true))
    // .catch(err => console.error(err));
    // =========================================================================

    // Determine contextual bot response (MOCK LOGIC)
    const lower = cleanQuery.toLowerCase();
    let reply = 'Thank you for your message! Amulya usually responds to custom inquiries within a few hours. Feel free to connect directly via email or LinkedIn!';

    if (lower.includes('stack') || lower.includes('language') || lower.includes('tech') || lower.includes('tool')) {
      reply = botResponses.stack;
    } else if (lower.includes('hire') || lower.includes('job') || lower.includes('available') || lower.includes('work') || lower.includes('role')) {
      reply = botResponses.hire;
    } else if (lower.includes('project') || lower.includes('portfolio') || lower.includes('synapse') || lower.includes('devpulse')) {
      reply = botResponses.project;
    } else if (lower.includes('anime') || lower.includes('aesthetic') || lower.includes('inspiration') || lower.includes('design')) {
      reply = botResponses.anime;
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('konnichiwa')) {
      reply = 'Konnichiwa! Great to connect. What would you like to know about Amulya\'s work, engineering philosophy, or tech stack?';
    }

    // Realistic typing delay
    setTimeout(() => {
      appendChatMessage("Amulya's Assistant", reply, true);
    }, 450);
  }

  if (chatForm && chatInputField) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInputField.value;
      if (text) {
        handleUserQuery(text);
        chatInputField.value = '';
      }
    });
  }

  chatPromptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-msg') || chip.textContent;
      handleUserQuery(promptText);
    });
  });

  // =========================================================================
  // 4. DYNAMIC YEAR IN FOOTER
  // =========================================================================
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 5. CONTACT FORM SUBMIT (WITH API INTEGRATION COMMENTS)
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      // Show processing state
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Sending... ⏳</span>';
        submitBtn.disabled = true;
      }

      // =========================================================================
      // TODO: EMAIL SERVICE INTEGRATION (e.g., Resend API)
      // =========================================================================
      // Replace the setTimeout mock below with an actual fetch request to your 
      // backend API that uses a service like Resend to send the email.
      //
      // Example implementation:
      // const formData = new FormData(contactForm);
      // const data = Object.fromEntries(formData.entries());
      // 
      // fetch('/api/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      // .then(response => {
      //   if (response.ok) {
      //     // Success confirmation
      //     submitBtn.innerHTML = '<span>Message Sent! ✨</span>';
      //     submitBtn.style.backgroundColor = '#10b981'; // Success color
      //     setTimeout(() => contactForm.reset(), 3000);
      //   } else {
      //     throw new Error('Network response was not ok');
      //   }
      // })
      // .catch(error => {
      //   console.error('Error sending message:', error);
      //   submitBtn.innerHTML = '<span>Error Sending ❌</span>';
      // })
      // .finally(() => {
      //   setTimeout(() => {
      //     submitBtn.innerHTML = originalText;
      //     submitBtn.disabled = false;
      //     submitBtn.style.backgroundColor = '';
      //   }, 4000);
      // });
      // =========================================================================

      // MOCK LOGIC for visual demonstration
      setTimeout(() => {
        if (submitBtn) {
          // Display success confirmation message
          submitBtn.innerHTML = '<span>Message Sent! ✨</span>';
        }
        
        setTimeout(() => {
          contactForm.reset();
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        }, 3000);
      }, 1200);
    });
  }

  // =========================================================================
  // 6. ABOUT ME: AVATAR MODE SWITCHER (PHOTO <-> ANIME)
  // =========================================================================
  const btnPhotoMode = document.getElementById('btn-photo-mode');
  const btnAnimeMode = document.getElementById('btn-anime-mode');
  const aboutProfileImg = document.getElementById('about-profile-img');

  if (btnPhotoMode && btnAnimeMode && aboutProfileImg) {
    function switchAvatar(activeBtn, inactiveBtn, src) {
      aboutProfileImg.style.opacity = '0';
      aboutProfileImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        aboutProfileImg.src = src;
        aboutProfileImg.style.opacity = '1';
        aboutProfileImg.style.transform = 'scale(1)';
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-pressed', 'true');
        inactiveBtn.classList.remove('active');
        inactiveBtn.setAttribute('aria-pressed', 'false');
      }, 180);
    }

    btnPhotoMode.addEventListener('click', () => {
      const src = btnPhotoMode.getAttribute('data-img');
      switchAvatar(btnPhotoMode, btnAnimeMode, src);
    });

    btnAnimeMode.addEventListener('click', () => {
      const src = btnAnimeMode.getAttribute('data-img');
      switchAvatar(btnAnimeMode, btnPhotoMode, src);
    });
  }

  // =========================================================================
  // 7. SKILLS SECTION: FILTER TABS + ANIMATED PROGRESS BARS
  // =========================================================================

  // ---- 7a. Helper: animate all progress/mini bars inside a container --------
  // Reads the inline `style="width: XX%"` that was set in HTML as the target,
  // resets to 0 first so re-triggers always show the sweep animation.
  function animateBarsIn(container) {
    // Animate featured-card main meter fills (8px tall bars)
    container.querySelectorAll('.meter-fill').forEach(fill => {
      const target = fill.style.getPropertyValue('--target-width') || fill.getAttribute('style').match(/width:\s*([\d.]+%)/)?.[1] || '0%';
      fill.style.width = '0%'; // reset
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fill.style.width = target;
        });
      });
    });

    // Animate mini bars inside category cards (5px tall bars)
    container.querySelectorAll('.mini-bar-fill').forEach(bar => {
      // Read target from data-width attr (set in HTML), not live style
      const target = bar.getAttribute('data-width') || '0%';
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.width = target;
        });
      });
    });
  }

  // ---- 7b. IntersectionObserver: entrance animation + bar trigger on scroll --
  // Observes every .skill-featured-card and .skill-group-card.
  // When 20% of the card enters the viewport it:
  //   1. Adds `.skill-visible` → triggers CSS entrance keyframe animation
  //   2. Calls animateBarsIn() to sweep all progress bars
  //   3. Unobserves (fires once per card lifetime)
  const skillCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        // Add class that triggers @keyframes skillCardEntrance in CSS
        card.classList.add('skill-visible');
        // Animate progress/mini bars inside this card
        animateBarsIn(card);
        // Each card only animates once
        skillCardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.2 });

  // Observe all skill cards (featured language + category group)
  document.querySelectorAll('.skill-featured-card, .skill-group-card').forEach(card => {
    skillCardObserver.observe(card);
  });

  // ---- 7c. Filter pill tab switching ----------------------------------------
  // When a filter button is clicked:
  //   1. Toggle `.active` class on the button row
  //   2. Show/hide cards based on matching data-category vs data-filter
  //   3. Re-animate bars for any newly revealed cards
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const allFeaturedCards = document.querySelectorAll('.skill-featured-card');
  const allGroupCards = document.querySelectorAll('.skill-group-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide featured language cards (category: "core-lang")
      allFeaturedCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || filter === cat;
        card.classList.toggle('skill-filter-hidden', !show);
        // Re-animate bars on reveal so the sweep plays again
        if (show) {
          setTimeout(() => animateBarsIn(card), 50);
        }
      });

      // Show/hide category group cards (frameworks, tools, cs-core)
      allGroupCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || filter === cat;
        card.classList.toggle('skill-filter-hidden', !show);
        if (show) {
          setTimeout(() => animateBarsIn(card), 50);
        }
      });
    });
  });

  // =========================================================================
  // 8. TIMELINE SECTION: SCROLL-IN ENTRANCE ANIMATION
  // =========================================================================
  // Each .tl-item starts invisible (opacity:0, translateY:30px via CSS).
  // When 15% of the item enters the viewport, .tl-visible is added which
  // triggers the CSS transition → opacity:1, translateY:0.
  // Per-item stagger delays are set in CSS via nth-child selectors.
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('tl-visible');
        tlObserver.unobserve(entry.target); // fire only once per item
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.tl-item').forEach(item => {
    tlObserver.observe(item);
  });

  // =========================================================================
  // 9. PROJECTS SECTION: THUMBNAIL → MODAL DETAIL VIEW
  // =========================================================================
  // Architecture:
  //   Each .proj-thumb card has data-project="<id>".
  //   The matching detail modal has id="modal-<id>".
  //   Clicking a card (or pressing Enter/Space) opens the modal by:
  //     1. Finding document.getElementById('modal-' + projectId)
  //     2. Removing its `hidden` attribute
  //     3. Adding the `.is-open` CSS class (triggers opacity + slide-up anim)
  //   Closing is done by: × button, clicking backdrop, or pressing Escape.

  function openProjectModal(projectId) {
    const modal = document.getElementById('modal-' + projectId);
    if (!modal) return;
    modal.removeAttribute('hidden');       // remove HTML hidden attr
    // Double rAF: let browser render element first, then animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add('is-open');
      });
    });
    document.body.style.overflow = 'hidden'; // lock page scroll
    const closeBtn = modal.querySelector('.proj-modal-close');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 50); // move focus
  }

  function closeProjectModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.addEventListener('transitionend', () => {
      modal.setAttribute('hidden', '');
    }, { once: true });
    document.body.style.overflow = ''; // restore scroll
  }

  // Attach click + keyboard listeners to every .proj-thumb card
  document.querySelectorAll('.proj-thumb').forEach(card => {
    card.addEventListener('click', () => {
      openProjectModal(card.getAttribute('data-project'));
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(card.getAttribute('data-project'));
      }
    });
  });

  // × close button inside each modal
  document.querySelectorAll('.proj-modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      closeProjectModal(btn.closest('.proj-modal-backdrop'));
    });
  });

  // Click on the dark backdrop (outside the panel) closes the modal
  document.querySelectorAll('.proj-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeProjectModal(backdrop);
    });
  });

  // Escape key closes the currently open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const open = document.querySelector('.proj-modal-backdrop.is-open');
      if (open) closeProjectModal(open);
    }
  });

  // Scroll-in entrance animation for thumbnail cards
  const projCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('proj-visible');
        projCardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.proj-thumb').forEach(card => {
    projCardObserver.observe(card);
  });

});
