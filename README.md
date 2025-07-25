# My New App

This is a new application created with Vite and React.

## Project Structure

- `src/`: Contains the source code for the application.
  - `App.jsx`: Main application component.
  - `main.js`: Entry point for the main process (Electron).
  - `preload.js`: Preload script for Electron.
  - `renderer.jsx`: Entry point for the renderer process (React).
  - `SideContent/`: Components related to side content, e.g., `FileExplorer.jsx`.
  - `components/`: Reusable UI components.
  - `index.css`: Global styles.
- `public/`: Static assets.
- `forge.config.js`: Electron Forge configuration.
- `vite.main.config.mjs`, `vite.preload.config.mjs`, `vite.renderer.config.mjs`: Vite configurations for different Electron processes.

## Getting Started

To run this project locally, follow these steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Build the application:**
   ```bash
   npm run make
   ```

## Features

- **File Explorer:** Browse and manage files within the application.
- **Code Editor:** (If applicable) Edit code directly within the application.
- **Live Reload:** Development server with hot module replacement.

## Technologies Used

- React
- Vite
- Electron
- Electron Forge

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

This project is licensed under the MIT License.