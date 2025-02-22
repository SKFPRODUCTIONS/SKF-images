// API Keys
const REMOVE_BG_API_KEY = 'XKH7bcTPxbTBxhKcxu9JKPgy';

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
const imageEditor = document.getElementById('imageEditor');
const compressionLevel = document.getElementById('compressionLevel');
const compressionValue = document.getElementById('compressionValue');
const formatSelect = document.getElementById('formatSelect');
const qualityButtons = document.querySelectorAll('.quality-btn');
const removeBackgroundBtn = document.getElementById('removeBackground');
const processButton = document.getElementById('processButton');
const themeToggle = document.getElementById('themeToggle');
const zoomButtons = document.querySelectorAll('.zoom-btn');

// State
let currentFile = null;
let currentZoom = 1;
let isProcessing = false;

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-sun');
    icon.classList.toggle('fa-moon');
});

// File Upload Handlers
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFileUpload(file);
    }
});

dropZone.querySelector('.upload-btn').addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
});

// Image Processing Functions
async function handleFileUpload(file) {
    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        imageEditor.classList.remove('hidden');
        gsap.from(imageEditor, {
            opacity: 0,
            y: -20,
            duration: 0.5
        });
        // Add smooth scrolling to image editor section
        imageEditor.scrollIntoView({ behavior: 'smooth' });
    };
    reader.readAsDataURL(file);
}

// Add download functionality to background removal
async function removeBackground() {
    if (!currentFile || isProcessing) return;
    isProcessing = true;
    removeBackgroundBtn.disabled = true;
    removeBackgroundBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
        const formData = new FormData();
        formData.append('image_file', currentFile);

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': REMOVE_BG_API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors?.[0]?.title || 'Background removal failed');
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        // Create a new image to verify the blob loads correctly
        const img = new Image();
        img.onload = () => {
            previewImage.src = objectUrl;
            currentFile = new File([blob], 'removed-bg.png', { type: 'image/png' });
            
            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.href = objectUrl;
            downloadLink.download = 'removed-bg.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };
        img.onerror = () => {
            throw new Error('Failed to load processed image');
        };
        img.src = objectUrl;
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to remove background. Please try again.');
    } finally {
        isProcessing = false;
        removeBackgroundBtn.disabled = false;
        removeBackgroundBtn.innerHTML = '<i class="fas fa-magic"></i> Remove Background';
    }
}

// UI Controls
compressionLevel.addEventListener('input', (e) => {
    compressionValue.textContent = `${e.target.value}%`;
    if (currentFile) {
        applyImageProcessing();
    }
});

formatSelect.addEventListener('change', () => {
    if (currentFile) {
        applyImageProcessing();
    }
});

async function applyImageProcessing() {
    if (!currentFile || isProcessing) return;
    isProcessing = true;
    processButton.disabled = true;
    processButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    try {
        const compression = compressionLevel.value / 100;
        const format = formatSelect.value;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        await new Promise((resolve, reject) => {
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const objectUrl = URL.createObjectURL(blob);
                            previewImage.src = objectUrl;
                            currentFile = new File([blob], `processed.${format}`, { type: `image/${format}` });
                            
                            // Create download link
                            const downloadLink = document.createElement('a');
                            downloadLink.href = objectUrl;
                            downloadLink.download = `processed.${format}`;
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                            resolve();
                        } else {
                            reject(new Error('Failed to process image'));
                        }
                    },
                    `image/${format}`,
                    compression
                );
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(currentFile);
        });
    } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image. Please try again.');
    } finally {
        isProcessing = false;
        processButton.disabled = false;
        processButton.innerHTML = '<i class="fas fa-magic"></i> Process Image';
    }
}

qualityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        qualityButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
    });
});

zoomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentZoom = parseFloat(btn.dataset.zoom);
        previewImage.style.transform = `scale(${currentZoom})`;
    });
});

removeBackgroundBtn.addEventListener('click', removeBackground);
// Update event listener for upscale button
processButton.removeEventListener('click', upscaleImage);
processButton.addEventListener('click', applyImageProcessing);

// Add separate upscale button event listener
const upscaleButton = document.getElementById('upscaleButton');
if (upscaleButton) {
    upscaleButton.addEventListener('click', upscaleImage);
}