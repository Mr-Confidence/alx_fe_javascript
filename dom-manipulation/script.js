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

// Mock API endpoint
const mockApiEndpoint = "https://mockapi.example.com/quotes";

// Function to simulate fetching data from a server
function fetchQuotesFromServer() {
  console.log("Fetching quotes from server...");
  // Simulate server response with a delay (like an API call)
  setTimeout(() => {
      const serverQuotes = [
          { text: "New server quote 1", category: "Motivation" },
          { text: "Server quote 2", category: "Work" },
      ];
      handleFetchedQuotes(serverQuotes);
  }, 1000);
}

// Function to simulate posting data to a server
function postQuoteToServer(quote) {
  console.log("Posting quote to server...");
  // Simulate a POST request to the mock API
  setTimeout(() => {
      console.log("Quote posted successfully: ", quote);
      // Mock server response after posting
      // For now, assume server responds with the same quote
      handleServerPostResponse(quote);
  }, 1000);
}

// Function to handle fetched quotes and resolve conflicts
function handleFetchedQuotes(fetchedQuotes) {
  const localQuotes = loadQuotesFromLocalStorage();
  const newQuotes = [];

  fetchedQuotes.forEach(fetchedQuote => {
      const conflict = localQuotes.find(quote => quote.text === fetchedQuote.text);
      
      if (!conflict) {
          newQuotes.push(fetchedQuote);
      } else {
          // Handle conflicts (for now we assume the server's version is the most up-to-date)
          console.log(`Conflict detected for quote: "${fetchedQuote.text}", using server version.`);
      }
  });

  // Add new quotes to local storage
  if (newQuotes.length > 0) {
      newQuotes.forEach(quote => {
          quotes.push(quote);
      });
      saveQuotes();
      alert("New quotes were added from the server.");
      showRandomQuote();
  }
}

// Function to resolve server post response
function handleServerPostResponse(postedQuote) {
  // Check if the quote already exists in local storage
  const existingQuoteIndex = quotes.findIndex(quote => quote.text === postedQuote.text);

  if (existingQuoteIndex === -1) {
      quotes.push(postedQuote);
      saveQuotes();
      alert("Quote added to local storage from server.");
  } else {
      console.log(`Quote "${postedQuote.text}" already exists locally.`);
  }
}

// Function to synchronize quotes periodically
function syncQuotes() {
  console.log("Synchronizing quotes with the server...");
  fetchQuotesFromServer();
}

// Function to load quotes from local storage
function loadQuotesFromLocalStorage() {
  const savedQuotes = localStorage.getItem('quotes');
  return savedQuotes ? JSON.parse(savedQuotes) : [];
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to start periodic sync every 5 minutes
function startSync() {
  setInterval(syncQuotes, 5 * 60 * 1000); // Sync every 5 minutes
}

// Function to handle add quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!quoteText || !category) {
      alert('Please enter a quote text and provide its category.');
      return;
  }

  // Add new quote to local quotes array
  quotes.push({ text: quoteText, category: category });
  saveQuotes();

  // Post the new quote to the server
  postQuoteToServer({ text: quoteText, category: category });

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

// Initialize everything
document.addEventListener("DOMContentLoaded", function() {
  // Load saved quotes
  loadQuotes();
  
  // Start periodic syncing
  startSync();

  // Initialize add quote functionality
  createAddQuoteForm();
});
