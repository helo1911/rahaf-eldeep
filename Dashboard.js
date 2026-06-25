// ================= DATA MANAGEMENT =================

let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];

let skills = JSON.parse(localStorage.getItem('portfolioSkills')) || [];

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

// Temp storage for uploaded images (before saving)
let tempCoverImage = null;      // base64 string
let tempDesignImages = [];      // array of base64 strings

// ================= IMAGE UPLOAD HELPERS =================

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function handleCoverUpload(input) {
  const file = input.files[0];
  if (!file) return;

  // Validate type
  if (!file.type.startsWith('image/')) {
    showNotification('❌ Please upload an image file!');
    return;
  }

  // Validate size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    showNotification('❌ Image too large! Max size is 2MB.');
    return;
  }

  try {
    tempCoverImage = await readFileAsBase64(file);
    // Show preview
    document.getElementById('cover-preview').innerHTML = `
      <img src="${tempCoverImage}" alt="Cover Preview" style="width:100%;max-height:150px;object-fit:cover;border-radius:8px;margin-top:8px;">
      <small style="color:#3078A4;">✅ Cover image ready</small>
    `;
  } catch (e) {
    showNotification('❌ Failed to load image');
  }
}

async function handleDesignUpload(input) {
  const files = Array.from(input.files);
  if (!files.length) return;

  // Validate
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      showNotification('❌ Please upload image files only!');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showNotification(`❌ "${file.name}" is too large! Max 2MB per image.`);
      return;
    }
  }

  showNotification('⏳ Loading images...');

  try {
    const newImages = await Promise.all(files.map(f => readFileAsBase64(f)));
    tempDesignImages = [...tempDesignImages, ...newImages];

    // Show previews
    const previewHtml = tempDesignImages.map((img, i) => `
      <div style="position:relative;display:inline-block;">
        <img src="${img}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;border:2px solid #F2A4A5;">
        <button onclick="removeDesignImage(${i})" style="position:absolute;top:-5px;right:-5px;background:#F2A4A5;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;font-size:10px;font-weight:bold;color:#090087;">✕</button>
      </div>
    `).join('');

    document.getElementById('designs-preview').innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">${previewHtml}</div>
      <small style="color:#3078A4;display:block;margin-top:6px;">✅ ${tempDesignImages.length} design image(s) ready</small>
    `;
    showNotification(`✅ ${files.length} image(s) loaded!`);
  } catch (e) {
    showNotification('❌ Failed to load some images');
  }
}

function removeDesignImage(index) {
  tempDesignImages.splice(index, 1);
  // Refresh preview
  if (tempDesignImages.length === 0) {
    document.getElementById('designs-preview').innerHTML = '';
    return;
  }
  const previewHtml = tempDesignImages.map((img, i) => `
    <div style="position:relative;display:inline-block;">
      <img src="${img}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;border:2px solid #F2A4A5;">
      <button onclick="removeDesignImage(${i})" style="position:absolute;top:-5px;right:-5px;background:#F2A4A5;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;font-size:10px;font-weight:bold;color:#090087;">✕</button>
    </div>
  `).join('');
  document.getElementById('designs-preview').innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">${previewHtml}</div>
    <small style="color:#3078A4;display:block;margin-top:6px;">✅ ${tempDesignImages.length} design image(s) ready</small>
  `;
}

// ================= UI FUNCTIONS =================

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabName + '-tab').classList.add('active');
  event.target.classList.add('active');

  if (tabName === 'projects') loadProjects();
  if (tabName === 'about') loadAbout();
  if (tabName === 'skills') loadSkills();
  if (tabName === 'settings') loadSettings();
}

// ================= PROJECTS =================

