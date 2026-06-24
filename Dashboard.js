// ================= DATA MANAGEMENT =================

// Initialize projects from localStorage
let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [
  {
    id: 1,
    name: "Project 1",
    cover: "images/project1/cover.jpeg",
    desc: "Beautiful branding project",
    images: ["images/project1/design1.jpeg", "images/project1/design2.jpeg", "images/project1/design3.jpeg"]
  },
  {
    id: 2,
    name: "Project 2",
    cover: "images/project2/cover.jpeg",
    desc: "Social media campaign",
    images: ["images/project2/design1.jpeg", "images/project2/design2.jpeg"]
  }
];

let skills = JSON.parse(localStorage.getItem('portfolioSkills')) || [
  { id: 1, icon: "🎨", name: "Branding", desc: "Building strong and memorable brand identities." },
  { id: 2, icon: "📱", name: "Social Media", desc: "Modern social media designs and campaigns." }
];

let aboutData = JSON.parse(localStorage.getItem('portfolioAbout')) || {
  name: "Rahaf EL-Deeb",
  bio: "I'm Rahaf, a passionate graphic designer specializing in branding, social media content, and visual identity systems.",
  experience: 3,
  projectsCount: 50,
  clientsCount: 20
};

let socialLinks = JSON.parse(localStorage.getItem('portfolioSocial')) || {
  instagram: "https://instagram.com/design.with.rahaf",
  tiktok: "https://tiktok.com/@design.with.rahaf",
  youtube: "https://youtube.com/@design.with.rahaf"
};

// ================= UI FUNCTIONS =================

function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active from all buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(tabName + '-tab').classList.add('active');
  
  // Add active to clicked button
  event.target.classList.add('active');

  // Load data for the tab
  if(tabName === 'projects') loadProjects();
  if(tabName === 'about') loadAbout();
  if(tabName === 'skills') loadSkills();
  if(tabName === 'settings') loadSettings();
}

// ================= PROJECTS =================

