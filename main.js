// ======= Community Feed =======
let allPosts = JSON.parse(localStorage.getItem('careconnectPosts')) || [];

function savePostsToLocal() {
  localStorage.setItem('careconnectPosts', JSON.stringify(allPosts));
}

function renderPosts(posts) {
  const container = document.getElementById('feedContainer');
  if (!container) return;

  container.innerHTML = '';
  posts.forEach(post => {
    const card = document.createElement('div');
    card.className = `post-card urgency-${post.urgency}`;

    card.innerHTML = `
      <h3>${post.title}</h3>
      <p><strong>${post.type === 'need' ? '🆘 Need' : '🤝 Offer'} by:</strong> ${post.name}</p>
      <p><strong>Category:</strong> ${post.category}</p>
      <p>${post.description}</p>
      <p><em>Urgency: ${post.urgency}</em></p>
      <p class="post-meta">${post.time}</p>
    `;
    container.appendChild(card);
  });
}

const helpForm = document.getElementById('helpForm');
if (helpForm) {
  helpForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const type = document.getElementById('type').value;
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const urgency = document.getElementById('urgency').value;

    const post = {
      name, type, title, description, category, urgency,
      time: new Date().toLocaleString()
    };

    allPosts.unshift(post);
    savePostsToLocal();
    window.location.href = 'feed.html';
  });
}

const clearBtn = document.getElementById('clearPostsBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (confirm("Clear all community posts?")) {
      allPosts = [];
      savePostsToLocal();
      renderPosts([]);
    }
  });
}

// ======= Student Profiles =======
let allProfiles = JSON.parse(localStorage.getItem('careconnectProfiles')) || [];

function saveProfilesToLocal() {
  localStorage.setItem('careconnectProfiles', JSON.stringify(allProfiles));
}

function renderProfiles() {
  displayFilteredProfiles(allProfiles);
}

function displayFilteredProfiles(profilesToShow) {
  const list = document.getElementById('profileList');
  if (!list) return;

  list.innerHTML = '';
  profilesToShow.forEach(profile => {
    const div = document.createElement('div');
    div.className = 'post-card';

    div.innerHTML = `
      ${profile.image ? `<img src="${profile.image}" alt="${profile.name}'s photo">` : ''}
      <h3>${profile.name}</h3>
      <p><strong>🎓 School:</strong> ${profile.school}</p>
      <p><strong>🛠️ Skills:</strong> ${profile.skills}</p>
      <p><strong>📍 Location:</strong> ${profile.location}</p>
      <p><strong>💬 Bio:</strong> ${profile.bio}</p>
      <p><strong>📞 Contact:</strong> ${
        profile.contact.includes('@')
          ? `<a href="mailto:${profile.contact}">${profile.contact}</a>`
          : `<a href="tel:${profile.contact}">${profile.contact}</a>`
      }</p>
    `;
    list.appendChild(div);
  });
}

function applyProfileFilters() {
  const searchText = document.getElementById('searchProfileInput')?.value.toLowerCase() || '';
  const schoolText = document.getElementById('filterSchool')?.value.toLowerCase() || '';
  const locationText = document.getElementById('filterLocation')?.value.toLowerCase() || '';

  const filtered = allProfiles.filter(profile => {
    return (
      (profile.name.toLowerCase().includes(searchText) ||
       profile.skills.toLowerCase().includes(searchText)) &&
      profile.school.toLowerCase().includes(schoolText) &&
      profile.location.toLowerCase().includes(locationText)
    );
  });

  displayFilteredProfiles(filtered);
}

// ======= Handle Profile Image Upload =======
let profileImageBase64 = '';
const profilePicInput = document.getElementById('profilePic');
const previewImage = document.getElementById('previewImage');

if (profilePicInput) {
  profilePicInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      profileImageBase64 = e.target.result;
      previewImage.src = profileImageBase64;
      previewImage.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });
}

// ======= Handle Profile Form Submit =======
const profileForm = document.getElementById('profileForm');
if (profileForm) {
  profileForm.addEventListener('submit', e => {
    e.preventDefault();

    const profile = {
      name: document.getElementById('profileName').value.trim(),
      school: document.getElementById('school').value.trim(),
      skills: document.getElementById('skills').value.trim(),
      location: document.getElementById('location').value.trim(),
      bio: document.getElementById('bio').value.trim(),
      contact: document.getElementById('contact').value.trim(),
      image: profileImageBase64
    };

    allProfiles.unshift(profile);
    saveProfilesToLocal();
    renderProfiles();
    profileForm.reset();
    previewImage.style.display = 'none';
    profileImageBase64 = '';
  });
}

// ======= DOM Loaded Logic =======
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('feedContainer')) {
    renderPosts(allPosts);
  }

  if (document.getElementById('profileList')) {
    renderProfiles();
    ['searchProfileInput', 'filterSchool', 'filterLocation'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', applyProfileFilters);
      }
    });
  }
});