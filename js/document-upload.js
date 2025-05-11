/**
 * Document Upload System
 * Handles uploading and managing lab reports for verification
 */

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// File type icons
const FILE_TYPE_ICONS = {
    'application/pdf': 'fa-file-pdf',
    'image/jpeg': 'fa-file-image',
    'image/png': 'fa-file-image',
    'image/jpg': 'fa-file-image',
    'application/msword': 'fa-file-word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa-file-word',
    'default': 'fa-file-alt'
};

// Store uploaded files
let uploadedFiles = [];

/**
 * Initialize the document upload system
 */
function initDocumentUpload() {
    console.log('Initializing document upload system...');
    
    // Check if we're on the parameters page
    const uploadSection = document.getElementById('document-upload-section');
    if (uploadSection) {
        setupDocumentUploadListeners();
    }
    
    // Check if we're on the dashboard page
    const profileSection = document.getElementById('profile');
    if (profileSection) {
        displayCertificationStatus();
    }
}

/**
 * Set up event listeners for document upload
 */
function setupDocumentUploadListeners() {
    const uploadArea = document.getElementById('document-upload-area');
    const fileInput = document.getElementById('document-upload-input');
    const previewContainer = document.getElementById('document-preview-container');
    
    if (!uploadArea || !fileInput || !previewContainer) {
        console.error('Document upload elements not found');
        return;
    }
    
    // Load any previously uploaded files
    loadUploadedFiles();
    
    // Handle file input change
    fileInput.addEventListener('change', handleFileSelection);
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Handle clear all button
    const clearBtn = document.getElementById('document-clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFiles);
    }
}

/**
 * Handle file input selection
 * @param {Event} event - The change event
 */
function handleFileSelection(event) {
    const files = event.target.files;
    if (files.length > 0) {
        handleFiles(files);
    }
}

/**
 * Handle files (validation and preview)
 * @param {FileList} files - The files to handle
 */
function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        if (!validateFile(file)) {
            continue;
        }
        
        // Add file to uploaded files
        addFile(file);
    }
    
    // Reset file input
    const fileInput = document.getElementById('document-upload-input');
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Update preview
    updateFilePreview();
    
    // Save uploaded files
    saveUploadedFiles();
}

/**
 * Validate file (type and size)
 * @param {File} file - The file to validate
 * @returns {Boolean} True if file is valid
 */
