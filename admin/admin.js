document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();

    // --- AUTHENTICATION ---
    const loginModal = document.getElementById('login-modal');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('login-error');

    // Check session
    if (sessionStorage.getItem('admin_logged_in') === 'true') {
        loginModal.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loadAllData();
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('login-user').value;
        const p = document.getElementById('login-pass').value;
        if (u === 'admin' && p === 'Fula.2026#') {
            sessionStorage.setItem('admin_logged_in', 'true');
            loginModal.classList.add('hidden');
            dashboard.classList.remove('hidden');
            loadAllData();
        } else {
            errorMsg.classList.remove('hidden');
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('admin_logged_in');
        window.location.reload();
    });

    // --- NAVIGATION TABS ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const titleEl = document.getElementById('current-tab-title');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Reset active states
            tabBtns.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('text-slate-300');
            });
            tabContents.forEach(c => c.classList.remove('active'));

            // Set active
            btn.classList.remove('text-slate-300');
            btn.classList.add('bg-blue-600', 'text-white');
            document.getElementById(btn.getAttribute('data-target')).classList.add('active');
            titleEl.innerText = btn.innerText.trim();
        });
    });

    // --- TOAST NOTIFICATION ---
    function showToast(msg) {
        const toast = document.getElementById('toast');
        if (msg) toast.innerText = msg;
        toast.className = "toast show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    }

    // --- HELPER: IMAGE COMPRESSION ---
    function compressImage(file, maxWidth = 800) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8)); // 0.8 quality
                };
            };
        });
    }

    // --- LOAD AND BIND DATA ---
    let profileData = {};

    function loadAllData() {
        // Garantir que existe info
        if (typeof window.initDatabase === 'function') {
            window.initDatabase();
        }

        loadProfile();
        loadServices();
        loadExperience();
        loadEducation();
        loadSkills();
        loadEvents();
        loadGithubSettings();
    }

    function loadProfile() {
        profileData = JSON.parse(localStorage.getItem('portfolio_profile') || '{}');
        document.getElementById('prof-name').value = profileData.name || '';
        document.getElementById('prof-title').value = profileData.title || '';
        document.getElementById('prof-tagline').value = profileData.tagline || '';
        document.getElementById('prof-bio').value = profileData.bio || '';
        document.getElementById('prof-exp').value = profileData.experienceYears || 0;
        document.getElementById('prof-clients').value = profileData.clientsServed || 0;
        document.getElementById('prof-email').value = profileData.email || '';
        document.getElementById('prof-phone').value = profileData.phone || '';
        document.getElementById('prof-loc').value = profileData.location || '';
        document.getElementById('prof-link').value = profileData.linkedin || '';

        if (profileData.photo) {
            document.getElementById('prof-photo-preview').src = profileData.photo;
            document.getElementById('prof-photo-preview').classList.remove('hidden');
        }
    }

    // Converter foto e comprimir
    document.getElementById('prof-photo').addEventListener('change', async function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // Mostrar estado de processamento
        showToast('Processando imagem...');
        try {
            const compressedBase64 = await compressImage(file);
            profileData.photo = compressedBase64;
            document.getElementById('prof-photo-preview').src = profileData.photo;
            document.getElementById('prof-photo-preview').classList.remove('hidden');
            showToast('Imagem pronta!');
        } catch (err) {
            console.error(err);
            alert('Erro ao processar imagem.');
        }
    });

    // Remover Foto
    document.getElementById('btn-remove-photo').addEventListener('click', () => {
        if (confirm('Deseja remover a foto de perfil?')) {
            profileData.photo = "";
            document.getElementById('prof-photo-preview').src = "";
            document.getElementById('prof-photo-preview').classList.add('hidden');
            document.getElementById('prof-photo').value = "";
        }
    });

    // Salvar Perfil
    document.getElementById('form-profile').addEventListener('submit', (e) => {
        e.preventDefault();
        profileData.name = document.getElementById('prof-name').value;
        profileData.title = document.getElementById('prof-title').value;
        profileData.tagline = document.getElementById('prof-tagline').value;
        profileData.bio = document.getElementById('prof-bio').value;
        profileData.experienceYears = parseInt(document.getElementById('prof-exp').value);
        profileData.clientsServed = parseInt(document.getElementById('prof-clients').value);
        profileData.email = document.getElementById('prof-email').value;
        profileData.phone = document.getElementById('prof-phone').value;
        profileData.location = document.getElementById('prof-loc').value;
        profileData.linkedin = document.getElementById('prof-link').value;

        localStorage.setItem('portfolio_profile', JSON.stringify(profileData));
        showToast('Perfil atualizado com sucesso!');
    });

    // MOCK LOADERS FOR TABLE (Demonstration)
    function loadServices() {
        const serv = JSON.parse(localStorage.getItem('portfolio_services') || '[]');
        const tbody = document.getElementById('services-tbody');
        if (!tbody) return;
        tbody.innerHTML = serv.map(s => `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="p-3 align-top font-medium">${s.title}</td>
                <td class="p-3 align-top text-slate-500 line-clamp-2" title="${s.description}">${s.description.substring(0, 80)}...</td>
                <td class="p-3 align-top text-center space-x-2">
                    <button class="text-blue-500 hover:text-blue-700" title="Função ilustrativa"><i data-lucide="edit-2" class="w-4 h-4 inline"></i></button>
                    <button class="text-red-500 hover:text-red-700" title="Função ilustrativa"><i data-lucide="trash-2" class="w-4 h-4 inline"></i></button>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    }

    let allExperiences = [];
    let currentExpGallery = [];
    let editingExpId = null;

    function loadExperience() {
        allExperiences = JSON.parse(localStorage.getItem('portfolio_experiences') || '[]');
        renderExperienceList();
    }

    function renderExperienceList() {
        const listEl = document.getElementById('exp-list');
        if (!listEl) return;
        listEl.innerHTML = allExperiences.map(e => `
            <div class="border border-slate-200 p-4 rounded bg-slate-50 flex justify-between items-center group hover:border-blue-300">
                <div>
                    <div class="font-medium text-slate-800">${e.role}</div>
                    <div class="text-sm text-slate-500">${e.company} | ${e.period}</div>
                    ${e.gallery && e.gallery.length > 0 ? `<div class="text-xs mt-1 text-emerald-600 flex items-center"><i data-lucide="image" class="w-3 h-3 mr-1"></i> ${e.gallery.length} foto(s) na galeria</div>` : ''}
                </div>
                <div class="flex gap-2">
                    <button type="button" class="text-slate-400 hover:text-blue-500 transition-colors btn-edit-exp" data-id="${e.id}"><i data-lucide="edit" class="w-5 h-5"></i></button>
                    <button type="button" class="text-slate-300 hover:text-red-500 transition-colors btn-del-exp" data-id="${e.id}"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
                </div>
            </div>
        `).join('');
        lucide.createIcons();

        document.querySelectorAll('.btn-edit-exp').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                const id = parseInt(ev.currentTarget.getAttribute('data-id'));
                openExpEditor(id);
            });
        });

        document.querySelectorAll('.btn-del-exp').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                const id = parseInt(ev.currentTarget.getAttribute('data-id'));
                deleteExperience(id);
            });
        });
    }

    function openExpEditor(id = null) {
        editingExpId = id;
        document.getElementById('form-exp').reset();
        
        if (id) {
            const exp = allExperiences.find(x => x.id === id);
            if (!exp) return;
            document.getElementById('exp-id').value = exp.id;
            document.getElementById('exp-role').value = exp.role;
            document.getElementById('exp-company').value = exp.company;
            document.getElementById('exp-period').value = exp.period;
            document.getElementById('exp-desc').value = exp.description;
            currentExpGallery = exp.gallery ? [...exp.gallery] : [];
        } else {
            document.getElementById('exp-id').value = "";
            currentExpGallery = [];
        }

        renderExpGallery();
        document.getElementById('exp-list').classList.add('hidden');
        document.getElementById('exp-editor').classList.remove('hidden');
    }

    document.getElementById('btn-new-exp').addEventListener('click', () => openExpEditor());

    function closeExpEditor() {
        editingExpId = null;
        currentExpGallery = [];
        document.getElementById('form-exp').reset();
        document.getElementById('exp-list').classList.remove('hidden');
        document.getElementById('exp-editor').classList.add('hidden');
    }

    document.getElementById('btn-cancel-exp').addEventListener('click', closeExpEditor);

    document.getElementById('form-exp').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('exp-id').value;
        const newExp = {
            id: id ? parseInt(id) : Date.now(),
            role: document.getElementById('exp-role').value,
            company: document.getElementById('exp-company').value,
            period: document.getElementById('exp-period').value,
            description: document.getElementById('exp-desc').value,
            gallery: currentExpGallery
        };

        if (id) {
            const index = allExperiences.findIndex(x => x.id === parseInt(id));
            if (index > -1) allExperiences[index] = newExp;
        } else {
            allExperiences.push(newExp);
        }

        localStorage.setItem('portfolio_experiences', JSON.stringify(allExperiences));
        showToast('Experiência salva com sucesso!');
        renderExperienceList();
        closeExpEditor();
    });

    function deleteExperience(id) {
        if (confirm('Deseja apagar esta experiência?')) {
            allExperiences = allExperiences.filter(x => x.id !== id);
            localStorage.setItem('portfolio_experiences', JSON.stringify(allExperiences));
            renderExperienceList();
        }
    }

    // Gallery Logic
    let tempGalleryBase64 = null;
    document.getElementById('exp-gallery-upload') && document.getElementById('exp-gallery-upload').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (event) {
            tempGalleryBase64 = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('btn-add-gallery') && document.getElementById('btn-add-gallery').addEventListener('click', () => {
        if (!tempGalleryBase64) {
            alert('Por favor, selecione uma imagem primeiro.');
            return;
        }
        const caption = document.getElementById('exp-gallery-caption').value || '';
        currentExpGallery.push({
            imgBase64: tempGalleryBase64,
            caption: caption
        });

        // Reset inputs
        tempGalleryBase64 = null;
        document.getElementById('exp-gallery-upload').value = '';
        document.getElementById('exp-gallery-caption').value = '';

        renderExpGallery();
    });

    function renderExpGallery() {
        const container = document.getElementById('exp-gallery-preview');
        if (!container) return;
        container.innerHTML = currentExpGallery.map((gi, idx) => `
            <div class="relative group border rounded overflow-hidden">
                <img src="${gi.imgBase64}" class="w-full h-24 object-cover" alt="Galeria">
                <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" class="text-white hover:text-red-400 btn-del-gallery" data-idx="${idx}"><i data-lucide="trash-2" class="w-6 h-6"></i></button>
                </div>
                ${gi.caption ? `<div class="bg-white text-xs p-1 text-truncate text-slate-600 truncate" title="${gi.caption}">${gi.caption}</div>` : ''}
            </div>
        `).join('');
        lucide.createIcons();

        document.querySelectorAll('.btn-del-gallery').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                const idx = parseInt(ev.currentTarget.getAttribute('data-idx'));
                currentExpGallery.splice(idx, 1);
                renderExpGallery();
            });
        });
    }

    // --- EDUCATION LOGIC ---
    // --- EDUCATION LOGIC ---
    let allEducations = [];

    function loadEducation() {
        const stored = localStorage.getItem('portfolio_educations');
        allEducations = stored ? JSON.parse(stored) : [];
        renderEducationList();
    }

    function renderEducationList() {
        const listEl = document.getElementById('edu-list');
        if (!listEl) return;
        
        if (allEducations.length === 0) {
            listEl.innerHTML = '<div class="text-slate-400 text-center py-4 italic">Nenhuma formação registada.</div>';
        } else {
            listEl.innerHTML = allEducations.map(e => `
                <div class="border border-slate-200 p-4 rounded bg-slate-50 flex justify-between items-center group hover:border-indigo-300">
                    <div>
                        <div class="font-medium text-slate-800">${e.course}</div>
                        <div class="text-sm text-slate-500">${e.institution} | ${e.year}</div>
                    </div>
                    <div class="flex gap-2">
                        <button type="button" class="text-slate-400 hover:text-indigo-500 transition-colors btn-edit-edu" data-id="${e.id}"><i data-lucide="edit" class="w-5 h-5"></i></button>
                        <button type="button" class="text-slate-300 hover:text-red-500 transition-colors btn-del-edu" data-id="${e.id}"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
                    </div>
                </div>
            `).join('');
        }
        if (window.lucide) window.lucide.createIcons();

        document.querySelectorAll('.btn-edit-edu').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openEduEditor(id);
            });
        });

        document.querySelectorAll('.btn-del-edu').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                deleteEducation(id);
            });
        });
    }

    function openEduEditor(id = null) {
        document.getElementById('form-edu').reset();
        const idField = document.getElementById('edu-id');
        
        if (id) {
            const edu = allEducations.find(x => x.id.toString() === id.toString());
            if (edu) {
                idField.value = edu.id;
                document.getElementById('edu-course').value = edu.course;
                document.getElementById('edu-institution').value = edu.institution;
                document.getElementById('edu-year').value = edu.year;
            }
        } else {
            idField.value = "";
        }

        document.getElementById('edu-list').classList.add('hidden');
        document.getElementById('edu-editor').classList.remove('hidden');
    }

    function closeEduEditor() {
        document.getElementById('edu-list').classList.remove('hidden');
        document.getElementById('edu-editor').classList.add('hidden');
    }

    if (document.getElementById('btn-new-edu')) {
        document.getElementById('btn-new-edu').addEventListener('click', () => openEduEditor());
    }
    if (document.getElementById('btn-cancel-edu')) {
        document.getElementById('btn-cancel-edu').addEventListener('click', closeEduEditor);
    }

    document.getElementById('form-edu').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edu-id').value;
        const newEdu = {
            id: id ? (isNaN(id) ? id : parseInt(id)) : Date.now(),
            course: document.getElementById('edu-course').value,
            institution: document.getElementById('edu-institution').value,
            year: document.getElementById('edu-year').value
        };

        if (id) {
            const index = allEducations.findIndex(x => x.id.toString() === id.toString());
            if (index > -1) {
                allEducations[index] = newEdu;
            } else {
                allEducations.push(newEdu);
            }
        } else {
            allEducations.push(newEdu);
        }

        localStorage.setItem('portfolio_educations', JSON.stringify(allEducations));
        showToast('Formação salva com sucesso!');
        renderEducationList();
        closeEduEditor();
    });

    function deleteEducation(id) {
        if (confirm('Deseja apagar esta formação?')) {
            allEducations = allEducations.filter(x => x.id.toString() !== id.toString());
            localStorage.setItem('portfolio_educations', JSON.stringify(allEducations));
            renderEducationList();
            showToast('Formação eliminada!');
        }
    }


    // --- SKILLS LOGIC ---
    let allSkills = { technical: [], soft: [] };

    function loadSkills() {
        allSkills = JSON.parse(localStorage.getItem('portfolio_skills') || '{"technical":[],"soft":[]}');
        renderSkills();
    }

    function renderSkills() {
        const techList = document.getElementById('skills-tech-list');
        const softList = document.getElementById('skills-soft-list');
        if (!techList || !softList) return;

        const renderItem = (s, type) => `
            <div class="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100 group">
                <div class="flex-1">
                    <span class="text-sm font-medium">${s.name}</span>
                    <span class="text-xs text-slate-400 ml-2">(${s.level}%)</span>
                </div>
                <button type="button" class="text-slate-300 hover:text-red-500 transition-colors btn-del-skill" data-name="${s.name}" data-type="${type}">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        techList.innerHTML = allSkills.technical.map(s => renderItem(s, 'technical')).join('');
        softList.innerHTML = allSkills.soft.map(s => renderItem(s, 'soft')).join('');
        if (window.lucide) window.lucide.createIcons();

        document.querySelectorAll('.btn-del-skill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.currentTarget.getAttribute('data-name');
                const type = e.currentTarget.getAttribute('data-type');
                deleteSkill(name, type);
            });
        });
    }

    document.getElementById('btn-add-skill').addEventListener('click', () => {
        const name = document.getElementById('skill-name').value.trim();
        const type = document.getElementById('skill-type').value;
        const level = parseInt(document.getElementById('skill-level').value) || 50;

        if (!name) {
            alert('Por favor, insira o nome da competência.');
            return;
        }

        allSkills[type].push({ name, level });
        localStorage.setItem('portfolio_skills', JSON.stringify(allSkills));
        
        document.getElementById('skill-name').value = '';
        document.getElementById('skill-level').value = '';
        
        showToast('Competência adicionada!');
        renderSkills();
    });

    function deleteSkill(name, type) {
        if (confirm(`Remover "${name}"?`)) {
            allSkills[type] = allSkills[type].filter(s => s.name !== name);
            localStorage.setItem('portfolio_skills', JSON.stringify(allSkills));
            renderSkills();
        }
    }

    // --- EVENTS LOGIC ---
    let allEvents = [];

    function loadEvents() {
        allEvents = JSON.parse(localStorage.getItem('portfolio_events') || '[]');
        renderEvents();
    }

    function renderEvents() {
        const grid = document.getElementById('events-grid');
        if (!grid) return;

        grid.innerHTML = allEvents.map(ev => `
            <div class="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow group">
                <div class="aspect-video bg-slate-100 relative">
                    <img src="${ev.photo || ''}" class="w-full h-full object-cover ${!ev.photo ? 'hidden' : ''}">
                    <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button type="button" class="bg-white text-slate-800 p-2 rounded-full hover:bg-emerald-50 btn-edit-event" data-id="${ev.id}"><i data-lucide="edit-3" class="w-5 h-5"></i></button>
                        <button type="button" class="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 btn-del-event" data-id="${ev.id}"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
                    </div>
                </div>
                <div class="p-4">
                    <h5 class="font-bold text-slate-800 truncate">${ev.title}</h5>
                    <p class="text-xs text-slate-500 line-clamp-2 mt-1">${ev.caption}</p>
                </div>
            </div>
        `).join('');
        lucide.createIcons();

        document.querySelectorAll('.btn-edit-event').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                openEventEditor(id);
            });
        });

        document.querySelectorAll('.btn-del-event').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                deleteEvent(id);
            });
        });
    }

    function openEventEditor(id = null) {
        const form = document.getElementById('form-event');
        form.reset();
        document.getElementById('event-photo-preview').classList.add('hidden');

        if (id) {
            const ev = allEvents.find(x => x.id === id);
            if (ev) {
                document.getElementById('event-id').value = ev.id;
                document.getElementById('event-title').value = ev.title;
                document.getElementById('event-caption').value = ev.caption;
                if (ev.photo) {
                    document.getElementById('event-photo-preview').src = ev.photo;
                    document.getElementById('event-photo-preview').classList.remove('hidden');
                }
            }
        } else {
             document.getElementById('event-id').value = "";
        }

        document.getElementById('events-grid').classList.add('hidden');
        document.getElementById('event-editor').classList.remove('hidden');
    }

    document.getElementById('btn-new-event').addEventListener('click', () => openEventEditor());
    document.getElementById('btn-cancel-event').addEventListener('click', () => {
        document.getElementById('event-editor').classList.add('hidden');
        document.getElementById('events-grid').classList.remove('hidden');
    });

    document.getElementById('event-photo-file').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await compressImage(file);
            document.getElementById('event-photo-preview').src = base64;
            document.getElementById('event-photo-preview').classList.remove('hidden');
        }
    });

    document.getElementById('form-event').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('event-id').value;
        const newEvent = {
            id: id ? parseInt(id) : Date.now(),
            title: document.getElementById('event-title').value,
            caption: document.getElementById('event-caption').value,
            photo: document.getElementById('event-photo-preview').src
        };

        if (id) {
            const index = allEvents.findIndex(x => x.id === parseInt(id));
            if (index > -1) allEvents[index] = newEvent;
        } else {
            allEvents.push(newEvent);
        }

        localStorage.setItem('portfolio_events', JSON.stringify(allEvents));
        showToast('Evento salvo!');
        renderEvents();
        document.getElementById('btn-cancel-event').click();
    });

    function deleteEvent(id) {
        if (confirm('Deseja apagar este evento?')) {
            allEvents = allEvents.filter(x => x.id !== id);
            localStorage.setItem('portfolio_events', JSON.stringify(allEvents));
            renderEvents();
        }
    }

    // Definir Dados Atuais como Padrão
    document.getElementById('reset-db-btn').addEventListener('click', () => {
        // Verifica se existe pelo menos um perfil guardado
        const profile = localStorage.getItem('portfolio_profile');
        if (!profile) {
            alert('Não existe nenhum dado salvo no painel ainda. Por favor, preencha e salve as informações primeiro.');
            return;
        }

        if (confirm('Tem a certeza que deseja tornar os dados atuais os dados padrão permanentes?\nIsso significa que qualquer reset futuro restaurará estes dados.')) {
            // Capturar todos os dados atuais do localStorage
            const snapshot = {
                profile: localStorage.getItem('portfolio_profile'),
                services: localStorage.getItem('portfolio_services'),
                educations: localStorage.getItem('portfolio_educations'),
                experiences: localStorage.getItem('portfolio_experiences'),
                skills: localStorage.getItem('portfolio_skills'),
                certifications: localStorage.getItem('portfolio_certifications'),
                testimonials: localStorage.getItem('portfolio_testimonials')
            };

            // Guardar como defaults personalizados
            localStorage.setItem('portfolio_custom_defaults', JSON.stringify(snapshot));
            showToast('✔️ Dados atuais definidos como padrão com sucesso!');
        }
    });

    // Botão de Restauro Total (de fábrica)
    document.getElementById('factory-reset-btn').addEventListener('click', () => {
        if (confirm('ATENÇÃO: Isto irá apagar todos os dados E os defaults personalizados, restaurando o estado original de fábrica. Continuar?')) {
            localStorage.removeItem('portfolio_profile');
            localStorage.removeItem('portfolio_services');
            localStorage.removeItem('portfolio_educations');
            localStorage.removeItem('portfolio_experiences');
            localStorage.removeItem('portfolio_skills');
            localStorage.removeItem('portfolio_certifications');
            localStorage.removeItem('portfolio_testimonials');
            localStorage.removeItem('portfolio_custom_defaults');
            showToast('Reset total concluído. Recarregue o site principal para ver os defaults de fábrica.');
            setTimeout(() => window.location.reload(), 2000);
        }
    });
    // --- GITHUB INTEGRATION LOGIC ---
    function loadGithubSettings() {
        const settings = JSON.parse(localStorage.getItem('portfolio_github_settings') || '{}');
        document.getElementById('gh-user').value = settings.user || '';
        document.getElementById('gh-repo').value = settings.repo || '';
        document.getElementById('gh-token').value = settings.token || '';
    }

    document.getElementById('btn-save-github').addEventListener('click', () => {
        const settings = {
            user: document.getElementById('gh-user').value.trim(),
            repo: document.getElementById('gh-repo').value.trim(),
            token: document.getElementById('gh-token').value.trim()
        };
        localStorage.setItem('portfolio_github_settings', JSON.stringify(settings));
        showToast('✔️ Configurações GitHub salvas localmente.');
    });

    document.getElementById('btn-sync-github').addEventListener('click', async () => {
        const settings = JSON.parse(localStorage.getItem('portfolio_github_settings') || '{}');
        const statusEl = document.getElementById('sync-status');

        if (!settings.user || !settings.repo || !settings.token) {
            alert('Por favor, configure o Utilizador, Repositório e Token primeiro.');
            return;
        }

        statusEl.innerText = "⏳ Sincronizando com GitHub...";
        statusEl.className = "mt-4 text-xs font-medium text-blue-600";
        statusEl.classList.remove('hidden');

        try {
            // 1. Gerar o Snapshot dos dados
            const snapshot = {
                profile: localStorage.getItem('portfolio_profile'),
                services: localStorage.getItem('portfolio_services'),
                educations: localStorage.getItem('portfolio_educations'),
                experiences: localStorage.getItem('portfolio_experiences'),
                skills: localStorage.getItem('portfolio_skills'),
                certifications: localStorage.getItem('portfolio_certifications'),
                testimonials: localStorage.getItem('portfolio_testimonials'),
                events: localStorage.getItem('portfolio_events'),
                lastUpdated: Date.now()
            };

            // 2. Construir o conteúdo do ficheiro js/data.js baseado no localStorage atual
            const fileContent = `const defaultData = {
    profile: ${snapshot.profile},
    services: ${snapshot.services},
    educations: ${snapshot.educations},
    experiences: ${snapshot.experiences},
    skills: ${snapshot.skills},
    certifications: ${snapshot.certifications},
    testimonials: ${snapshot.testimonials},
    events: ${snapshot.events},
    lastUpdated: ${snapshot.lastUpdated}
};

function initDatabase() {
    const localLastUpdated = localStorage.getItem("portfolio_last_updated") || "0";
    const remoteLastUpdated = (defaultData.lastUpdated || 0).toString();

    if (!localStorage.getItem("portfolio_profile") || parseInt(remoteLastUpdated) > parseInt(localLastUpdated)) {
        console.log("Sincronizando com a versão mais recente do GitHub...");
        localStorage.setItem("portfolio_profile", JSON.stringify(defaultData.profile));
        localStorage.setItem("portfolio_services", JSON.stringify(defaultData.services));
        localStorage.setItem("portfolio_educations", JSON.stringify(defaultData.educations));
        localStorage.setItem("portfolio_experiences", JSON.stringify(defaultData.experiences));
        localStorage.setItem("portfolio_skills", JSON.stringify(defaultData.skills));
        localStorage.setItem("portfolio_certifications", JSON.stringify(defaultData.certifications));
        localStorage.setItem("portfolio_testimonials", JSON.stringify(defaultData.testimonials));
        localStorage.setItem("portfolio_events", JSON.stringify(defaultData.events || []));
        localStorage.setItem("portfolio_last_updated", remoteLastUpdated);
        
        if (localLastUpdated !== "0") {
            setTimeout(() => window.location.reload(), 500);
        }
    }
}
window.initDatabase = initDatabase;`;

            // 3. Obter o SHA do ficheiro atual no GitHub
            const apiUrl = `https://api.github.com/repos/${settings.user}/${settings.repo}/contents/js/data.js`;
            const getRes = await fetch(apiUrl, {
                headers: { 'Authorization': `token ${settings.token}` }
            });

            let sha = "";
            if (getRes.ok) {
                const data = await getRes.json();
                sha = data.sha;
            }

            // 4. Fazer o PUSH (Update)
            const putRes = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${settings.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: "Update portfolio data via Admin Panel",
                    content: btoa(unescape(encodeURIComponent(fileContent))), // UTF-8 safe base64
                    sha: sha
                })
            });

            if (putRes.ok) {
                statusEl.innerText = "✅ Sucesso! O repositório foi atualizado.";
                statusEl.className = "mt-4 text-xs font-medium text-emerald-600";
                showToast("Sincronização concluída!");
            } else {
                const errData = await putRes.json();
                throw new Error(errData.message || 'Erro no Push');
            }

        } catch (err) {
            console.error(err);
            statusEl.innerText = "❌ Erro: " + err.message;
            statusEl.className = "mt-4 text-xs font-medium text-red-600";
        }
    });
});
