document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation Bar
    const navbar = document.querySelector('.navbar-custom');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-sticky');
        } else {
            navbar.classList.remove('navbar-sticky');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial state in case of page reload halfway down
    
    // Close mobile menu on nav-link click
    const navLinks = document.querySelectorAll('.nav-link-custom');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });

    // 2. Active Link ScrollSpy (Fallback/Custom implementation for smooth highlighting)
    const sections = document.querySelectorAll('section, header');
    
    const scrollSpy = () => {
        let currentSectionId = '';
        const scrollPos = window.scrollY + 120; // Offset for sticky header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };
    
    window.addEventListener('scroll', scrollSpy);
    scrollSpy();

    // 3. Menu Filtering Logic
    const menuTabButtons = document.querySelectorAll('.menu-tab-btn');
    const menuItemCards = document.querySelectorAll('.menu-item-wrapper-col');
    
    menuTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active tab button
            menuTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            menuItemCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Animate filter
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 4. Gallery Filtering Logic & Lightbox
    const galleryFilterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item-col');
    
    galleryFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            galleryFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Gallery Lightbox Modal Binding
    const lightboxModalEl = document.getElementById('lightboxModal');
    if (lightboxModalEl && typeof bootstrap !== 'undefined') {
        const lightboxModal = new bootstrap.Modal(lightboxModalEl);
        const lightboxImg = lightboxModalEl.querySelector('.lightbox-img');
        const lightboxCaption = lightboxModalEl.querySelector('.lightbox-caption');
        const clickableItems = document.querySelectorAll('.gallery-item');
        
        clickableItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('.gallery-img');
                const title = item.querySelector('.gallery-title').textContent;
                const tag = item.querySelector('.gallery-tag').textContent;
                
                lightboxImg.src = img.src;
                lightboxCaption.textContent = `${title} (${tag})`;
                lightboxModal.show();
            });
        });
    }

    // 5. Reservation Form Processing
    const reservationForm = document.getElementById('reservation-form');
    const bookingSuccessModalEl = document.getElementById('bookingSuccessModal');
    
    if (reservationForm && bookingSuccessModalEl && typeof bootstrap !== 'undefined') {
        const successModal = new bootstrap.Modal(bookingSuccessModalEl);
        const submitBtn = reservationForm.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;
        
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic Bootstrap validation
            if (!reservationForm.checkValidity()) {
                e.stopPropagation();
                reservationForm.classList.add('was-validated');
                return;
            }
            
            // Collect Form Values
            const name = document.getElementById('booking-name').value;
            const phone = document.getElementById('booking-phone').value;
            const email = document.getElementById('booking-email').value;
            const date = document.getElementById('booking-date').value;
            const time = document.getElementById('booking-time').value;
            const guests = document.getElementById('booking-guests').value;
            const requests = document.getElementById('booking-requests').value || 'None';
            
            // Trigger UI Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Securing Table...';
            
            // Simulate API request delay
            setTimeout(() => {
                // Populate Success Modal Fields
                document.getElementById('summary-name').textContent = name;
                document.getElementById('summary-details').textContent = `${guests} guests | ${date} at ${time}`;
                document.getElementById('summary-id').textContent = 'LAVUE-' + Math.floor(100000 + Math.random() * 900000);
                
                // Form booking text for WhatsApp backup booking
                const whatsappBtn = document.getElementById('whatsapp-booking-btn');
                if (whatsappBtn) {
                    const message = encodeURIComponent(
                        `*Table Reservation Request - La Vue Rooftop*\n\n` +
                        `• *Name:* ${name}\n` +
                        `• *Phone:* ${phone}\n` +
                        `• *Email:* ${email}\n` +
                        `• *Date:* ${date}\n` +
                        `• *Time:* ${time}\n` +
                        `• *Number of Guests:* ${guests}\n` +
                        `• *Special Requests:* ${requests}`
                    );
                    whatsappBtn.href = `https://wa.me/919836398969?text=${message}`;
                }
                
                // Reset loading button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                
                // Reset form inputs & validation status
                reservationForm.reset();
                reservationForm.classList.remove('was-validated');
                
                // Launch success modal
                successModal.show();
            }, 1800);
        });
    }

    // 6. Contact Form Processing (Mock)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHTML = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                
                alert('Thank you for getting in touch! The La Vue team will respond to your message shortly.');
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            }, 1500);
        });
    }

    // 7. Newsletter Subscription (Mock)
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('.newsletter-input');
            
            if (input.value.trim() === '') return;
            
            alert('Welcome aboard! You have successfully subscribed to the La Vue newsletter. Get ready for exclusive rooftop offers.');
            input.value = '';
        });
    }

    // 8. Scroll Reveal Observer
    const reveals = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        // Hide elements initially for animation
        reveals.forEach(el => el.classList.add('reveal-hidden'));
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('reveal-hidden');
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        reveals.forEach(el => revealObserver.observe(el));
    }

    // 9. Floating Sakura Petal Animation System
    const initPetals = () => {
        const container = document.createElement('div');
        container.className = 'petals-container';
        document.body.appendChild(container);
        
        const petalColors = ['#ffccd5', '#ffb3c1', '#ffa1b3', '#fff0f3'];
        
        setInterval(() => {
            // Limit active petal count for smooth performance
            if (container.children.length > 30) return;
            
            const petal = document.createElement('div');
            petal.className = 'petal';
            
            // Random size
            const size = Math.random() * 8 + 8;
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            
            // Random horizontal spawn position
            petal.style.left = `${Math.random() * 100}vw`;
            petal.style.top = `-20px`;
            
            // Cherry blossom rose coloration and organic shape
            petal.style.backgroundColor = petalColors[Math.floor(Math.random() * petalColors.length)];
            petal.style.borderRadius = '50% 0 50% 50%';
            
            // Falling path transitions
            const duration = Math.random() * 6 + 6;
            const delay = Math.random() * 3;
            petal.style.animation = `fall ${duration}s linear ${delay}s infinite`;
            petal.style.opacity = Math.random() * 0.5 + 0.3;
            
            container.appendChild(petal);
            
            // Clean up elements
            setTimeout(() => {
                petal.remove();
            }, (duration + delay) * 1000);
        }, 450);
    };
    
    initPetals();
});
