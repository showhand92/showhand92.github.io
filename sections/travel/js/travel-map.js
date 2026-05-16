(function () {
  function getPointKind(point) {
    if (point.kind === "transit" || point.kind === "visit") return point.kind;
    return /[-+]/.test(point.time) ? "visit" : "transit";
  }

  function renderSidebar(points, options = {}) {
    const groupSelector = options.groupSelector || ".day-card[data-day]";
    const pointsByDay = points.reduce((groups, point) => {
      groups[point.day] = groups[point.day] || [];
      groups[point.day].push(point);
      return groups;
    }, {});

    document.querySelectorAll(groupSelector).forEach((card) => {
      const day = Number(card.dataset.day);
      const list = card.querySelector("ol");
      if (!list) return;

      list.textContent = "";
      (pointsByDay[day] || []).forEach((point) => {
        const kind = getPointKind(point);
        const item = document.createElement("li");
        item.className = `point-${kind}`;
        item.dataset.target = point.id;

        const id = document.createElement("span");
        id.className = "time";
        id.textContent = point.id;
        item.append(id, document.createTextNode(`${point.time} ${point.summary || point.name}`));

        if (point.featured) {
          const badge = document.createElement("span");
          badge.className = "featured-badge";
          badge.textContent = "知名";
          item.append(" ", badge);
        }

        if (point.photo) {
          const badge = document.createElement("span");
          badge.className = "photo-badge";
          badge.textContent = "照片";
          item.append(" ", badge);
        }

        list.append(item);
      });
    });
  }

  function renderRouteSummaries(routeSegments, options = {}) {
    const groupSelector = options.groupSelector || ".day-card[data-day]";
    const prefix = options.prefix || "交通";
    const tagsByDay = routeSegments.reduce((groups, segment) => {
      if (!segment.routeTag) return groups;
      groups[segment.day] = groups[segment.day] || [];
      const routeText = segment.label ? `${segment.label}: ${segment.routeTag}` : segment.routeTag;
      if (!groups[segment.day].includes(routeText)) {
        groups[segment.day].push(routeText);
      }
      return groups;
    }, {});

    document.querySelectorAll(groupSelector).forEach((card) => {
      const day = Number(card.dataset.day);
      card.querySelectorAll(".traffic-summary").forEach((summary) => summary.remove());
      const tags = tagsByDay[day] || [];
      if (!tags.length) return;

      const summary = document.createElement("div");
      summary.className = "traffic-summary";

      const heading = document.createElement("span");
      heading.className = "traffic-summary-heading";
      heading.textContent = `${prefix}:`;
      summary.append(heading);

      tags.forEach((tag) => {
        const line = document.createElement("span");
        line.className = "traffic-summary-line";
        line.textContent = tag;
        summary.append(line);
      });

      const title = card.querySelector("h2");
      if (title) {
        title.insertAdjacentElement("afterend", summary);
      } else {
        card.prepend(summary);
      }
    });
  }

  function renderLegend(items, options = {}) {
    const target = document.querySelector(options.selector || "#map-legend");
    if (!target) return;

    target.textContent = "";
    const legend = document.createElement("div");
    legend.className = "legend";

    const title = document.createElement("p");
    title.className = "legend-title";
    title.textContent = options.title || "图例";
    legend.append(title);

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "legend-row";

      const line = document.createElement("span");
      line.className = `legend-line ${item.type || item.mode || ""}`.trim();

      row.append(line, document.createTextNode(item.label));
      legend.append(row);
    });

    target.append(legend);
  }

  function assignLabelOffsets(points, map, options = {}) {
    const minDistance = options.minDistance || 48;
    const sameDayOnly = options.sameDayOnly === true;
    const manualOffsets = options.manualOffsets || {};
    const offsets = options.offsets || [
      [0, 0],
      [0, -30],
      [38, 0],
      [-38, 0],
      [0, 30],
      [34, -26],
      [-34, -26],
      [34, 26],
      [-34, 26],
      [58, 0],
      [-58, 0]
    ];
    const placed = [];

    points.forEach((point) => {
      const projected = map.latLngToLayerPoint([point.lat, point.lng]);
      const nearbyCount = placed.filter((candidate) => {
        if (sameDayOnly && candidate.day !== point.day) return false;
        return projected.distanceTo(candidate.projected) < minDistance;
      }).length;

      point.labelOffset = manualOffsets[point.id] || offsets[nearbyCount % offsets.length];
      placed.push({ day: point.day, projected });
    });
  }

  function createItineraryMap(config) {
    const {
      map,
      points,
      routeSegments,
      days,
      dayColors,
      routeStyles,
      baseLayers,
      layerName = (day) => `Day ${day}`,
      activeMaxZoom = 12,
      resetMaxZoom = 9,
      labelOffsetOptions = {},
      resizerId = "resizer",
      sidebarMinWidth = 320,
      sidebarMaxWidth = 760
    } = config;

    assignLabelOffsets(points, map, labelOffsetOptions);
    renderSidebar(points);
    renderRouteSummaries(routeSegments);

    const layerGroups = {};
    const markerById = {};
    const markersByDay = {};
    const routeLinesByDay = {};
    const boundsByDay = {};
    const allBounds = [];

    function makeIcon(point) {
      const [offsetX, offsetY] = point.labelOffset || [0, 0];
      const kind = getPointKind(point);
      return L.divIcon({
        className: "",
        html: `<span class="marker-label point-${kind}" style="--label-color:${dayColors[point.day]};">${point.id}</span>`,
        iconSize: [58, 34],
        iconAnchor: [29 - offsetX, 17 - offsetY]
      });
    }

    days.forEach((day) => {
      const group = L.layerGroup();

      routeSegments
        .filter((segment) => segment.day === day)
        .forEach((segment) => {
          const style = routeStyles[segment.mode];
          if (!style) return;
          const routeTooltip = segment.routeTag ? `${segment.label}｜${segment.routeTag}` : segment.label;
          const line = L.polyline(segment.coords, {
            color: dayColors[day],
            weight: style.weight,
            opacity: style.opacity,
            dashArray: style.dashArray
          })
            .bindTooltip(routeTooltip, { sticky: true })
            .addTo(group);

          routeLinesByDay[day] = routeLinesByDay[day] || [];
          routeLinesByDay[day].push({ line, style, segment });
          boundsByDay[day] = boundsByDay[day] || [];
          segment.coords.forEach((coord) => {
            allBounds.push(coord);
            boundsByDay[day].push(coord);
          });
        });

      points.filter((point) => point.day === day).forEach((point) => {
        const photoHtml = point.photo
          ? `<img class="popup-photo" src="${point.photo}" loading="lazy" alt="${point.name}"><a class="popup-link" href="${point.photoSource}" target="_blank" rel="noreferrer">查看照片来源</a>`
          : "";
        const popup = `
          <p class="popup-title">${point.id}｜${point.time}｜${point.name}</p>
          <p class="popup-body">${point.note}</p>
          ${photoHtml}
        `;
        const marker = L.marker([point.lat, point.lng], { icon: makeIcon(point) })
          .bindTooltip(`${point.id} ${point.time} ${point.name}`, { permanent: false, direction: "top" })
          .bindPopup(popup)
          .addTo(group);

        markerById[point.id] = marker;
        markersByDay[day] = markersByDay[day] || [];
        markersByDay[day].push(marker);
        boundsByDay[day] = boundsByDay[day] || [];
        boundsByDay[day].push([point.lat, point.lng]);
        allBounds.push([point.lat, point.lng]);
      });

      group.addTo(map);
      layerGroups[layerName(day)] = group;
    });

    if (baseLayers) {
      L.control.layers(baseLayers, layerGroups, { collapsed: true }).addTo(map);
    }

    if (allBounds.length) {
      map.fitBounds(allBounds, { padding: [36, 36] });
    }

    let activeDay = null;

    function fitDayBounds(day) {
      const selectedDay = day === null ? null : Number(day);
      const targetBounds = selectedDay === null ? allBounds : (boundsByDay[selectedDay] || []);
      if (!targetBounds.length) return;
      map.flyToBounds(targetBounds, {
        padding: [42, 42],
        maxZoom: selectedDay === null ? resetMaxZoom : activeMaxZoom,
        duration: 0.65
      });
    }

    function highlightDay(day, options = {}) {
      const selectedDay = day === null ? null : Number(day);
      activeDay = selectedDay;

      Object.entries(routeLinesByDay).forEach(([candidateDay, lines]) => {
        const isDefault = selectedDay === null;
        const isActive = Number(candidateDay) === selectedDay;
        lines.forEach(({ line, style }) => {
          line.setStyle({
            weight: isDefault ? style.weight : (isActive ? style.weight + 3 : Math.max(style.weight - 1, 2)),
            opacity: isDefault ? style.opacity : (isActive ? 0.96 : 0.5)
          });
          if (isActive) {
            line.bringToFront();
          }
        });
      });

      document.querySelectorAll(".day-card").forEach((card) => {
        card.classList.toggle("active", Number(card.dataset.day) === selectedDay);
      });

      Object.entries(markersByDay).forEach(([candidateDay, markers]) => {
        const isActive = Number(candidateDay) === selectedDay;
        markers.forEach((marker) => {
          marker.setOpacity(isActive ? 1 : 0);
          marker.setZIndexOffset(isActive ? 1000 : 0);
        });
      });

      if (options.fitMap !== false) {
        fitDayBounds(selectedDay);
      }
    }

    document.querySelectorAll(".day-card").forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest("[data-target]")) return;
        const day = Number(card.dataset.day);
        highlightDay(activeDay === day ? null : day);
      });
    });

    const root = document.documentElement;
    const resizer = document.getElementById(resizerId);
    if (resizer) {
      let isResizing = false;
      let pendingWidth = null;
      let resizeFrame = null;
      const layout = resizer.closest(".layout");

      function applyResizeFrame() {
        resizeFrame = null;
        if (pendingWidth === null) return;
        root.style.setProperty("--sidebar-width", `${pendingWidth}px`);
      }

      function queueSidebarWidth(width) {
        pendingWidth = width;
        if (resizeFrame === null) {
          resizeFrame = window.requestAnimationFrame(applyResizeFrame);
        }
      }

      function finishResize() {
        if (!isResizing) return;
        isResizing = false;
        document.body.classList.remove("resizing");
        if (resizeFrame !== null) {
          window.cancelAnimationFrame(resizeFrame);
          applyResizeFrame();
        }
        map.invalidateSize();
      }

      resizer.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        isResizing = true;
        document.body.classList.add("resizing");
        resizer.setPointerCapture(event.pointerId);
      });

      resizer.addEventListener("pointermove", (event) => {
        if (!isResizing) return;
        event.preventDefault();
        const layoutLeft = layout ? layout.getBoundingClientRect().left : 0;
        const width = Math.min(Math.max(event.clientX - layoutLeft, sidebarMinWidth), sidebarMaxWidth);
        queueSidebarWidth(width);
      });

      resizer.addEventListener("pointerup", finishResize);
      resizer.addEventListener("pointercancel", finishResize);
      resizer.addEventListener("lostpointercapture", finishResize);
    }

    document.querySelectorAll("[data-target]").forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.dataset.target;
        const marker = markerById[id];
        if (!marker) return;
        const point = points.find((candidate) => candidate.id === id);
        const dayLayer = layerGroups[layerName(point.day)];
        if (dayLayer && !map.hasLayer(dayLayer)) {
          dayLayer.addTo(map);
        }
        highlightDay(point.day, { fitMap: false });
        map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), activeMaxZoom), { duration: 0.65 });
        window.setTimeout(() => marker.openPopup(), 680);
      });
    });

    highlightDay(null, { fitMap: false });

    return {
      fitDayBounds,
      highlightDay,
      layerGroups,
      markerById
    };
  }

  window.TravelMap = {
    assignLabelOffsets,
    createItineraryMap,
    getPointKind,
    renderLegend,
    renderRouteSummaries,
    renderSidebar
  };
})();
