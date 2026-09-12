/* ==========================================
   LIVE WORKS
   DESKTOP + TABLET + MOBILE
========================================== */

/* ==========================================
   ELEMENTS
========================================== */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectsGrid = document.querySelector(".projects-grid");

const prevProjectBtn = document.querySelector(".prev-project");
const nextProjectBtn = document.querySelector(".next-project");

/* ==========================================
   RESPONSIVE STATE

   TABLET NAVIGATION:
   -1 = React only
    0 = React + Vue
    1 = Vue + Angular
    2 = Angular only

   MOBILE:
    0 = React
    1 = Vue
    2 = Angular
========================================== */

let tabletPosition = 0;
let mobilePosition = 0;

/* Direct tablet button selection */
let tabletSelectedCategory = null;

/* ==========================================
   SCREEN CHECKS
========================================== */

function isMobile() {
  return window.innerWidth <= 768;
}

function isTablet() {
  return window.innerWidth >= 769 && window.innerWidth <= 1024;
}

function isResponsiveProjects() {
  return isMobile() || isTablet();
}

/* ==========================================
   GET CARD BY CATEGORY
========================================== */

function getCard(category) {
  return document.querySelector(`.project-card[data-category="${category}"]`);
}

/* ==========================================
   UPDATE ACTIVE CATEGORY BUTTONS

   Only visible card categories become orange.
========================================== */

function updateActiveButtons(categories) {
  filterButtons.forEach((button) => {
    button.classList.remove("active");

    const filterValue = button.getAttribute("data-filter");

    if (categories.includes(filterValue)) {
      button.classList.add("active");
    }
  });
}

/* ==========================================
   RESET GRID
========================================== */

function resetGridLayout() {
  if (!projectsGrid) return;

  projectsGrid.classList.remove("tablet-single");
  projectsGrid.classList.remove("mobile-single");
  projectsGrid.classList.remove("single-card");
}

/* ==========================================
   HIDE ALL CARDS FOR RESPONSIVE NAVIGATION
========================================== */

function hideAllResponsiveCards() {
  projectCards.forEach((card) => {
    card.style.display = "none";

    card.classList.remove("hide");
    card.classList.add("show");
  });
}

/* ==========================================
   SHOW SELECTED CARDS
========================================== */

function showCards(cards) {
  cards.forEach((card) => {
    if (card) {
      card.style.display = "block";
    }
  });
}

/* ==========================================
   TABLET PROJECT UPDATE

   NORMAL NAVIGATION:

   -1 = React only
    0 = React + Vue
    1 = Vue + Angular
    2 = Angular only

   DIRECT BUTTON:

   React   = React only centered
   Vue     = Vue only centered
   Angular = Angular only centered
========================================== */

function updateTabletProjects() {
  if (!isTablet()) return;

  hideAllResponsiveCards();
  resetGridLayout();

  let visibleCards = [];
  let visibleCategories = [];

  /* Direct category button selection */
  if (tabletSelectedCategory) {
    visibleCards = [getCard(tabletSelectedCategory)];
    visibleCategories = [tabletSelectedCategory];
  } else if (tabletPosition === -1) {
    /* Normal Prev / Next navigation */
    /* React only */
    visibleCards = [getCard("react")];
    visibleCategories = ["react"];
  } else if (tabletPosition === 0) {
    /* React + Vue */
    visibleCards = [getCard("react"), getCard("vue")];
    visibleCategories = ["react", "vue"];
  } else if (tabletPosition === 1) {
    /* Vue + Angular */
    visibleCards = [getCard("vue"), getCard("angular")];
    visibleCategories = ["vue", "angular"];
  } else if (tabletPosition === 2) {
    /* Angular only */
    visibleCards = [getCard("angular")];
    visibleCategories = ["angular"];
  }

  /* Show cards */
  showCards(visibleCards);

  /* Center single card */
  if (visibleCards.length === 1 && projectsGrid) {
    projectsGrid.classList.add("tablet-single");
  }

  /* Update active buttons */
  updateActiveButtons(visibleCategories);
}

/* ==========================================
   MOBILE PROJECT UPDATE

   React
   ↓ Next

   Vue
   ↓ Next

   Angular
========================================== */

function updateMobileProjects() {
  if (!isMobile()) return;

  hideAllResponsiveCards();
  resetGridLayout();

  let visibleCard = null;
  let visibleCategory = null;

  /* React */
  if (mobilePosition === 0) {
    visibleCard = getCard("react");
    visibleCategory = "react";
  } else if (mobilePosition === 1) {
    /* Vue */
    visibleCard = getCard("vue");
    visibleCategory = "vue";
  } else if (mobilePosition === 2) {
    /* Angular */
    visibleCard = getCard("angular");
    visibleCategory = "angular";
  }

  /* Show card */
  if (visibleCard) {
    visibleCard.style.display = "block";
  }

  /* Mobile single card */
  if (projectsGrid) {
    projectsGrid.classList.add("mobile-single");
  }

  /* Update active button */
  if (visibleCategory) {
    updateActiveButtons([visibleCategory]);
  }
}

