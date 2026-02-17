// ========================================
// CONSULTÓRIO CLÍNICO SAÚDE E VIDA LONGA
// Website Scripts
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.benefit-card, .contact-card, .stat-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.benefit-card, .contact-card, .stat-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // Counter animation for stats
    const animateCounters = function() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            const numericValue = parseInt(target);
            
            if (!isNaN(numericValue) && !counter.classList.contains('animated')) {
                const elementPosition = counter.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementPosition < windowHeight - 100) {
                    counter.classList.add('animated');
                    let current = 0;
                    const increment = numericValue / 50;
                    const suffix = target.replace(/[0-9]/g, '');
                    
                    const updateCounter = function() {
                        current += increment;
                        if (current < numericValue) {
                            counter.textContent = Math.floor(current) + suffix;
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                }
            }
        });
    };
    
    window.addEventListener('scroll', animateCounters);

    // Appointment modal + client registration
    const appointmentModal = document.getElementById('appointment-modal');
    const openAppointmentModalBtn = document.getElementById('open-appointment-modal');
    const tabButtons = appointmentModal ? appointmentModal.querySelectorAll('[data-tab]') : [];
    const tabPanels = appointmentModal ? appointmentModal.querySelectorAll('[data-panel]') : [];
    const registerForm = document.getElementById('client-register-form');
    const provinceSelect = document.getElementById('client-province');
    const citySelect = document.getElementById('client-city');
    const neighborhoodSelect = document.getElementById('client-neighborhood');

    const setTab = function(tabName) {
        if (!appointmentModal) return;

        tabButtons.forEach(btn => {
            const isActive = btn.getAttribute('data-tab') === tabName;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        tabPanels.forEach(panel => {
            const isActive = panel.getAttribute('data-panel') === tabName;
            panel.classList.toggle('is-active', isActive);
        });
    };

    const openModal = function() {
        if (!appointmentModal) return;
        appointmentModal.classList.add('is-open');
        appointmentModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTab('agendar');
    };

    const closeModal = function() {
        if (!appointmentModal) return;
        appointmentModal.classList.remove('is-open');
        appointmentModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (openAppointmentModalBtn && appointmentModal) {
        openAppointmentModalBtn.addEventListener('click', openModal);

        appointmentModal.addEventListener('click', function(e) {
            const closeTarget = e.target.closest('[data-modal-close]');
            if (closeTarget) closeModal();
        });

        tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                if (tabName) setTab(tabName);
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && appointmentModal.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    const resetSelect = function(selectEl, placeholder) {
        if (!selectEl) return;
        selectEl.innerHTML = '';
        const opt = document.createElement('option');
        opt.value = '';
        opt.disabled = true;
        opt.selected = true;
        opt.textContent = placeholder;
        selectEl.appendChild(opt);
    };

    const setHint = function(text, isError) {
        const hint = document.getElementById('client-register-hint');
        if (!hint) return;
        hint.textContent = text;
        hint.style.color = isError ? '#b00020' : '';
    };

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(registerForm);
            const name = String(formData.get('name') || '').trim();
            const dateBirth = String(formData.get('dateBirth') || '').trim();
            const bi = String(formData.get('bi') || '').trim();
            const province = String(formData.get('province') || '').trim();
            const city = String(formData.get('city') || '').trim();
            const neighborhood = String(formData.get('neighborhood') || '').trim();
            const phoneNumber = String(formData.get('phoneNumber') || '').replace(/\D/g, '').trim();
            const iswhatsapp = registerForm.querySelector('#client-iswhatsapp')?.checked ? '1' : '0';

            if (!name || !dateBirth || !bi || !province || !city || !neighborhood || phoneNumber.length !== 9) {
                setHint('Por favor, preencha todos os campos. O contacto deve ter 9 dígitos.', true);
                return;
            }

            formData.set('phoneNumber', phoneNumber);
            formData.set('iswhatsapp', iswhatsapp);

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;
            setHint('A enviar cadastro...', false);

            fetch('patient_register.php', {
                method: 'POST',
                body: formData
            })
                .then(async (res) => {
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok || !data.success) {
                        const msg = data && data.error ? data.error : 'Não foi possível enviar o cadastro.';
                        throw new Error(msg);
                    }
                    return data;
                })
                .then(() => {
                    setHint('Cadastro enviado com sucesso.', false);
                    registerForm.reset();
                    if (provinceSelect && citySelect && neighborhoodSelect) {
                        if (typeof loadProvinces === 'function') {
                            loadProvinces();
                        } else {
                            resetSelect(provinceSelect, 'Selecione a província');
                            resetSelect(citySelect, 'Selecione a cidade');
                            resetSelect(neighborhoodSelect, 'Selecione o bairro');
                            citySelect.disabled = true;
                            neighborhoodSelect.disabled = true;
                        }
                    }
                })
                .catch((err) => {
                    setHint(err && err.message ? err.message : 'Erro ao enviar cadastro.', true);
                })
                .finally(() => {
                    if (submitBtn) submitBtn.disabled = false;
                });
        });
    }
});
