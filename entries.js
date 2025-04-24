async function loadEntries() {
  const container = document.getElementById('archive-entries');
  const numEntries = 100;

  // Generate file names first
  const entryFileNames = Array.from({ length: numEntries }, (_, i) =>
    `entry_${String(i + 1).padStart(2, '0')}.html`
  );

  // Fetch all entry files in parallel
  const fetchPromises = entryFileNames.map(file =>
    fetch(file).then(res => res.ok ? res.text() : null).catch(() => null)
  );

  const results = await Promise.all(fetchPromises);

  // Process fetched results
  const entries = results.map((html, index) => {
    if (!html) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const title = doc.querySelector('h3')?.textContent || 'Untitled';
    const body = doc.querySelector('.post p')?.textContent || '';
    const excerpt = body.split('\n')[0].trim();

    const entryElement = document.createElement('div');
    entryElement.classList.add('entry');
    entryElement.innerHTML = `
      <h3><a href="${entryFileNames[index]}">${title}</a></h3>
      <p class="excerpt">${excerpt}...</p>
      <p>&not; <a href="${entryFileNames[index]}">read more</a></p>
    `;
    return entryElement;
  }).filter(Boolean); // Remove nulls

  // Append in reverse order (newest first)
  entries.reverse().forEach(entry => container.appendChild(entry));
}

window.onload = loadEntries;
