(function () {
  function normalizePhotoUrl(url) {
    return (url || "").split("?")[0];
  }

  function normalizeLink(url) {
    if (!url) return "";
    try {
      return decodeURI(new URL(url, window.location.href).href).split("?")[0].split("#")[0];
    } catch (error) {
      return decodeURI(url).split("?")[0].split("#")[0];
    }
  }

  function photoDisplayUrl(url) {
    if (!url) return "";
    if (url.includes("width=")) return url.replace(/width=\d+/, "width=900");
    return `${url}${url.includes("?") ? "&" : "?"}width=900`;
  }

  function collectExistingPhotos() {
    return new Set(
      Array.from(document.querySelectorAll("img[src]"), (image) => normalizePhotoUrl(image.src))
    );
  }

  function pointRank(point) {
    let rank = 0;
    if (point.kind === "visit") rank += 4;
    if (point.featured) rank += 2;
    if (point.photo && point.photoSource) rank += 1;
    return rank;
  }

  function buildPointLookup(points) {
    const lookup = new Map();

    points
      .filter((point) => point.photo || point.photoSource)
      .slice()
      .sort((left, right) => pointRank(right) - pointRank(left))
      .forEach((point) => {
        [normalizeLink(point.photoSource), normalizeLink(point.photo)].forEach((key) => {
          if (key && !lookup.has(key)) lookup.set(key, point);
        });
        if (point.name && !lookup.has(point.name)) lookup.set(point.name, point);
      });

    return lookup;
  }

  function makeTag(text, className) {
    const tag = document.createElement("span");
    tag.className = className ? `tag ${className}` : "tag";
    tag.textContent = text;
    return tag;
  }

  function makePhotoCard(point) {
    const card = document.createElement("article");
    card.className = "spot-card";

    const image = document.createElement("img");
    image.src = photoDisplayUrl(point.photo);
    image.alt = point.name;
    image.loading = "lazy";

    const body = document.createElement("div");
    body.className = "spot-body";

    const title = document.createElement("h3");
    title.textContent = point.name;

    const tags = document.createElement("div");
    tags.className = "tag-row";
    tags.append(makeTag(`D${point.day}`, point.featured ? "must" : "recommend"));
    if (point.featured) tags.append(makeTag("知名", "recommend"));
    tags.append(makeTag(point.kind === "transit" ? "交通点" : "行程点"));

    const list = document.createElement("ul");
    const item = document.createElement("li");
    item.textContent = point.note || `${point.time} ${point.name}`;
    list.append(item);

    const source = document.createElement("a");
    source.className = "source";
    source.href = point.photoSource;
    source.textContent = "图片来源与许可";

    body.append(title, tags, list, source);
    card.append(image, body);
    return card;
  }

  function syncExistingCards(points) {
    const lookup = buildPointLookup(points);

    document.querySelectorAll(".spot-card").forEach((card) => {
      const image = card.querySelector("img[src]");
      const source = card.querySelector(".source[href]");
      const title = card.querySelector("h3");
      const matchKeys = [
        source && normalizeLink(source.href),
        image && normalizeLink(image.src),
        title && title.textContent.trim()
      ].filter(Boolean);
      const point = matchKeys.map((key) => lookup.get(key)).find(Boolean);
      if (!point || !point.note) return;

      card.dataset.mapPoint = point.id;
      if (title) title.textContent = point.name;
      if (image) {
        image.src = photoDisplayUrl(point.photo);
        image.alt = point.name;
        image.loading = image.loading || "lazy";
      }
      if (source && point.photoSource) source.href = point.photoSource;

      let list = card.querySelector("ul");
      if (!list) {
        list = document.createElement("ul");
        card.querySelector(".spot-body")?.append(list);
      }
      list.replaceChildren();
      const item = document.createElement("li");
      item.textContent = point.note;
      list.append(item);
    });
  }

  const GROUPS = {
    europe: [
      { id: "swiss", label: "瑞士", match: (point) => point.day <= 3 },
      { id: "italy", label: "意大利", match: (point) => point.day >= 4 && point.day <= 8 },
      { id: "france", label: "法国", match: (point) => point.day >= 9 }
    ],
    kyushu: [
      { id: "kumamoto", label: "熊本", match: (point) => point.day === 1 || point.name.includes("熊本") || point.name.includes("水前寺") },
      { id: "kagoshima", label: "鹿儿岛 / 樱岛", match: (point) => point.day === 2 || point.day === 3 },
      { id: "fukuoka", label: "福冈与备选", match: (point) => point.day === 4 || point.name.includes("福冈") || point.name.includes("博多") }
    ]
  };

  function groupMissingPhotos(tripSlug, points) {
    const groupConfig = GROUPS[tripSlug] || [{ id: "map-photo-points", label: "行程地图照片点", match: () => true }];
    const groups = groupConfig.map((group) => ({ ...group, points: [] }));

    points.forEach((point) => {
      const group = groups.find((candidate) => candidate.match(point)) || groups[groups.length - 1];
      group.points.push(point);
    });

    return groups.filter((group) => group.points.length);
  }

  function addJumpLinks(groups) {
    const panel = document.querySelector(".jump-panel");
    if (!panel) return;

    const divider = panel.querySelector(".jump-divider");
    groups.forEach((group) => {
      if (panel.querySelector(`[href="#${group.id}"]`)) return;

      const link = document.createElement("a");
      link.href = `#${group.id}`;
      link.textContent = group.label;

      if (divider) {
        panel.insertBefore(link, divider);
      } else {
        panel.append(link);
      }
    });
  }

  function findExistingGroupGrid(groupId) {
    const heading = document.getElementById(groupId);
    let sibling = heading && heading.nextElementSibling;
    while (sibling) {
      if (sibling.classList && sibling.classList.contains("grid")) return sibling;
      if (sibling.tagName === "H2") return null;
      sibling = sibling.nextElementSibling;
    }
    return null;
  }

  function renderMapPhotoSuperset(tripSlug) {
    const itinerary = window.TravelItineraries && window.TravelItineraries[tripSlug];
    const main = document.querySelector("main");
    if (!itinerary || !main) return;

    syncExistingCards(itinerary.points);

    const existing = collectExistingPhotos();
    const missing = itinerary.points.filter((point) => {
      if (!point.photo || !point.photoSource) return false;
      return !existing.has(normalizePhotoUrl(photoDisplayUrl(point.photo)));
    });
    if (!missing.length) return;

    const groups = groupMissingPhotos(tripSlug, missing);
    const createdGroups = [];
    groups.forEach((group) => {
      const existingGrid = findExistingGroupGrid(group.id);
      if (existingGrid) {
        group.points.forEach((point) => existingGrid.append(makePhotoCard(point)));
        return;
      }

      const heading = document.createElement("h2");
      heading.id = group.id;
      heading.textContent = group.label;

      const grid = document.createElement("section");
      grid.className = "grid";
      group.points.forEach((point) => grid.append(makePhotoCard(point)));

      main.append(heading, grid);
      createdGroups.push(group);
    });
    addJumpLinks(createdGroups);
  }

  window.TravelPhotosRenderer = {
    renderMapPhotoSuperset
  };
})();
