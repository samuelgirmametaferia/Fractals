// fractals/newton.js

// Initialize CodeMirror Editor
const newtonEditor = CodeMirror.fromTextArea(document.getElementById('newton-shader'), {
    mode: 'x-shader/x-fragment',
    theme: 'material-darker',
    lineNumbers: true,
    tabSize: 4,
    autoCloseBrackets: true,
    matchBrackets: true,
    autofocus: true,
    viewportMargin: Infinity // Allows CodeMirror to auto-resize vertically
});

// Set editor size to fill the sidebar
newtonEditor.setSize('100%', '100%');

// Initialize Three.js Scene
const newtonContainer = document.getElementById('newton-container');
const newtonScene = new THREE.Scene();

// Orthographic Camera
const newtonCamera = new THREE.OrthographicCamera(
    newtonContainer.clientWidth / -2, newtonContainer.clientWidth / 2,
    newtonContainer.clientHeight / 2, newtonContainer.clientHeight / -2,
    1, 1000
);
newtonCamera.position.z = 1;

// Renderer
const newtonRenderer = new THREE.WebGLRenderer({ antialias: true });
newtonRenderer.setSize(newtonContainer.clientWidth, newtonContainer.clientHeight);
newtonContainer.appendChild(newtonRenderer.domElement);

/**
 * Creates a ShaderMaterial using the provided fragment shader code.
 * @param {string} fragmentShaderCode - The GLSL code for the fragment shader.
 * @returns {THREE.ShaderMaterial} - The created shader material.
 */
function createNewtonMaterial(fragmentShaderCode) {
    return new THREE.ShaderMaterial({
        uniforms: {
            resolution: { value: new THREE.Vector2(newtonContainer.clientWidth, newtonContainer.clientHeight) },
            zoom: { value: 1.0 },
            offset: { value: new THREE.Vector2(0.0, 0.0) },
            maxIterations: { value: 100.0 }
        },
        fragmentShader: fragmentShaderCode
    });
}

// Initialize Shader Material with Default Shader Code
let newtonMaterial = createNewtonMaterial(newtonEditor.getValue());

// Create Plane Geometry
let newtonPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(newtonContainer.clientWidth, newtonContainer.clientHeight),
    newtonMaterial
);
newtonScene.add(newtonPlane);

// Handle Window Resize
window.addEventListener('resize', () => {
    newtonRenderer.setSize(newtonContainer.clientWidth, newtonContainer.clientHeight);
    newtonCamera.left = newtonContainer.clientWidth / -2;
    newtonCamera.right = newtonContainer.clientWidth / 2;
    newtonCamera.top = newtonContainer.clientHeight / 2;
    newtonCamera.bottom = newtonContainer.clientHeight / -2;
    newtonCamera.updateProjectionMatrix();

    newtonMaterial.uniforms.resolution.value.x = newtonContainer.clientWidth;
    newtonMaterial.uniforms.resolution.value.y = newtonContainer.clientHeight;
    newtonPlane.geometry = new THREE.PlaneGeometry(newtonContainer.clientWidth, newtonContainer.clientHeight);
});

// Variables for Zoom and Pan
let zoomN = 1.0;
let offsetN = { x: 0.0, y: 0.0 };
let isDraggingN = false;
let previousMousePositionN = { x: 0, y: 0 };

// Handle Zoom (Mouse Wheel)
newtonContainer.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
        zoomN *= 1.1;
    } else {
        zoomN /= 1.1;
    }
    newtonMaterial.uniforms.zoom.value = zoomN;
    showTooltip("Zoom Level Adjusted", "Use the mouse wheel to zoom in and out.", event);
}, { passive: false });

// Handle Panning (Mouse Drag)
newtonContainer.addEventListener('mousedown', (event) => {
    isDraggingN = true;
    previousMousePositionN.x = event.clientX;
    previousMousePositionN.y = event.clientY;
});

newtonContainer.addEventListener('mousemove', (event) => {
    if (isDraggingN) {
        const deltaX = (event.clientX - previousMousePositionN.x) / newtonContainer.clientWidth * 2.0 / zoomN;
        const deltaY = (event.clientY - previousMousePositionN.y) / newtonContainer.clientHeight * 2.0 / zoomN;
        offsetN.x -= deltaX;
        offsetN.y += deltaY;
        newtonMaterial.uniforms.offset.value.x = offsetN.x;
        newtonMaterial.uniforms.offset.value.y = offsetN.y;
        previousMousePositionN.x = event.clientX;
        previousMousePositionN.y = event.clientY;
        showTooltip("Panning", "Click and drag to move around the fractal.", event);
    }
});

newtonContainer.addEventListener('mouseup', () => {
    isDraggingN = false;
});

newtonContainer.addEventListener('mouseleave', () => {
    isDraggingN = false;
});

// Render Loop
function animateNewton() {
    requestAnimationFrame(animateNewton);
    newtonRenderer.render(newtonScene, newtonCamera);
}

animateNewton();

// Run Shader Button Functionality
document.getElementById('run-newton').addEventListener('click', () => {
    const newFragmentShader = newtonEditor.getValue();
    try {
        // Create a new ShaderMaterial with the edited shader code
        const newMaterial = createNewtonMaterial(newFragmentShader);

        // Replace the old material with the new one
        newtonPlane.material.dispose(); // Dispose of the old material
        newtonPlane.material = newMaterial;
        newtonMaterial = newMaterial;

        showTooltip("Shader Updated", "Your changes have been applied successfully!", { pageX: 100, pageY: 100 });
    } catch (error) {
        console.error("Error compiling shader:", error);
        showTooltip("Shader Compilation Error", "Please check the console for details.", { pageX: 100, pageY: 100 });
    }
});

// Back Button Functionality
document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = '../index.html'; // Navigates back to the main menu
});