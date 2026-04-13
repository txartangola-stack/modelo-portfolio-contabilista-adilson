document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    // --- AUTHENTICATION ---
    const loginModal = document.getElementById('login-modal');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('login-error');
    
    // Check session
    if(sessionStorage.getItem('admin_logged_in') === 'true') {
        loginModal.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loadAllData();
    }
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('login-user').value;
        const p = document.getElementById('login-pass').value;
        if(u === 'admin' && p === 'admin') {
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
        if(msg) toast.innerText = msg;
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
        if(!localStorage.getItem("portfolio_profile") && window.initDatabase) window.initDatabase();
        
        loadProfile();
        loadServices();
        loadExperience();
        loadEducation();
        loadSkills();
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
        
        if(profileData.photo) {
            document.getElementById('prof-photo-preview').src = profileData.photo;
            document.getElementById('prof-photo-preview').classList.remove('hidden');
        }
    }
    
    // Converter foto e comprimir
    document.getElementById('prof-photo').addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if(!file) return;
        
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
        if(confirm('Deseja remover a foto de perfil?')) {
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
        tbody.innerHTML = serv.map(s => `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="p-3 align-top font-medium">${s.title}</td>
                <td class="p-3 align-top text-slate-500 line-clamp-2" title="${s.description}">${s.description.substring(0,80)}...</td>
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
        listEl.innerHTML = allExperiences.map(e => `
            <div class="border border-slate-200 p-4 rounded bg-slate-50 flex justify-between items-center group hover:border-blue-300">
                <div>
                    <div class="font-medium text-slate-800">${e.role}</div>
                    <div class="text-sm text-slate-500">${e.company} | ${e.period}</div>
                    ${e.gallery && e.gallery.length > 0 ? `<div class="text-xs mt-1 text-emerald-600 flex items-center"><i data-lucide="image" class="w-3 h-3 mr-1"></i> ${e.gallery.length} foto(s) na galeria</div>` : ''}
                </div>
                <button type="button" class="text-slate-400 hover:text-blue-500 transition-colors btn-edit-exp" data-id="${e.id}"><i data-lucide="edit" class="w-5 h-5"></i></button>
            </div>
        `).join('');
        lucide.createIcons();

        document.querySelectorAll('.btn-edit-exp').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                const id = parseInt(ev.currentTarget.getAttribute('data-id'));
                openExpEditor(id);
            });
        });
    }

    function openExpEditor(id) {
        editingExpId = id;
        const exp = allExperiences.find(x => x.id === id);
        if(!exp) return;
        
        document.getElementById('exp-id').value = exp.id;
        document.getElementById('exp-role').value = exp.role;
        document.getElementById('exp-company').value = exp.company;
        document.getElementById('exp-period').value = exp.period;
        document.getElementById('exp-desc').value = exp.description;
        
        currentExpGallery = exp.gallery ? [...exp.gallery] : [];
        renderExpGallery();

        document.getElementById('exp-list').classList.add('hidden');
        document.getElementById('exp-editor').classList.remove('hidden');
    }

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
        const id = parseInt(document.getElementById('exp-id').value);
        const index = allExperiences.findIndex(x => x.id === id);
        if(index > -1) {
            allExperiences[index] = {
                id: id,
                role: document.getElementById('exp-role').value,
                company: document.getElementById('exp-company').value,
                period: document.getElementById('exp-period').value,
                description: document.getElementById('exp-desc').value,
                gallery: currentExpGallery
            };
            localStorage.setItem('portfolio_experiences', JSON.stringify(allExperiences));
            showToast('Experiência salva com sucesso!');
            renderExperienceList();
            closeExpEditor();
        }
    });

    // Gallery Logic
    let tempGalleryBase64 = null;
    document.getElementById('exp-gallery-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            tempGalleryBase64 = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('btn-add-gallery').addEventListener('click', () => {
        if(!tempGalleryBase64) {
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
    
    function loadEducation() {
        const edu = JSON.parse(localStorage.getItem('portfolio_educations') || '[]');
        document.getElementById('edu-list').innerHTML = edu.map(e => `
            <div class="border border-slate-200 p-4 rounded bg-slate-50 flex justify-between">
                <div><div class="font-medium">${e.course}</div><div class="text-sm text-slate-500">${e.institution} | ${e.year}</div></div>
                <button class="text-slate-400 hover:text-blue-500"><i data-lucide="edit" class="w-5 h-5"></i></button>
            </div>
        `).join('');
        lucide.createIcons();
    }

    function loadSkills() {
        const sk = JSON.parse(localStorage.getItem('portfolio_skills') || '{"technical":[],"soft":[]}');
        document.getElementById('skills-tech-ul').innerHTML = sk.technical.map(s => `<li>${s.name} <span class="text-slate-400">(${s.level}%)</span></li>`).join('');
        document.getElementById('skills-soft-ul').innerHTML = sk.soft.map(s => `<li>${s.name} <span class="text-slate-400">(${s.level}%)</span></li>`).join('');
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
                testimonials: localStorage.getItem('portfolio_testimonials')
            };

            // 2. Construir o conteúdo do ficheiro js/data.js baseado no localStorage atual
            const fileContent = `const defaultData = {
    profile: ${snapshot.profile},
    services: ${snapshot.services},
    educations: ${snapshot.educations},
    experiences: ${snapshot.experiences},
    skills: ${snapshot.skills},
    certifications: ${snapshot.certifications},
    testimonials: ${snapshot.testimonials}
};

function initDatabase() {
    if (!localStorage.getItem("portfolio_profile")) {
        localStorage.setItem("portfolio_profile", JSON.stringify(defaultData.profile));
        localStorage.setItem("portfolio_services", JSON.stringify(defaultData.services));
        localStorage.setItem("portfolio_educations", JSON.stringify(defaultData.educations));
        localStorage.setItem("portfolio_experiences", JSON.stringify(defaultData.experiences));
        localStorage.setItem("portfolio_skills", JSON.stringify(defaultData.skills));
        localStorage.setItem("portfolio_certifications", JSON.stringify(defaultData.certifications));
        localStorage.setItem("portfolio_testimonials", JSON.stringify(defaultData.testimonials));
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
