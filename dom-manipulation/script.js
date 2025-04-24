let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function showRandomQuote() {
  const category = localStorage.getItem('selectedCategory') || "all";
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").textContent = quote ? quote.text : "No quotes available.";
  sessionStorage.setItem("lastQuote", quote ? quote.text : "");
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");
  }
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
  const selected = localStorage.getItem("selectedCategory") || "all";
  select.value = selected;
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
    } catch (err) {
      alert('Invalid JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
populateCategories();
showRandomQuote();
