# SKF IMAGES - AI-Powered Image Processing Tool

SKF IMAGES is a modern, web-based image processing tool that offers powerful features for image manipulation and optimization.

## Features

- **Image Compression**: Reduce file size while maintaining quality
- **Format Conversion**: Convert between multiple image formats (JPEG, PNG, WebP)
- **Background Removal**: AI-powered background removal using remove.bg API
- **Responsive Design**: Works seamlessly across all devices
- **Dark/Light Mode**: Customizable interface theme

## Technologies Used

- HTML5
- CSS3 with modern features (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript
- GSAP for animations
- Font Awesome for icons
- Remove.bg API for background removal

## Setup

1. Clone the repository
2. No build process required - it's a static website
3. Deploy to any static hosting service (GitHub Pages, Netlify, Vercel)

## Usage

1. Upload an image by dragging and dropping or using the file picker
2. Adjust compression level using the slider
3. Select output format (JPEG, PNG, or WebP)
4. Click "Process Image" to apply changes
5. Use "Remove Background" for AI-powered background removal

## API Keys

To use the background removal feature, you need to:
1. Get an API key from [remove.bg](https://www.remove.bg/api)
2. Replace the `REMOVE_BG_API_KEY` in `js/main.js`

## License

MIT License

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.