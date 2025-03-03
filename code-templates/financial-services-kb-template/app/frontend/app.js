// Financial Services Knowledge Base Frontend

document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const queryInput = document.getElementById("query-input");
  const searchButton = document.getElementById("search-button");
  const userSelect = document.getElementById("user-select");
  const resultsContainer = document.getElementById("results-container");
  const statusDisplay = document.getElementById("status-display");

  // API endpoint
  const API_URL = "http://localhost:8000";

  // Event listeners
  searchButton.addEventListener("click", performSearch);
  queryInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // Check API health
  checkApiHealth();

  // Functions
  async function performSearch() {
    const query = queryInput.value.trim();
    const userId = userSelect.value;

    if (!query) {
      showMessage("Please enter a question", "warning");
      return;
    }

    // Update status
    statusDisplay.innerHTML =
      '<span class="badge bg-warning">Searching...</span>';

    try {
      const response = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: query,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      displayResults(data);

      // Update status
      statusDisplay.innerHTML =
        '<span class="badge bg-success">Results Found</span>';
    } catch (error) {
      console.error("Error:", error);
      showMessage(`Error: ${error.message}`, "danger");

      // Update status
      statusDisplay.innerHTML = '<span class="badge bg-danger">Error</span>';
    }
  }

  function displayResults(data) {
    if (!data.documents || data.documents.length === 0) {
      showMessage("No results found", "info");
      return;
    }

    let html = `<h3>Results for: "${data.query}"</h3>`;

    data.documents.forEach((doc) => {
      const score = doc.score ? doc.score : 0.0;
      const scoreClass =
        score > 0.8
          ? "bg-success"
          : score > 0.5
          ? "bg-warning"
          : "bg-secondary";

      html += `
                <div class="card result-card">
                    <div class="card-body">
                        <span class="badge ${scoreClass} score-badge">${(
        score * 100
      ).toFixed(0)}%</span>
                        <h5 class="card-title">${doc.title}</h5>
                        ${
                          doc.summary
                            ? `<p class="summary">${doc.summary}</p>`
                            : ""
                        }
                        <p class="card-text">${doc.content.substring(0, 200)}${
        doc.content.length > 200 ? "..." : ""
      }</p>
                        <div class="metadata">
                            ${Object.entries(doc.metadata)
                              .map(
                                ([key, value]) =>
                                  `<span class="badge bg-light text-dark metadata-badge">${key}: ${value}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            `;
    });

    resultsContainer.innerHTML = html;
  }

  function showMessage(message, type = "info") {
    resultsContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  }

  async function checkApiHealth() {
    try {
      const response = await fetch(`${API_URL}/health`);

      if (response.ok) {
        statusDisplay.innerHTML =
          '<span class="badge bg-success">API Connected</span>';
      } else {
        statusDisplay.innerHTML =
          '<span class="badge bg-danger">API Error</span>';
      }
    } catch (error) {
      console.error("Health check error:", error);
      statusDisplay.innerHTML =
        '<span class="badge bg-danger">API Unavailable</span>';
    }
  }
});
