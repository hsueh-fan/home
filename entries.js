const entryFiles = ['entry_01.html', 'entry_02.html', 'entry_03.html']; // Add more as you publish

async function loadEntries() {
  const container = document.getElementById('archive-entries');

  const entries = await Promise.all(
    entryFiles.map(async (file) => {
      const res = await fetch(file);
      const html = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const title = doc.querySelector('h3')?.textContent || 'Untitled';
      const excerpt = doc.querySelector('p')?.textContent || 'No excerpt available';

      return { title, excerpt, link: file };
    })
  );

  // Newest first
  entries.reverse().forEach(entry => {
    const el = document.createElement('div');
    el.classList.add('entry');
    el.innerHTML = `
      <h3><a href="${entry.link}">${entry.title}</a></h3>
      <p>${entry.excerpt}</p>
      <p>&not; <a href="${entry.link}">read more</a></p>
    `;
    container.appendChild(el);
  });
}

window.onload = loadEntries;
