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
      const body = doc.querySelector('.body')?.textContent || '';  // Get the full body content

      // Create an excerpt (first 3-4 lines of the body)
      const excerpt = createExcerpt(body);

      return { title, excerpt, link: file };
    })
  );

  // Newest first
  entries.reverse().forEach(entry => {
    const el = document.createElement('div');
    el.classList.add('entry');
    el.innerHTML = `
      <h3><a href="${entry.link}">${entry.title}</a></h3>
      <p class="excerpt">${entry.excerpt}</p>  <!-- Adding the excerpt class for styling -->
      <p>&not; <a href="${entry.link}">read more</a></p>
    `;
    container.appendChild(el);
  });
}

// Function to create an excerpt (first 3-4 lines of the body)
function createExcerpt(body) {
  const lines = body.split('\n');  // Split the body into lines
  const excerptLines = lines.slice(0, 4);  // Get the first 4 lines (you can change this number if needed)
  return excerptLines.join(' ') + '...';  // Join them back and add '...'
}

window.onload = loadEntries;
