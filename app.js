document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();

  // === STARTSEITE ===
  if (path.includes("index.html") || path === "/" || path.endsWith("roaster.html")) {
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    const suggestions = document.getElementById("suggestions");

    let fighterNames = [];

    // Kämpfernamen für Autovervollständigung laden
    fetch("fighter_stats.json")
      .then(res => res.json())
      .then(data => {
        fighterNames = data.map(f => `${f.first_name} ${f.last_name}`);
      });

    // Suche ausführen
    if (searchBtn && searchInput) {
      searchBtn.addEventListener("click", () => {
        const name = searchInput.value.trim();
        if (name) {
          const encoded = encodeURIComponent(name);
          window.location.href = `FighterProfile.html?name=${encoded}`;
        }
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") searchBtn.click();
      });

      // Autovervollständigung
      searchInput.addEventListener("input", () => {
        const input = searchInput.value.toLowerCase();
        suggestions.innerHTML = "";

        if (input.length === 0) return;

        const matches = fighterNames
          .filter(name => name.toLowerCase().includes(input))
          .slice(0, 5);

        matches.forEach(name => {
          const li = document.createElement("li");
          li.textContent = name;
          li.addEventListener("click", () => {
            searchInput.value = name;
            suggestions.innerHTML = "";
          });
          suggestions.appendChild(li);
        });
      });

      // Klick außerhalb → Vorschläge ausblenden
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-box")) {
          suggestions.innerHTML = "";
        }
      });
    }
  }

  // === PROFILSEITE ===
  if (path.includes("fighterprofile.html")) {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get("name")?.toLowerCase();

    fetch("fighter_stats.json")
      .then(res => res.json())
      .then(data => {
        const fighter = data.find(f => {
          const fullName = `${f.first_name} ${f.last_name}`.toLowerCase();
          return fullName === nameParam;
        });

        if (!fighter) {
          alert("Fighter not found!");
          return;
        }

        // DOM befüllen
        document.getElementById("fighter-name").textContent = `${fighter.first_name} ${fighter.last_name}`;
        document.getElementById("fighter-nickname").textContent = fighter.nickname ? `"${fighter.nickname}"` : "";
        document.getElementById("fighter-division").textContent = fighter.weight_class || "";
        document.getElementById("fighter-record").textContent = fighter.record || "";

        document.getElementById("wins-knockout").textContent = fighter.wins_by_KO;
        document.getElementById("wins-submission").textContent = fighter.wins_by_Submission;
        document.getElementById("wins-decision").textContent = fighter.wins_by_Decision;

        document.getElementById("loss-knockout").innerHTML = `${fighter.losses_by_KO}<br>LOSS BY<br>KNOCKOUT`;
        document.getElementById("loss-submission").innerHTML = `${fighter.losses_by_Submission}<br>LOSS BY<br>SUBMISSION`;
        document.getElementById("loss-decision").innerHTML = `${fighter.losses_by_Decision}<br>LOSS BY<br>DECISION`;

        document.getElementById("fighter-image").src = fighter.image_url;
      })
      .catch(error => {
        console.error("Fehler beim Laden der Daten:", error);
      });
  }
});
