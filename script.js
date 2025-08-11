// Live date
function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  document.getElementById('live-date').textContent = now.toLocaleDateString('en-US', options);
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Google Sheet CSV URL
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSJVgMOzk0A9w_50a4Jcos13lw0andMszzXQNsz4NiEg688vKfesvvlI23MFKWeuQ9hUKUsoEv51r78/pub?output=csv";

async function loadPlayers() {
  try {
    const res = await fetch(sheetUrl);
    const csvText = await res.text();
    const rows = csvText.trim().split("\n").map(r => r.split(","));
    const tbody = document.querySelector("#playersTable tbody");
    tbody.innerHTML = "";

    rows.slice(1).forEach(row => {
      const [fideId, title, name, birthYear, gender, district] = row;

      // If FIDE ID already a full URL, use it; else build it
      let link = fideId.includes("http") ? fideId : `https://ratings.fide.com/profile/${fideId}`;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><a href="${link}" target="_blank">${fideId}</a></td>
        <td>${title}</td>
        <td>${name}</td>
        <td>${birthYear}</td>
        <td>${gender}</td>
        <td>${district}</td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById("loading").style.display = "none";
  } catch (error) {
    console.error("Error loading players:", error);
    document.getElementById("loading").textContent = "Error loading data.";
  }
}

loadPlayers();
