const container = document.getElementById('postContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

function displayPosts(filterType = 'all') {
  const posts = JSON.parse(localStorage.getItem('careconnectPosts')) || [];

  container.innerHTML = '';

  const filtered = filterType === 'all'
    ? posts
    : posts.filter(post => post.type === filterType);

  if (filtered.length === 0) {
    container.innerHTML = '<p>No posts found.</p>';
    return;
  }

  filtered.reverse().forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';

    card.innerHTML = `
      ${post.profilePic ? `<img src="${post.profilePic}" alt="Profile Picture">` : ''}
      <h3>${post.fullName}</h3>
      <small>${post.contact} · ${post.location || 'Unknown'}</small>
      <p><strong>Skills:</strong> ${post.skills || 'None'}</p>
      <p><strong>School:</strong> ${post.school || 'N/A'}</p>
      <p><strong>Bio:</strong> ${post.bio || ''}</p>
      <p><strong>Type:</strong> ${post.type === 'need' ? '🆘 Need Help' : '🤝 Offer Help'}</p>
      <p><strong>Description:</strong> ${post.description}</p>
      <p><strong>Urgency:</strong> ${post.urgency}</p>
    `;

    container.appendChild(card);
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.getAttribute('data-filter');
    displayPosts(type);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  displayPosts();
});