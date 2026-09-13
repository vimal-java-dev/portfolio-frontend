/* =========================================================
   VIMAL TECH - LATEST BLOG POSTS
   Blogger JSONP Integration
   ========================================================= */

const blogSources = [
  {
    container: "technical-journeys-posts",
    feed: "https://blog.vimaltech.dev/feeds/posts/default",
    limit: 3,
  },
  {
    container: "system-design-posts",
    feed: "https://sd.vimaltech.dev/feeds/posts/default",
    limit: 3,
  },
  {
    container: "dsa-posts",
    feed: "https://dsa.vimaltech.dev/feeds/posts/default",
    limit: 3,
  },
];

/* =========================================================
   LOAD BLOGGER FEED USING JSONP
   ========================================================= */

function loadBlogPosts(blog) {
  const callbackName = `bloggerCallback_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;
  const container = document.getElementById(blog.container);

  if (!container) {
    return;
  }

  /* -----------------------------------------
     Global JSONP callback
     ----------------------------------------- */

  window[callbackName] = function (data) {
    try {
      const entries = data?.feed?.entry || [];

      if (!entries.length) {
        container.innerHTML = `
          <div class="blog-error">
            No posts available.
          </div>
        `;
        return;
      }

      /* -----------------------------------------
         Clear loading message
         ----------------------------------------- */

      container.innerHTML = "";

      /* -----------------------------------------
         Render latest posts
         ----------------------------------------- */

      entries.slice(0, blog.limit).forEach((entry) => {
        const title = entry.title?.$t || "Untitled Post";
        const url = getPostUrl(entry);
        const published = entry.published?.$t || "";
        const formattedDate = formatBlogDate(published);
        const postElement = document.createElement("article");

        postElement.className = "blog-post";

        postElement.innerHTML = `
          <a
            href="${escapeHtmlAttribute(url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h4 class="blog-post-title">
              ${escapeHtml(title)}
            </h4>
            <span class="blog-post-date">
              ${escapeHtml(formattedDate)}
            </span>
          </a>
        `;

        container.appendChild(postElement);
      });
    } catch (error) {
      console.error("Error processing Blogger feed:", error);
      showBlogError(container);
    }

    /* -----------------------------------------
       Cleanup callback
       ----------------------------------------- */

    delete window[callbackName];

    if (scriptElement.parentNode) {
      scriptElement.parentNode.removeChild(scriptElement);
    }
  };

  /* -----------------------------------------
     Create JSONP script
     ----------------------------------------- */

  const scriptElement = document.createElement("script");

  scriptElement.src =
    `${blog.feed}` +
    `?alt=json-in-script` +
    `&max-results=${blog.limit}` +
    `&callback=${callbackName}`;

  scriptElement.async = true;

  /* -----------------------------------------
     Handle network/script errors
     ----------------------------------------- */

  scriptElement.onerror = function () {
    console.error(`Unable to load Blogger feed: ${blog.feed}`);
    showBlogError(container);
    delete window[callbackName];

    if (scriptElement.parentNode) {
      scriptElement.parentNode.removeChild(scriptElement);
    }
  };

  document.head.appendChild(scriptElement);
}

/* =========================================================
   GET BLOG POST URL
   ========================================================= */

function getPostUrl(entry) {
  const alternateLink = entry.link?.find((link) => link.rel === "alternate");
  return alternateLink?.href || "#";
}

/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatBlogDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

/* =========================================================
   HTML ATTRIBUTE ESCAPE
   ========================================================= */

function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* =========================================================
   ERROR MESSAGE
   ========================================================= */

function showBlogError(container) {
  container.innerHTML = `
    <div class="blog-error">
      Unable to load posts right now.
    </div>
  `;
}

/* =========================================================
   INITIALIZE BLOG POSTS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  blogSources.forEach((blog) => loadBlogPosts(blog));
});

/* =========================================================
   BLOG CATEGORY NAVIGATION
   Tablet + Mobile
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const categoryContainer = document.querySelector(".blog-categories");
  const navigationContainer = document.querySelector(
    ".blog-category-navigation",
  );
  const categoryButtons = document.querySelectorAll(".blog-category-button");
  const categories = document.querySelectorAll(".blog-category");

  if (!categoryContainer || !categoryButtons.length || !categories.length) {
    return;
  }

  /* -----------------------------------------------------
     CHECK SLIDER VIEW
     ----------------------------------------------------- */

  function isSliderView() {
    return window.matchMedia("(max-width: 1024px)").matches;
  }

  /* -----------------------------------------------------
     CHECK MOBILE VIEW
     ----------------------------------------------------- */

  function isMobileView() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  /* -----------------------------------------------------
     MOVE NAVIGATION TO ACTIVE BUTTON
     Mobile Only
     ----------------------------------------------------- */

  function moveNavigationToActiveButton(targetName) {
    if (!isMobileView() || !navigationContainer) {
      return;
    }

    const activeButton = Array.from(categoryButtons).find(
      (button) => button.dataset.blogTarget === targetName,
    );

    if (!activeButton) {
      return;
    }

    const buttonCenter = activeButton.offsetLeft + activeButton.offsetWidth / 2;

    const scrollPosition = buttonCenter - navigationContainer.clientWidth / 2;

    navigationContainer.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: "smooth",
    });
  }

  /* -----------------------------------------------------
     SET ACTIVE BUTTON
     ----------------------------------------------------- */

  function setActiveButton(targetName) {
    categoryButtons.forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.blogTarget === targetName,
      );
    });

    moveNavigationToActiveButton(targetName);
  }

  /* -----------------------------------------------------
     SLIDE TO CATEGORY
     ----------------------------------------------------- */

  function slideToCategory(targetName) {
    const targetCategory = document.querySelector(
      `.blog-category.${targetName}`,
    );

    if (!targetCategory) {
      return;
    }

    const scrollPosition =
      targetCategory.offsetLeft - categoryContainer.offsetLeft;

    categoryContainer.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });

    setActiveButton(targetName);
  }

  /* -----------------------------------------------------
     CATEGORY BUTTON CLICK
     ----------------------------------------------------- */

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!isSliderView()) {
        return;
      }

      const targetName = button.dataset.blogTarget;

      slideToCategory(targetName);
    });
  });

  /* -----------------------------------------------------
     UPDATE ACTIVE BUTTON
     WHEN USER SWIPES / SCROLLS
     ----------------------------------------------------- */

  let scrollTimeout;

  categoryContainer.addEventListener("scroll", () => {
    if (!isSliderView()) {
      return;
    }

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const containerCenter =
        categoryContainer.scrollLeft + categoryContainer.clientWidth / 2;

      let activeCategory = categories[0];
      let closestDistance = Infinity;

      categories.forEach((category) => {
        const categoryCenter = category.offsetLeft + category.offsetWidth / 2;

        const distance = Math.abs(containerCenter - categoryCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          activeCategory = category;
        }
      });

      if (activeCategory.classList.contains("technical-journeys")) {
        setActiveButton("technical-journeys");
      }

      if (activeCategory.classList.contains("system-design")) {
        setActiveButton("system-design");
      }

      if (activeCategory.classList.contains("dsa")) {
        setActiveButton("dsa");
      }
    }, 80);
  });
});
