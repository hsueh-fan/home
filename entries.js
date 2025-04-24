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

      // Parse the HTML content of the entry
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract the title (from <h3>) and the body text (from .post class)
      const title = doc.querySelector('h3')?.textContent || 'Untitled';
      const body = doc.querySelector('.post')?.textContent || ''; // Grab all text in the post

      // Generate an excerpt by splitting the body into lines and taking the first few
      const excerpt = body.split('\n').slice(0, 4).join(' ').trim(); // Get first 3-4 lines of text

      // Ensure we have a proper excerpt (add '...' at the end if necessary)
      const finalExcerpt = excerpt.length > 0 ? `${excerpt}...` : 'No excerpt available';

      // Create an entry element for each post
      const entryElement = document.createElement('div');
      entryElement.classList.add('entry');
      entryElement.innerHTML = `
        <h3><a href="${entryFile}">${title}</a></h3>
        <p class="excerpt">${finalExcerpt}</p>
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
