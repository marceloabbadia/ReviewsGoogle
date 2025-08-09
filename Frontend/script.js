async function fetchApi() {
  const placeQuery = document.getElementById("placeInput").value.trim();
  const linkContainer = document.getElementById("mapsLinkContainer");
  const placeInfo = document.getElementById("placeInfo");
  const tbody = document.querySelector("#reviewsTable tbody");
  const btnFetch = document.getElementById("btnFetch");
  const rawJsonLink = document.getElementById("rawJsonLink");

  linkContainer.innerHTML = "";
  placeInfo.textContent = "";
  tbody.innerHTML = "";
  rawJsonLink.style.display = "none";
  rawJsonLink.href = "#";
  showAlert("");

  if (!placeQuery) return alert("Digite o nome ou endereço do local");

  btnFetch.disabled = true;

  try {
    const resPlace = await fetch(
      `/placeid?query=${encodeURIComponent(placeQuery)}`
    );
    if (!resPlace.ok) {
      alert("Local não encontrado");
      return;
    }

    const placeData = await resPlace.json();
    const placeId = placeData.place_id;

    const mapsLink = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
    linkContainer.innerHTML = `<a href="${mapsLink}" target="_blank" class="btn btn-link">Ver local no Google Maps: ${placeData.name}</a>`;

    rawJsonLink.style.display = "inline-block";
    rawJsonLink.href = `/reviews/api?place_id=${placeId}`;

    const resReviews = await fetch(`/reviews/api?place_id=${placeId}`);
    if (!resReviews.ok) {
      alert("Erro ao buscar reviews");
      return;
    }

    const data = await resReviews.json();

    renderTable(data.reviews || data);

    placeInfo.innerHTML = `Nota geral: ${
      data.rating
        ? `${data.rating.toFixed(1)} <span style="color: gold;">★</span>`
        : "N/A"
    } / 5.0 <span style="color: gold;">★</span>`;

    showAlert(`Lugar: ${placeData.name}. Reviews obtidos: ${data.count || 0}`);
  } catch (err) {
    alert("Erro inesperado: " + err.message);
  } finally {
    btnFetch.disabled = false;
  }
}

function renderTable(rows) {
  const tbody = document.querySelector("#reviewsTable tbody");
  tbody.innerHTML = "";

  rows.sort((a, b) => (b.time || 0) - (a.time || 0));

  rows.forEach((r) => {
    let dateText = "";
    if (r.time) {
      if (r.time > 1000000000000) {
        dateText = new Date(r.time).toLocaleString();
      } else {
        dateText = new Date(r.time * 1000).toLocaleString();
      }
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.author_name || ""}</td><td>${
      r.rating || ""
    }</td><td>${r.text || ""}</td><td>${dateText}</td><td>${
      r.source || ""
    }</td><td>${r.sentiment_score || ""}</td>`;
    tbody.appendChild(tr);
  });
}

function showAlert(msg) {
  const el = document.getElementById("alerts");
  el.innerHTML = `<div class="alert alert-info">${msg}</div>`;
  setTimeout(() => (el.innerHTML = ""), 4000);
}

document.getElementById("btnFetch").addEventListener("click", fetchApi);
