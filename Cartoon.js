// Dark Mode Toggle with Storage and Animation
const themeToggle = document.querySelector('.theme-toggle');

// Check if user previously set dark mode
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const icon = themeToggle.querySelector('i');
  
  if (document.body.classList.contains('dark-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('darkMode', 'enabled');
    
    // Add retro flicker animation to logo
    const logo = document.querySelector('.logo');
    logo.classList.add('retro-flicker');
    setTimeout(() => logo.classList.remove('retro-flicker'), 1000);
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('darkMode', 'disabled');
  }
});

// Search Toggle with Animation
const searchBtn = document.querySelector('.search-btn');
const searchContainer = document.querySelector('.search-container');
const searchInput = document.querySelector('.search-input');

searchBtn.addEventListener('click', () => {
  searchContainer.classList.toggle('active');
  if (searchContainer.classList.contains('active')) {
    setTimeout(() => searchInput.focus(), 300);
  }
});

// Auto-complete search feature
searchInput.addEventListener('input', debounce(function(e) {
  // Mock anime/cartoon data for auto-suggestions
  const animeData = [
    'Demon Slayer', 'Attack on Titan', 'My Hero Academia', 'SpongeBob SquarePants',
    'Naruto', 'Dragon Ball Z', 'One Piece', 'Sailor Moon', 'Jujutsu Kaisen',
    'Chainsaw Man', 'The Owl House', 'Arcane'
  ];
  
  const query = e.target.value.toLowerCase();
  
  if (query.length < 2) {
    removeAutoComplete();
    return;
  }
  
  const matches = animeData.filter(anime => 
    anime.toLowerCase().includes(query)
  );
  
  showAutoComplete(matches);
}, 300));

function showAutoComplete(matches) {
  removeAutoComplete();
  
  if (matches.length === 0) return;
  
  const autocompleteList = document.createElement('div');
  autocompleteList.className = 'autocomplete-list';
  
  matches.forEach(match => {
    const item = document.createElement('div');
    item.className = 'autocomplete-item';
    item.textContent = match;
    item.addEventListener('click', () => {
      searchInput.value = match;
      removeAutoComplete();
      // Trigger the search with typed glitch effect
      simulateRetroSearch(match);
    });
    autocompleteList.appendChild(item);
  });
  
  searchContainer.appendChild(autocompleteList);
}

function removeAutoComplete() {
  const existing = document.querySelector('.autocomplete-list');
  if (existing) existing.remove();
}

// Favorite Buttons with Animation
const favoriteBtns = document.querySelectorAll('.favorite-btn');
favoriteBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    
    if (btn.classList.contains('active')) {
      icon.classList.replace('far', 'fas');
      // Add favorite animation
      icon.classList.add('favorite-pulse');
      setTimeout(() => icon.classList.remove('favorite-pulse'), 500);
      
      // Save to local storage
      const showTitle = btn.closest('.cartoon-card').querySelector('h3').textContent;
      saveFavorite(showTitle);
      
      // Show toast notification
      showToast(`${showTitle} added to favorites!`);
    } else {
      icon.classList.replace('fas', 'far');
      
      // Remove from local storage
      const showTitle = btn.closest('.cartoon-card').querySelector('h3').textContent;
      removeFavorite(showTitle);
      
      // Show toast notification
      showToast(`${showTitle} removed from favorites.`);
    }
  });
});

// Favorites Storage
function saveFavorite(title) {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (!favorites.includes(title)) {
    favorites.push(title);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

function removeFavorite(title) {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  favorites = favorites.filter(fav => fav !== title);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Load favorites from storage on page load
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  
  favoriteBtns.forEach(btn => {
    const showTitle = btn.closest('.cartoon-card').querySelector('h3').textContent;
    if (favorites.includes(showTitle)) {
      btn.classList.add('active');
      btn.querySelector('i').classList.replace('far', 'fas');
    }
  });
}
loadFavorites();

// Cartoon Card Click (Modal) with Animation
const cartoonCards = document.querySelectorAll('.cartoon-card');
const modal = document.getElementById('show-modal');
const closeModal = document.querySelector('.close-modal');

cartoonCards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('h3').textContent;
    const imgSrc = card.querySelector('img').src;
    const rating = card.querySelector('.rating span').textContent;
    const description = card.querySelector('p').textContent;
    
    // Get tags
    const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent).join(', ');
    
    // Update modal content
    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-img').src = imgSrc;
    modal.querySelector('.modal-rating').textContent = `${rating}/5`;
    modal.querySelector('.modal-genre').textContent = tags;
    modal.querySelector('.modal-description p').textContent = description;
    
    // Random episode count and status for demo purposes
    modal.querySelector('.modal-episodes').textContent = Math.floor(Math.random() * 24) + 12;
    modal.querySelector('.modal-status').textContent = Math.random() > 0.5 ? 'Ongoing' : 'Completed';
    
    // Show modal with retro loading effect
    modal.classList.add('active');
    simulateRetroLoading(modal.querySelector('.modal-content'));
  });
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

