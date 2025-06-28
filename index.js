// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });

      // Close mobile menu if open
      mobileMenu.classList.add("hidden");
    }
  });
});

// Define filterButtons and portfolioItems
const filterButtons = document.querySelectorAll(".portfolio-filter");
const portfolioItems = document.querySelectorAll(".portfolio-item");

let currentFilter = "all";
let currentPage = 1;
const itemsPerPage = 6;

function getFilteredItems() {
  return Array.from(portfolioItems).filter((item) => {
    return (
      currentFilter === "all" ||
      item.getAttribute("data-category") === currentFilter
    );
  });
}

function renderPortfolio() {
  const filteredItems = getFilteredItems();
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Hide all items
  portfolioItems.forEach((item) => {
    item.style.display = "none";
  });

  // Show items for current page
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  filteredItems.slice(start, end).forEach((item) => {
    item.style.display = "block";
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  // Common classes for filter button look
  const baseBtnClass =
    "px-4 py-2 rounded-full text-sm font-medium transition portfolio-filter focus:outline-none focus:ring-2 focus:ring-blue-500";
  const navBtnClass = "bg-blue-900 text-white hover:bg-blue-900";
  const activeBtnClass = "bg-blue-900 text-white";
  const inactiveBtnClass =
    "border border-blue-900 text-blue-900 bg-transparent hover:bg-blue-100";

  // Prev button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.className = `${baseBtnClass} ${navBtnClass} mr-1 ${
    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
  }`;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPortfolio();
    }
  };
  pagination.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.className = `${baseBtnClass} mx-1 ${
      i === currentPage ? "active-page " + activeBtnClass : inactiveBtnClass
    }`;
    pageBtn.onclick = () => {
      currentPage = i;
      renderPortfolio();
    };
    pagination.appendChild(pageBtn);
  }

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.className = `${baseBtnClass} ${navBtnClass} ml-1 ${
    currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
  }`;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPortfolio();
    }
  };
  pagination.appendChild(nextBtn);
}

// Initialize on load
window.addEventListener("load", () => {
  // Set 'All Work' as the default active filter
  filterButtons.forEach((btn) => {
    if (btn.getAttribute("data-filter") === "all") {
      btn.style.backgroundColor = "#1e40af";
      btn.classList.add("active-filter");
    } else {
      btn.style.backgroundColor = "";
      btn.classList.remove("active-filter");
    }
  });
  renderPortfolio();
});

// Filter button logic
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active background from all buttons
    filterButtons.forEach((btn) => {
      btn.style.backgroundColor = "";
      btn.classList.remove("active-filter");
    });
    // Set background color for the active button
    button.style.backgroundColor = "#1e40af"; // blue-900
    button.classList.add("active-filter");
    currentFilter = button.getAttribute("data-filter");
    currentPage = 1; // Reset to first page on filter change
    renderPortfolio();
  });
});

// Back to top button
const backToTopButton = document.getElementById("back-to-top");

if (backToTopButton) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("opacity-100");
      backToTopButton.classList.remove("opacity-0");
    } else {
      backToTopButton.classList.add("opacity-0");
      backToTopButton.classList.remove("opacity-100");
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Add click event to portfolio items and view-artwork buttons to open itemviewer.html with details
function handlePortfolioItemClick(item, button = null) {
  const img = item.querySelector("img");
  let title,
    description,
    mediumanddate,
    youtube,
    link1,
    link2,
    linktitle1,
    linktitle2;
  let images = [];
  if (button) {
    title = button.getAttribute("data-title");
    description = button.getAttribute("data-description");
    mediumanddate = button.getAttribute("data-mediumanddate");
    youtube = button.getAttribute("data-youtube");
    link1 = button.getAttribute("data-link1");
    link2 = button.getAttribute("data-link2");
    linktitle1 = button.getAttribute("data-linktitle1");
    linktitle2 = button.getAttribute("data-linktitle2");
    // Collect all data-imageN attributes from the button (fix: use getAttributeNames)
    const attrs = Array.from(button.attributes)
      .filter((attr) => attr.name.startsWith("data-image"))
      .sort((a, b) => {
        // Sort by number after data-image
        const aNum = parseInt(a.name.replace("data-image", "")) || 0;
        const bNum = parseInt(b.name.replace("data-image", "")) || 0;
        return aNum - bNum;
      });
    images = attrs.map((attr) => attr.value);
    // fallback to data-image if present
    if (images.length === 0 && button.hasAttribute("data-image")) {
      images.push(button.getAttribute("data-image"));
    }
  } else {
    title = item.querySelector("h3")?.textContent;
    description = item
      .querySelector(".view-artwork")
      ?.getAttribute("data-description");
    mediumanddate = item
      .querySelector(".view-artwork")
      ?.getAttribute("data-mediumanddate");
    youtube = item.querySelector(".view-artwork")?.getAttribute("data-youtube");
    const viewBtn = item.querySelector(".view-artwork");
    if (viewBtn) {
      link1 = viewBtn.getAttribute("data-link1");
      link2 = viewBtn.getAttribute("data-link2");
      linktitle1 = viewBtn.getAttribute("data-linktitle1");
      linktitle2 = viewBtn.getAttribute("data-linktitle2");
      const attrs = Array.from(viewBtn.attributes)
        .filter((attr) => attr.name.startsWith("data-image"))
        .sort((a, b) => {
          const aNum = parseInt(a.name.replace("data-image", "")) || 0;
          const bNum = parseInt(b.name.replace("data-image", "")) || 0;
          return aNum - bNum;
        });
      images = attrs.map((attr) => attr.value);
      if (images.length === 0 && viewBtn.hasAttribute("data-image")) {
        images.push(viewBtn.getAttribute("data-image"));
      }
    }
    if (images.length === 0 && item.hasAttribute("data-image")) {
      images.push(item.getAttribute("data-image"));
    }
    if (images.length === 0 && img?.src) {
      images.push(img.src);
    }
  }
  const image =
    images[0] || (button ? button.getAttribute("data-image") : img?.src);
  if ((images.length > 0 || youtube) && title && description) {
    // Encode parameters for URL
    const params = new URLSearchParams({
      title,
      description,
      mediumanddate: mediumanddate || "",
    });
    if (youtube) params.set("youtube", youtube);
    if (images.length > 0)
      params.set("images", images.map(encodeURIComponent).join(","));
    if (link1) params.set("link1", encodeURIComponent(link1));
    if (link2) params.set("link2", encodeURIComponent(link2));
    if (linktitle1) params.set("linktitle1", encodeURIComponent(linktitle1));
    if (linktitle2) params.set("linktitle2", encodeURIComponent(linktitle2));
    window.location.href = `itemviewer.html?${params.toString()}`;
  }
}

document.querySelectorAll(".portfolio-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-artwork")) return; // handled separately
    handlePortfolioItemClick(item);
  });
});

document.querySelectorAll(".view-artwork").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const item = button.closest(".portfolio-item");
    handlePortfolioItemClick(item, button);
  });
});

// Read URL parameters and update item view
const params = new URLSearchParams(window.location.search);
const imagesParam = params.get("images");
const image = params.get("image");
const title = params.get("title");
const description = params.get("description");
const mediumanddate = params.get("mediumanddate");
const youtube = params.get("youtube");

// Use unique variable names to avoid redeclaration
const mainImgEl = document.getElementById("MainImg");
const youtubePlayerEl = document.getElementById("youtube-player");
const thumbnailsGallery = document.getElementById("thumbnails-gallery");

function setYouTubeAspectRatio(iframe, width, height) {
  if (!iframe) return;
  const aspect = width && height ? height / width : 9 / 16;
  iframe.style.aspectRatio = `${width}/${height}`;
  iframe.style.height = `auto`;
  iframe.style.width = `100%`;
  // Fallback for browsers that don't support aspect-ratio
  iframe.parentElement.style.position = "relative";
  iframe.parentElement.style.paddingTop = `${aspect * 100}%`;
  iframe.style.position = "absolute";
  iframe.style.top = 0;
  iframe.style.left = 0;
}

if (youtubePlayerEl && mainImgEl) {
  if (youtube) {
    youtubePlayerEl.style.display = "block";
    mainImgEl.style.display = "none";
    if (thumbnailsGallery) thumbnailsGallery.innerHTML = "";
    // Fetch video details from YouTube oEmbed API to get width/height
    fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtube}&format=json`
    )
      .then((res) => res.json())
      .then((data) => {
        const width = data.width;
        const height = data.height;
        youtubePlayerEl.innerHTML = `<iframe width="100%" height="auto" src="https://www.youtube.com/embed/${youtube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="display:block;"></iframe>`;
        const iframe = youtubePlayerEl.querySelector("iframe");
        setYouTubeAspectRatio(iframe, width, height);
      })
      .catch(() => {
        // fallback to 16:9
        youtubePlayerEl.innerHTML = `<iframe width="100%" height="auto" src="https://www.youtube.com/embed/${youtube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio:16/9;display:block;"></iframe>`;
      });
  } else {
    // Gallery logic
    let imagesArr = [];
    if (imagesParam) {
      imagesArr = imagesParam
        .split(",")
        .map(decodeURIComponent)
        .filter(Boolean);
    } else if (image) {
      imagesArr = [image];
    }
    if (imagesArr.length > 0) {
      mainImgEl.style.display = "block";
      youtubePlayerEl.style.display = "none";
      mainImgEl.src = imagesArr[0];
      // Render thumbnails
      if (thumbnailsGallery) {
        thumbnailsGallery.innerHTML = "";
        imagesArr.forEach((imgSrc, idx) => {
          const thumb = document.createElement("img");
          thumb.src = imgSrc;
          thumb.className =
            "w-16 h-16 object-cover rounded border-2 border-blue-900 cursor-pointer transition hover:border-blue-400" +
            (idx === 0 ? " border-blue-400" : "");
          thumb.style.marginRight = "0.5rem";
          thumb.onclick = () => {
            mainImgEl.src = imgSrc;
            // Highlight selected thumbnail
            thumbnailsGallery.querySelectorAll("img").forEach((t, i) => {
              t.classList.toggle("border-blue-400", i === idx);
            });
          };
          thumbnailsGallery.appendChild(thumb);
        });
      }
    } else {
      mainImgEl.style.display = "none";
      youtubePlayerEl.style.display = "none";
      if (thumbnailsGallery) thumbnailsGallery.innerHTML = "";
    }
  }
}
if (title) document.getElementById("item-title").textContent = title;
if (mediumanddate)
  document.getElementById("item-mediumanddate").textContent = mediumanddate;
if (description)
  document.getElementById("item-description").textContent = description;

// Fullscreen and zoom logic
const mainImg = document.getElementById("MainImg");
const fullscreenModal = document.getElementById("fullscreenModal");
const fullscreenImg = document.getElementById("fullscreenImg");
const closeFullscreen = document.getElementById("closeFullscreen");
let scale = 1;
if (mainImg) {
  mainImg.addEventListener("click", function () {
    fullscreenImg.src = mainImg.src;
    fullscreenModal.style.display = "flex";
    scale = 1;
    fullscreenImg.style.transform = "scale(1)";
  });
}
if (closeFullscreen) {
  closeFullscreen.addEventListener("click", function () {
    fullscreenModal.style.display = "none";
  });
}
if (fullscreenModal) {
  fullscreenModal.addEventListener("click", function (e) {
    if (e.target === fullscreenModal) fullscreenModal.style.display = "none";
  });
}
if (fullscreenImg) {
  fullscreenImg.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
      scale += e.deltaY * -0.001;
      scale = Math.min(Math.max(1, scale), 5);
      fullscreenImg.style.transform = `scale(${scale})`;
    },
    { passive: false }
  );
}
