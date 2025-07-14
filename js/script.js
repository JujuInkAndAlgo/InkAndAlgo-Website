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

    // Sample algorithmic artwork data
    const artworkData = [
        { title: "Neural Network Symphony", category: "generative", description: "A dynamic generative artwork created through neural network algorithms, exploring the intersection of artificial intelligence and artistic expression." },
        { title: "Quantum Fractal Patterns", category: "algorithmic", description: "Complex fractal patterns generated using quantum-inspired algorithms, creating infinite detail at every scale." },
        { title: "Interactive Data Flow", category: "interactive", description: "An interactive digital experience that responds to user input, visualizing data streams in real-time." },
        { title: "Algorithmic Harmony", category: "generative", description: "Generative art piece that creates harmonious visual patterns through mathematical algorithms and creative coding." },
        { title: "Digital Evolution", category: "algorithmic", description: "An algorithmic artwork that evolves and adapts over time, showcasing the beauty of computational creativity." },
        { title: "Virtual Reality Matrix", category: "interactive", description: "Interactive virtual reality experience that allows users to explore algorithmic art in immersive 3D space." },
        { title: "Machine Learning Dreams", category: "generative", description: "Artwork generated through machine learning algorithms, creating dreamlike visual compositions." },
        { title: "Computational Aesthetics", category: "algorithmic", description: "Algorithmic design that explores the mathematical foundations of beauty and visual harmony." },
        { title: "Digital Consciousness", category: "interactive", description: "Interactive installation that simulates digital consciousness through responsive algorithmic art." },
        { title: "Fractal Universe", category: "generative", description: "Generative fractal art that creates infinite universes within finite computational space." },
        { title: "Algorithmic Poetry", category: "algorithmic", description: "Visual poetry created through algorithmic processes, where code becomes art." },
        { title: "Neural Art Gallery", category: "interactive", description: "Interactive gallery where neural networks create and curate digital artworks in real-time." },
        { title: "Quantum Art Generator", category: "generative", description: "Quantum-inspired generative art that explores the probabilistic nature of creativity." },
        { title: "Digital DNA", category: "algorithmic", description: "Algorithmic artwork that visualizes digital genetic codes and evolutionary patterns." },
        { title: "Virtual Sculpture Garden", category: "interactive", description: "Interactive 3D sculpture garden where users can create and manipulate algorithmic sculptures." }
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