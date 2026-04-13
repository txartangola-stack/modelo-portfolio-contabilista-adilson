const defaultData = {
    profile: {
        name: "Crislaine Teixeira",
        title: "Contabilista Certificado",
        tagline: "Rigor, transparência e confiança financeira",
        bio: "Profissional com mais de 10 anos de experiência na área contábil e financeira, especializado em garantir a saúde e o crescimento sustentável de pequenas e médias empresas.",
        experienceYears: 10,
        clientsServed: 250,
        location: "Angola, Luanda",
        email: "txartangola@gmail.com",
        phone: "949 002 171",
        whatsappMsg: "Olá Crislaine! Gostaria de falar sobre os seus serviços de contabilidade.",
        linkedin: "https://linkedin.com",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop" // placeholder temporário
    },
    services: [
        { id: 1, title: "Contabilidade Geral", description: "Organização e execução da contabilidade de acordo com as normas em vigor.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
        { id: 2, title: "Gestão Fiscal", description: "Planeamento e otimização fiscal para empresas e particulares.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        { id: 3, title: "Consultoria Financeira", description: "Análise de viabilidade, planos de negócios e reestruturação financeira.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
        { id: 4, title: "Processamento Salarial", description: "Gestão completa de remunerações, segurança social e obrigações contributivas.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }
    ],
    educations: [
        { id: 1, course: "Mestrado em Finanças Empresariais", institution: "Universidade Nova de Lisboa", year: "2018", certificateDownload: "" },
        { id: 2, course: "Licenciatura em Contabilidade e Administração", institution: "ISCAL", year: "2015", certificateDownload: "" }
    ],
    experiences: [
        { id: 1, role: "Contabilista Sénior", company: "Finance Corp SA", period: "2018 - Presente", description: "Responsável pelo fecho de contas anuais, planeamento fiscal e coordenação da equipa de salários.", gallery: [
            { imgBase64: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=800&fit=crop", caption: "Reunião de planeamento financeiro trimestral" },
            { imgBase64: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=800&fit=crop", caption: "Análise de relatórios de auditoria interna" }
        ] },
        { id: 2, role: "Técnico de Contabilidade", company: "Contab Solutions Lda", period: "2015 - 2018", description: "Elaboração de demonstrações financeiras, reconciliações bancárias e verificação de faturas.", gallery: [
            { imgBase64: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&fit=crop", caption: "Verificação de faturas e documentação local" }
        ] }
    ],
    skills: {
        technical: [
            { name: "Análise Financeira", level: 90 },
            { name: "Gestão Fiscal", level: 95 },
            { name: "Contabilidade Empresarial", level: 100 },
            { name: "Softwares ERP (Primavera, SAP)", level: 85 }
        ],
        soft: [
            { name: "Organização", level: 100 },
            { name: "Atenção ao Detalhe", level: 95 },
            { name: "Ética e Sigilo", level: 100 },
            { name: "Comunicação", level: 90 }
        ]
    },
    certifications: [
        { id: 1, name: "Membro da Ordem dos Contabilistas Certificados" },
        { id: 2, name: "Consultor de Gestão Acreditado" }
    ],
    testimonials: [
        { id: 1, name: "Maria Fernandes", role: "CEO, TechStart", text: "Graças ao apoio do João, conseguimos otimizar a nossa carga fiscal em 20%. Serviço de excelência!" },
        { id: 2, name: "Carlos Pereira", role: "Sócio-Gerente, Comercio Local Lda", text: "Sempre disponível e muito rigoroso nos prazos da Segurança Social e Finanças. Recomendo vivamente." }
    ]
};

// Initiate Default Data if not exists
function initDatabase() {
    if (!localStorage.getItem("portfolio_profile")) {
        const customDefaults = localStorage.getItem("portfolio_custom_defaults");
        
        if (customDefaults) {
            const snapshot = JSON.parse(customDefaults);
            localStorage.setItem("portfolio_profile", snapshot.profile);
            localStorage.setItem("portfolio_services", snapshot.services);
            localStorage.setItem("portfolio_educations", snapshot.educations);
            localStorage.setItem("portfolio_experiences", snapshot.experiences);
            localStorage.setItem("portfolio_skills", snapshot.skills);
            localStorage.setItem("portfolio_certifications", snapshot.certifications);
            localStorage.setItem("portfolio_testimonials", snapshot.testimonials);
            console.log("Database initialized with custom defaults.");
        } else {
            localStorage.setItem("portfolio_profile", JSON.stringify(defaultData.profile));
            localStorage.setItem("portfolio_services", JSON.stringify(defaultData.services));
            localStorage.setItem("portfolio_educations", JSON.stringify(defaultData.educations));
            localStorage.setItem("portfolio_experiences", JSON.stringify(defaultData.experiences));
            localStorage.setItem("portfolio_skills", JSON.stringify(defaultData.skills));
            localStorage.setItem("portfolio_certifications", JSON.stringify(defaultData.certifications));
            localStorage.setItem("portfolio_testimonials", JSON.stringify(defaultData.testimonials));
            console.log("Mock database initialized with hardcoded defaults.");
        }
    }
}

// Global available
window.initDatabase = initDatabase;