/* ==========================================
   FILTER BUTTONS

   DESKTOP:
   ORIGINAL BEHAVIOUR

   TABLET:
   SELECT SINGLE CARD

   MOBILE:
   SELECT SINGLE CARD
========================================== */

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filterValue = button.getAttribute("data-filter");

    /* ======================================
       MOBILE
    ====================================== */

    if (isMobile()) {
      if (filterValue === "react") {
        mobilePosition = 0;
      } else if (filterValue === "vue") {
        mobilePosition = 1;
      } else if (filterValue === "angular") {
        mobilePosition = 2;
      }

      updateMobileProjects();
      return;
    }

    /* ======================================
       TABLET
    ====================================== */

    if (isTablet()) {
      if (
        filterValue === "react" ||
        filterValue === "vue" ||
        filterValue === "angular"
      ) {
        tabletSelectedCategory = filterValue;
      }

      updateTabletProjects();
      return;
    }

    /* ======================================
       DESKTOP FILTERING

       ORIGINAL BEHAVIOUR
    ====================================== */

    /* Remove active */
    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    /* Activate clicked button */
    button.classList.add("active");

    let visibleCardsCount = 0;

    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");

      /* Show */
      if (filterValue === "all" || category === filterValue) {
        card.classList.remove("hide");
        card.classList.add("show");

        card.style.display = "";

        visibleCardsCount++;
      } else {
        /* Hide */
        card.classList.remove("show");
        card.classList.add("hide");
      }
    });

    /* Center single desktop card */
    if (visibleCardsCount === 1 && projectsGrid) {
      projectsGrid.classList.add("single-card");
    } else if (projectsGrid) {
      projectsGrid.classList.remove("single-card");
    }
  });
});

/* ==========================================
   PREVIOUS BUTTON
========================================== */

if (prevProjectBtn) {
  prevProjectBtn.addEventListener("click", () => {
    /* MOBILE */
    if (isMobile()) {
      if (mobilePosition > 0) {
        mobilePosition--;
      }

      updateMobileProjects();
      return;
    }

    /* TABLET */
    if (isTablet()) {
      /* Direct button selection */
      if (tabletSelectedCategory) {
        if (tabletSelectedCategory === "react") {
          tabletPosition = -1;
        } else if (tabletSelectedCategory === "vue") {
          tabletPosition = 0;
        } else if (tabletSelectedCategory === "angular") {
          tabletPosition = 1;
        }

        /* Return to navigation mode */
        tabletSelectedCategory = null;
      } else {
        /* Normal navigation */
        if (tabletPosition > -1) {
          tabletPosition--;
        }
      }

      updateTabletProjects();
    }
  });
}

/* ==========================================
   NEXT BUTTON
========================================== */

if (nextProjectBtn) {
  nextProjectBtn.addEventListener("click", () => {
    /* MOBILE */
    if (isMobile()) {
      if (mobilePosition < 2) {
        mobilePosition++;
      }

      updateMobileProjects();
      return;
    }

    /* TABLET */
    if (isTablet()) {
      /* Direct button selection */
      if (tabletSelectedCategory) {
        if (tabletSelectedCategory === "react") {
          tabletPosition = 0;
        } else if (tabletSelectedCategory === "vue") {
          tabletPosition = 1;
        } else if (tabletSelectedCategory === "angular") {
          tabletPosition = 2;
        }

        /* Return to navigation mode */
        tabletSelectedCategory = null;
      } else {
        /* Normal navigation */
        if (tabletPosition < 2) {
          tabletPosition++;
        }
      }

      updateTabletProjects();
    }
  });
}

/* ==========================================
   RESTORE DESKTOP

   ORIGINAL DESKTOP BEHAVIOUR
========================================== */

function restoreDesktopProjects() {
  projectCards.forEach((card) => {
    card.style.display = "";

    card.classList.remove("hide");
    card.classList.add("show");
  });

  resetGridLayout();

  /* Restore All as active */
  filterButtons.forEach((button) => {
    button.classList.remove("active");

    if (button.getAttribute("data-filter") === "all") {
      button.classList.add("active");
    }
  });
}

/* ==========================================
   SCREEN RESIZE
========================================== */

window.addEventListener("resize", () => {
  if (isMobile()) {
    tabletSelectedCategory = null;
    updateMobileProjects();
  } else if (isTablet()) {
    updateTabletProjects();
  } else {
    tabletSelectedCategory = null;
    restoreDesktopProjects();
  }
});

/* ==========================================
   INITIAL LOAD
========================================== */

window.addEventListener("load", () => {
  /* Mobile starts React */
  if (isMobile()) {
    mobilePosition = 0;
    updateMobileProjects();
  } else if (isTablet()) {
    /* Tablet starts React + Vue */
    tabletPosition = 0;
    tabletSelectedCategory = null;
    updateTabletProjects();
  }
});
