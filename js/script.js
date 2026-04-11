document.addEventListener("DOMContentLoaded", function () {
    const counterElement = document.getElementById("view-counter");
    const namespace = "inkandalgo-website";
    const pathKey = window.location.pathname === "/" ? "home" : window.location.pathname.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const localCounterKey = "inkandalgo-local-views-" + pathKey;

    if (counterElement) {
        const localValue = Number(window.localStorage.getItem(localCounterKey) || "0") + 1;
        window.localStorage.setItem(localCounterKey, String(localValue));

        fetch("https://api.countapi.xyz/hit/" + namespace + "/" + pathKey)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Counter request failed");
                }
                return response.json();
            })
            .then(function (data) {
                if (typeof data.value === "number") {
                    counterElement.textContent = "Views: " + data.value.toLocaleString();
                } else {
                    counterElement.textContent = "Views: " + localValue.toLocaleString();
                }
            })
            .catch(function () {
                counterElement.textContent = "Views: " + localValue.toLocaleString();
            });
    }

    const gallery = document.getElementById("gallery-grid");
    const loading = document.getElementById("loading");
    const modal = document.getElementById("artwork-modal");
    const modalClose = document.querySelector(".modal-close");
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const sortFilter = document.getElementById("sort-filter");
    const viewButtons = document.querySelectorAll(".view-btn");
    const galleryCountElements = document.querySelectorAll("[data-gallery-count]");
    const galleryCategoryCountElements = document.querySelectorAll("[data-gallery-category-count]");

    const artworkData = [
        {
            title: "Moon Garden Notes",
            category: "atmospheric",
            description: "Soft lunar light, sketched detail, and a calm atmospheric composition.",
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
            category: "atmospheric",
            description: "A darker scene with fine-line details and calm atmospheric light.",
            src: "assets/images/PXL_20210515_201150112.PORTRAIT.jpg",
            price: 440,
            created: new Date(2026, 3, 1)
        },
        {
            title: "Magnolia Study",
            category: "botanical",
            description: "A close botanical photograph centered on a white magnolia bloom, with waxy leaves and a soft residential background framing the flower.",
            src: "assets/images/gallery/magnolia-study.jpg",
            price: 4,
            created: new Date(2026, 3, 11)
        },
        {
            title: "Vulnerable",
            category: "poster",
            description: "A comic poster with a startled chicken, two puzzled figures, and handwritten side notes arranged against a dotted aqua background.",
            src: "assets/images/gallery/vulnerable.jpg",
            price: 2,
            created: new Date(2026, 3, 5)
        },
        {
            title: "Specimen",
            category: "poster",
            description: "A three-panel specimen sheet featuring a lounging character, a cartoon Earth in space, and a pink creature framed like a classroom display.",
            src: "assets/images/gallery/specimen.jpg",
            price: 2,
            created: new Date(2026, 3, 5)
        },
        {
            title: "Swirlish",
            category: "comic",
            description: "A western-style comic scene with a cowboy character, sparse buildings, and floating title lettering set against a soft red sky.",
            src: "assets/images/gallery/swirlish.jpg",
            price: 2,
            created: new Date(2026, 3, 5)
        },
        {
            title: "Stamina",
            category: "comic",
            description: "An interior cartoon scene pairing bold yellow lettering with a worried character, framed wall art, and a sleeping dog on the floor.",
            src: "assets/images/gallery/trauma.jpg",
            price: 2,
            created: new Date(2026, 3, 5)
        },
        {
            title: "Swagger",
            category: "character",
            description: "A school hallway poster centered on a sunglasses-wearing character, with lockers, scattered doodles, and groups of onlookers on both sides.",
            src: "assets/images/gallery/swagger.jpg",
            price: 2,
            created: new Date(2026, 3, 5)
        },
        {
            title: "Malleable",
            category: "character",
            description: "A theatrical creature drawing with flame-like shapes, star accents, and handwritten callouts that make it feel like a staged character reveal.",
            src: "assets/images/gallery/malleable.jpg",
            price: 2,
            created: new Date(2026, 3, 5)
        },
        {
            title: "Grueling",
            category: "character",
            description: "A satirical poster featuring a shouting figure, a tired frog with a coffee cup, and layered handwritten text around the large multicolor title.",
            src: "assets/images/gallery/grueling.jpeg",
            price: 2,
            created: new Date(2026, 3, 5)
        }
    ];

    let filteredItems = [...artworkData];

    function formatCategoryLabel(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function syncGalleryStats() {
        const categories = new Set(
            artworkData.map(function (item) {
                return item.category;
            })
        );

        galleryCountElements.forEach(function (element) {
            element.textContent = String(artworkData.length);
        });

        galleryCategoryCountElements.forEach(function (element) {
            element.textContent = String(categories.size);
        });
    }

    function populateCategoryOptions() {
        const categories = Array.from(
            new Set(
                artworkData.map(function (item) {
                    return item.category;
                })
            )
        ).sort();

        categories.forEach(function (category) {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = formatCategoryLabel(category);
            categoryFilter.appendChild(option);
        });
    }

    syncGalleryStats();

    if (!gallery) {
        return;
    }

    function renderGallery() {
        gallery.innerHTML = "";

        if (filteredItems.length === 0) {
            gallery.innerHTML = [
                "<div class=\"no-results\">",
                "<h3>No pieces found</h3>",
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
                "<span class=\"item-category\">" + formatCategoryLabel(item.category) + "</span>",
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
        modalCategory.textContent = formatCategoryLabel(item.category);
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

    populateCategoryOptions();

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
