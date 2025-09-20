// Project Xerx - AI-Powered Secure Workspace
// Advanced JavaScript functionality with AI features

class ProjectXerx {
    constructor() {
        this.currentUser = null;
        this.files = [];
        this.notes = [];
        this.research = [];
        this.translations = [];
        this.currentWorkspace = 'files';
        this.isAuthenticated = false;
        this.securityLevel = 'standard';
        this.autoLockTimeout = 5; // minutes
        this.idleTimer = null;
        this.faceIdSupported = false;
        this.aiLanguage = 'en';
        this.searchIndex = null;

        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.checkFaceIdSupport();
        this.setupSecurityFeatures();
        this.setupIdleDetection();
        this.setupVisibilityDetection();
        this.preventCopyPaste();
        this.preventScreenshot();
    }

    setupEventListeners() {
        // Authentication
        document.getElementById('face-auth-btn').addEventListener('click', () => this.authenticateWithFaceId());
        document.getElementById('pin-auth-btn').addEventListener('click', () => this.showPinAuth());

        // Main app controls
        document.getElementById('upload-btn').addEventListener('click', () => this.toggleUploadZone());
        document.getElementById('profile-btn').addEventListener('click', () => this.showProfileModal());
        document.getElementById('security-btn').addEventListener('click', () => this.showSecurityModal());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // File operations
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileSelect(e));
        document.getElementById('upload-zone').addEventListener('click', () => this.openFileDialog());
        document.getElementById('upload-zone').addEventListener('dragover', (e) => this.handleDragOver(e));
        document.getElementById('upload-zone').addEventListener('drop', (e) => this.handleFileDrop(e));

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => this.handleSearch(e));

        // Folder navigation
        document.querySelectorAll('.folder-item').forEach(item => {
            item.addEventListener('click', () => this.switchFolder(item.dataset.folder));
        });

        // View controls
        document.getElementById('grid-view-btn').addEventListener('click', () => this.setViewMode('grid'));
        document.getElementById('list-view-btn').addEventListener('click', () => this.setViewMode('list'));

        // Modal controls
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // Window events
        window.addEventListener('beforeunload', () => this.cleanup());
        window.addEventListener('blur', () => this.handleWindowBlur());
        window.addEventListener('focus', () => this.handleWindowFocus());
    }

    // Face ID Authentication
    async checkFaceIdSupport() {
        if ('credentials' in navigator) {
            try {
                const availableCredentials = await navigator.credentials.get({password: true});
                this.faceIdSupported = true;
                document.getElementById('face-auth-btn').style.display = 'flex';
            } catch (error) {
                this.faceIdSupported = false;
                console.log('Face ID not supported');
            }
        }
    }

    async authenticateWithFaceId() {
        if (!this.faceIdSupported) {
            this.showAuthStatus('Face ID not supported on this device', 'error');
            return;
        }

        try {
            const credential = await navigator.credentials.get({
                password: true,
                mediation: 'conditional'
            });

            if (credential) {
                this.currentUser = 'User'; // In real app, get from credential
                this.completeAuthentication();
            } else {
                this.showAuthStatus('Authentication failed', 'error');
            }
        } catch (error) {
            this.showAuthStatus('Authentication error', 'error');
            console.error('Face ID error:', error);
        }
    }

    showPinAuth() {
        // Simple PIN authentication fallback
        const pin = prompt('Enter PIN (1234 for demo):');
        if (pin === '1234') {
            this.currentUser = 'User';
            this.completeAuthentication();
        } else {
            this.showAuthStatus('Invalid PIN', 'error');
        }
    }

    completeAuthentication() {
        this.isAuthenticated = true;
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('user-name').textContent = this.currentUser;
        this.showAuthStatus('Authentication successful!', 'success');
        this.startIdleTimer();
        this.loadUserFiles();
    }

    showAuthStatus(message, type) {
        const statusEl = document.getElementById('auth-status');
        statusEl.textContent = message;
        statusEl.className = `auth-status ${type}`;
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'auth-status';
        }, 3000);
    }

    // Security Features
    setupSecurityFeatures() {
        // Anti-screenshot protection
        this.preventScreenshot();

        // Anti-copy/paste protection
        this.preventCopyPaste();

        // Auto-close protection
        this.setupVisibilityDetection();
    }

    preventScreenshot() {
        const overlay = document.getElementById('screenshot-overlay');

        // Activate overlay on certain events
        const events = ['keydown', 'contextmenu', 'selectstart'];
        events.forEach(event => {
            document.addEventListener(event, () => {
                if (this.securityLevel === 'high' || this.securityLevel === 'maximum') {
                    overlay.classList.add('active');
                    setTimeout(() => overlay.classList.remove('active'), 1000);
                }
            });
        });

        // Print protection
        window.addEventListener('beforeprint', () => {
            overlay.classList.add('active');
        });

        window.addEventListener('afterprint', () => {
            overlay.classList.remove('active');
        });
    }

    preventCopyPaste() {
        const preventDefault = (e) => {
            if (this.securityLevel === 'maximum') {
                e.preventDefault();
                this.showNotification('Copy/paste disabled for security', 'warning');
            }
        };

        document.addEventListener('copy', preventDefault);
        document.addEventListener('paste', preventDefault);
        document.addEventListener('cut', preventDefault);
        document.addEventListener('contextmenu', (e) => {
            if (this.securityLevel === 'high' || this.securityLevel === 'maximum') {
                e.preventDefault();
                this.showNotification('Right-click disabled', 'warning');
            }
        });
    }

    setupIdleDetection() {
        const resetTimer = () => {
            if (this.idleTimer) clearTimeout(this.idleTimer);
            if (this.autoLockTimeout > 0) {
                this.idleTimer = setTimeout(() => {
                    this.autoClose();
                }, this.autoLockTimeout * 60 * 1000);
            }
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        resetTimer();
    }

    setupVisibilityDetection() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.securityLevel !== 'standard') {
                // App is hidden, activate security measures
                document.getElementById('screenshot-overlay').classList.add('active');
                if (this.securityLevel === 'maximum') {
                    setTimeout(() => this.autoClose(), 1000);
                }
            } else if (!document.hidden) {
                // App is visible again
                document.getElementById('screenshot-overlay').classList.remove('active');
            }
        });
    }

    autoClose() {
        if (this.securityLevel !== 'standard') {
            this.showNotification('Auto-closing for security', 'warning');
            setTimeout(() => {
                this.logout();
            }, 2000);
        }
    }

    handleWindowBlur() {
        if (this.securityLevel === 'maximum') {
            document.getElementById('screenshot-overlay').classList.add('active');
        }
    }

    handleWindowFocus() {
        document.getElementById('screenshot-overlay').classList.remove('active');
    }

    // File Upload System
    toggleUploadZone() {
        const uploadZone = document.getElementById('upload-zone');
        const fileGrid = document.getElementById('file-grid');

        if (uploadZone.classList.contains('hidden')) {
            uploadZone.classList.remove('hidden');
            fileGrid.classList.add('hidden');
        } else {
            uploadZone.classList.add('hidden');
            fileGrid.classList.remove('hidden');
        }
    }

    openFileDialog() {
        document.getElementById('file-input').click();
    }

    handleDragOver(e) {
        e.preventDefault();
        document.getElementById('upload-zone').classList.add('dragover');
    }

    handleFileDrop(e) {
        e.preventDefault();
        document.getElementById('upload-zone').classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        this.uploadFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.uploadFiles(files);
    }

    async uploadFiles(files) {
        this.showProgressModal();

        for (const file of files) {
            try {
                await this.uploadFile(file);
            } catch (error) {
                console.error('Upload error:', error);
                this.showNotification(`Failed to upload ${file.name}`, 'error');
            }
        }

        this.hideProgressModal();
        this.loadUserFiles();
    }

    async uploadFile(file) {
        return new Promise((resolve, reject) => {
            const chunkSize = 1024 * 1024; // 1MB chunks
            const totalChunks = Math.ceil(file.size / chunkSize);
            let uploadedChunks = 0;

            const uploadChunk = (start) => {
                const end = Math.min(start + chunkSize, file.size);
                const chunk = file.slice(start, end);

                // Simulate chunk upload
                setTimeout(() => {
                    uploadedChunks++;
                    const progress = (uploadedChunks / totalChunks) * 100;
                    this.updateUploadProgress(file.name, progress);

                    if (uploadedChunks < totalChunks) {
                        uploadChunk(end);
                    } else {
                        // File upload complete
                        this.addFile({
                            id: Date.now() + Math.random(),
                            name: file.name,
                            size: file.size,
                            type: this.getFileType(file.name),
                            uploadDate: new Date().toISOString(),
                            url: URL.createObjectURL(file)
                        });
                        resolve();
                    }
                }, 100); // Simulate network delay
            };

            uploadChunk(0);
        });
    }

    getFileType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
        if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(ext)) return 'video';
        if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext)) return 'audio';
        return 'document';
    }

    addFile(fileData) {
        this.files.push(fileData);
        this.updateStorageInfo();
    }

    updateUploadProgress(filename, progress) {
        document.getElementById('current-file').textContent = filename;
        document.getElementById('progress-percent').textContent = Math.round(progress) + '%';
        document.getElementById('upload-progress').style.width = progress + '%';
    }

    showProgressModal() {
        document.getElementById('progress-modal').classList.remove('hidden');
    }

    hideProgressModal() {
        document.getElementById('progress-modal').classList.add('hidden');
    }

    // File Management
    loadUserFiles() {
        this.renderFiles();
        this.updateStorageInfo();
    }

    renderFiles() {
        const container = document.getElementById('files-container');
        const filteredFiles = this.currentFolder === 'all'
            ? this.files
            : this.files.filter(file => file.type === this.currentFolder.slice(0, -1)); // Remove 's' from folder name

        container.innerHTML = '';

        if (filteredFiles.length === 0) {
            container.innerHTML = '<div class="no-files">No files in this folder</div>';
            return;
        }

        filteredFiles.forEach(file => {
            const fileElement = this.createFileElement(file);
            container.appendChild(fileElement);
        });
    }

    createFileElement(file) {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.dataset.id = file.id;

        const icon = this.getFileIcon(file.type);
        const size = this.formatFileSize(file.size);
        const date = new Date(file.date || file.uploadDate).toLocaleDateString();

        div.innerHTML = `
            <span class="file-icon">${icon}</span>
            <div class="file-name">${file.name}</div>
            <div class="file-size">${size}</div>
            <div class="file-date">${date}</div>
        `;

        div.addEventListener('click', () => this.openFile(file));
        div.addEventListener('contextmenu', (e) => this.showFileContextMenu(e, file));

        return div;
    }

    getFileIcon(type) {
        const icons = {
            image: '🖼️',
            video: '🎥',
            audio: '🎵',
            document: '📄'
        };
        return icons[type] || '📄';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    openFile(file) {
        if (file.type === 'image') {
            this.showImagePreview(file);
        } else {
            // For other file types, create download link
            const a = document.createElement('a');
            a.href = file.url;
            a.download = file.name;
            a.click();
        }
    }

    showImagePreview(file) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 90vw; max-height: 90vh;">
                <div class="modal-header">
                    <h3>${file.name}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body" style="text-align: center; padding: 20px;">
                    <img src="${file.url}" style="max-width: 100%; max-height: 70vh; object-fit: contain;">
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showFileContextMenu(e, file) {
        e.preventDefault();
        // Simple context menu implementation
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${e.pageX}px;
            top: ${e.pageY}px;
            background: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            padding: 5px 0;
        `;

        const options = [
            { label: 'Download', action: () => this.downloadFile(file) },
            { label: 'Delete', action: () => this.deleteFile(file) },
            { label: 'Properties', action: () => this.showFileProperties(file) }
        ];

        options.forEach(option => {
            const item = document.createElement('div');
            item.textContent = option.label;
            item.style.cssText = 'padding: 10px 15px; cursor: pointer;';
            item.addEventListener('click', () => {
                option.action();
                menu.remove();
            });
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = 'var(--surface-color)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'transparent';
            });
            menu.appendChild(item);
        });

        document.body.appendChild(menu);

        setTimeout(() => {
            document.addEventListener('click', () => menu.remove(), { once: true });
        }, 100);
    }

    downloadFile(file) {
        const a = document.createElement('a');
        a.href = file.url;
        a.download = file.name;
        a.click();
    }

    deleteFile(file) {
        if (confirm(`Delete ${file.name}?`)) {
            this.files = this.files.filter(f => f.id !== file.id);
            this.renderFiles();
            this.updateStorageInfo();
            this.showNotification('File deleted', 'success');
        }
    }

    showFileProperties(file) {
        alert(`File: ${file.name}\nSize: ${this.formatFileSize(file.size)}\nType: ${file.type}\nUploaded: ${new Date(file.uploadDate).toLocaleString()}`);
    }

    // Folder Management
    switchFolder(folder) {
        this.currentFolder = folder;
        document.querySelectorAll('.folder-item').forEach(item => {
            item.classList.toggle('active', item.dataset.folder === folder);
        });
        this.renderFiles();
    }

    // Search
    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const fileItems = document.querySelectorAll('.file-item');

        fileItems.forEach(item => {
            const fileName = item.querySelector('.file-name').textContent.toLowerCase();
            item.style.display = fileName.includes(query) ? 'block' : 'none';
        });
    }

    // View Modes
    setViewMode(mode) {
        document.getElementById('grid-view-btn').classList.toggle('active', mode === 'grid');
        document.getElementById('list-view-btn').classList.toggle('active', mode === 'list');

        const container = document.getElementById('files-container');
        if (mode === 'list') {
            container.style.gridTemplateColumns = '1fr';
            container.classList.add('list-view');
        } else {
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
            container.classList.remove('list-view');
        }
    }

    // Storage Info
    updateStorageInfo() {
        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        const usedPercent = 0; // Unlimited storage

        document.getElementById('storage-used').style.width = usedPercent + '%';
        document.getElementById('storage-text').textContent = `${this.formatFileSize(totalSize)} / Unlimited`;
    }

    // Profile Management
    showProfileModal() {
        document.getElementById('profile-modal').classList.remove('hidden');
        document.getElementById('profile-name').value = this.currentUser;
        document.getElementById('theme-select').value = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        document.getElementById('security-level').value = this.securityLevel;
        document.getElementById('auto-lock-timeout').value = this.autoLockTimeout;
    }

    saveProfile() {
        const name = document.getElementById('profile-name').value;
        const theme = document.getElementById('theme-select').value;
        const security = document.getElementById('security-level').value;
        const timeout = document.getElementById('auto-lock-timeout').value;

        this.currentUser = name;
        document.getElementById('user-name').textContent = name;

        // Apply theme
        document.body.classList.toggle('dark-theme', theme === 'dark');

        // Apply security settings
        this.securityLevel = security;
        this.autoLockTimeout = parseInt(timeout);

        this.closeModal('profile-modal');
        this.showNotification('Profile updated', 'success');
    }

    // Security Modal
    showSecurityModal() {
        document.getElementById('security-modal').classList.remove('hidden');

        // Update status indicators
        document.getElementById('screenshot-status').textContent =
            this.securityLevel === 'standard' ? 'Disabled' : 'Active';
        document.getElementById('copy-status').textContent =
            this.securityLevel === 'maximum' ? 'Active' : 'Disabled';
        document.getElementById('autoclose-status').textContent =
            this.securityLevel === 'standard' ? 'Disabled' : 'Active';
    }

    // Modal Management
    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Cleanup and Logout
    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.files = [];

        // Clear timers
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }

        // Show auth screen
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');

        // Reset forms
        document.getElementById('profile-name').value = '';
        document.getElementById('search-input').value = '';

        this.showNotification('Logged out successfully', 'success');
    }

    cleanup() {
        // Clean up object URLs to prevent memory leaks
        this.files.forEach(file => {
            if (file.url && file.url.startsWith('blob:')) {
                URL.revokeObjectURL(file.url);
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SecureFileApp();
});

// Global functions for modal controls
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function saveProfile() {
    window.app.saveProfile();
}
