document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('posts');
    const response = await fetch('/api/posts');
    const posts = await response.json();
  
    posts.forEach(post => {
      const { id, content } = post;
      const data = typeof content === 'string' ? JSON.parse(content) : content;
  
      const card = document.createElement('div');
      card.className = 'post-card';
      card.innerHTML = `
        <img src="${data.image}" alt="${data.title}" />
        <div class="post-card-body">
          <div class="post-category">Travel | ${data.subtitle}</div>
          <h3>${data.title}</h3>
          <p>${data.excerpt}</p>
          <a class="continue-link" href="/post/${id}">Continue reading →</a>
        </div>
      `;
      postsContainer.appendChild(card);
    });
  });
  