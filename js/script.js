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

    // Futuristic algorithmic categories
    const categories = ['generative', 'algorithmic', 'interactive'];
    const prices = [250, 350, 450, 550, 750, 950, 1200, 1500];

    // Tech-Art Fusion artwork data
    const artworkData = [
        { title: "Digital Brush Strokes", category: "generative", description: "A harmonious blend of traditional artistic techniques and digital algorithms, where brush strokes are generated through creative coding." },
        { title: "Algorithmic Canvas", category: "algorithmic", description: "An artistic canvas where mathematical algorithms paint with the precision of technology and the soul of human creativity." },
        { title: "Interactive Art Studio", category: "interactive", description: "A digital art studio where technology and creativity merge, allowing users to paint with algorithms and sculpt with code." },
        { title: "Creative Code Symphony", category: "generative", description: "Where programming becomes poetry and algorithms dance with artistic expression in perfect harmony." },
        { title: "Digital Artisan", category: "algorithmic", description: "Artwork that combines the craftsmanship of traditional art with the innovation of modern technology." },
        { title: "Virtual Art Gallery", category: "interactive", description: "An immersive gallery where technology enhances artistic experience, creating new ways to interact with digital art." },
        { title: "Code as Canvas", category: "generative", description: "Artwork where programming languages become paintbrushes and algorithms become the artist's palette." },
        { title: "Tech-Art Harmony", category: "algorithmic", description: "A perfect fusion of technological precision and artistic intuition, creating beauty through the marriage of code and creativity." },
        { title: "Digital Art Workshop", category: "interactive", description: "An interactive workshop where users can explore the intersection of technology and artistic expression." },
        { title: "Algorithmic Masterpiece", category: "generative", description: "A masterpiece created where technology serves as the artist's assistant, enhancing human creativity with digital precision." },
        { title: "Creative Computing", category: "algorithmic", description: "Artwork that demonstrates how computers can be creative partners, working alongside human artists to create something beautiful." },
        { title: "Digital Art Lab", category: "interactive", description: "A laboratory where art and technology experiment together, pushing the boundaries of creative expression." },
        { title: "Code Poetry", category: "generative", description: "Artwork where programming becomes a form of poetry, creating visual beauty through elegant code." },
        { title: "Tech-Art Fusion", category: "algorithmic", description: "A seamless blend of technological innovation and artistic vision, where neither dominates but both enhance each other." },
        { title: "Digital Creative Space", category: "interactive", description: "An interactive space where technology and art coexist, creating new possibilities for creative expression." }
    ];

    // Only create one item - the first image
    const artwork = artworkData[0];
    const price = prices[Math.floor(Math.random() * prices.length)];
    
    items.push({
        type: 'image',
        src: 'assets/images/image_001.jpg',
        title: artwork.title,
        category: artwork.category,
        price: price,
        description: artwork.description,
        created: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    });

    // Initialize filtered items
    filteredItems = [...items];

    // Render gallery
    function renderGallery() {
        gallery.innerHTML = '';
        
        if (filteredItems.length === 0) {
            gallery.innerHTML = `
                <div class="no-results">
                    <h3>No artworks found</h3>
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
            case 'price':
                filteredItems.sort((a, b) => a.price - b.price);
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
        alert(`Purchase functionality for "${item.title}" - Price: $${item.price.toLocaleString()}\n\nThis would integrate with your payment system.`);
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