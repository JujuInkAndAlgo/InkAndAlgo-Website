document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("gallery");

    if (!gallery) {
        return;
    }

    const loading = document.getElementById("loading");
    const modal = document.getElementById("artwork-modal");
    const modalClose = document.querySelector(".modal-close");
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const sortFilter = document.getElementById("sort-filter");
    const viewButtons = document.querySelectorAll(".view-btn");

    const artworkData = [
        {
            title: "Moon Garden Notes",
            category: "nightscape",
            description: "Soft lunar light, sketched petals, and a quiet spring-night composition.",
            src: "assets/images/image_001.jpg",
            price: 420,
            created: new Date(2026, 2, 20)
        },
        {
            title: "Greenhouse Study",
            category: "botanical",
            description: "A layered botanical portrait with muted greens and warm natural contrast.",
            src: "assets/images/PXL_20210515_195102835.PORTRAIT.jpg",
            price: 360,
            created: new Date(2026, 2, 24)
        },
        {
            title: "Petal Index",
            category: "editorial",
            description: "A print-inspired composition built around negative space and blush accents.",
            src: "assets/images/PXL_20210515_200025261.PORTRAIT.jpg",
            price: 390,
            created: new Date(2026, 2, 28)
        },
        {
            title: "Evening Bloom",
            category: "nightscape",
            description: "A darker spring scene with fine-line details and calm atmospheric light.",
            src: "assets/images/PXL_20210515_201150112.PORTRAIT.jpg",
            price: 440,
            created: new Date(2026, 3, 1)
        }
    ];

    const categoryCycle = ["botanical", "editorial", "nightscape"];
    const titleCycle = [
        "Garden Margin",
        "Veranda Light",
        "Wildflower Draft",
        "Soft Weather Study",
        "Florals After Rain",
        "Editorial Stem",
        "Morning Trellis",
        "Paper Petals",
        "Dusky Orchard",
        "Windowbox Notes",
        "Bloom Sequence"
    ];
    const descriptionCycle = {
        botanical: "A spring botanical built with soft foliage, organic texture, and a collected studio feel.",
        editorial: "An editorial-style composition shaped around whitespace, arrangement, and seasonal color.",
        nightscape: "A moonlit spring study balancing dark skies, calm light, and hand-drawn detail."
    };

    const imagePool = [
        "assets/images/image_001.jpg",
        "assets/images/PXL_20210515_195102835.PORTRAIT.jpg",
        "assets/images/PXL_20210515_200025261.PORTRAIT.jpg",
        "assets/images/PXL_20210515_201150112.PORTRAIT.jpg"
    ];

    for (let i = 0; i < 11; i += 1) {
        const category = categoryCycle[i % categoryCycle.length];
        artworkData.push({
            title: titleCycle[i],
            category: category,
            description: descriptionCycle[category],
            src: imagePool[i % imagePool.length],
            price: 320 + i * 25,
            created: new Date(2026, 2 + (i % 2), 2 + i)
        });
    }

    let filteredItems = [...artworkData];

    function renderGallery() {
        gallery.innerHTML = "";

        if (filteredItems.length === 0) {
            gallery.innerHTML = [
                "<div class=\"no-results\">",
                "<h3>No spring pieces found</h3>",
                "<p>Try a different search term or collection filter.</p>",
                "</div>"
            ].join("");
            return;
        }

        filteredItems.forEach(function (item, index) {
            const div = document.createElement("div");
            div.className = "item";
            div.setAttribute("data-index", String(index));
            div.innerHTML = [
                "<img src=\"" + item.src + "\" alt=\"" + item.title + "\">",
                "<div class=\"item-info\">",
                "<span class=\"item-category\">" + item.category + "</span>",
                "<h3>" + item.title + "</h3>",
                "<p>" + item.description + "</p>",
                "<div class=\"item-price\">$" + item.price.toLocaleString() + "</div>",
                "<div class=\"item-actions\">",
                "<button class=\"cta-button view-details-btn\" type=\"button\">View Details</button>",
                "<button class=\"cta-button buy-button\" type=\"button\">Inquire</button>",
                "</div>",
                "</div>"
            ].join("");

            div.querySelector(".view-details-btn").addEventListener("click", function () {
                viewArtworkDetails(index);
            });

            div.querySelector(".buy-button").addEventListener("click", function () {
                purchaseArtwork(index);
            });

            gallery.appendChild(div);
        });
    }

    function filterItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryValue = categoryFilter.value;
        const sortValue = sortFilter.value;

        filteredItems = artworkData.filter(function (item) {
            const matchesSearch =
                item.title.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryValue === "all" || item.category === categoryValue;
            return matchesSearch && matchesCategory;
        });

        switch (sortValue) {
            case "newest":
                filteredItems.sort(function (a, b) {
                    return b.created - a.created;
                });
                break;
            case "oldest":
                filteredItems.sort(function (a, b) {
                    return a.created - b.created;
                });
                break;
            case "popular":
                filteredItems.sort(function (a, b) {
                    return a.title.localeCompare(b.title);
                });
                break;
            case "price":
                filteredItems.sort(function (a, b) {
                    return a.price - b.price;
                });
                break;
            default:
                break;
        }

        renderGallery();
    }

    function toggleView(button, viewType) {
        viewButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });
        button.classList.add("active");
        gallery.className = viewType === "list" ? "gallery-grid list-view" : "gallery-grid";
    }

    function viewArtworkDetails(index) {
        const item = filteredItems[index];
        const modalTitle = modal.querySelector(".modal-title");
        const modalDescription = modal.querySelector(".modal-description");
        const modalImage = modal.querySelector(".modal-image");
        const modalCategory = modal.querySelector(".detail-item:nth-child(1) .detail-value");
        const modalCreated = modal.querySelector(".detail-item:nth-child(2) .detail-value");
        const modalPrice = modal.querySelector(".detail-item:nth-child(3) .detail-value");
        const modalBuyButton = modal.querySelector(".modal-buy-btn");

        modalTitle.textContent = item.title;
        modalDescription.textContent = item.description;
        modalCategory.textContent = item.category;
        modalCreated.textContent = item.created.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        modalPrice.textContent = "$" + item.price.toLocaleString();
        modalImage.innerHTML = "<img src=\"" + item.src + "\" alt=\"" + item.title + "\">";
        modalBuyButton.onclick = function () {
            purchaseArtwork(index);
        };

        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    function purchaseArtwork(index) {
        const item = filteredItems[index];
        window.alert(
            "Inquiry for \"" +
            item.title +
            "\"\nCollection: " +
            item.category +
            "\nPrice: $" +
            item.price.toLocaleString() +
            "\n\nHook this button into your real contact or checkout flow."
        );
    }

    searchInput.addEventListener("input", filterItems);
    categoryFilter.addEventListener("change", filterItems);
    sortFilter.addEventListener("change", filterItems);

    viewButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            toggleView(btn, btn.getAttribute("data-view"));
        });
    });

    modalClose.onclick = function () {
        modal.style.display = "none";
        document.body.style.overflow = "";
    };

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "";
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
            document.body.style.overflow = "";
        }
    });

    setTimeout(function () {
        loading.style.display = "none";
        renderGallery();
    }, 500);
});
