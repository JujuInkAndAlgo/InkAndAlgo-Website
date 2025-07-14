document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("gallery");
    const loading = document.getElementById("loading");
    const modal = document.getElementById("artwork-modal");
    const modalClose = document.querySelector(".modal-close");
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const sortFilter = document.getElementById("sort-filter");
    const viewButtons = document.querySelectorAll(".view-btn");
    
    let items = [];
    let filteredItems = [];

    // Artistic categories for young artist's work
    const categories = ['animals', 'abstract', 'flowers', 'fantasy', 'custom'];
    const prices = [25, 35, 45, 55, 75, 95, 120, 150]; // More affordable prices for young artist

    // Sample artwork titles and descriptions
    const artworkData = [
        { title: "Rainbow Unicorn", category: "fantasy", description: "A magical unicorn with a colorful rainbow mane, painted with lots of sparkles and love!" },
        { title: "Sunny Garden", category: "flowers", description: "A bright garden full of happy flowers in all the colors of the rainbow." },
        { title: "Happy Puppy", category: "animals", description: "A cute puppy playing in a field of flowers, painted with warm colors and joy." },
        { title: "Colorful Dreams", category: "abstract", description: "An abstract painting with swirling colors that represent happy dreams and imagination." },
        { title: "Butterfly Garden", category: "flowers", description: "Beautiful butterflies dancing among colorful flowers in a magical garden." },
        { title: "Space Adventure", category: "fantasy", description: "A rocket ship exploring a colorful galaxy with stars and planets." },
        { title: "Ocean Friends", category: "animals", description: "Friendly sea creatures swimming in a bright blue ocean with coral reefs." },
        { title: "Rainbow Heart", category: "abstract", description: "A big heart filled with all the colors of the rainbow, spreading love and happiness." },
        { title: "Forest Friends", category: "animals", description: "Cute forest animals having a picnic under a big tree with flowers." },
        { title: "Magic Castle", category: "fantasy", description: "A beautiful castle in the clouds with rainbow bridges and magical creatures." },
        { title: "Spring Flowers", category: "flowers", description: "Fresh spring flowers blooming in a garden, painted with soft pastel colors." },
        { title: "Dancing Colors", category: "abstract", description: "Abstract shapes and colors that seem to dance and move across the canvas." },
        { title: "Farm Animals", category: "animals", description: "Happy farm animals including cows, pigs, and chickens in a sunny farmyard." },
        { title: "Fairy Tale", category: "fantasy", description: "A magical scene with fairies, dragons, and princesses in an enchanted forest." },
        { title: "Wildflower Meadow", category: "flowers", description: "A beautiful meadow filled with wildflowers in every color imaginable." }
    ];

    // Mock 50 image items with artistic data
    for (let i = 1; i <= 50; i++) {
        const padded = String(i).padStart(3, '0');
        const artwork = artworkData[i % artworkData.length] || artworkData[0];
        const price = prices[Math.floor(Math.random() * prices.length)];
        
        items.push({
            type: 'image',
            src: `assets/images/image_${padded}.jpg`,
            title: artwork.title + (i > artworkData.length ? ` ${Math.floor(i / artworkData.length) + 1}` : ''),
            category: artwork.category,
            price: price,
            description: artwork.description,
            created: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        });
    }

    // Initialize filtered items
    filteredItems = [...items];

    // Render gallery
    function renderGallery() {
        gallery.innerHTML = '';
        
        if (filteredItems.length === 0) {
            gallery.innerHTML = `
                <div class="no-results">
                    <h3>No artwork found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            `;
            return;
        }

        filteredItems.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'item';
            div.setAttribute('data-index', index);

            const mediaElement = item.type === 'image' 
                ? `<img src="${item.src}" alt="${item.title}" onerror="this.style.display='none'">`
                : `<video src="${item.src}" controls></video>`;

            div.innerHTML = `
                ${mediaElement}
                <div class="item-info">
                    <span class="item-category">${item.category}</span>
                    <h3>${item.title}</h3>
                    <div class="item-price">$${item.price.toLocaleString()}</div>
                    <div class="item-actions">
                        <button class="cta-button view-details-btn" onclick="viewArtworkDetails(${index})">View Details</button>
                        <button class="cta-button buy-button" onclick="purchaseArtwork(${index})">Buy Now</button>
                    </div>
                </div>
            `;

            gallery.appendChild(div);
        });
    }

    // Filter and search functionality
    function filterItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryValue = categoryFilter.value;
        const sortValue = sortFilter.value;

        filteredItems = items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) || 
                                item.category.toLowerCase().includes(searchTerm) ||
                                item.description.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryValue === 'all' || item.category === categoryValue;
            return matchesSearch && matchesCategory;
        });

        // Sort items
        switch (sortValue) {
            case 'newest':
                filteredItems.sort((a, b) => b.created - a.created);
                break;
            case 'oldest':
                filteredItems.sort((a, b) => a.created - b.created);
                break;
            case 'popular':
                // Mock popularity based on price (higher price = more popular)
                filteredItems.sort((a, b) => b.price - a.price);
                break;
            case 'price-low':
                filteredItems.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredItems.sort((a, b) => b.price - a.price);
                break;
        }

        renderGallery();
    }

    // View toggle functionality
    function toggleView(viewType) {
        viewButtons.forEach(btn => btn.classList.remove('active'));
        event.target.closest('.view-btn').classList.add('active');
        
        gallery.className = viewType === 'list' ? 'gallery-grid list-view' : 'gallery-grid';
        renderGallery();
    }

    // Modal functionality
    window.viewArtworkDetails = function(index) {
        const item = filteredItems[index];
        const modalTitle = modal.querySelector('.modal-title');
        const modalDescription = modal.querySelector('.modal-description');
        const modalImage = modal.querySelector('.modal-image');
        const modalCategory = modal.querySelector('.detail-item:nth-child(1) .detail-value');
        const modalCreated = modal.querySelector('.detail-item:nth-child(2) .detail-value');
        const modalPrice = modal.querySelector('.detail-item:nth-child(3) .detail-value');

        modalTitle.textContent = item.title;
        modalDescription.textContent = item.description;
        modalCategory.textContent = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        modalCreated.textContent = item.created.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        modalPrice.textContent = `$${item.price.toLocaleString()}`;

        modalImage.innerHTML = item.type === 'image' 
            ? `<img src="${item.src}" alt="${item.title}">`
            : `<video src="${item.src}" controls></video>`;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    window.purchaseArtwork = function(index) {
        const item = filteredItems[index];
        alert(`Thank you for your interest in "${item.title}"!\n\nPrice: $${item.price.toLocaleString()}\n\nPlease contact us to arrange payment and shipping. Each piece is made with love and will bring joy to your home! 💕`);
    };

    // Close modal
    modalClose.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Event listeners
    searchInput.addEventListener('input', filterItems);
    categoryFilter.addEventListener('change', filterItems);
    sortFilter.addEventListener('change', filterItems);
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleView(this.getAttribute('data-view'));
        });
    });

    // Loading simulation
    setTimeout(() => {
        loading.style.display = 'none';
        renderGallery();
    }, 1500);

    // Add some interactive effects
    gallery.addEventListener('mouseover', function(e) {
        if (e.target.closest('.item')) {
            e.target.closest('.item').style.transform = 'translateY(-8px) scale(1.02)';
        }
    });

    gallery.addEventListener('mouseout', function(e) {
        if (e.target.closest('.item')) {
            e.target.closest('.item').style.transform = 'translateY(0) scale(1)';
        }
    });

    // Keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});