// Retro Loading Animation
function simulateRetroLoading(element) {
  element.classList.add('retro-loading');
  
  // Simulate loading data with retro text effect
  const loadingText = document.createElement('div');
  loadingText.className = 'loading-text';
  loadingText.innerHTML = 'LOADING DATA...';
  element.appendChild(loadingText);
  
  // Loading progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'loading-progress';
  element.appendChild(progressBar);
  
  // Simulate loading
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      // Remove loading elements
      setTimeout(() => {
        loadingText.remove();
        progressBar.remove();
        element.classList.remove('retro-loading');
        
        // Show content with CRT scan effect
        element.classList.add('crt-on');
      }, 500);
    }
    progressBar.style.width = `${progress}%`;
  }, 100);
}

// Newsletter Form with Validation and Animation
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailInput = newsletterForm.querySelector('input');
  const email = emailInput.value;
  
  if (!validateEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    emailInput.classList.add('input-error');
    setTimeout(() => emailInput.classList.remove('input-error'), 2000);
    return;
  }
  
  // Simulate sending with retro terminal effect
  simulateRetroTerminal('SENDING EMAIL DATA...', 'EMAIL SUBSCRIPTION CONFIRMED');
  
  // Success animation
  showToast(`Thank you for subscribing with ${email}! You'll receive our updates soon.`);
  newsletterForm.reset();
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Active Navigation with Retro Sound
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Play retro sound effect
    playRetroSound('click');
    
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Add retro navigation effect
    simulatePageChange(link.textContent);
  });
});

// Character Slider with Dragging
const characterSlider = document.querySelector('.character-slider');
let isDown = false;
let startX;
let scrollLeft;

characterSlider.addEventListener('mousedown', (e) => {
  isDown = true;
  characterSlider.classList.add('active');
  startX = e.pageX - characterSlider.offsetLeft;
  scrollLeft = characterSlider.scrollLeft;
});

characterSlider.addEventListener('mouseleave', () => {
  isDown = false;
  characterSlider.classList.remove('active');
});

characterSlider.addEventListener('mouseup', () => {
  isDown = false;
  characterSlider.classList.remove('active');
});

characterSlider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - characterSlider.offsetLeft;
  const walk = (x - startX) * 2; // Scroll speed
  characterSlider.scrollLeft = scrollLeft - walk;
});

// Character Cards Animation
const characterCards = document.querySelectorAll('.character-card');
characterCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    playRetroSound('hover');
    card.classList.add('character-glow');
  });
  
  card.addEventListener('mouseleave', () => {
    card.classList.remove('character-glow');
  });
  
  card.addEventListener('click', () => {
    // Character info popup with pixelated zoom effect
    showCharacterDetails(card);
  });
});

