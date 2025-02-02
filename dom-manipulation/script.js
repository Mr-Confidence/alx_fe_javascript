// Initial quotes array
let quotes = [
  { text: "Life is what happens while you're busy making other plans.", category: "Life" },
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Failure" },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', category: "Dreams" },
  { text : 'One day you will face many defeats but remember that defeat is a stepping stone to victory.', category: "Victory" },
  { text : 'One day , the son will be greater than his father.', category: "Inheritance" }
];

// Initialize variables
let quoteDisplay, newQuote, categoryFilter;

// Function to initialize and set up event listeners
function init() {
  quoteDisplay = document.getElementById("quoteDisplay");
  newQuote = document.getElementById("newQuote");
  categoryFilter = document.getElementById("categoryFilter");

  // Load quotes from local storage
  loadQuotes();

  // Event listener for displaying random quote
  newQuote.addEventListener("click", showRandomQuote);

  // Create and append add quote form
  createAddQuoteForm();

  // Create and append import/export buttons
  createImportExportButtons();

  // Populate categories dropdown
  populateCategories();

  // Load and set last selected category
  const lastCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  categoryFilter.value = lastCategory;
  filterQuotes();

  // Store last viewed quote in session storage
  window.addEventListener('beforeunload', () => {
      const currentQuote = quoteDisplay.textContent;
      sessionStorage.setItem('lastViewedQuote', currentQuote);
  });
}

// Populate categories dynamically in the dropdown
function populateCategories() {
  const categories = new Set(quotes.map(quote => quote.category));

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });
}

// Filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;

  // Save selected category in local storage
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);

  displayQuotes(filteredQuotes);
}

// Display quotes in the quote display area
function displayQuotes(quotesToShow) {
  quoteDisplay.innerHTML = '';

  if (quotesToShow.length === 0) {
      quoteDisplay.textContent = "No quotes available in this category.";
      return;
  }

  quotesToShow.forEach(quote => {
      const quoteDiv = document.createElement('div');
      quoteDiv.className = 'quote-item';

      const quoteText = document.createElement('p');
      quoteText.className = 'quote-text';
      quoteText.textContent = quote.text;

      const quoteCategory = document.createElement('span');
      quoteCategory.className = 'quote-category';
      quoteCategory.textContent = `Category: ${quote.category}`;

      quoteDiv.appendChild(quoteText);
      quoteDiv.appendChild(quoteCategory);
      quoteDisplay.appendChild(quoteDiv);
  });
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
      quotes = JSON.parse(savedQuotes);
  }
}

// Create import/export buttons
function createImportExportButtons() {
  const exportBtn = document.getElementById('exportBtn');
  const importInput = document.getElementById('importFile');

  exportBtn.addEventListener('click', exportToJsonFile);

  // Add event listener for import
  importInput.addEventListener('change', importFromJsonFile);
}

// Export quotes to JSON file
function exportToJsonFile() {
  const quotesJson = JSON.stringify(quotes, null, 2);
  const blob = new Blob([quotesJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(e) {
      try {
          const importedQuotes = JSON.parse(e.target.result);

          // Validate imported data
          if (Array.isArray(importedQuotes) && importedQuotes.every(quote => typeof quote === 'object' && 'text' in quote && 'category' in quote)) {
              quotes.push(...importedQuotes);
              saveQuotes();
              showRandomQuote();
              alert('Quotes imported successfully!');
          } else {
              throw new Error('Invalid quote format');
          }
      } catch (error) {
          alert('Error importing quotes. Please check the file format.');
      }
  };

  fileReader.readAsText(event.target.files[0]);
}

// Create add quote form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.className = 'js-quote-form';

  formContainer.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter a new quote">
    <input type="text" id="newQuoteCategory" placeholder="Enter quote category">
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(formContainer);
}

// Show a random quote from the list based on the selected category
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const eligibleQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);

  if (eligibleQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available in this category.";
      return;
  }

  const randomIndex = Math.floor(Math.random() * eligibleQuotes.length);
  const quote = eligibleQuotes[randomIndex];

  quoteDisplay.innerHTML = '';

  const quoteText = document.createElement('p');
  quoteText.className = 'quote-text';
  quoteText.textContent = quote.text;

  const quoteCategory = document.createElement('span');
  quoteCategory.className = 'quote-category';
  quoteCategory.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  // Store current quote in session storage
  sessionStorage.setItem('lastViewedQuote', quote.text);
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!quoteText || !category) {
      alert('Please enter a quote text and provide its category.');
      return;
  }

  quotes.push({ text: quoteText, category: category });
  saveQuotes();
  populateCategories();

  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  // Display success message
  const successMessage = document.createElement('p');
  successMessage.className = 'success-message';
  successMessage.textContent = 'Quote added successfully!';
  document.body.appendChild(successMessage);

  setTimeout(() => {
      document.body.removeChild(successMessage);
  }, 3000);

  // Show random quote
  showRandomQuote();
}

// Initialize the page
document.addEventListener("DOMContentLoaded", init);
