(function () {
  const input = document.querySelector(".search-container input");

  if (!input || input.dataset.searchReady === "true") {
    return;
  }

  input.dataset.searchReady = "true";
  input.type = "search";
  input.autocomplete = "off";

  const container = input.closest(".search-container");
  const style = document.createElement("style");
  style.textContent = `
    .search-container {
      position: relative;
    }

    .site-search-results {
      display: none;
      position: absolute;
      top: 66px;
      left: 0;
      width: 280px;
      max-height: 340px;
      overflow-y: auto;
      list-style: none;
      background: white;
      border: 1px solid #eadfd8;
      border-radius: 8px;
      box-shadow: 0 8px 22px rgba(76, 55, 42, 0.16);
      z-index: 100;
    }

    .site-search-results.show {
      display: block;
    }

    .site-search-results a,
    .site-search-results p {
      display: block;
      padding: 12px 14px;
      color: #5f4637;
      text-decoration: none;
      font-size: 14px;
      line-height: 1.35;
    }

    .site-search-results a:hover {
      background: #f5eee6;
    }

    .site-search-results span {
      display: block;
      color: #9a7b64;
      font-size: 12px;
      margin-top: 3px;
    }

    @media (max-width: 560px) {
      .navbar {
        height: auto;
        padding: 16px 18px 14px;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .navbar .logo img {
        height: 68px;
        display: block;
      }

      .navbar .search-container {
        width: 100%;
        margin: 0;
        padding: 0;
      }

      .navbar .search-container input {
        width: 100%;
        max-width: 320px;
        display: block;
        margin: 0 auto;
      }

      .navbar nav {
        width: 100%;
      }

      .navbar .nav-links {
        width: 100%;
        padding: 2px 0 0;
        gap: 0;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
      }

      .navbar .nav-links a {
        font-size: 16px;
        white-space: nowrap;
      }

      .navbar .dropdown-menu {
        left: 50%;
        transform: translateX(-50%);
        min-width: 130px;
      }

      .navbar .site-search-results {
        top: 42px;
        left: 50%;
        width: min(320px, 100%);
        transform: translateX(-50%);
      }
    }
  `;
  document.head.appendChild(style);

  const results = document.createElement("ul");
  results.className = "site-search-results";
  container.appendChild(results);

  const searchableSelector =
    ".cake-card, .category-card, .recipe-card, #recipeList a";
  const fallbackSelector = ".nav-links a";
  const links = Array.from(document.querySelectorAll(searchableSelector));
  const searchableLinks = links.length
    ? links
    : Array.from(document.querySelectorAll(fallbackSelector));

  const filterTargets = Array.from(
    document.querySelectorAll(".cake-card, .category-card, .recipe-card, #recipeList li"),
  );

  const searchItems = searchableLinks.map((link) => {
    const title =
      link.querySelector("h2, h3")?.textContent ||
      link.childNodes[0]?.textContent ||
      link.textContent;
    const subtitle = link.querySelector("p, span")?.textContent || "";

    return {
      title: title.trim(),
      subtitle: subtitle.trim(),
      href: link.getAttribute("href"),
      keywords: link.textContent.trim().toLowerCase(),
    };
  });

  function renderResults(query) {
    results.innerHTML = "";

    if (!query) {
      results.classList.remove("show");
      return;
    }

    const matches = searchItems
      .filter((item) => item.keywords.includes(query))
      .slice(0, 8);

    if (!matches.length) {
      results.innerHTML = "<li><p>没有找到相关配方</p></li>";
      results.classList.add("show");
      return;
    }

    matches.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${item.href}">${item.title}<span>${item.subtitle}</span></a>`;
      results.appendChild(li);
    });

    results.classList.add("show");
  }

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();

    filterTargets.forEach((target) => {
      const isMatch = target.textContent.toLowerCase().includes(query);
      target.style.display = query && !isMatch ? "none" : "";
    });

    renderResults(query);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    const firstResult = results.querySelector("a");
    if (firstResult) {
      window.location.href = firstResult.href;
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-container")) {
      results.classList.remove("show");
    }
  });
})();
