document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loaded');
    initializeNavbar();
    initializeAnimations();
    initializeChatWidget();
    initializeSmoothScroll();
    initializeScrollAnimations();
    initializeFormHandling();
    initializeBackgroundMusic();
    initializeWheelNav();
});

// Initialize Navbar Scroll Effect
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize Animations
function initializeAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                const index = Array.from(elements).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));
}

// Initialize Chat Widget
function initializeChatWidget() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatToggle || !chatWidget) return;

    // Toggle chat widget
    chatToggle.addEventListener('click', () => {
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            chatInput.focus();
        }
    });

    // Close chat widget
    chatClose.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    // Send message
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        const userDiv = document.createElement('div');
        userDiv.className = 'message user-message';
        userDiv.textContent = message;
        chatMessages.appendChild(userDiv);

        // Clear input
        chatInput.value = '';

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "That sounds interesting! Tell me more.",
                "I love that! 🎨 What else would you like to know?",
                "Great question! I'm happy to help.",
                "That's awesome! Let's create something amazing.",
                "I'm interested in learning more about that!",
                "Feel free to reach out if you have any other questions!",
                "Thanks for the question! Let's collaborate.",
                "That's a perfect opportunity for innovation! 🚀"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const assistantDiv = document.createElement('div');
            assistantDiv.className = 'message assistant-message';
            assistantDiv.textContent = randomResponse;
            chatMessages.appendChild(assistantDiv);

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);
    }
}

// Smooth scroll for navigation links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll-triggered animations
function initializeScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// Initialize Form Handling
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate form submission
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
        });
    }
}

// Initialize Background Music
function initializeBackgroundMusic() {
    const music = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');

    if (!music || !musicToggle) {
        return;
    }

    let userPaused = false;
    let hasAttemptedStart = false;

    music.volume = 0.2;

    function updateMusicToggle() {
        const isPlaying = !music.paused;
        musicToggle.textContent = isPlaying ? 'Music On' : 'Music Off';
        musicToggle.setAttribute('aria-pressed', String(isPlaying));
    }

    async function playMusic() {
        try {
            await music.play();
        } catch (error) {
            // Ignore blocked autoplay attempts and keep the toggle state accurate.
        }

        updateMusicToggle();
    }

    function pauseMusic() {
        music.pause();
        updateMusicToggle();
    }

    async function unlockMusic() {
        if (hasAttemptedStart || userPaused || !music.paused) {
            return;
        }

        hasAttemptedStart = true;
        await playMusic();
    }

    ['pointerdown', 'keydown'].forEach((eventName) => {
        document.addEventListener(eventName, unlockMusic, { once: true });
    });

    musicToggle.addEventListener('click', async () => {
        if (music.paused) {
            userPaused = false;
            await playMusic();
            return;
        }

        userPaused = true;
        pauseMusic();
    });

    music.addEventListener('play', updateMusicToggle);
    music.addEventListener('pause', updateMusicToggle);
    updateMusicToggle();
}

// Initialize Wheel Navigation
function initializeWheelNav() {
    const wheelToggle = document.getElementById('wheel-nav-toggle');
    const wheelNav = document.getElementById('wheel-nav');
    const wheelItems = document.querySelectorAll('.wheel-item');

    if (!wheelToggle || !wheelNav || wheelItems.length === 0) {
        return;
    }

    let isActive = false;
    const sections = Array.from(document.querySelectorAll('section[id]'));

    function setWheelState(nextState) {
        isActive = nextState;
        wheelToggle.classList.toggle('active', isActive);
        wheelNav.classList.toggle('active', isActive);
        wheelToggle.setAttribute('aria-expanded', String(isActive));
    }

    function setCurrentWheelItem(sectionId) {
        wheelItems.forEach((item) => {
            const targetId = item.getAttribute('href')?.slice(1);
            item.classList.toggle('current', targetId === sectionId);
        });
    }

    // Toggle wheel nav
    wheelToggle.addEventListener('click', () => {
        setWheelState(!isActive);
    });

    // Close wheel nav when item is clicked
    wheelItems.forEach(item => {
        item.addEventListener('click', () => {
            setWheelState(false);
        });
    });

    // Close wheel nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!wheelToggle.contains(e.target) && !wheelNav.contains(e.target)) {
            if (isActive) {
                setWheelState(false);
            }
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isActive) {
            setWheelState(false);
        }
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        const visibleEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
            setCurrentWheelItem(visibleEntry.target.id);
        }
    }, {
        threshold: [0.2, 0.35, 0.5, 0.7],
        rootMargin: '-20% 0px -35% 0px'
    });

    sections.forEach((section) => {
        const hasWheelLink = Array.from(wheelItems).some((item) => item.getAttribute('href') === `#${section.id}`);
        if (hasWheelLink) {
            sectionObserver.observe(section);
        }
    });

    setCurrentWheelItem('home');
    setWheelState(false);
}
