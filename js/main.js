document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize DB if empty
    if (window.initDatabase) {
        window.initDatabase();
    }

    // 2. Load Data from LocalStorage
    const profile = JSON.parse(localStorage.getItem('portfolio_profile') || '{}');
    const services = JSON.parse(localStorage.getItem('portfolio_services') || '[]');
    const educations = JSON.parse(localStorage.getItem('portfolio_educations') || '[]');
    const experiences = JSON.parse(localStorage.getItem('portfolio_experiences') || '[]');
    const skills = JSON.parse(localStorage.getItem('portfolio_skills') || '{"technical":[],"soft":[]}');
    const certifications = JSON.parse(localStorage.getItem('portfolio_certifications') || '[]');
    const events = JSON.parse(localStorage.getItem('portfolio_events') || '[]');

    // 3. Populate Profile Data
    document.getElementById('nav-name').innerText = profile.name || 'Nome Profissional';
    document.getElementById('hero-name').innerText = profile.name || 'Carregando...';
    document.getElementById('hero-title').innerText = profile.title || '';
    document.getElementById('hero-tagline').innerText = profile.tagline || '';
    
    document.getElementById('profile-bio').innerText = profile.bio || '';
    document.getElementById('stat-years').setAttribute('data-target', profile.experienceYears || 0);
    document.getElementById('stat-clients').setAttribute('data-target', profile.clientsServed || 0);
    
    document.getElementById('contact-location').innerText = profile.location || '--';
    const emailEl = document.getElementById('contact-email');
    emailEl.innerText = profile.email || '--';
    emailEl.href = `mailto:${profile.email}`;
    
    const whatsEl = document.getElementById('contact-whatsapp');
    whatsEl.innerText = profile.phone || '--';
    whatsEl.href = `https://wa.me/${(profile.phone||'').replace(/\D/g,'')}?text=${encodeURIComponent(profile.whatsappMsg || '')}`;
    
    document.getElementById('footer-name').innerText = profile.name || 'Nome Profissional';
    document.getElementById('footer-linkedin').href = profile.linkedin || '#';
    document.getElementById('current-year').innerText = new Date().getFullYear();

    // Profile Photo Validation (suporta base64 e URL externas)
    const photoEl = document.getElementById('profile-photo');
    const fallbackEl = document.getElementById('profile-fallback-icon');
    if (profile.photo && (profile.photo.startsWith('data:image') || profile.photo.startsWith('http'))) {
        photoEl.src = profile.photo;
        photoEl.classList.remove('hidden');
        fallbackEl.classList.add('hidden');
    }

    // 4. Populate Services
    const servicesGrid = document.getElementById('services-grid');
    servicesGrid.innerHTML = services.map((s, index) => `
        <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 fade-in delay-${(index % 4) * 100}">
            <div class="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-6">
                <!-- Using generic SVG since icons string might vary format. Will use Lucide standard check if string empty -->
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${s.icon || 'M5 13l4 4L19 7'}"></path>
                </svg>
            </div>
            <h4 class="text-xl font-bold text-slate-900 mb-3">${s.title}</h4>
            <p class="text-slate-600 leading-relaxed">${s.description}</p>
        </div>
    `).join('');

    // 5. Populate Experience Timeline
    const expTimeline = document.getElementById('experiences-timeline');
    expTimeline.innerHTML = experiences.map((exp, index) => {
        let galleryHtml = '';
        if (exp.gallery && exp.gallery.length > 0) {
            galleryHtml = `
                <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    ${exp.gallery.map(img => `
                        <div class="relative overflow-hidden rounded border border-slate-200 cursor-pointer group lightbox-trigger" data-img="${img.imgBase64}" data-caption="${img.caption || ''}">
                            <img src="${img.imgBase64}" class="w-full h-20 object-cover group-hover:scale-105 transition-transform" alt="Galeria Experiência">
                            ${img.caption ? `<div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-[10px] p-1 truncate text-center">${img.caption}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }
        return `
            <div class="timeline-item group fade-in delay-${(index % 3) * 100}">
                <div class="bg-slate-50 border border-slate-100 p-6 rounded-lg group-hover:border-brand-300 transition-colors">
                    <span class="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-xs font-semibold rounded-full mb-3">${exp.period}</span>
                    <h4 class="text-lg font-bold text-slate-900">${exp.role}</h4>
                    <div class="text-brand-600 font-medium mb-3">${exp.company}</div>
                    <p class="text-slate-600">${exp.description}</p>
                    ${galleryHtml}
                </div>
            </div>
        `;
    }).join('');

    // 6. Populate Education
    const eduList = document.getElementById('educations-list');
    eduList.innerHTML = educations.map(edu => `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white border border-slate-100 rounded-lg hover:shadow-md transition-shadow">
            <div>
                <h4 class="font-bold text-slate-900">${edu.course}</h4>
                <div class="text-slate-500 text-sm mt-1">${edu.institution}</div>
            </div>
            <div class="mt-3 sm:mt-0 flex items-center gap-4">
                <span class="font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded text-sm">${edu.year}</span>
                ${edu.certificateDownload ? `<a href="${edu.certificateDownload}" download="certificado.pdf" class="text-brand-600 hover:text-brand-800"><i data-lucide="download" class="w-5 h-5"></i></a>` : ''}
            </div>
        </div>
    `).join('');

    // 7. Populate Skills
    const techSkillsList = document.getElementById('tech-skills-list');
    if (techSkillsList) {
        techSkillsList.innerHTML = (skills.technical || []).map(skill => `
            <div>
                <div class="flex justify-between mb-1">
                    <span class="font-medium text-slate-200">${skill.name}</span>
                    <span class="font-medium text-brand-300">${skill.level}%</span>
                </div>
                <div class="w-full bg-brand-900 rounded-full h-2.5 bg-opacity-50">
                    <div class="bg-brand-500 h-2.5 rounded-full skill-bar-fill transition-all duration-1000 ease-out" style="width: 0%;" data-target-width="${skill.level}%"></div>
                </div>
            </div>
        `).join('');
    }

    const softSkillsList = document.getElementById('soft-skills-list');
    if (softSkillsList) {
        softSkillsList.innerHTML = (skills.soft || []).map(skill => `
            <div>
                <div class="flex justify-between mb-1">
                    <span class="font-medium text-slate-200">${skill.name}</span>
                    <span class="font-medium text-finance-400">${skill.level}%</span>
                </div>
                <div class="w-full bg-brand-900 rounded-full h-2.5 bg-opacity-50">
                    <div class="bg-finance-500 h-2.5 rounded-full skill-bar-fill transition-all duration-1000 ease-out" style="width: 0%;" data-target-width="${skill.level}%"></div>
                </div>
            </div>
        `).join('');
    }

    // 8. Populate Certifications
    const certsList = document.getElementById('certifications-list');
    certsList.innerHTML = certifications.map(cert => `
        <span class="px-4 py-2 bg-white/10 text-white rounded border border-white/20 text-sm">${cert.name}</span>
    `).join('');

    // 9. Populate Events Gallery
    const eventsCarousel = document.getElementById('events-carousel');
    if (eventsCarousel) {
        eventsCarousel.innerHTML = events.map((ev, index) => `
            <div class="min-w-[300px] md:min-w-[400px] snap-start bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group lightbox-trigger cursor-pointer" data-img="${ev.photo || ''}" data-caption="${ev.caption || ''}">
                <div class="aspect-video relative overflow-hidden">
                    <img src="${ev.photo || ''}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="${ev.title}">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                         <div>
                            <h4 class="text-white font-bold text-lg">${ev.title}</h4>
                            <p class="text-white/80 text-xs mt-1 line-clamp-1">${ev.caption}</p>
                         </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Carousel Controls
        const prevBtn = document.getElementById('prev-event');
        const nextBtn = document.getElementById('next-event');
        if (prevBtn && nextBtn) {
            prevBtn.onclick = () => eventsCarousel.scrollBy({ left: -400, behavior: 'smooth' });
            nextBtn.onclick = () => eventsCarousel.scrollBy({ left: 400, behavior: 'smooth' });
        }
    }

    // Update lucide icons for dynamically added content
    if(window.lucide) { window.lucide.createIcons(); }

    // --- Animations & Interactivity ---

    // Intersection Observer for Fade-ins
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                
                // If it's a skill bar, trigger the fill animation
                const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                if (skillBars.length > 0) {
                    skillBars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-target-width');
                    });
                }

                // If it has counters inside
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    if(!counter.classList.contains('counted')){
                        animateCounter(counter);
                        counter.classList.add('counted');
                    }
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Number Counter Animation Function
    function animateCounter(el) {
        const target = +el.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                el.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = target;
            }
        };
        updateCounter();
    }

    // Lightbox Logic
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if(lightboxModal) {
        document.querySelectorAll('.lightbox-trigger').forEach(el => {
            el.addEventListener('click', (ev) => {
                const trg = ev.currentTarget;
                lightboxImg.src = trg.getAttribute('data-img');
                lightboxCaption.innerText = trg.getAttribute('data-caption') || '';
                lightboxModal.classList.remove('hidden');
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.add('hidden');
        });
        lightboxModal.addEventListener('click', (ev) => {
            if(ev.target === lightboxModal) {
                lightboxModal.classList.add('hidden');
            }
        });
    }
});
