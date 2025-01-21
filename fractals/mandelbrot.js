// fractals/mandelbrot.js
let isPanning = false;
let startPan = { x: 0, y: 0 };
let currentOffset = { x: 0, y: 0 };
let currentZoom = 1.0;

// Variables for touch zooming
let initialPinchDistance = null;

// Add event listeners for mouse interactions
renderer.domElement.addEventListener('mousedown', onMouseDown, false);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);
renderer.domElement.addEventListener('mouseup', onMouseUp, false);
renderer.domElement.addEventListener('wheel', onMouseWheel, false);

function onMouseDown(event) {
    isPanning = true;
    startPan.x = event.clientX;
    startPan.y = event.clientY;
}

function onMouseMove(event) {
    if (isPanning) {
        const deltaX = event.clientX - startPan.x;
        const deltaY = event.clientY - startPan.y;

        // Adjust the offset based on mouse movement and current zoom
        currentOffset.x += deltaX * 0.005 * currentZoom;
        currentOffset.y -= deltaY * 0.005 * currentZoom; // Invert Y-axis for natural movement

        // Update shader uniforms
        material.uniforms.offset.value.x = currentOffset.x;
        material.uniforms.offset.value.y = currentOffset.y;

        // Update starting position for the next move
        startPan.x = event.clientX;
        startPan.y = event.clientY;

        // Re-render the scene with updated uniforms
        renderer.render(scene, camera);
    }
}

function onMouseUp(event) {
    isPanning = false;
}
function onMouseWheel(event) {
    event.preventDefault();

    const zoomIntensity = 0.1;
    if (event.deltaY < 0) {
        // Zoom in
        currentZoom *= (1 + zoomIntensity);
    } else {
        // Zoom out
        currentZoom /= (1 + zoomIntensity);
    }

    // Clamp the zoom level to prevent excessive zooming
    currentZoom = Math.min(Math.max(currentZoom, 0.1), 100);

    // Update shader uniform
    material.uniforms.zoom.value = currentZoom;

    // Re-render the scene with updated zoom
    renderer.render(scene, camera);
}
// Add touch event listeners
renderer.domElement.addEventListener('touchstart', onTouchStart, false);
renderer.domElement.addEventListener('touchmove', onTouchMove, false);
renderer.domElement.addEventListener('touchend', onTouchEnd, false);

function onTouchStart(event) {
    if (event.touches.length === 1) {
        // Single touch for panning
        isPanning = true;
        startPan.x = event.touches[0].clientX;
        startPan.y = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
        // Two-finger touch for zooming
        isPanning = false;
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
    }
}

function onTouchMove(event) {
    event.preventDefault(); // Prevent default touch behaviors like scrolling

    if (isPanning && event.touches.length === 1) {
        const deltaX = event.touches[0].clientX - startPan.x;
        const deltaY = event.touches[0].clientY - startPan.y;

        // Adjust the offset based on touch movement and current zoom
        currentOffset.x += deltaX * 0.005 * currentZoom;
        currentOffset.y -= deltaY * 0.005 * currentZoom;

        // Update shader uniforms
        material.uniforms.offset.value.x = currentOffset.x;
        material.uniforms.offset.value.y = currentOffset.y;

        // Update starting position for the next move
        startPan.x = event.touches[0].clientX;
        startPan.y = event.touches[0].clientY;

        // Re-render the scene with updated uniforms
        renderer.render(scene, camera);
    } else if (event.touches.length === 2) {
        // Handle pinch-to-zoom
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        const currentPinchDistance = Math.sqrt(dx * dx + dy * dy);

        if (initialPinchDistance) {
            const scale = currentPinchDistance / initialPinchDistance;
            currentZoom *= scale;

            // Clamp the zoom level
            currentZoom = Math.min(Math.max(currentZoom, 0.1), 100);

            // Update shader uniform
            material.uniforms.zoom.value = currentZoom;

            // Re-render the scene with updated zoom
            renderer.render(scene, camera);
        }

        // Update initial pinch distance for the next move
        initialPinchDistance = currentPinchDistance;
    }
}

function onTouchEnd(event) {
    if (event.touches.length < 2) {
        initialPinchDistance = null;
    }
    if (event.touches.length === 0) {
        isPanning = false;
    }
}
// Initialize CodeMirror Editor
const mandelbrotEditor = CodeMirror.fromTextArea(document.getElementById('mandelbrot-shader'), {
    mode: 'x-shader/x-fragment',
    theme: 'material-darker',
    lineNumbers: true,
    tabSize: 4,
    autoCloseBrackets: true,
    matchBrackets: true,
    autofocus: true,
    // Ensure the editor fills the container
    viewportMargin: Infinity // Makes CodeMirror auto-resize vertically
});

// Adjust editor size to fit the panel
mandelbrotEditor.setSize('100%', '100%');

