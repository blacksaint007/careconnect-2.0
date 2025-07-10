// ==== COMMUNITY POST SYSTEM ====
const postForm = document.getElementById('helpForm');
const postContainer = document.getElementById('postContainer');
const filterType = document.getElementById('filterType');
const filterCategory = document.getElementById('filterCategory');

let allPosts = JSON.parse(localStorage.getItem('careconnectPosts')) || [];

function savePosts() {
  localStorage.setItem('careconnectPosts', JSON.stringify(allPosts));
}

function displayFilteredPosts() {
  if (!postContainer) return;
  const type = filterType?.value || 'all';
  const category = filterCategory?.value || 'all';
  postContainer.innerHTML = '';

  const filtered = allPosts.filter(post => {
    return (type === 'all' || post.type === type) &&
           (category === 'all' || post.category === category);
  });

  if (filtered.length === 0) {
    postContainer.innerHTML = '<p>No posts found.</p>';
    return;
  }

  filtered.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post-card';
    div.innerHTML = `
      <h3>${post.title}</h3>
      <p><strong>${post.type === 'need' ? '🆘' : '🤝'} ${post.name}</strong></p>
      <p><em>${post.category}</em> | Urgency: ${post.urgency}</p>
      <p>${post.description}</p>
      <button class="bookmark-btn" onclick="bookmarkPost('${post.id}')">🔖 Bookmark</button>
    `;
    postContainer.appendChild(div);
  });
}

function bookmarkPost(id) {
  const bookmarks = JSON.parse(localStorage.getItem('careconnectBookmarks')) || [];
  const exists = bookmarks.find(b => b.id === id);
  if (!exists) {
    const post = allPosts.find(p => p.id === id);
    bookmarks.push(post);
    localStorage.setItem('careconnectBookmarks', JSON.stringify(bookmarks));
    alert('Bookmarked!');
  } else {
    alert('Already bookmarked.');
  }
}

// === POST FORM HANDLING ===
if (postForm) {
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now().toString(),
      name: document.getElementById('name').value,
      type: document.getElementById('type').value,
      title: document.getElementById('title').value,
      category: document.getElementById('category').value,
      urgency: document.getElementById('urgency').value,
      description: document.getElementById('description').value
    };
    allPosts.unshift(newPost);
    savePosts();
    postForm.reset();
    window.location.href = 'feed.html';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  displayFilteredPosts();
});

// ==== STUDENT PROFILE SYSTEM ====
const profileForm = document.getElementById('studentProfileForm');
const profileContainer = document.getElementById('profileContainer');
const profileFilters = document.getElementById('profileFilters');

let studentProfiles = JSON.parse(localStorage.getItem('careconnectProfiles')) || [];

function saveProfiles() {
  localStorage.setItem('careconnectProfiles', JSON.stringify(studentProfiles));
}

function displayProfiles() {
  if (!profileContainer) return;
  profileContainer.innerHTML = '';

  const nameFilter = document.getElementById('filterName')?.value?.toLowerCase() || '';
  const schoolFilter = document.getElementById('filterSchool')?.value?.toLowerCase() || '';
  const skillFilter = document.getElementById('filterSkills')?.value?.toLowerCase() || '';
  const locationFilter = document.getElementById('filterLocation')?.value?.toLowerCase() || '';

  const filtered = studentProfiles.filter(profile =>
    profile.name.toLowerCase().includes(nameFilter) &&
    profile.school.toLowerCase().includes(schoolFilter) &&
    profile.skills.toLowerCase().includes(skillFilter) &&
    profile.location.toLowerCase().includes(locationFilter)
  );

  if (filtered.length === 0) {
    profileContainer.innerHTML = '<p>No matching profiles found.</p>';
    return;
  }

  filtered.forEach(profile => {
    const div = document.createElement('div');
    div.className = 'post-card';
    div.innerHTML = `
      ${profile.image ? `<img src="${profile.image}" alt="Profile Picture">` : ''}
      <h3>${profile.name}</h3>
      <p><strong>School:</strong> ${profile.school}</p>
      <p><strong>Skills:</strong> ${profile.skills}</p>
      <p><strong>Location:</strong> ${profile.location}</p>
      <p>Contact: <a href="${profile.contact.startsWith('mailto') ? profile.contact : 'mailto:' + profile.contact}">${profile.contact}</a></p>
      <button class="bookmark-btn" onclick="bookmarkProfile('${profile.id}')">🔖 Bookmark</button>
    `;
    profileContainer.appendChild(div);
  });
}

function bookmarkProfile(id) {
  const bookmarks = JSON.parse(localStorage.getItem('careconnectBookmarks')) || [];
  const profile = studentProfiles.find(p => p.id === id);
  if (!bookmarks.find(b => b.id === id)) {
    bookmarks.push(profile);
    localStorage.setItem('careconnectBookmarks', JSON.stringify(bookmarks));
    alert('Profile bookmarked!');
  } else {
    alert('Already bookmarked.');
  }
}

// === PROFILE FORM HANDLING ===
if (profileForm) {
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const fileInput = document.getElementById('profileImage');
    const newProfile = {
      id: Date.now().toString(),
      name: document.getElementById('profileName').value,
      school: document.getElementById('profileSchool').value,
      skills: document.getElementById('profileSkills').value,
      location: document.getElementById('profileLocation').value,
      contact: document.getElementById('profileContact').value,
      image: ''
    };

    if (fileInput.files[0]) {
      reader.onload = function () {
        newProfile.image = reader.result;
        studentProfiles.unshift(newProfile);
        saveProfiles();
        profileForm.reset();
        window.location.href = 'profiles.html';
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      studentProfiles.unshift(newProfile);
      saveProfiles();
      profileForm.reset();
      window.location.href = 'profiles.html';
    }
  });
}

if (profileFilters) {
  document.querySelectorAll('#profileFilters input').forEach(input => {
    input.addEventListener('input', displayProfiles);
  });
}

// ==== BOOKMARK VIEW ====
const bookmarksContainer = document.getElementById('bookmarksContainer');
if (bookmarksContainer) {
  const bookmarks = JSON.parse(localStorage.getItem('careconnectBookmarks')) || [];

  if (bookmarks.length === 0) {
    bookmarksContainer.innerHTML = '<p>No bookmarks saved.</p>';
  } else {
    bookmarks.forEach(item => {
      const div = document.createElement('div');
      div.className = 'post-card';
      div.innerHTML = `
        ${item.image ? `<img src="${item.image}" alt="Profile Picture">` : ''}
        <h3>${item.title || item.name}</h3>
        ${item.type ? `<p><strong>${item.type === 'need' ? '🆘' : '🤝'} ${item.name}</strong></p>` : ''}
        ${item.category ? `<p><em>${item.category}</em> | Urgency: ${item.urgency}</p>` : ''}
        ${item.description ? `<p>${item.description}</p>` : ''}
        ${item.school ? `<p><strong>School:</strong> ${item.school}</p>` : ''}
        ${item.skills ? `<p><strong>Skills:</strong> ${item.skills}</p>` : ''}
        ${item.location ? `<p><strong>Location:</strong> ${item.location}</p>` : ''}
        ${item.contact ? `<p>Contact: <a href="${item.contact.startsWith('mailto') ? item.contact : 'mailto:' + item.contact}">${item.contact}</a></p>` : ''}
      `;
      bookmarksContainer.appendChild(div);
    });
  }
}