function loadProjects() {
  const container = document.getElementById('projects-container');
  container.innerHTML = '';

  if(projects.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #3078A4; padding: 40px;">No projects yet. Click "Add Project" to get started!</p>';
    return;
  }

  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-card-header">
        <h3>${project.name}</h3>
        <div class="project-actions">
          <button class="edit-btn" onclick="editProject(${project.id})">✏️ Edit</button>
          <button class="delete-btn" onclick="deleteProject(${project.id})">🗑️ Delete</button>
        </div>
      </div>
      <div class="project-info">
        <p><strong>Cover:</strong> ${project.cover}</p>
        <p><strong>Description:</strong> ${project.desc || 'No description'}</p>
        <p><strong>Designs Count:</strong> ${project.images.length}</p>
      </div>
      <div class="project-images">
        ${project.images.map((img, idx) => `<span class="image-tag">${idx + 1}. ${img.split('/').pop()}</span>`).join('')}
      </div>
    `;
    container.appendChild(card);
  });
}

function openProjectModal() {
  document.getElementById('project-modal').classList.add('active');
  document.getElementById('modal-title').textContent = 'Add New Project';
  document.getElementById('projectName').value = '';
  document.getElementById('coverImage').value = '';
  document.getElementById('projectDesc').value = '';
  document.getElementById('designImages').value = '';
  document.getElementById('projectName').dataset.editId = '';
}

function closeProjectModal() {
  document.getElementById('project-modal').classList.remove('active');
}

function saveProject(e) {
  e.preventDefault();

  const name = document.getElementById('projectName').value;
  const cover = document.getElementById('coverImage').value;
  const desc = document.getElementById('projectDesc').value;
  const imagesStr = document.getElementById('designImages').value;
  const images = imagesStr.split(',').map(img => img.trim()).filter(img => img);

  const editId = document.getElementById('projectName').dataset.editId;

  if(editId) {
    // Update existing
    const project = projects.find(p => p.id == editId);
    if(project) {
      project.name = name;
      project.cover = cover;
      project.desc = desc;
      project.images = images;
    }
  } else {
    // Add new
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    projects.push({ id: newId, name, cover, desc, images });
  }

  saveToLocalStorage();
  closeProjectModal();
  loadProjects();
  showNotification('Project saved successfully! ✅');
}

function editProject(id) {
  const project = projects.find(p => p.id === id);
  if(!project) return;

  document.getElementById('modal-title').textContent = 'Edit Project';
  document.getElementById('projectName').value = project.name;
  document.getElementById('coverImage').value = project.cover;
  document.getElementById('projectDesc').value = project.desc || '';
  document.getElementById('designImages').value = project.images.join(', ');
  document.getElementById('projectName').dataset.editId = id;

  document.getElementById('project-modal').classList.add('active');
}

function deleteProject(id) {
  if(confirm('Are you sure you want to delete this project?')) {
    projects = projects.filter(p => p.id !== id);
    saveToLocalStorage();
    loadProjects();
    showNotification('Project deleted! 🗑️');
  }
}

// ================= SKILLS =================

function loadSkills() {
  const container = document.getElementById('skills-container');
  container.innerHTML = '';

  skills.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <div class="skill-icon">${skill.icon}</div>
      <h4>${skill.name}</h4>
      <p>${skill.desc}</p>
      <div class="skill-actions">
        <button class="edit-btn" onclick="editSkill(${skill.id})">✏️</button>
        <button class="delete-btn" onclick="deleteSkill(${skill.id})">🗑️</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openSkillModal() {
  document.getElementById('skill-modal').classList.add('active');
  document.getElementById('skillName').value = '';
  document.getElementById('skillIcon').value = '';
  document.getElementById('skillDesc').value = '';
  document.getElementById('skillName').dataset.editId = '';
}

function closeSkillModal() {
  document.getElementById('skill-modal').classList.remove('active');
}

function saveSkill(e) {
  e.preventDefault();

  const name = document.getElementById('skillName').value;
  const icon = document.getElementById('skillIcon').value;
  const desc = document.getElementById('skillDesc').value;
  const editId = document.getElementById('skillName').dataset.editId;

  if(editId) {
    const skill = skills.find(s => s.id == editId);
    if(skill) {
      skill.name = name;
      skill.icon = icon;
      skill.desc = desc;
    }
  } else {
    const newId = Math.max(...skills.map(s => s.id), 0) + 1;
    skills.push({ id: newId, icon, name, desc });
  }

  saveToLocalStorage();
  closeSkillModal();
  loadSkills();
  showNotification('Skill saved successfully! ✅');
}

function editSkill(id) {
  const skill = skills.find(s => s.id === id);
  if(!skill) return;

  document.getElementById('skillName').value = skill.name;
  document.getElementById('skillIcon').value = skill.icon;
  document.getElementById('skillDesc').value = skill.desc;
  document.getElementById('skillName').dataset.editId = id;

  document.getElementById('skill-modal').classList.add('active');
}

function deleteSkill(id) {
  if(confirm('Delete this skill?')) {
    skills = skills.filter(s => s.id !== id);
    saveToLocalStorage();
    loadSkills();
    showNotification('Skill deleted! 🗑️');
  }
}

// ================= ABOUT SECTION =================

function loadAbout() {
  document.getElementById('aboutName').value = aboutData.name;
  document.getElementById('aboutBio').value = aboutData.bio;
  document.getElementById('experienceYears').value = aboutData.experience;
  document.getElementById('projectsCount').value = aboutData.projectsCount;
  document.getElementById('clientsCount').value = aboutData.clientsCount;
}

function saveAbout(e) {
  e.preventDefault();

  aboutData = {
    name: document.getElementById('aboutName').value,
    bio: document.getElementById('aboutBio').value,
    experience: parseInt(document.getElementById('experienceYears').value),
    projectsCount: parseInt(document.getElementById('projectsCount').value),
    clientsCount: parseInt(document.getElementById('clientsCount').value)
  };

  saveToLocalStorage();
  showNotification('About section updated! ✅');
}

// ================= SETTINGS =================

function loadSettings() {
  document.getElementById('instagramUrl').value = socialLinks.instagram;
  document.getElementById('tiktokUrl').value = socialLinks.tiktok;
  document.getElementById('youtubeUrl').value = socialLinks.youtube;
}

function saveSocialLinks(e) {
  e.preventDefault();

  socialLinks = {
    instagram: document.getElementById('instagramUrl').value,
    tiktok: document.getElementById('tiktokUrl').value,
    youtube: document.getElementById('youtubeUrl').value
  };

  saveToLocalStorage();
  showNotification('Social links updated! ✅');
}

// ================= UTILITIES =================

function saveToLocalStorage() {
  localStorage.setItem('portfolioProjects', JSON.stringify(projects));
  localStorage.setItem('portfolioSkills', JSON.stringify(skills));
  localStorage.setItem('portfolioAbout', JSON.stringify(aboutData));
  localStorage.setItem('portfolioSocial', JSON.stringify(socialLinks));
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #F2A4A5;
    color: #090087;
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: 700;
    z-index: 10000;
    animation: slideIn 0.3s ease-in-out;
  `;
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

function exportData() {
  const data = {
    projects,
    skills,
    aboutData,
    socialLinks
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio-backup.json';
  a.click();

  showNotification('Data exported! 💾');
}

function resetAllData() {
  if(confirm('⚠️ This will delete ALL your data! Are you absolutely sure?')) {
    if(confirm('Last chance! Click OK to confirm deletion...')) {
      localStorage.clear();
      projects = [];
      skills = [];
      aboutData = {};
      socialLinks = {};
      showNotification('All data deleted!');
      setTimeout(() => location.reload(), 1000);
    }
  }
}

// ================= INITIALIZATION =================

document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  console.log('Dashboard loaded! 📊');
  console.log('Current data:', { projects, skills, aboutData, socialLinks });
});

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);