// Initialize Three.js Scene
const mandelbrotContainer = document.getElementById('mandelbrot-container');
const mandelbrotScene = new THREE.Scene();

// Orthographic Camera
const mandelbrotCamera = new THREE.OrthographicCamera(
    mandelbrotContainer.clientWidth / -2, mandelbrotContainer.clientWidth / 2,
    mandelbrotContainer.clientHeight / 2, mandelbrotContainer.clientHeight / -2,
    1, 1000
);
mandelbrotCamera.position.z = 1;

// Renderer
const mandelbrotRenderer = new THREE.WebGLRenderer({ antialias: true });
mandelbrotRenderer.setSize(mandelbrotContainer.clientWidth, mandelbrotContainer.clientHeight);
mandelbrotContainer.appendChild(mandelbrotRenderer.domElement);

/**
 * Creates a ShaderMaterial using the provided fragment shader code.
 * @param {string} fragmentShaderCode - The GLSL code for the fragment shader.
 * @returns {THREE.ShaderMaterial|null} - The created shader material or null if there's an error.
 */
function createMandelbrotMaterial(fragmentShaderCode) {
    try {
        return new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: new THREE.Vector2(mandelbrotContainer.clientWidth, mandelbrotContainer.clientHeight) },
                zoom: { value: zoomM },
                offset: { value: new THREE.Vector2(offsetM.x, offsetM.y) },
                maxIterations: { value: 100.0 }
            },
            fragmentShader: fragmentShaderCode,
            vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `
        });
    } catch (error) {
        console.error("Error creating ShaderMaterial:", error);
        showTooltip("Shader Compilation Error", "Check the console for details.", { pageX: 100, pageY: 100 });
        return null;
    }
}

// Initialize Shader Material with Default Shader Code
let mandelbrotMaterial = createMandelbrotMaterial(mandelbrotEditor.getValue());

if (mandelbrotMaterial) {
    // Create Plane Geometry
    let mandelbrotPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(mandelbrotContainer.clientWidth, mandelbrotContainer.clientHeight),
        mandelbrotMaterial
    );
    mandelbrotScene.add(mandelbrotPlane);
} else {
    // Handle case where initial shader compilation failed
    showTooltip("Initial Shader Error", "Please fix the shader code to render fractal.", { pageX: 100, pageY: 100 });
}

// Handle Window Resize
window.addEventListener('resize', () => {
    mandelbrotRenderer.setSize(mandelbrotContainer.clientWidth, mandelbrotContainer.clientHeight);
    mandelbrotCamera.left = mandelbrotContainer.clientWidth / -2;
    mandelbrotCamera.right = mandelbrotContainer.clientWidth / 2;
    mandelbrotCamera.top = mandelbrotContainer.clientHeight / 2;
    mandelbrotCamera.bottom = mandelbrotContainer.clientHeight / -2;
    mandelbrotCamera.updateProjectionMatrix();

    if (mandelbrotMaterial) {
        mandelbrotMaterial.uniforms.resolution.value.x = mandelbrotContainer.clientWidth;
        mandelbrotMaterial.uniforms.resolution.value.y = mandelbrotContainer.clientHeight;
        mandelbrotPlane.geometry = new THREE.PlaneGeometry(mandelbrotContainer.clientWidth, mandelbrotContainer.clientHeight);
    }
});

// Variables for Zoom and Pan
let zoomM = 1.0;
let offsetM = { x: 0.0, y: 0.0 };
let isDraggingM = false;
let previousMousePositionM = { x: 0, y: 0 };

// Handle Zoom (Mouse Wheel)
mandelbrotContainer.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
        zoomM *= 1.1;
    } else {
        zoomM /= 1.1;
    }
    if (mandelbrotMaterial) {
        mandelbrotMaterial.uniforms.zoom.value = zoomM;
    }
    showTooltip("Zoom Level Adjusted", "Use the mouse wheel to zoom in and out.", event);
}, { passive: false });

// Handle Panning (Mouse Drag)
mandelbrotContainer.addEventListener('mousedown', (event) => {
    isDraggingM = true;
    previousMousePositionM.x = event.clientX;
    previousMousePositionM.y = event.clientY;
});

mandelbrotContainer.addEventListener('mousemove', (event) => {
    if (isDraggingM && mandelbrotMaterial) {
        const deltaX = (event.clientX - previousMousePositionM.x) / mandelbrotContainer.clientWidth * 2.0 / zoomM;
        const deltaY = (event.clientY - previousMousePositionM.y) / mandelbrotContainer.clientHeight * 2.0 / zoomM;
        offsetM.x -= deltaX;
        offsetM.y += deltaY;
        mandelbrotMaterial.uniforms.offset.value.x = offsetM.x;
        mandelbrotMaterial.uniforms.offset.value.y = offsetM.y;
        previousMousePositionM.x = event.clientX;
        previousMousePositionM.y = event.clientY;
        showTooltip("Panning", "Click and drag to move around the fractal.", event);
    }
});

mandelbrotContainer.addEventListener('mouseup', () => {
    isDraggingM = false;
});

mandelbrotContainer.addEventListener('mouseleave', () => {
    isDraggingM = false;
});

// Render Loop
function animateMandelbrot() {
    requestAnimationFrame(animateMandelbrot);
    mandelbrotRenderer.render(mandelbrotScene, mandelbrotCamera);
}

animateMandelbrot();

// Run Shader Button Functionality
document.getElementById('run-mandelbrot').addEventListener('click', () => {
    const newFragmentShader = mandelbrotEditor.getValue();
    const newMaterial = createMandelbrotMaterial(newFragmentShader);

    if (newMaterial) {
        // Replace the old material with the new one
        mandelbrotPlane.material.dispose(); // Dispose of the old material
        mandelbrotPlane.material = newMaterial;
        mandelbrotMaterial = newMaterial;

        showTooltip("Shader Updated", "Your changes have been applied successfully!", { pageX: 100, pageY: 100 });
    }
});

// Implement Auto-Compile (Debounced)
let compileTimeout;
mandelbrotEditor.on('change', () => {
    clearTimeout(compileTimeout);
    compileTimeout = setTimeout(() => {
        const updatedShader = mandelbrotEditor.getValue();
        const updatedMaterial = createMandelbrotMaterial(updatedShader);
        
        if (updatedMaterial) {
            mandelbrotPlane.material.dispose();
            mandelbrotPlane.material = updatedMaterial;
            mandelbrotMaterial = updatedMaterial;
            showTooltip("Shader Auto-Compiled", "Your changes have been applied.", { pageX: 100, pageY: 100 });
        }
    }, 1000); // Compile after 1 second of no changes
});

// Back Button Functionality
document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = '../index.html'; // Navigates back to the main menu
});
// mandelbrot.js

function runMandelbrotShader() {
    const fragmentShader = editor.getValue(); // Get shader code from CodeMirror

    // Assuming you have a Three.js scene set up
    const mandelbrotMaterial = new THREE.ShaderMaterial({
        uniforms: {
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            zoom: { value: 200.0 },
            offset: { value: new THREE.Vector2(0.0, 0.0) },
            maxIterations: { value: 100 }
        },
        fragmentShader: fragmentShader,
        vertexShader: `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `
    });

    // Assuming there's a mesh named 'mandelbrotMesh' in your scene
    mandelbrotMesh.material = mandelbrotMaterial;
    mandelbrotMaterial.needsUpdate = true;
}
// Function to display the information pop-up
function showInfoPopup() {
    Swal.fire({
        title: 'Welcome to the Mandelbrot Set Explorer!',
        html: `
            <p>This tool allows you to explore the fascinating world of the Mandelbrot Set, a famous fractal in mathematics.</p>
            <h3>Features:</h3>
            <ul style="text-align: left;">
                <li><strong>Panning:</strong> Click and drag to move around the fractal.</li>
                <li><strong>Zooming:</strong> Use your mouse scroll or pinch gestures on touch devices to zoom in and out.</li>
                <li><strong>Shader Editor:</strong> Modify the GLSL shader code in real-time to see how changes affect the fractal.</li>
                <li><strong>Colored Syntax Highlighting:</strong> The shader editor provides syntax highlighting for easier code readability.</li>
            </ul>
            <h3>How to Use:</h3>
            <ol style="text-align: left;">
                <li>Navigate through the fractal using panning and zooming controls.</li>
                <li>Edit the shader code in the editor to customize the appearance of the Mandelbrot Set.</li>
                <li>Click the "Run Shader" button to apply your changes.</li>
            </ol>
            <p>Enjoy exploring the intricate patterns of the Mandelbrot Set!</p>
        `,
        icon: 'info',
        confirmButtonText: 'Get Started',
        width: '600px' // Adjust the width as needed
    });
}
// Display the pop-up when the page loads
window.onload = function() {
    showInfoPopup();
};
// Attach event listener to the info button
document.getElementById('info-button').addEventListener('click', showInfoPopup);
function showInfoPopup() {
    Swal.fire({
        title: 'Welcome to the Mandelbrot Set Explorer!',
        html: `
            <img src="path-to-your-image.jpg" alt="Mandelbrot Set" style="width:100%; height:auto; margin-bottom:20px;">
            <p>This tool allows you to explore the fascinating world of the Mandelbrot Set, a famous fractal in mathematics.</p>
            <!-- Rest of the content -->
        `,
        icon: 'info',
        confirmButtonText: 'Get Started',
        width: '600px'
    });
}