function validateFile(file) {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert(`File type not allowed: ${file.type}. Please upload PDF, Word, or image files.`);
        return false;
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        alert(`File too large: ${formatFileSize(file.size)}. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
        return false;
    }
    
    return true;
}

/**
 * Add file to uploaded files
 * @param {File} file - The file to add
 */
function addFile(file) {
    // Create a unique ID for the file
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create file object
    const fileObj = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        // Convert file to data URL for storage
        dataUrl: null
    };
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        fileObj.dataUrl = e.target.result;
        
        // Update uploaded files
        uploadedFiles.push(fileObj);
        
        // Update preview
        updateFilePreview();
        
        // Save uploaded files
        saveUploadedFiles();
    };
    reader.readAsDataURL(file);
}

/**
 * Update file preview
 */
function updateFilePreview() {
    const previewContainer = document.getElementById('document-preview-container');
    if (!previewContainer) return;
    
    // Clear preview container
    previewContainer.innerHTML = '';
    
    // Add file previews
    uploadedFiles.forEach(file => {
        const previewItem = createFilePreviewItem(file);
        previewContainer.appendChild(previewItem);
    });
    
    // Show/hide preview container
    previewContainer.style.display = uploadedFiles.length > 0 ? 'grid' : 'none';
    
    // Update clear button
    const clearBtn = document.getElementById('document-clear-btn');
    if (clearBtn) {
        clearBtn.style.display = uploadedFiles.length > 0 ? 'flex' : 'none';
    }
}

/**
 * Create file preview item
 * @param {Object} file - The file object
 * @returns {HTMLElement} The preview item element
 */
function createFilePreviewItem(file) {
    const previewItem = document.createElement('div');
    previewItem.className = 'document-preview-item';
    previewItem.dataset.fileId = file.id;
    
    // Create header
    const header = document.createElement('div');
    header.className = 'document-preview-header';
    
    // Create title
    const title = document.createElement('div');
    title.className = 'document-preview-title';
    title.title = file.name;
    title.textContent = file.name;
    header.appendChild(title);
    
    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'document-preview-remove';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', () => removeFile(file.id));
    header.appendChild(removeBtn);
    
    previewItem.appendChild(header);
    
    // Create content
    const content = document.createElement('div');
    content.className = 'document-preview-content';
    
    // Create icon
    const icon = document.createElement('div');
    icon.className = 'document-preview-icon';
    icon.innerHTML = `<i class="fas ${FILE_TYPE_ICONS[file.type] || FILE_TYPE_ICONS.default}"></i>`;
    content.appendChild(icon);
    
    // Create info
    const info = document.createElement('div');
    info.className = 'document-preview-info';
    info.textContent = getFileTypeLabel(file.type);
    content.appendChild(info);
    
    // Create size
    const size = document.createElement('div');
    size.className = 'document-preview-size';
    size.textContent = formatFileSize(file.size);
    content.appendChild(size);
    
    previewItem.appendChild(content);
    
    return previewItem;
}

/**
 * Remove file
 * @param {String} fileId - The file ID to remove
 */
function removeFile(fileId) {
    // Find file index
    const fileIndex = uploadedFiles.findIndex(file => file.id === fileId);
    
    if (fileIndex !== -1) {
        // Remove file
        uploadedFiles.splice(fileIndex, 1);
        
        // Update preview
        updateFilePreview();
        
        // Save uploaded files
        saveUploadedFiles();
    }
}

/**
 * Clear all files
 */
function clearAllFiles() {
    // Clear uploaded files
    uploadedFiles = [];
    
    // Update preview
    updateFilePreview();
    
    // Save uploaded files
    saveUploadedFiles();
}

/**
 * Save uploaded files to localStorage
 */
function saveUploadedFiles() {
    try {
        // Create a simplified version of the files for storage
        const filesForStorage = uploadedFiles.map(file => ({
            id: file.id,
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            dataUrl: file.dataUrl
        }));
        
        // Save to localStorage
        localStorage.setItem('uploadedLabReports', JSON.stringify(filesForStorage));
        
        // Update certification status
        updateCertificationStatus();
        
        console.log(`Saved ${filesForStorage.length} files to localStorage`);
    } catch (error) {
        console.error('Error saving uploaded files:', error);
    }
}

/**
 * Load uploaded files from localStorage
 */
function loadUploadedFiles() {
    try {
        // Get files from localStorage
        const filesStr = localStorage.getItem('uploadedLabReports');
        
        if (filesStr) {
            // Parse files
            const files = JSON.parse(filesStr);
            
            // Set uploaded files
            uploadedFiles = files;
            
            // Update preview
            updateFilePreview();
            
            console.log(`Loaded ${files.length} files from localStorage`);
        }
    } catch (error) {
        console.error('Error loading uploaded files:', error);
    }
}

/**
 * Update certification status
 */
function updateCertificationStatus() {
    try {
        // Check if we have uploaded files
        const hasCertification = uploadedFiles.length > 0;
        
        // Save certification status
        localStorage.setItem('isCertified', hasCertification.toString());
        
        console.log(`Updated certification status: ${hasCertification}`);
    } catch (error) {
        console.error('Error updating certification status:', error);
    }
}

/**
 * Display certification status in the dashboard
 */
function displayCertificationStatus() {
    try {
        // Check if certified
        const isCertified = localStorage.getItem('isCertified') === 'true';
        
        if (isCertified) {
            console.log('Farmer is certified, displaying badge');
            
            // Add to profile badges
            const badgesContainer = document.querySelector('.profile-badges');
            if (badgesContainer) {
                // Check if badge already exists
                const existingBadge = badgesContainer.querySelector('.profile-certified-badge');
                if (!existingBadge) {
                    // Create badge
                    const badge = document.createElement('div');
                    badge.className = 'profile-certified-badge';
                    badge.innerHTML = '<i class="fas fa-certificate"></i> Certified';
                    
                    // Add to badges container
                    badgesContainer.appendChild(badge);
                }
            }
            
            // Add to dashboard farm badges
            const dashboardBadges = document.getElementById('dashboard-farm-badges');
            if (dashboardBadges) {
                // Check if badge already exists
                const existingBadge = dashboardBadges.querySelector('.certified-badge');
                if (!existingBadge) {
                    // Create badge
                    const badge = document.createElement('div');
                    badge.className = 'certified-badge';
                    badge.innerHTML = '<i class="fas fa-certificate"></i> Lab Verified Farmer';
                    
                    // Add to badges container
                    dashboardBadges.appendChild(badge);
                }
            }
            
            // Add to profile details grid
            const profileGrid = document.getElementById('profile-details-grid');
            if (profileGrid) {
                // Check if item already exists
                const existingItem = profileGrid.querySelector('.profile-item[data-type="certification"]');
                if (!existingItem) {
                    // Create item
                    const item = document.createElement('div');
                    item.className = 'profile-item';
                    item.setAttribute('data-type', 'certification');
                    
                    // Create label
                    const label = document.createElement('div');
                    label.className = 'profile-item-label';
                    label.textContent = 'Certification';
                    item.appendChild(label);
                    
                    // Create value
                    const value = document.createElement('div');
                    value.className = 'profile-item-value';
                    
                    // Create badge
                    const badge = document.createElement('span');
                    badge.className = 'verification-badge verified';
                    badge.innerHTML = '<i class="fas fa-certificate"></i> Lab Verified';
                    
                    value.appendChild(badge);
                    item.appendChild(value);
                    
                    // Add to grid
                    profileGrid.appendChild(item);
                }
            }
        }
    } catch (error) {
        console.error('Error displaying certification status:', error);
    }
}

/**
 * Get file type label
 * @param {String} fileType - The file MIME type
 * @returns {String} The file type label
 */
function getFileTypeLabel(fileType) {
    switch (fileType) {
        case 'application/pdf':
            return 'PDF Document';
        case 'image/jpeg':
        case 'image/png':
        case 'image/jpg':
            return 'Image';
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'Word Document';
        default:
            return 'Document';
    }
}

/**
 * Format file size
 * @param {Number} bytes - The file size in bytes
 * @returns {String} The formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initDocumentUpload);
