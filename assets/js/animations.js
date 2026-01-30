// ========================================
// Animated Number Counter
// ========================================
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  
  updateCounter();
}

// ========================================
// Intersection Observer for Scroll Animations
// ========================================
function initScrollAnimations() {
  // Observe stat cards for counter animation
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });
  
  statNumbers.forEach(stat => {
    statsObserver.observe(stat);
  });
  
  // Observe elements for fade-in animations
  const animateElements = document.querySelectorAll('.project-card, .research-card, .skill-category, .pub-button');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in', 'visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  animateElements.forEach(element => {
    element.classList.add('animate-in');
    fadeObserver.observe(element);
  });
}

// ========================================
// Smooth Scrolling for Internal Links
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 20; // Small offset for better viewing
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// Parallax Effect for Hero Section
// ========================================
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent && scrolled < window.innerHeight) {
          // Parallax effect: content moves slower than scroll
          heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
          heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// ========================================
// Add Active State to Navigation (if present)
// ========================================
function updateActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let current = '';
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
          }
        });
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// ========================================
// Fetch GitHub Stats (Optional Enhancement)
// ========================================
async function fetchGitHubStats() {
  const username = 'BrunoSanchez';
  
  try {
    // Note: This is a simple implementation without authentication
    // For production, consider using a backend proxy to avoid rate limits
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      console.log('GitHub API rate limit may have been reached, using default values');
      return;
    }
    
    const data = await response.json();
    
    // Update stat cards with real data
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 2 && data.public_repos) {
      statCards[1].querySelector('.stat-number').setAttribute('data-target', data.public_repos);
    }
    
    // Fetch additional stats (repositories for stars count)
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (reposResponse.ok) {
      const repos = await reposResponse.json();
      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
      
      if (statCards.length >= 3 && totalStars > 0) {
        statCards[2].querySelector('.stat-number').setAttribute('data-target', totalStars);
      }
      
      if (statCards.length >= 4 && totalForks > 0) {
        statCards[3].querySelector('.stat-number').setAttribute('data-target', totalForks);
      }
    }
  } catch (error) {
    console.log('Could not fetch GitHub stats, using default values:', error.message);
  }
}

// ========================================
// Add Hover Effect Enhancement
// ========================================
function enhanceCardHovers() {
  const cards = document.querySelectorAll('.project-card, .research-card, .stat-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ========================================
// Hide/Show Scroll Indicator
// ========================================
function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollIndicator.style.opacity = '0';
    } else {
      scrollIndicator.style.opacity = '1';
    }
  });
}

// ========================================
// Performance: Debounce Function
// ========================================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================================
// Initialize Everything on DOM Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌌 Initializing cosmic portfolio...');
  
  // Initialize all features
  initScrollAnimations();
  initSmoothScroll();
  initParallax();
  updateActiveSection();
  enhanceCardHovers();
  initScrollIndicator();
  
  // Fetch GitHub stats (with fallback to default values)
  fetchGitHubStats();
  
  // Add loaded class to body for CSS transitions
  document.body.classList.add('loaded');
  
  console.log('✨ Portfolio initialized successfully!');
});

// ========================================
// Handle Window Resize
// ========================================
const handleResize = debounce(() => {
  // Recalculate any position-dependent features if needed
  console.log('Window resized');
}, 250);

window.addEventListener('resize', handleResize);

// ========================================
// Progressive Enhancement Check
// ========================================
if (!window.IntersectionObserver) {
  // Fallback for browsers without Intersection Observer
  console.log('IntersectionObserver not supported, using fallback');
  document.querySelectorAll('.animate-in').forEach(element => {
    element.classList.add('visible');
  });
  
  // Trigger counters immediately
  document.querySelectorAll('.stat-number').forEach(stat => {
    animateCounter(stat);
  });
}
