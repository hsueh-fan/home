// Function to load the entries dynamically from the JSON file
async function loadEntries() {
  // Fetch the entries from the local JSON file
  const response = await fetch('entries.json');
  const entries = await response.json(); // Parse the JSON data

  // Get the container where you want to show the entries (e.g., a div with the ID 'archive-entries')
  const archiveContainer = document.getElementById('archive-entries');

  // Loop through each entry and create HTML elements for them
  entries.forEach(entry => {
    // Create a new div for each entry
    const entryElement = document.createElement('div');
    entryElement.classList.add('col'); // Adds 'col' class to the div (styling)

    // Add HTML content for the entry (title, excerpt, and read more link)
    entryElement.innerHTML = `
      <h3><a href="${entry.link}">${entry.title}</a></h3>
      <p>${entry.excerpt}</p>
      <p>&not; <a href="${entry.link}">read more</a></p>
    `;

    // Append the new entry to the container
    archiveContainer.appendChild(entryElement);
  });
}

// Run the function when the page loads
window.onload = loadEntries;
