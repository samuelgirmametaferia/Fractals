// fractals/script.js

/* -------------------- */
/* Helper Functions for Tooltips */
/* -------------------- */

/**
 * Creates a tooltip element if it doesn't exist.
 */
function createTooltip() {
    if (!document.getElementById('tooltip')) {
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        document.body.appendChild(tooltip);
    }
}

createTooltip();

/**
 * Displays a tooltip with a message and description at specified coordinates.
 * @param {string} message - The title of the tooltip.
 * @param {string} description - The detailed message.
 * @param {object|null} event - The event object containing cursor coordinates.
 */
function showTooltip(message, description, event = null) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = `<strong>${message}</strong><br>${description}`;
    if (event) {
        tooltip.style.left = `${event.pageX + 15}px`;
        tooltip.style.top = `${event.pageY + 15}px`;
        tooltip.style.transform = `translate(0, 0)`;
    } else {
        // Default position (center-top)
        tooltip.style.left = `50%`;
        tooltip.style.top = `20px`;
        tooltip.style.transform = `translate(-50%, 0)`;
    }
    tooltip.style.opacity = '1';
    tooltip.style.pointerEvents = 'none';

    // Hide after 3 seconds
    setTimeout(() => {
        tooltip.style.opacity = '0';
    }, 3000);
}

/* -------------------- */
/* Sidebar Collapse Functionality */
/* -------------------- */

document.addEventListener('DOMContentLoaded', () => {
    const collapseButton = document.querySelector('.collapse-button');
    const sidebar = document.querySelector('.sidebar');

    if (collapseButton && sidebar) {
        collapseButton.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            showTooltip("Welcome to Fractal Explorer!", "Use the editor on the left to modify the shader code. Click 'Run Shader' to apply changes.", null);
            if (sidebar.classList.contains('collapsed')) {
                collapseButton.textContent = '→';
                showTooltip("Editor Hidden", "Click the arrow to show the editor again.", { pageX: collapseButton.offsetLeft, pageY: collapseButton.offsetTop });
            } else {
                collapseButton.textContent = '←';
                showTooltip("Editor Shown", "You can now edit your shader code.", { pageX: collapseButton.offsetLeft, pageY: collapseButton.offsetTop });
            }
          
        });
    }
});