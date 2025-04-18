# Hacker Brain: Explore Mental Models & Dev Principles

[![Built with HTML/CSS/JS](https://img.shields.io/badge/Built%20with-HTML%2FCSS%2FJS-orange?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web)

A curated collection of essential Mental Models, Cognitive Biases, Developer Laws, and Software Principles presented in a clean, searchable interface with a dynamic background.

**(Add a screenshot or GIF of the application here)**

## Description

Hacker Brain aims to be a quick reference and exploration tool for developers, designers, and thinkers. It aggregates valuable concepts often discussed in technology and decision-making contexts, making them easily accessible and browsable. The project features two main sections: Mental Models & Biases, and Laws & Principles for software development.

## Features

*   **Two Content Sections:** Separate pages for "Mental Models & Biases" and "Laws & Principles".
*   **Card-Based UI:** Resources displayed as visually distinct cards.
*   **Search Functionality:** Filter resources by keywords within the current page.
*   **Category Filtering:** Sidebar allows filtering resources by their category.
*   **Detailed Modal View:** Click on a card to view the full description, examples, and source link in a popup modal.
*   **Dark/Light Theme:** Toggle between dark (default) and light themes, with preference saved in local storage.
*   **Responsive Design:** Adapts layout for different screen sizes (desktop, tablet, mobile).
*   **Dynamic Background:** Features a Matrix-style falling character animation for visual flair.
*   **Minimalist Styling:** Clean UI with subtle hover effects and accent colors.

## Live Demo

**(Link to the live deployed application will go here)**

## Pages

*   **`index.html`**: Displays Mental Models & Cognitive Biases.
*   **`dev.html`**: Displays Developer Laws & Software Principles.

## Technology Stack

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
*   **Icons:** Font Awesome (via CDN)
*   **Background Effect:** Custom JavaScript Matrix animation using HTML Canvas.

## Data Sources

*   **Mental Models & Biases:** Content primarily sourced from `resources_master.json`.
*   **Laws & Principles:** Content sourced from `resources.json`.
    *   This file (`resources.json`) was generated from `reources.md` (a markdown file aggregating concepts, inspired by resources like the original [Hacker Laws](https://github.com/dwmkerr/hacker-laws)) using the `convert_markdown.js` Node.js script (requires `marked` library: `npm install marked`).

## Getting Started / Local Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd hacker-brain # Or your project directory name
    ```
2.  **Open HTML Files:** Simply open `index.html` or `dev.html` in your web browser. No build step or local server is strictly required for basic functionality.

*(Note: If you want to regenerate `resources.json` from `reources.md`, you will need Node.js and npm installed. Run `npm install` to install the `marked` dependency, then run `node convert_markdown.js`.)*

## Contributing

Contributions are welcome! If you find issues, have suggestions, or want to add more resources:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -am 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure any added content is relevant and properly formatted in the JSON files.

## License

*(Consider adding a LICENSE file - e.g., MIT License)*

## Acknowledgements

*   Content inspired by and aggregated from various sources including the [Hacker Laws repository](https://github.com/dwmkerr/hacker-laws) and other mental model collections.
*   Placeholder images from [placehold.co](https://placehold.co/).
*   Icons by [Font Awesome](https://fontawesome.com/).
