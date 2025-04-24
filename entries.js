async function loadEntries() {
  const container = document.getElementById('archive-entries');

  const entryFiles = [];
  const numEntries = 100; // Assuming we might have up to 100 entries

  for (let i = 1; i <= numEntries; i++) {
    const entryFile = `entry_${String(i).padStart(2, '0')}.html`; // Dynamically generate entry filenames
    try {
      const res = await fetch(entryFile);
      if (!res.ok) continue; // Skip this entry if it doesn't exist
      const html = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract the title (from <h3>) and body (from .post class)
      const title = doc.querySelector('h3')?.textContent || 'Untitled';
      const body = doc.querySelector('.post p')?.textContent || ''; // Grab the first <p> from the post body

      // Generate an excerpt by taking only the first paragraph
      const excerpt = body.split('\n')[0].trim(); // Only the first paragraph (up to the first line break)

      // Create an entry element for each post
      const entryElement = document.createElement('div');
      entryElement.classList.add('entry');
      entryElement.innerHTML = `
        <h3><a href="${entryFile}">${title}</a></h3>
        <p class="excerpt">${excerpt}...</p>
        <p>&not; <a href="${entryFile}">read more</a></p>
      `;
      entryFiles.push(entryElement);  // Store the entry element to append later
    } catch (err) {
      console.error(`Failed to load ${entryFile}: ${err}`);
    }
  }

  // Reverse the order to show newest entries first
  entryFiles.reverse().forEach(entryElement => {
    container.appendChild(entryElement);  // Append the reversed entries to the page
  });
}

window.onload = loadEntries;