function loadProjects() {
  const container = document.getElementById('projects-container');
  container.innerHTML = '';

  if (projects.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#3078A4;padding:40px;">No projects yet. Click "Add Project" to get started!</p>';
    return;
  }

  projects.forEach(project => {
    const coverSrc = project.cover || '';
    const isBase64Cover = coverSrc.startsWith('data:');
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-card-header">
        <div style="display:flex;align-items:center;gap:15px;">
          ${isBase64Cover
            ? `<img src="${coverSrc}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;border:2px solid #F2A4A5;">`
            : `<div style="width:60px;height:60px;background:#E5D4C5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;">🖼️</div>`
          }
          <h3>${project.name}</h3>
        </div>
        <div class="project-actions">
          <button class="edit-btn" onclick="editProject(${project.id})">✏️ Edit</button>
          <button class="delete-btn" onclick="deleteProject(${project.id})">🗑️ Delete</button>
        </div>
      </div>
      <div class="project-info">
        <p><strong>Description:</strong> ${project.desc || 'No description'}</p>
        <p><strong>Designs Count:</strong> ${project.images.length} image(s)</p>
      </div>
      <div class="project-images">
        ${project.images.map((img, idx) => {
          if (img.startsWith('data:')) {
            return `<img src="${img}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;border:1px solid #E5D4C5;" title="Design ${idx+1}">`;
          }
          return `<span class="image-tag">${idx + 1}. ${img.split('/').pop()}</span>`;
        }).join('')}
      </div>
    `;
    container.appendChild(card);
  });
}

function openProjectModal() {
  document.getElementById('project-modal').classList.add('active');
  document.getElementById('modal-title').textContent = 'Add New Project';
  document.getElementById('projectName').value = '';
  document.getElementById('projectDesc').value = '';
  document.getElementById('projectName').dataset.editId = '';
  // Reset temp images
  tempCoverImage = null;
  tempDesignImages = [];
  document.getElementById('cover-preview').innerHTML = '';
  document.getElementById('designs-preview').innerHTML = '';
  // Reset file inputs
  document.getElementById('coverImageFile').value = '';
  document.getElementById('designImagesFile').value = '';
}

function closeProjectModal() {
  document.getElementById('project-modal').classList.remove('active');
}

function saveProject(e) {
  e.preventDefault();

  const name = document.getElementById('projectName').value;
  const desc = document.getElementById('projectDesc').value;
  const editId = document.getElementById('projectName').dataset.editId;

  if (!tempCoverImage && !editId) {
    showNotification('❌ Please upload a cover image!');
    return;
  }

  if (tempDesignImages.length === 0 && !editId) {
    showNotification('❌ Please upload at least one design image!');
    return;
  }

  if (editId) {
    const project = projects.find(p => p.id == editId);
    if (project) {
      project.name = name;
      project.desc = desc;
      if (tempCoverImage) project.cover = tempCoverImage;
      if (tempDesignImages.length > 0) project.images = tempDesignImages;
    }
  } else {
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    projects.push({
      id: newId,
      name,
      cover: tempCoverImage,
      desc,
      images: tempDesignImages
    });
  }

  try {
    saveToLocalStorage();
  } catch (storageErr) {
    showNotification('❌ Storage full! Try fewer or smaller images.');
    return;
  }

  closeProjectModal();
  loadProjects();
  showNotification('Project saved successfully! ✅');
}

function editProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  document.getElementById('modal-title').textContent = 'Edit Project';
  document.getElementById('projectName').value = project.name;
  document.getElementById('projectDesc').value = project.desc || '';
  document.getElementById('projectName').dataset.editId = id;

  // Reset temp
  tempCoverImage = null;
  tempDesignImages = [];

  // Show current cover
  const coverPreview = document.getElementById('cover-preview');
  if (project.cover && project.cover.startsWith('data:')) {
    coverPreview.innerHTML = `
      <img src="${project.cover}" alt="Current Cover" style="width:100%;max-height:150px;object-fit:cover;border-radius:8px;margin-top:8px;">
      <small style="color:#3078A4;">Current cover (upload new to replace)</small>
    `;
  } else {
    coverPreview.innerHTML = `<small style="color:#3078A4;">Current: ${project.cover} — upload new to replace</small>`;
  }

  // Show current designs
  const designsPreview = document.getElementById('designs-preview');
  const previewHtml = project.images.map((img, i) =>
    img.startsWith('data:')
      ? `<img src="${img}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;border:2px solid #E5D4C5;">`
      : `<span class="image-tag">${i + 1}. ${img.split('/').pop()}</span>`
  ).join('');
  designsPreview.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">${previewHtml}</div>
    <small style="color:#3078A4;display:block;margin-top:6px;">Current designs (upload new to replace all)</small>
  `;

  document.getElementById('project-modal').classList.add('active');
}

function deleteProject(id) {
  if (confirm('Are you sure you want to delete this project?')) {
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

  if (editId) {
    const skill = skills.find(s => s.id == editId);
    if (skill) { skill.name = name; skill.icon = icon; skill.desc = desc; }
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
  if (!skill) return;
  document.getElementById('skillName').value = skill.name;
  document.getElementById('skillIcon').value = skill.icon;
  document.getElementById('skillDesc').value = skill.desc;
  document.getElementById('skillName').dataset.editId = id;
  document.getElementById('skill-modal').classList.add('active');
}

function deleteSkill(id) {
  if (confirm('Delete this skill?')) {
    skills = skills.filter(s => s.id !== id);
    saveToLocalStorage();
    loadSkills();
    showNotification('Skill deleted! 🗑️');
  }
}

// ================= ABOUT =================

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
    position:fixed;top:20px;right:20px;background:#F2A4A5;color:#090087;
    padding:15px 25px;border-radius:10px;font-weight:700;z-index:10000;
    animation:slideIn 0.3s ease-in-out;max-width:300px;word-wrap:break-word;
  `;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

function exportData() {
  const exportObj = {
    projects: projects.map(p => ({
      ...p,
      cover: p.cover ? '[base64 image]' : p.cover,
      images: p.images.map(() => '[base64 image]')
    })),
    skills,
    aboutData,
    socialLinks
  };
  const json = JSON.stringify(exportObj, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio-backup.json';
  a.click();
  showNotification('Data exported! 💾');
}

function resetAllData() {
  if (confirm('⚠️ This will delete ALL your data! Are you absolutely sure?')) {
    if (confirm('Last chance! Click OK to confirm deletion...')) {
      localStorage.clear();
      projects = []; skills = []; aboutData = {}; socialLinks = {};
      showNotification('All data deleted!');
      setTimeout(() => location.reload(), 1000);
    }
  }
}

// ================= INIT =================

document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
});

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn { from { transform:translateX(400px);opacity:0; } to { transform:translateX(0);opacity:1; } }
  @keyframes slideOut { from { transform:translateX(0);opacity:1; } to { transform:translateX(400px);opacity:0; } }
  .upload-area { border:2px dashed #F2A4A5;border-radius:10px;padding:20px;text-align:center;cursor:pointer;transition:0.3s;background:#F2FFE9; }
  .upload-area:hover { background:#fff;border-color:#090087; }
  .upload-area input[type=file] { display:none; }
  .upload-label { cursor:pointer;display:block;width:100%; }
`;
document.head.appendChild(style);