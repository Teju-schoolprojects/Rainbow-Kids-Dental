document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scrolled State ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Navigation Menu ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      // Simple toggle animation representation for burger icon if present
      const svg = menuToggle.querySelector('svg');
      if (svg) {
        svg.style.transform = navMenu.classList.contains('active') ? 'rotate(90deg)' : 'none';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const svg = menuToggle.querySelector('svg');
        if (svg) svg.style.transform = 'none';
      });
    });
  }

  // --- Scrollspy Navigation Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  // --- Interactive Mascot Tips ---
  const mascotTips = [
    "Hey there! Brush your teeth twice a day for two full minutes! ⏰",
    "Flossing helps clean places where your toothbrush can't reach. 🧵",
    "Limit sugary snacks! Apples and carrots are super delicious and great for teeth! 🍎🥕",
    "Visit your friendly dentist twice a year to keep your smile bright! 🦷✨",
    "Change your toothbrush every three months or after you've been sick! 🪥"
  ];
  
  let currentTipIndex = 0;
  const speechBubbleText = document.querySelector('.speech-bubble p');
  const tipDots = document.querySelectorAll('.tip-dot');

  function updateMascotTip(index) {
    if (!speechBubbleText) return;
    currentTipIndex = index;
    speechBubbleText.textContent = mascotTips[currentTipIndex];
    
    tipDots.forEach((dot, idx) => {
      if (idx === currentTipIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  if (tipDots.length > 0) {
    tipDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        updateMascotTip(index);
      });
    });
    
    // Auto cycle mascot tips every 8 seconds when timer is not running
    let tipTimer = setInterval(() => {
      if (!timerInterval) {
        let nextIndex = (currentTipIndex + 1) % mascotTips.length;
        updateMascotTip(nextIndex);
      }
    }, 8000);
  }

  // --- Brushing Timer Game Logic ---
  const playButton = document.getElementById('timer-play');
  const resetButton = document.getElementById('timer-reset');
  const timerDigits = document.querySelector('.timer-digits');
  const progressRing = document.querySelector('.timer-ring-progress');
  const gameMascotBubble = document.getElementById('game-mascot-bubble');
  
  let timerInterval = null;
  const totalSeconds = 120; // 2 minutes
  let timeRemaining = totalSeconds;
  const maxStrokeOffset = 628; // SVG stroke circumference (2 * PI * r = 2 * 3.14 * 100)

  // Configure initial stroke dash offset
  if (progressRing) {
    progressRing.style.strokeDashoffset = maxStrokeOffset;
  }

  function getTimerSpeechText(secondsLeft) {
    if (secondsLeft === 0) return "Hooray! Your teeth are super clean and shiny! Sparkle Dino is proud! 🌟🏆";
    if (secondsLeft <= 30) return "Almost done! Don't forget your tongue! You're doing awesome! 👅✨";
    if (secondsLeft <= 60) return "Halfway there! Keep going, brush the chewing surfaces! 🦷🌈";
    if (secondsLeft <= 90) return "Great job! Now brush the back teeth on the sides! 🦖🪥";
    return "Start brushing! Brush the front teeth up and down! 🪥✨";
  }

  function updateTimerUI() {
    if (!timerDigits) return;
    
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDigits.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Update progress circle ring
    if (progressRing) {
      const offset = (timeRemaining / totalSeconds) * maxStrokeOffset;
      progressRing.style.strokeDashoffset = offset;
    }

    // Update game speech bubble tip
    if (gameMascotBubble) {
      gameMascotBubble.textContent = getTimerSpeechText(timeRemaining);
    }
  }

  function startTimer() {
    if (timerInterval) return;

    // Toggle button icons (simple style updates for demonstration)
    const playIcon = playButton.querySelector('.icon-play');
    const pauseIcon = playButton.querySelector('.icon-pause');
    if (playIcon && pauseIcon) {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    }

    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateTimerUI();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        triggerCompletionAnimation();
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;

    const playIcon = playButton.querySelector('.icon-play');
    const pauseIcon = playButton.querySelector('.icon-pause');
    if (playIcon && pauseIcon) {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  function resetTimer() {
    pauseTimer();
    timeRemaining = totalSeconds;
    updateTimerUI();
  }

  function triggerCompletionAnimation() {
    // Reset play button icon
    const playIcon = playButton.querySelector('.icon-play');
    const pauseIcon = playButton.querySelector('.icon-pause');
    if (playIcon && pauseIcon) {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }

    // Soft flashing effect on game screen
    const gameConsole = document.querySelector('.game-console');
    if (gameConsole) {
      gameConsole.style.transition = 'background-color 0.5s ease';
      gameConsole.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
      setTimeout(() => {
        gameConsole.style.backgroundColor = 'var(--clr-bg-card)';
      }, 2000);
    }
  }

  if (playButton) {
    playButton.addEventListener('click', () => {
      if (timerInterval) {
        pauseTimer();
      } else {
        startTimer();
      }
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', resetTimer);
  }

  // --- Testimonial Carousel ---
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  const dotsContainer = document.querySelector('.carousel-indicator-dots');

  if (track && cards.length > 0) {
    let currentSlide = 0;
    
    // Create dots dynamic indicator
    if (dotsContainer) {
      cards.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('carousel-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    const dots = document.querySelectorAll('.carousel-dot');

    function moveToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update dots state
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        let index = (currentSlide + 1) % cards.length;
        moveToSlide(index);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        let index = (currentSlide - 1 + cards.length) % cards.length;
        moveToSlide(index);
      });
    }

    // Auto-scroll testimonials
    let carouselAutoInterval = setInterval(() => {
      let index = (currentSlide + 1) % cards.length;
      moveToSlide(index);
    }, 6000);

    // Pause auto scroll on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselAutoInterval));
      carouselContainer.addEventListener('mouseleave', () => {
        carouselAutoInterval = setInterval(() => {
          let index = (currentSlide + 1) % cards.length;
          moveToSlide(index);
        }, 6000);
      });
    }
  }

  // --- Appointment Booking Form ---
  const bookingForm = document.getElementById('booking-form');
  const successOverlay = document.getElementById('booking-success-overlay');
  const successCloseBtn = document.getElementById('success-close-btn');
  const bookingDateInput = document.getElementById('booking-date');

  if (bookingDateInput) {
    // Prevent past date bookings
    const todayStr = new Date().toISOString().split('T')[0];
    bookingDateInput.setAttribute('min', todayStr);

    // Alert if selected date is Sunday
    bookingDateInput.addEventListener('input', (e) => {
      if (e.target.value) {
        const selectedDate = new Date(e.target.value);
        const dayOfWeek = selectedDate.getUTCDay(); // 0 is Sunday
        if (dayOfWeek === 0) {
          alert("Sundays are our Family Rest Days! Rainbow Kids Dental is closed on Sundays. Please select a different magical date.");
          e.target.value = '';
        }
      }
    });
  }

  if (bookingForm && successOverlay) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate inputs
      const parentName = document.getElementById('parent-name').value.trim();
      const childName = document.getElementById('child-name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const date = document.getElementById('booking-date').value;
      const service = document.getElementById('booking-service').value;

      if (!parentName || !childName || !phone || !date || !service) {
        alert("Please fill in all details before submitting!");
        return;
      }

      // Sunday double check validation
      const selectedDate = new Date(date);
      const dayOfWeek = selectedDate.getUTCDay();
      if (dayOfWeek === 0) {
        alert("Sundays are our Family Rest Days! Rainbow Kids Dental is closed on Sundays. Please select a different magical date.");
        return;
      }

      // Animate and show Success Screen overlay inside card
      successOverlay.classList.add('active');
      bookingForm.reset();
    });
  }

  if (successCloseBtn && successOverlay) {
    successCloseBtn.addEventListener('click', () => {
      successOverlay.classList.remove('active');
    });
  }

  // --- Tour Video Controls ---
  const tourVideo = document.getElementById('tour-video');
  const videoOverlay = document.getElementById('video-overlay');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');

  if (tourVideo && videoOverlay) {
    videoOverlay.addEventListener('click', () => {
      if (tourVideo.paused) {
        tourVideo.muted = false; // Unmute programmatically on play
        tourVideo.play();
        videoOverlay.style.background = 'rgba(15, 23, 42, 0.05)';
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        // Auto hide overlay after 1.5s
        setTimeout(() => {
          if (!tourVideo.paused) {
            videoOverlay.style.opacity = '0';
          }
        }, 1500);
      } else {
        tourVideo.pause();
        videoOverlay.style.opacity = '1';
        videoOverlay.style.background = 'rgba(15, 23, 42, 0.35)';
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
      }
    });

    // Show overlay again on hover when video is playing
    const container = document.querySelector('.tour-video-container');
    if (container) {
      container.addEventListener('mouseenter', () => {
        if (!tourVideo.paused) {
          videoOverlay.style.opacity = '1';
        }
      });
      container.addEventListener('mouseleave', () => {
        if (!tourVideo.paused) {
          videoOverlay.style.opacity = '0';
        }
    }
  }

  // --- Hero Video Mute Toggle ---
  const heroVideo = document.getElementById('hero-video');
  const heroMuteBtn = document.getElementById('hero-mute-btn');
  
  if (heroVideo && heroMuteBtn) {
    const unmuteVideo = () => {
      heroVideo.muted = false;
      const iconMuted = heroMuteBtn.querySelector('.icon-muted');
      const iconUnmuted = heroMuteBtn.querySelector('.icon-unmuted');
      if (iconMuted) iconMuted.style.display = 'none';
      if (iconUnmuted) iconUnmuted.style.display = 'block';
    };

    const muteVideo = () => {
      heroVideo.muted = true;
      const iconMuted = heroMuteBtn.querySelector('.icon-muted');
      const iconUnmuted = heroMuteBtn.querySelector('.icon-unmuted');
      if (iconMuted) iconMuted.style.display = 'block';
      if (iconUnmuted) iconUnmuted.style.display = 'none';
    };

    // Toggle button click listener
    heroMuteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (heroVideo.muted) {
        unmuteVideo();
      } else {
        muteVideo();
      }
    });

    // Auto-unmute on first user interaction anywhere on the screen
    const handleFirstInteraction = () => {
      if (heroVideo.muted) {
        unmuteVideo();
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
  }
});
