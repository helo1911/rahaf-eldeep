// ================= LOAD DATA FROM DASHBOARD =================
// اقرأ البيانات من localStorage (من Dashboard)
let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
let skills = JSON.parse(localStorage.getItem('portfolioSkills')) || [];
let aboutData = JSON.parse(localStorage.getItem('portfolioAbout')) || {
  name: "Rahaf EL-Deeb",
  bio: "I'm Rahaf, a passionate graphic designer specializing in branding, social media content, and visual identity systems. I transform ideas into memorable visual experiences that help brands connect with people.",
  experience: 3,
  projectsCount: 50,
  clientsCount: 20
};
let socialLinks = JSON.parse(localStorage.getItem('portfolioSocial')) || {
  instagram: "https://instagram.com/design.with.rahaf",
  tiktok: "https://tiktok.com/@design.with.rahaf",
  youtube: "https://youtube.com/@design.with.rahaf"
};

// If no projects in localStorage, use defaults
if(projects.length === 0) {
  projects = [
    {
      id: 1,
      name: "Project 1",
      cover: "images/project1/cover.jpeg",
      desc: "Beautiful branding project",
      images: [
        "images/project1/design1.jpeg",
        "images/project1/design2.jpeg",
        "images/project1/design3.jpeg",
        "images/project1/design4.jpeg",
        "images/project1/design5.jpeg"
      ]
    },
    {
      id: 2,
      name: "Project 2",
      cover: "images/project2/cover.jpeg",
      desc: "Social media campaign",
      images: [
        "images/project2/design1.jpeg",
        "images/project2/design2.jpeg",
        "images/project2/design3.jpeg",
        "images/project2/design4.jpeg"
      ]
    },
    {
      id: 3,
      name: "Project 3",
      cover: "images/project3/cover.jpeg",
      desc: "Logo design collection",
      images: [
        "images/project3/design1.jpeg",
        "images/project3/design2.jpeg",
        "images/project3/design3.jpeg",
        "images/project3/design4.jpeg",
        "images/project3/design5.jpeg",
        "images/project3/design6.jpeg"
      ]
    },
    {
      id: 4,
      name: "Project 4",
      cover: "images/project4/cover.webp",
      desc: "Poster design series",
      images: [
        "images/project4/design1.webp",
        "images/project4/design2.webp",
        "images/project4/design3.webp"
      ]
    },
    {
      id: 5,
      name: "Project 5",
      cover: "images/project5/cover.webp",
      desc: "Visual identity system",
      images: [
        "images/project5/design1.webp",
        "images/project5/design2.webp",
        "images/project5/design3.webp",
        "images/project5/design4.webp",
        "images/project5/design5.webp"
      ]
    },
    {
      id: 6,
      name: "Project 6",
      cover: "images/project6/cover.jpg",
      desc: "Branding package",
      images: [
        "images/project6/design1.jpg",
        "images/project6/design2.jpg",
        "images/project6/design3.jpg",
        "images/project6/design4.jpg"
      ]
    }
  ];
}

// Update about section with loaded data
function updateAboutSection() {
  const experElement = document.querySelector('.glass-card:nth-child(3) h3');
  const clientsElement = document.querySelector('.glass-card:nth-child(2) h3');
  const projectsElement = document.querySelector('.glass-card:nth-child(1) h3');
  
  if(projectsElement) projectsElement.textContent = aboutData.projectsCount + '+';
  if(clientsElement) clientsElement.textContent = aboutData.clientsCount + '+';
  if(experElement) experElement.textContent = aboutData.experience + '+';
}

// Update social links
function updateSocialLinks() {
  const instaBtn = document.querySelector('.btn-instagram');
  const tiktokBtn = document.querySelector('.btn-tiktok');
  const youtubeBtn = document.querySelector('.btn-youtube');
  
  if(instaBtn) instaBtn.href = socialLinks.instagram;
  if(tiktokBtn) tiktokBtn.href = socialLinks.tiktok;
  if(youtubeBtn) youtubeBtn.href = socialLinks.youtube;
}

// ================= GALLERY SYSTEM =================
let currentProjectIndex = 0;
let currentImageIndex = 0;

function openGallery(projectIndex) {
  currentProjectIndex = projectIndex;
  currentImageIndex = 0;
  
  const modal = document.getElementById('gallery-modal');
  modal.classList.add('active');
  
  displayImage();
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  const modal = document.getElementById('gallery-modal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function displayImage() {
  const project = projects[currentProjectIndex];
  const image = project.images[currentImageIndex];
  const totalImages = project.images.length;
  
  document.getElementById('gallery-image').src = image;
  document.getElementById('image-counter').textContent = 
    `${currentImageIndex + 1} / ${totalImages}`;
}

function nextImage() {
  const project = projects[currentProjectIndex];
  
  if(currentImageIndex < project.images.length - 1) {
    currentImageIndex++;
  } else {
    currentImageIndex = 0; // Loop back to first
  }
  
  displayImage();
}

function prevImage() {
  const project = projects[currentProjectIndex];
  
  if(currentImageIndex > 0) {
    currentImageIndex--;
  } else {
    currentImageIndex = project.images.length - 1; // Loop to last
  }
  
  displayImage();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('gallery-modal');
  
  if(modal.classList.contains('active')) {
    if(e.key === 'ArrowRight') nextImage();
    if(e.key === 'ArrowLeft') prevImage();
    if(e.key === 'Escape') closeGallery();
  }
});

// Close gallery when clicking outside the image
document.getElementById('gallery-modal')?.addEventListener('click', (e) => {
  if(e.target.id === 'gallery-modal') {
    closeGallery();
  }
});

// ================= ORIGINAL FUNCTIONALITY =================

// Smooth scroll navigation
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Cursor glow effect
const cursor = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Hide cursor glow on mobile
if(window.innerWidth < 768) {
  cursor.style.display = 'none';
}

// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-card, .glass-card').forEach(el => {
  observer.observe(el);
});

// Add active state to nav links based on scroll position
window.addEventListener('scroll', () => {
  let current = '';
  
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    if(pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
    if(link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// Social media button tracking (optional)
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    console.log('Clicked social button:', this.querySelector('svg').parentElement.textContent.trim());
  });
});

// Page load initialization
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  updateAboutSection();
  updateSocialLinks();
  console.log('Portfolio loaded with data from Dashboard! 📊');
  console.log('Projects:', projects);
  console.log('Skills:', skills);
});