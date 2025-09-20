# Secure File Upload Application

A comprehensive secure file upload application with Face ID authentication and advanced security features.

## Features

### 🔐 Authentication
- **Face ID Authentication**: Uses Web Authentication API for biometric authentication
- **PIN Fallback**: Alternative PIN authentication for devices without Face ID
- **Session Management**: Secure session handling with auto-logout

### 📁 File Management
- **Unlimited File Size**: Chunked upload system supports files of any size
- **Drag & Drop**: Intuitive drag-and-drop file upload interface
- **File Organization**: Organize files by type (Documents, Images, Videos, Audio)
- **Search Functionality**: Real-time file search
- **Multiple Views**: Grid and list view modes

### 🛡️ Security Features
- **Anti-Screenshot Protection**: Visual overlay prevents screenshot capture
- **Anti-Copy/Paste Protection**: Prevents copying sensitive content
- **Auto-Close Protection**: Automatically closes on unauthorized access
- **Idle Timeout**: Configurable auto-lock after inactivity
- **Security Levels**: Standard, High, and Maximum security modes

### 🎨 User Experience
- **Profile Customization**: Customizable themes and user preferences
- **Mobile Responsive**: Optimized for mobile devices
- **Real-time Progress**: Upload progress tracking with speed indicators
- **Storage Information**: Visual storage usage display

## Getting Started

### Prerequisites
- Modern web browser with Web Authentication API support
- Local web server (for file protocol limitations)

### Running the Application

1. **Using Python (if available)**:
   ```bash
   python -m http.server 8000
   ```

2. **Using Node.js (if available)**:
   ```bash
   npx http-server
   ```

3. **Using PHP (if available)**:
   ```bash
   php -S localhost:8000
   ```

4. **Or simply open `index.html` in your browser** (some features may be limited due to CORS restrictions)

### Accessing the Application
Open your browser and navigate to `http://localhost:8000` (or the appropriate port)

## Usage

### Authentication
1. Click "Face ID Authentication" for biometric authentication
2. Or use "PIN Authentication" and enter `1234` for demo purposes

### File Upload
1. Click the "Upload" button or drag files to the upload zone
2. Files will be uploaded in chunks with progress tracking
3. Uploaded files appear in the file grid

### Security Features
- **Anti-screenshot**: Activated on security events
- **Anti-copy**: Prevents copying in high/maximum security modes
- **Auto-close**: Monitors for unauthorized access attempts

### Profile Settings
1. Click the profile icon (👤) in the header
2. Customize your name, theme, security level, and auto-lock timeout
3. Changes are applied immediately

## Security Levels

- **Standard**: Basic protection, no anti-copy or auto-close
- **High**: Anti-screenshot and auto-close protection
- **Maximum**: All security features including anti-copy protection

## Browser Compatibility

### Required Features
- Web Authentication API (for Face ID)
- File API (for file uploads)
- Drag and Drop API
- Local Storage (for preferences)

### Supported Browsers
- Chrome 67+
- Firefox 60+
- Safari 14+
- Edge 79+

## File Structure

```
├── index.html          # Main application HTML
├── styles.css          # Application styles and security features
├── app.js             # Main JavaScript functionality
└── README.md          # This documentation
```

## Technical Implementation

### Face ID Authentication
Uses the Web Authentication API to provide biometric authentication:
```javascript
const credential = await navigator.credentials.get({
    password: true,
    mediation: 'conditional'
});
```

### Chunked File Upload
Implements chunked uploads for unlimited file sizes:
```javascript
const chunkSize = 1024 * 1024; // 1MB chunks
const totalChunks = Math.ceil(file.size / chunkSize);
```

### Security Features
- Screenshot protection using CSS overlays
- Copy/paste prevention using event listeners
- Visibility change detection for auto-close
- Idle timeout management

## Demo Credentials

- **PIN**: `1234`
- **Test Files**: Upload any files to see the system in action
- **Security Testing**: Try taking screenshots or copying content to see protection

## Troubleshooting

### Face ID Not Working
- Ensure HTTPS is used (required for Web Authentication API)
- Check browser compatibility
- Try the PIN authentication fallback

### File Upload Issues
- Check browser console for errors
- Ensure sufficient disk space
- Try smaller files if chunking fails

### Security Features Not Working
- Some features require a secure context (HTTPS)
- Check security level settings in profile
- Ensure JavaScript is enabled

## Contributing

This is a demo application showcasing security features. For production use:
1. Implement proper server-side authentication
2. Add file encryption at rest
3. Implement user management system
4. Add database storage for files and metadata
5. Implement proper session management

## License

This project is for demonstration purposes only.
