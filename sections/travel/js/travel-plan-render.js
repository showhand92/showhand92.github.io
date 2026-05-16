(function () {
  function appendBadge(cell, className, text) {
    const badge = document.createElement("span");
    badge.className = className;
    badge.textContent = text;
    cell.append(" ", badge);
  }

  function renderTextCell(cell, point) {
    const id = document.createElement("strong");
    id.textContent = `${point.id} `;
    cell.append(id, document.createTextNode(`${point.name}${point.note ? `：${point.note}` : ""}`));
    if (point.featured) appendBadge(cell, "featured-badge", "知名");
    if (point.photo) appendBadge(cell, "photo-badge", "照片");
  }

  function renderSchedule(tripSlug) {
    const itinerary = window.TravelItineraries && window.TravelItineraries[tripSlug];
    if (!itinerary) return;

    const pointsByDay = itinerary.points.reduce((groups, point) => {
      groups[point.day] = groups[point.day] || [];
      groups[point.day].push(point);
      return groups;
    }, {});

    document.querySelectorAll("article.day-card[id^='day']").forEach((card) => {
      const day = Number(card.id.replace("day", ""));
      const tbody = card.querySelector(".schedule-table tbody");
      if (!tbody || !pointsByDay[day]) return;

      tbody.textContent = "";
      pointsByDay[day].forEach((point) => {
        const row = document.createElement("tr");
        const time = document.createElement("td");
        const detail = document.createElement("td");
        time.textContent = point.time;
        renderTextCell(detail, point);
        row.append(time, detail);
        tbody.append(row);
      });
    });
  }

  window.TravelPlanRenderer = {
    renderSchedule
  };
})();