// Retro Toast Notification
function showToast(message, type = 'success') {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Show with glitch effect
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Auto hide
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// Show Character Details
function showCharacterDetails(card) {
  const characterName = card.querySelector('.character-name').textContent;
  const characterShow = card.querySelector('.character-show').textContent;
  const characterImg = card.querySelector('.character-img').src;
  
  // Create character popup
  const popup = document.createElement('div');
  popup.className = 'character-popup';
  popup.innerHTML = `
    <div class="character-popup-content">
      <button class="close-popup">&times;</button>
      <div class="character-popup-header">
        <img src="${characterImg}" alt="${characterName}">
        <div>
          <h2>${characterName}</h2>
          <p>Series: ${characterShow}</p>
        </div>
      </div>
      <div class="character-popup-body">
        <div class="character-stats">
          <div class="stat">
            <h4>POWER</h4>
            <div class="stat-bar">
              <div class="stat-fill" style="width: ${Math.random() * 100}%"></div>
            </div>
          </div>
          <div class="stat">
            <h4>SPEED</h4>
            <div class="stat-bar">
              <div class="stat-fill" style="width: ${Math.random() * 100}%"></div>
            </div>
          </div>
          <div class="stat">
            <h4>DEFENSE</h4>
            <div class="stat-bar">
              <div class="stat-fill" style="width: ${Math.random() * 100}%"></div>
            </div>
          </div>
          <div class="stat">
            <h4>TECHNIQUE</h4>
            <div class="stat-bar">
              <div class="stat-fill" style="width: ${Math.random() * 100}%"></div>
            </div>
          </div>
        </div>
        <div class="character-description">
          <h3>ABOUT</h3>
          <p>This is a retro-styled character description for ${characterName} from ${characterShow}. Character information would appear here with typical anime statistics and background story.</p>
        </div>
        <button class="btn btn-accent view-episodes">VIEW EPISODES</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Add retro animation
  setTimeout(() => {
    popup.classList.add('active');
    simulateRetroLoading(popup.querySelector('.character-popup-content'));
  }, 10);
  
  // Close popup
  popup.querySelector('.close-popup').addEventListener('click', () => {
    popup.classList.remove('active');
    setTimeout(() => popup.remove(), 500);
  });
  
  // Close when clicking outside
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('active');
      setTimeout(() => popup.remove(), 500);
    }
  });
  
  // View episodes button
  popup.querySelector('.view-episodes').addEventListener('click', () => {
    showToast(`Episodes for ${characterName} loading soon!`);
    playRetroSound('select');
  });
}

// Simulate Retro Terminal
function simulateRetroTerminal(loadingText, successText) {
  const terminal = document.createElement('div');
  terminal.className = 'retro-terminal';
  terminal.innerHTML = `
    <div class="terminal-header">
      <span>CARTOONIX.EXE</span>
      <button class="close-terminal">×</button>
    </div>
    <div class="terminal-body">
      <p class="command">C:\\> <span class="typing">${loadingText}</span></p>
      <div class="terminal-progress">
        <div class="progress-fill"></div>
      </div>
      <p class="response"></p>
    </div>
  `;
  
  document.body.appendChild(terminal);
  
  // Activate
  setTimeout(() => terminal.classList.add('active'), 10);
  
  // Close button
  terminal.querySelector('.close-terminal').addEventListener('click', () => {
    terminal.classList.remove('active');
    setTimeout(() => terminal.remove(), 500);
  });
  
  // Simulate progress
  const progressFill = terminal.querySelector('.progress-fill');
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      
      // Show success text
      const response = terminal.querySelector('.response');
      typeWriterEffect(response, successText);
      
      // Auto close after delay
      setTimeout(() => {
        terminal.classList.remove('active');
        setTimeout(() => terminal.remove(), 500);
      }, 4000);
    }
    progressFill.style.width = `${progress}%`;
  }, 100);
}

// Simulate Page Change with Retro Effect
function simulatePageChange(pageName) {
  const pageTransition = document.createElement('div');
  pageTransition.className = 'page-transition';
  pageTransition.innerHTML = `
    <div class="scanline"></div>
    <div class="transition-text">LOADING ${pageName}</div>
  `;
  
  document.body.appendChild(pageTransition);
  
  setTimeout(() => {
    pageTransition.classList.add('active');
    
    // Remove after animation completes
    setTimeout(() => {
      pageTransition.classList.remove('active');
      setTimeout(() => pageTransition.remove(), 1000);
    }, 1500);
  }, 10);
}

// Simulate Retro Search
function simulateRetroSearch(query) {
  const searchEffect = document.createElement('div');
  searchEffect.className = 'search-effect';
  searchEffect.innerHTML = `
    <div class="search-result-text">SEARCHING DATABASE FOR: <span class="typing">${query}</span></div>
    <div class="result-count">FOUND: <span class="count-number">0</span> RESULTS</div>
  `;
  
  document.body.appendChild(searchEffect);
  
  // Animate search
  setTimeout(() => {
    searchEffect.classList.add('active');
    
    // Count up effect
    const countElement = searchEffect.querySelector('.count-number');
    let currentCount = 0;
    const targetCount = Math.floor(Math.random() * 50) + 5;
    
    const countInterval = setInterval(() => {
      currentCount++;
      countElement.textContent = currentCount;
      
      if (currentCount >= targetCount) {
        clearInterval(countInterval);
        
        // Show completion message
        searchEffect.innerHTML += `<div class="search-complete">SEARCH COMPLETE. PRESS ANY KEY TO CONTINUE.</div>`;
        
        // Any key to dismiss
        document.addEventListener('keydown', dismissSearch);
        document.addEventListener('click', dismissSearch);
        
        function dismissSearch() {
          document.removeEventListener('keydown', dismissSearch);
          document.removeEventListener('click', dismissSearch);
          
          searchEffect.classList.remove('active');
          setTimeout(() => searchEffect.remove(), 500);
        }
      }
    }, 50);
  }, 10);
}

// Retro Sound Effects
function playRetroSound(type) {
  // Check if user has interacted with the page to enable audio (browser policy)
  if (document.documentElement.hasAttribute('data-user-interacted')) {
    const sound = new Audio();
    
    switch(type) {
      case 'click':
        sound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3';
        break;
      case 'hover':
        sound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3';
        break;
      case 'select':
        sound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-video-game-retro-click-237.mp3';
        break;
      default:
        sound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-mechanical-bling-210.mp3';
    }
    
    sound.volume = 0.3;
    sound.play().catch(err => console.log('Audio could not play:', err));
  }
}

// Enable sound after first user interaction
document.addEventListener('click', enableSound, { once: true });
document.addEventListener('keydown', enableSound, { once: true });

function enableSound() {
  document.documentElement.setAttribute('data-user-interacted', 'true');
}

// Type Writer Effect
function typeWriterEffect(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Add Glitch Effect to Random Elements
function addRandomGlitchEffects() {
  const allTitles = document.querySelectorAll('h2.section-title');
  
  setInterval(() => {
    // Pick random title to glitch
    const randomTitle = allTitles[Math.floor(Math.random() * allTitles.length)];
    randomTitle.classList.add('text-glitch');
    setTimeout(() => randomTitle.classList.remove('text-glitch'), 1000);
  }, 5000);
}
addRandomGlitchEffects();

// Scroll Animation for Cards
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('.cartoon-card, .character-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animateElements.forEach(element => {
    observer.observe(element);
  });
}
initScrollAnimations();

// Add Retro Easter Egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    
    if (konamiIndex === konamiCode.length) {
      activateRetroMode();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateRetroMode() {
  document.documentElement.classList.add('ultra-retro-mode');
  playRetroSound('select');
  
  showToast('ULTRA RETRO MODE ACTIVATED!');
  
  // Create retro game intro
  const retroIntro = document.createElement('div');
  retroIntro.className = 'retro-game-intro';
  retroIntro.innerHTML = `
    <div class="retro-game-text">
      <div class="pixel-text">CARTOONIX</div>
      <div class="subtitle">ULTIMATE EDITION</div>
      <div class="press-start">PRESS ENTER TO START</div>
    </div>
  `;
  
  document.body.appendChild(retroIntro);
  
  setTimeout(() => {
    retroIntro.classList.add('active');
    
    // Listen for enter key
    const enterHandler = (e) => {
      if (e.key === 'Enter') {
        retroIntro.classList.remove('active');
        setTimeout(() => retroIntro.remove(), 1000);
        document.removeEventListener('keydown', enterHandler);
        
        // Reset after some time
        setTimeout(() => {
          document.documentElement.classList.remove('ultra-retro-mode');
          showToast('ULTRA RETRO MODE DEACTIVATED');
        }, 30000);
      }
    };
    
    document.addEventListener('keydown', enterHandler);
  }, 100);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Add CRT scanline effect
  const crtEffect = document.createElement('div');
  crtEffect.className = 'crt-effect';
  document.body.appendChild(crtEffect);
  
  // Show welcome message
  setTimeout(() => {
    showToast('Welcome to CARTOONIX - Anime & Cartoon Hub!');
  }, 1000);
});