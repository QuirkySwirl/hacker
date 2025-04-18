document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const resourceContainer = document.getElementById('resources-container');
    const categoriesList = document.getElementById('categories-list');
    const searchInput = document.getElementById('search-input');
    const themeToggleButton = document.getElementById('theme-toggle');
    const menuToggleButton = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const modalCloseButton = document.getElementById('modal-close');

    let allResources = []; // To store all fetched resources
    let currentFilter = 'all'; // To track the active category filter

    // --- Page Detection ---
    const isDevPage = window.location.pathname.endsWith('/dev.html');
    const dataPath = isDevPage ? 'resources.json' : 'resources_master.json';

    // --- Theme Handling ---
    const applyTheme = (theme) => {
        const icon = themeToggleButton.querySelector('i');
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            if (icon) icon.className = 'fas fa-moon';
        }
    };

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    if (!savedTheme) { // Default to dark if no preference saved
        currentTheme = 'dark';
    }
    applyTheme(currentTheme);

    themeToggleButton.addEventListener('click', () => {
        currentTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme);
    });

    // --- Mobile Sidebar Toggle ---
    menuToggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 992 && sidebar.classList.contains('active')) {
            if (!sidebar.contains(event.target) && !menuToggleButton.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // --- Modal Handling ---
    const openModal = (resource) => {
        if (!modalOverlay || !modalBody) return;

        // Generate placeholder URL if needed
        const placeholderBg = '2c2c2c'; // Dark background
        const placeholderText = 'FFA500'; // Orange text
        const imageUrl = resource.imageUrl || `https://placehold.co/600x400/${placeholderBg}/${placeholderText}?text=${encodeURIComponent(resource.title)}`;

        // Examples (handle both array and example1/2 for simplicity, prefer array)
        let examplesHtml = '';
        let examplesToShow = resource.examples || [];
        if (examplesToShow.length === 0 && (resource.example1 || resource.example2)) {
            if (resource.example1) examplesToShow.push(resource.example1);
            if (resource.example2) examplesToShow.push(resource.example2);
        }
        if (examplesToShow.length > 0) {
            examplesHtml += '<div class="examples"><h3>Examples</h3>';
            examplesToShow.forEach(example => {
                if (example) examplesHtml += `<p>${example}</p>`;
            });
            examplesHtml += '</div>';
        }

        // See Also (only relevant for dev page, check field exists)
        let seeAlsoHtml = '';
        if (isDevPage && resource.seeAlso && resource.seeAlso.length > 0) {
            seeAlsoHtml += '<div class="see-also"><h3>See Also</h3><ul>';
            resource.seeAlso.forEach(item => {
                if (item) seeAlsoHtml += `<li>${item}</li>`;
            });
            seeAlsoHtml += '</ul></div>';
        }

        let sourceLinkHtml = '';
        if (resource.sourceUrl) {
            sourceLinkHtml = `<a href="${resource.sourceUrl}" target="_blank" rel="noopener noreferrer" class="source-link">Learn More <i class="fas fa-external-link-alt"></i></a>`;
        }

        // Use resource.icon if available (mainly from dev resources)
        const iconHtml = resource.icon ? `<span class="modal-icon">${resource.icon}</span>` : '';

        // Ensure description is treated as HTML if it looks like it
        let descriptionHtml = resource.description || '';
        if (isDevPage && !descriptionHtml.startsWith('<')) {
             // Wrap plain text from mental models in <p> if needed (though this shouldn't happen now)
             // Dev resources description is already HTML
        } else if (!isDevPage && !descriptionHtml.startsWith('<')) {
             descriptionHtml = `<p>${descriptionHtml}</p>`; // Wrap mental model plain text
        }


        modalBody.innerHTML = `
            <img src="${imageUrl}" alt="${resource.title}" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/600x400/2c2c2c/ff0000?text=Load+Error'; this.alt='Image loading error';">
            <span class="category">${resource.category || 'General'}</span>
            <h2>${iconHtml}${resource.title}</h2>
            <div>${descriptionHtml}</div> <!-- Use div for potentially mixed content -->
            ${examplesHtml}
            ${seeAlsoHtml}
            ${sourceLinkHtml}
        `;
        modalOverlay.classList.add('active');
    };

    const closeModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        // Optional: Clear modal body after transition
        // setTimeout(() => {
        //     if (modalBody) modalBody.innerHTML = '';
        // }, 300); // Match transition duration
    };

    if (modalCloseButton) modalCloseButton.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', (event) => {
        // Close only if clicking the overlay itself, not the content
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    // --- Data Loading and Card Creation ---

     // Helper to generate placeholder URL
     const generatePlaceholderImageUrl = (text) => {
        const placeholderBg = '2c2c2c';
        const placeholderText = 'FFA500';
        return `https://placehold.co/600x400/${placeholderBg}/${placeholderText}?text=${encodeURIComponent(text)}`;
    };

    // Removed Normalization function - no longer needed

    const createCard = (resource, index) => {
        const card = document.createElement('div');
        // Add base class only
        card.classList.add('card');
        card.style.setProperty('--card-index', index);

        // Generate placeholder if needed (imageUrl might be missing)
        const imageUrl = resource.imageUrl || generatePlaceholderImageUrl(resource.title);

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = resource.title;
        img.loading = 'lazy';
        img.onerror = () => {
            img.src = `https://placehold.co/600x400/${placeholderBg}/ff0000?text=Load+Error`; // Red text on error
            img.alt = 'Image loading error';
        };

        const content = document.createElement('div');
        content.classList.add('card-content');

        const categorySpan = document.createElement('span');
        categorySpan.classList.add('category');
        categorySpan.textContent = resource.category || 'General';

        const title = document.createElement('h2');
        title.textContent = resource.title;

        // Add short description preview - CSS will hide/show based on body class
        const descriptionPreview = document.createElement('p');
        descriptionPreview.classList.add('description'); // Use existing class for ellipsis
        // Create a temporary element to strip HTML/markdown for the preview
        const tempDiv = document.createElement('div');
         // Handle both HTML (dev) and plain text (mental models) descriptions
        let previewText = resource.description || "";
        if (previewText.includes('<')) { // Basic check if it might be HTML
            tempDiv.innerHTML = previewText;
            previewText = tempDiv.textContent || tempDiv.innerText || "";
        }
        descriptionPreview.textContent = previewText;

        content.appendChild(categorySpan);
        content.appendChild(title);
        content.appendChild(descriptionPreview); // Always add, CSS controls visibility

        card.appendChild(img);
        card.appendChild(content);

        // Add click listener to the whole card to open the modal
        card.addEventListener('click', () => openModal(resource));

        return card;
    };

    // Function to display resources
    const displayResources = (resourcesToDisplay) => {
        if (!resourceContainer) return;
        resourceContainer.innerHTML = '';
        if (resourcesToDisplay.length === 0) {
            resourceContainer.innerHTML = '<p>No matching resources found.</p>';
            return;
        }
        resourcesToDisplay.forEach((resource, index) => {
            const cardElement = createCard(resource, index);
            resourceContainer.appendChild(cardElement);
        });
    };

    // Function to populate categories in the sidebar
    const populateCategories = (resources) => {
        if (!categoriesList) return;
        // Extract unique categories, ensure 'all' is first, sort alphabetically
        const categories = ['all', ...new Set(resources.map(r => r.category).filter(Boolean))].sort((a, b) => {
            if (a === 'all') return -1;
            if (b === 'all') return 1;
            return a.localeCompare(b);
        });

        categoriesList.innerHTML = ''; // Clear all existing categories first

        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.classList.add('category-item');
            const categoryId = category.toLowerCase().replace(/\s+/g, '-');
            categoryItem.dataset.category = categoryId;

            // Icon mapping
            let iconClass = 'fa-star'; // Default icon
            if (category === 'all') iconClass = 'fa-asterisk';
            else if (category.toLowerCase().includes('law')) iconClass = 'fa-gavel';
            else if (category.toLowerCase().includes('principle')) iconClass = 'fa-lightbulb';
            else if (category.toLowerCase().includes('model')) iconClass = 'fa-brain';
            else if (category.toLowerCase().includes('bias')) iconClass = 'fa-balance-scale-left';
            else if (category.toLowerCase().includes('productivity')) iconClass = 'fa-rocket';
            else if (category.toLowerCase().includes('decision')) iconClass = 'fa-check-double';
            else if (category.toLowerCase().includes('solving')) iconClass = 'fa-puzzle-piece';
            else if (category.toLowerCase().includes('psychology')) iconClass = 'fa-user-cog';
            else if (category.toLowerCase().includes('economics')) iconClass = 'fa-chart-line';
            else if (category.toLowerCase().includes('systems')) iconClass = 'fa-project-diagram';

            categoryItem.innerHTML = `<span class="category-icon"><i class="fas ${iconClass}"></i></span> ${category === 'all' ? 'All' : category}`;
            categoryItem.addEventListener('click', handleCategoryClick);

            if (category === currentFilter) { // Set initial active state
                categoryItem.classList.add('active');
            }

            categoriesList.appendChild(categoryItem);
        });
    };

    // Handle category click
    const handleCategoryClick = (event) => {
        const clickedCategoryItem = event.currentTarget;
        currentFilter = clickedCategoryItem.dataset.category;
        document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
        clickedCategoryItem.classList.add('active');
        filterAndDisplayResources();
        if (window.innerWidth <= 992 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    };

    // Filter and display resources
    const filterAndDisplayResources = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let filtered = allResources;

        if (currentFilter !== 'all') {
            // Match category based on the generated data-category attribute
            filtered = filtered.filter(resource => resource.category && resource.category.toLowerCase().replace(/\s+/g, '-') === currentFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(resource =>
                resource.title.toLowerCase().includes(searchTerm) ||
                (resource.description && resource.description.toLowerCase().includes(searchTerm)) || // Check description exists
                (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))) ||
                (resource.category && resource.category.toLowerCase().includes(searchTerm)) // Also search category name
            );
        }
        displayResources(filtered);
    };

    // --- Matrix Background Effect ---
    const initializeMatrixEffect = () => {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Make canvas full screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Characters to use - Katakana + Numerals + Symbols
        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const symbols = '#$*+%&'; // Add more symbols if desired
        const characters = katakana + latin + nums + symbols;
        const charactersArray = characters.split('');

        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize);

        // Array to store the current y position of the drop in each column
        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        // Theme colors
        const matrixColorDark = getComputedStyle(document.documentElement).getPropertyValue('--accent-cyan').trim() || '#06b6d4'; // Cyan default
        const matrixColorLight = '#d1d5db'; // Very light gray for light mode text
        const bgColorDark = 'rgba(10, 12, 16, 0.05)'; // Very transparent dark bg for trails
        const bgColorLight = 'rgba(246, 248, 250, 0.05)'; // Very transparent light bg for trails

        let animationInterval = null;

        const drawMatrix = () => {
            const isLight = body.classList.contains('light-mode');
            const matrixColor = isLight ? matrixColorLight : matrixColorDark;
            const bgColor = isLight ? bgColorLight : bgColorDark;

            // Set background with low opacity to create the trail effect
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = matrixColor; // Set character color
            ctx.font = `${fontSize}px monospace`;

            // Loop through drops
            for (let i = 0; i < drops.length; i++) {
                // Get a random character
                const text = charactersArray[Math.floor(Math.random() * charactersArray.length)];
                // Draw the character
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Send the drop back to the top randomly after it has crossed the screen
                // or when it hits the bottom
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Increment Y coordinate
                drops[i]++;
            }
        };

        // Start animation
        if (animationInterval) clearInterval(animationInterval);
        animationInterval = setInterval(drawMatrix, 50); // Adjust speed here (milliseconds)

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Recalculate columns and reset drops on resize
            const newColumns = Math.floor(canvas.width / fontSize);
            drops.length = 0; // Clear existing drops
            for (let x = 0; x < newColumns; x++) {
                drops[x] = 1;
            }
            // No need to restart interval, drawMatrix will adapt
        });

         // Update colors on theme toggle
         themeToggleButton.addEventListener('click', () => {
            // No need to restart, drawMatrix checks theme on each frame
         });
    };

    // Initialize Matrix effect after other setup
    initializeMatrixEffect();


    // Search input event listener
    if (searchInput) searchInput.addEventListener('input', filterAndDisplayResources);

    // Initial Fetch and Setup - Load single file based on page
    fetch(dataPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error fetching ${dataPath}! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // No normalization needed anymore, data structure is specific to the page
            allResources = data;

            // Shuffle resources for variety on load? Optional.
            // allResources.sort(() => Math.random() - 0.5);

            populateCategories(allResources); // Populate categories from the loaded data
            filterAndDisplayResources(); // Display initial view
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
            if (resourceContainer) {
                resourceContainer.innerHTML = `<p style="color: red; text-align: center;">Failed to load resources. ${error.message}</p>`;
            }
        });
});
