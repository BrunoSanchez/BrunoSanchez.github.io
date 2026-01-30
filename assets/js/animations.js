// ========================================
// Animated Number Counter
// ========================================
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  
  // Validate target is a valid number
  if (isNaN(target)) {
    console.warn('Invalid data-target attribute for counter animation');
    return;
  }
  
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;
  
  // Reset to 0 to prevent race conditions
  element.textContent = '0';
  
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
  
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY; // Use scrollY instead of deprecated pageYOffset
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
  };
  
  window.addEventListener('scroll', handleScroll);
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
  const CACHE_KEY = 'github_stats_cache';
  const CACHE_DURATION = 3600000; // 1 hour in milliseconds
  
  try {
    // Check cache first to avoid rate limits
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        updateStatsFromCache(data);
        return;
      }
    }
    
    // Note: This is a simple implementation without authentication
    // For production, consider using a backend proxy to avoid rate limits
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      console.log('GitHub API rate limit may have been reached, using default values');
      return;
    }
    
    const data = await response.json();
    
    // Fetch additional stats (repositories for stars count)
    // Note: Limited to 100 repos. For users with more repos, consider pagination
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    let totalStars = 0;
    let totalForks = 0;
    
    if (reposResponse.ok) {
      const repos = await reposResponse.json();
      totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    }
    
    const statsData = {
      public_repos: data.public_repos,
      totalStars,
      totalForks
    };
    
    // Cache the results
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: statsData,
      timestamp: Date.now()
    }));
    
    updateStatsFromCache(statsData);
  } catch (error) {
    console.log('Could not fetch GitHub stats, using default values:', error.message);
  }
}

function updateStatsFromCache(data) {
  const statCards = document.querySelectorAll('.stat-card');
  
  // Safely update each stat card
  if (statCards[1] && data.public_repos) {
    const element = statCards[1].querySelector('.stat-number');
    if (element) element.setAttribute('data-target', data.public_repos);
  }
  
  if (statCards[2] && data.totalStars) {
    const element = statCards[2].querySelector('.stat-number');
    if (element) element.setAttribute('data-target', data.totalStars);
  }
  
  if (statCards[3] && data.totalForks) {
    const element = statCards[3].querySelector('.stat-number');
    if (element) element.setAttribute('data-target', data.totalForks);
  }
}

// ========================================
// Hide/Show Scroll Indicator
// ========================================
function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;
  
  const handleScroll = () => {
    if (window.scrollY > 300) {
      scrollIndicator.style.opacity = '0';
    } else {
      scrollIndicator.style.opacity = '1';
    }
  };
  
  window.addEventListener('scroll', handleScroll);
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
