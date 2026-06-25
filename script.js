// ================= LOAD DATA FROM DASHBOARD =================
let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
let skills   = JSON.parse(localStorage.getItem('portfolioSkills'))   || [];
let aboutData = JSON.parse(localStorage.getItem('portfolioAbout')) || {
  name: "Rahaf EL-Deeb",
  bio: "I'm Rahaf, a passionate graphic designer specializing in branding, social media content, and visual identity systems.",
  experience: 3,
  projectsCount: 50,
  clientsCount: 20
};
let socialLinks = JSON.parse(localStorage.getItem('portfolioSocial')) || {
  instagram: "https://instagram.com/design.with.rahaf",
  tiktok:    "https://tiktok.com/@design.with.rahaf",
  youtube:   "https://youtube.com/@design.with.rahaf"
};

// ================= RENDER PROJECTS =================
function renderProjects() {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (projects.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#E5D4C5;opacity:0.6;">
        <div style="font-size:48px;margin-bottom:15px;">🎨</div>
        <p style="font-size:18px;">Projects coming soon...</p>
      </div>`;
    return;
  }

  projects.forEach((project, index) => {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.onclick = () => openGallery(index);
    item.innerHTML = `
      <img src="${project.cover}" alt="${project.name}">
      <div class="overlay">
        <h3>${project.name}</h3>
        <p class="project-count">${project.images.length} design${project.images.length !== 1 ? 's' : ''}</p>
      </div>
    `;
    grid.appendChild(item);
  });
}

// ================= RENDER SKILLS =================
function renderSkills() {
  const grid = document.querySelector('.skills-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (skills.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;color:#3078A4;opacity:0.6;">
        <p>Skills coming soon...</p>
      </div>`;
    return;
  }

  skills.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `<h3>${skill.icon} ${skill.name}</h3><p>${skill.desc}</p>`;
    grid.appendChild(card);
  });
}

// ================= UPDATE ABOUT =================
function updateAboutSection() {
  const els = {
    projects:   document.querySelector('.glass-card:nth-child(1) h3'),
    clients:    document.querySelector('.glass-card:nth-child(2) h3'),
    experience: document.querySelector('.glass-card:nth-child(3) h3'),
  };
  if (els.projects)   els.projects.textContent   = aboutData.projectsCount + '+';
  if (els.clients)    els.clients.textContent     = aboutData.clientsCount  + '+';
  if (els.experience) els.experience.textContent  = aboutData.experience    + '+';

  const bioEl = document.querySelector('.about-left p');
  if (bioEl && aboutData.bio) bioEl.textContent = aboutData.bio;
}

// ================= UPDATE SOCIAL LINKS =================
function updateSocialLinks() {
  const map = {
    '.btn-instagram': socialLinks.instagram,
    '.btn-tiktok':    socialLinks.tiktok,
    '.btn-youtube':   socialLinks.youtube,
  };
  Object.entries(map).forEach(([sel, href]) => {
    const el = document.querySelector(sel);
    if (el && href) el.href = href;
  });
}

// ================= GALLERY =================
let currentProjectIndex = 0;
let currentImageIndex   = 0;

function openGallery(projectIndex) {
  currentProjectIndex = projectIndex;
  currentImageIndex   = 0;
  document.getElementById('gallery-modal').classList.add('active');
  displayImage();
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  document.getElementById('gallery-modal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

function displayImage() {
  const project = projects[currentProjectIndex];
  document.getElementById('gallery-image').src = project.images[currentImageIndex];
  document.getElementById('image-counter').textContent =
    `${currentImageIndex + 1} / ${project.images.length}`;
}

function nextImage() {
  const len = projects[currentProjectIndex].images.length;
  currentImageIndex = (currentImageIndex + 1) % len;
  displayImage();
}

function prevImage() {
  const len = projects[currentProjectIndex].images.length;
  currentImageIndex = (currentImageIndex - 1 + len) % len;
  displayImage();
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('gallery-modal').classList.contains('active')) return;
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft')  prevImage();
  if (e.key === 'Escape')     closeGallery();
});

document.getElementById('gallery-modal')?.addEventListener('click', e => {
  if (e.target.id === 'gallery-modal') closeGallery();
});

// ================= NAV & SCROLL =================
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('section').forEach(section => {
    if (pageYOffset >= section.offsetTop - 200) current = section.getAttribute('id');
  });
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) link.classList.add('active');
  });
});

// ================= CURSOR GLOW =================
const cursor = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
if (window.innerWidth < 768) cursor.style.display = 'none';

// ================= SCROLL REVEAL =================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-card, .glass-card').forEach(el => observer.observe(el));

// ================= INIT =================
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  renderProjects();
  renderSkills();
  updateAboutSection();
  updateSocialLinks();
});