console.log("Current path:", window.location.pathname);
fetch("fighter_stats.json")
  .then(res => {
    console.log("Fetch status for fighter_stats.json:", res.status);
    return res.json();
  })
  .then(data => console.log("Loaded JSON length:", data.length))
  .catch(err => console.error("Fetch error:", err));

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();

  if (path.includes("index.html") || path === "/") {
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    const suggestions = document.getElementById("suggestions");

    let fighterNames = [];
    fetch("fighter_stats.json")
      .then(res => res.json())
      .then(data => fighterNames = data.map(f => `${f.first_name} ${f.last_name}`));

    searchBtn.addEventListener("click", () => {
      const name = searchInput.value.trim();
      if (name) {
        localStorage.setItem("selectedFighter", name);
        window.location.href = "FighterProfile.html";
      }
    });

    searchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") searchBtn.click();
    });

    searchInput.addEventListener("input", () => {
      const input = searchInput.value.toLowerCase();
      suggestions.innerHTML = "";
      if (!input) return;

      fighterNames
        .filter(n => n.toLowerCase().includes(input))
        .slice(0, 5)
        .forEach(name => {
          const li = document.createElement("li");
          li.textContent = name;
          li.addEventListener("click", () => {
            searchInput.value = name;
            suggestions.innerHTML = "";
          });
          suggestions.appendChild(li);
        });
    });

    document.addEventListener("click", e => {
      if (!e.target.closest(".search-box")) suggestions.innerHTML = "";
    });
  }

  if (path.includes("fighterprofile.html")) {
    const name = localStorage.getItem("selectedFighter")?.toLowerCase();

    fetch("fighter_stats.json")
      .then(res => res.json())
      .then(data => {
        const fighter = data.find(f =>
          `${f.first_name} ${f.last_name}`.toLowerCase() === name
        );

        if (!fighter) return alert("Fighter not found!");

        document.getElementById("fighter-name").textContent =
          `${fighter.first_name} ${fighter.last_name}`;
        document.getElementById("fighter-nickname").textContent =
          fighter.nickname ? `"${fighter.nickname}"` : "";
        document.getElementById("fighter-division").textContent =
          fighter.weight_class || "";
        document.getElementById("fighter-record").textContent =
          fighter.record || "";

        document.getElementById("wins-knockout").textContent =
          fighter.wins_by_KO;
        document.getElementById("wins-submission").textContent =
          fighter.wins_by_Submission;
        document.getElementById("wins-decision").textContent =
          fighter.wins_by_Decision;

        document.getElementById("loss-knockout").innerHTML =
          `${fighter.losses_by_KO}<br>LOSS BY<br>KNOCKOUT`;
        document.getElementById("loss-submission").innerHTML =
          `${fighter.losses_by_Submission}<br>LOSS BY<br>SUBMISSION`;
        document.getElementById("loss-decision").innerHTML =
          `${fighter.losses_by_Decision}<br>LOSS BY<br>DECISION`;

        document.getElementById("fighter-image").src = fighter.image_url;
      })
      .catch(error => console.error("Error loading data:", error));
  }
});
