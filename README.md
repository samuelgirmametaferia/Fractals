# Fractal Explorer

Welcome to the Fractal Explorer project! This website allows you to explore and interact with multiple fractals, such as the Mandelbrot Set and Newton's Fractals, all within an immersive, visually appealing environment. This README serves as a comprehensive guide to understand the project structure, the technologies involved, and how to get started.

---

## Table of Contents  
1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Technologies Used](#technologies-used)  
4. [File Structure](#file-structure)  
5. [Getting Started](#getting-started)  
6. [How It Works](#how-it-works)  
7. [Customization](#customization)  
8. [Contributing](#contributing)  
9. [License](#license)

---

## Project Overview

The Fractal Explorer project is designed to introduce users to the beauty and complexity of fractals. It demonstrates two popular fractal types:

1. **Mandelbrot Set** – A famous fractal defined by repeating a simple equation in the complex plane.  
2. **Newton's Fractals** – Created by applying the Newton-Raphson method to iterative functions in complex space.

Within this site, users can transition through informative slides about fractals, then pick which fractal they want to explore. Each fractal page includes a real-time shader editor, allowing users to modify the fractal rendering code and see results instantly.

---

## Features

- Interactive **slide-based introduction** that transitions automatically to guide users toward fractals.
- **Mandelbrot Set** visualization with run-time shader compilation:
  - Pan, zoom, and explore the fractal with mouse controls.
  - Edit the GLSL code in the integrated Monaco editor.
- **Newton's Fractals** visualization with a CodeMirror-based shader editor for live editing.
- Smooth CSS animations and transitions, including a subtle **starry background** and a hovering **poof** effect when selecting fractals.
- Fully commented code to aid understanding for both beginners and advanced users.

---

## Technologies Used

- **HTML/CSS/JavaScript** – Primary web technologies for structure, style, and interactivity.
- **Three.js** – A WebGL library used to handle 3D rendering pipelines for fractal generation.
- **Monaco Editor** & **CodeMirror** – In-browser code editors enabling users to view and modify shader code.
- **Shader Programming (GLSL)** – Fragment shaders for generating fractals in real time.
- **Prism.js** – Used in the Mandelbrot page for syntax highlighting (if needed).
- **SweetAlert2** – Provides attractive custom popups for instructions, errors, or confirmations.
- **CSS Animations** – Implements transitions and starfield backgrounds for a polished user experience.

---

## File Structure

Below is an overview of the relevant files and folders:

```
.
├── index.html                // Main page containing slides and fractal selections
├── style.css (inlined/unified in index.html)  // Main styling (if separated, found elsewhere)
├── script.js                 // Shared JavaScript (if separated, found elsewhere)
├── fractals/
│   ├── mandelbrot.html       // Page dedicated to the Mandelbrot fractal
│   ├── newton.html           // Page dedicated to Newton's Fractals
│   ├── styles.css            // Style overrides or fractal-specific styles
│   ├── mandelbrot.js         // JavaScript logic for Mandelbrot fractal
│   ├── newton.js             // JavaScript logic for Newton's Fractal
│   ...
└── README.md                 // Project README (this file)
```

---

## Getting Started

1. **Clone or Download** the repository onto your local machine.  
2. **Open index.html** in your favorite web browser to view the main slides and introductory content.  
3. **Allow the slides to transition**, or click on any fractal choice (Mandelbrot or Newton's) to be taken directly to the fractal exploration page.

If you prefer running on a local server for consistent performance:

1. Use a simple HTTP server (e.g., Python’s SimpleHTTPServer or Node’s `http-server`) in the project’s root directory.  
2. Navigate to `http://localhost:8080` (or whichever port you chose).  
3. Explore the fractals from the landing page as described.

---

## How It Works

### Slides and Transitions
- On the main page (`index.html`), JavaScript code in `<script>` tags automatically cycles through slides by applying the `.active` class to each slide in intervals.
- After the final slide, the user can select either the Mandelbrot or Newton’s fractal.

### Mandelbrot Page
- Uses **Monaco Editor** to provide an inline GLSL shader editing experience.
- A fragment shader calculates the color of each pixel according to Mandelbrot iterations.
- Users can modify constants (like `maxIterations`) or color calculations directly, then press "Run Shader" to recompile and render the updated fractal.

### Newton's Page
- Uses **CodeMirror** for editing a GLSL shader that applies the Newton-Raphson method to complex numbers, generating Newton’s Fractals.
- Users can adjust iteration logic, convergence checks, or color schemes and rerun the shader to see changes in real time.

---

## Customization

1. **Styling**  
   - Most of the styling is included inline within the HTML files (CSS in `<style>` tags).  
   - You can adapt background colors, transitions, or text styling as needed.  
   - The starry background, slide transitions, and fractal card animations can be modified in these CSS blocks.

2. **Shader Code**  
   - The default GLSL code is found in `<textarea>` tags or within script references (`mandelbrot.js` or `newton.js`).  
   - Feel free to change iteration parameters, color mapping, or convergence thresholds.

3. **JavaScript Logic**  
   - The main user interactions (click events, popups, fractal rendering) can be customized in `script.js` and each fractal’s respective JS file (`mandelbrot.js` or `newton.js`).

---

## Contributing

Contributions to this project are welcome! To contribute:

1. **Fork** the repository.  
2. Create a new **feature branch**.  
3. **Commit** your changes.  
4. Open a **pull request**, detailing the modifications you’ve made and how they enhance the project.

---

## License

This project is provided as-is under the MIT License. Please see the [LICENSE](LICENSE) file (if present) or add one to clarify terms for distribution and modification.  

Thank you for exploring fractals with us! Have fun modifying code and discovering new patterns in these endlessly fascinating shapes.
