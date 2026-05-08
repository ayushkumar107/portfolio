// ============================================
// RETRO PIXEL PORTFOLIO — SCRIPT.JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // =============================
    // 1. AVATAR + SPEECH BUBBLE (Section-Aware)
    // =============================
    const avatarSprite = document.getElementById('avatar-sprite');
    const speechText = document.getElementById('speech-text');
    const avatarSpeech = document.getElementById('avatar-speech');
    const frameWidth = 52;

    // Map each section to a specific avatar frame + speech message
    const sectionData = {
        intro:      { frame: 0, text: "Hey! Welcome to my world 👋" },
        about:      { frame: 1, text: "Let me tell you about myself ✨" },
        experience: { frame: 2, text: "The grind never stops 💪" },
        skills:     { frame: 3, text: "Check out my deck of skills 🃏" },
        projects:   { frame: 0, text: "Here's what I've been building 🚀" },
        contact:    { frame: 1, text: "Let's connect and build! 🤝" }
    };

    let lastActiveSection = '';

    // Update avatar frame and speech for a given section
    const updateAvatarForSection = (sectionId) => {
        if (sectionId === lastActiveSection) return; // no change needed
        lastActiveSection = sectionId;

        const data = sectionData[sectionId];
        if (!data) return;

        // Update avatar sprite frame
        avatarSprite.src = `assets/avatar_${data.frame}.png`;

        // Bounce the avatar
        avatarSprite.style.transform = 'scale(1.15)';
        setTimeout(() => {
            avatarSprite.style.transform = 'scale(1)';
        }, 250);

        // Update speech bubble text with pop animation
        if (speechText && avatarSpeech) {
            speechText.textContent = data.text;
            avatarSpeech.classList.remove('speech-pop');
            // Force reflow to restart animation
            void avatarSpeech.offsetWidth;
            avatarSpeech.classList.add('speech-pop');
        }
    };

    // Click avatar to cycle through random messages
    const clickMessages = [
        "You clicked me! 😄",
        "Stop poking me! 😤",
        "Hire me already! 💼",
        "I run on coffee ☕",
        "Bug? What bug? 🐛",
        "It works on my machine 🤷",
        "sudo hire ayush 🔥",
        "404: Sleep not found 😴"
    ];

    avatarSprite.addEventListener('click', () => {
        const randomMsg = clickMessages[Math.floor(Math.random() * clickMessages.length)];
        
        if (speechText && avatarSpeech) {
            speechText.textContent = randomMsg;
            avatarSpeech.classList.remove('speech-pop');
            void avatarSpeech.offsetWidth;
            avatarSpeech.classList.add('speech-pop');
        }

        // Cycle to next frame
        const currentSrc = avatarSprite.src || '';
        const match = currentSrc.match(/avatar_(\d)/);
        const currentFrame = match ? parseInt(match[1]) : 0;
        const nextFrame = (currentFrame + 1) % 4;
        avatarSprite.src = `assets/avatar_${nextFrame}.png`;

        // Bounce
        avatarSprite.style.transform = 'scale(1.25) rotate(5deg)';
        setTimeout(() => {
            avatarSprite.style.transform = 'scale(1) rotate(0deg)';
        }, 300);

        // Reset to section-aware after 3 seconds
        setTimeout(() => {
            lastActiveSection = ''; // force re-update
            updateActiveTab();
        }, 3000);
    });

    // =============================
    // 2. NAVIGATION — Active Tab on Scroll
    // =============================
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.section');

    // Smooth scroll to section on tab click
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Immediately update avatar for clicked section
                const sectionId = tab.dataset.section;
                if (sectionId) {
                    setTimeout(() => updateAvatarForSection(sectionId), 300);
                }
            }
        });
    });

    // Highlight active tab based on scroll position
    const updateActiveTab = () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.section === currentSection) {
                tab.classList.add('active');
            }
        });

        // Update avatar + speech for current section
        if (currentSection) {
            updateAvatarForSection(currentSection);
        }
    };

    // =============================
    // 3. SCROLL REVEAL ANIMATION
    // =============================
    const revealSections = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.85) {
                section.classList.add('visible');
            }
        });
    };

    // =============================
    // 4. STAT COUNTER ANIMATION
    // =============================
    let countersAnimated = false;
    
    const animateCounters = () => {
        if (countersAnimated) return;
        
        const statsCard = document.querySelector('.stats-card');
        if (!statsCard) return;
        
        const rect = statsCard.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;
            
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(el => {
                const text = el.textContent.trim();
                // Extract numeric value
                const match = text.match(/[\d.]+/);
                if (!match) return;
                
                const target = parseFloat(match[0]);
                const suffix = text.replace(match[0], '').trim();
                const isDecimal = text.includes('.');
                const duration = 1500;
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease-out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = isDecimal 
                        ? (target * eased).toFixed(1)
                        : Math.floor(target * eased);
                    
                    el.innerHTML = suffix.includes('months') || suffix.includes('small')
                        ? `${current} <small>${suffix.replace(/<\/?small>/g, '').trim()}</small>`
                        : `${current}${suffix}`;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Restore original text
                        el.innerHTML = text.includes('<small>')
                            ? text
                            : text;
                    }
                };
                
                requestAnimationFrame(animate);
            });
        }
    };

    // =============================
    // 5. SKILL CARDS — Tilt Effect
    // =============================
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;
            
            card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.03)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // =============================
    // 6. TYPING EFFECT for title
    // =============================
    const glitchTitle = document.querySelector('.glitch-title');
    if (glitchTitle) {
        const originalText = glitchTitle.textContent;
        glitchTitle.textContent = '';
        glitchTitle.classList.add('cursor-blink');
        
        let charIndex = 0;
        const typeSpeed = 80;
        
        const typeWriter = () => {
            if (charIndex < originalText.length) {
                glitchTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Remove cursor after typing is done
                setTimeout(() => {
                    glitchTitle.classList.remove('cursor-blink');
                }, 2000);
            }
        };
        
        // Start typing after a brief delay
        setTimeout(typeWriter, 500);
    }

    // =============================
    // 7. PARALLAX CITY SKYLINE
    // =============================
    const citySkyline = document.querySelector('.city-skyline');
    
    const parallaxSkyline = () => {
        if (citySkyline) {
            const scrolled = window.scrollY;
            citySkyline.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
    };

    // =============================
    // 8. PROJECT CARDS — Glow on hover
    // =============================
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(232, 93, 38, 0.08), var(--bg-card))`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.background = '';
        });
    });

    // =============================
    // 9. COMBINED SCROLL HANDLER
    // =============================
    const onScroll = () => {
        updateActiveTab();
        revealSections();
        animateCounters();
        parallaxSkyline();
    };

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // =============================
    // 10. INITIAL CALLS
    // =============================
    
    // Make intro section visible immediately
    const introSection = document.getElementById('intro');
    if (introSection) {
        setTimeout(() => {
            introSection.classList.add('visible');
        }, 100);
    }
    
    // Run once on load
    revealSections();
    updateActiveTab();
    animateCounters();

    // =============================
    // 11. EASTER EGG — Konami Code
    // =============================
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Trigger rainbow mode!
                document.body.style.filter = 'hue-rotate(0deg)';
                let hue = 0;
                const rainbow = setInterval(() => {
                    hue += 5;
                    document.body.style.filter = `hue-rotate(${hue}deg)`;
                    if (hue >= 360) {
                        clearInterval(rainbow);
                        document.body.style.filter = '';
                    }
                }, 50);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // =============================
    // 12. SHUFFLE DECK LOGIC
    // =============================
    const shuffleBtn = document.getElementById('shuffle-btn');
    const skillDeck = document.querySelector('.skill-deck');
    
    if (shuffleBtn && skillDeck) {
        shuffleBtn.addEventListener('click', () => {
            if (shuffleBtn.disabled) return;
            shuffleBtn.disabled = true;
            shuffleBtn.innerHTML = '★ SHUFFLING...';
            
            const cards = Array.from(skillDeck.querySelectorAll('.skill-card'));
            
            // Step 1: Add vibration class
            cards.forEach(card => {
                card.classList.add('vibrating');
                // Ensure no inline transforms interfere
                card.style.transform = ''; 
            });
            
            // Step 2: Vibrate for a moment, then shuffle array and re-append
            setTimeout(() => {
                for (let i = cards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [cards[i], cards[j]] = [cards[j], cards[i]];
                }
                
                cards.forEach(card => skillDeck.appendChild(card));
                
                // Keep vibrating for a tiny split second longer or remove immediately
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        cards.forEach(card => {
                            card.classList.remove('vibrating');
                        });
                        
                        shuffleBtn.innerHTML = '★ SHUFFLE DECK';
                        shuffleBtn.disabled = false;
                    });
                }, 100);
            }, 600); // 600ms of vibration before shuffling
        });
    }

});
