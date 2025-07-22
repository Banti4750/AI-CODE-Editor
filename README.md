# My New App

This is an Electron application built with React and Vite.

## Setup

To set up the project, navigate to the `my-new-app` directory and install the dependencies:

```bash
npm install
```

## Running the Application

To run the application in development mode:

```bash
npm start
```

## Project Structure

```
my-new-app/
├── .gitignore
├── forge.config.js
├── index.html
├── package.json
├── src/
│   ├── App.jsx
│   ├── SideContent/
│   ├── components/
│   ├── index.css
│   ├── main.js
│   ├── preload.js
│   └── renderer.jsx
├── vite.main.config.mjs
├── vite.preload.config.mjs
└── vite.renderer.config.mjs
```

## Running the Application

To package the application for distribution:

```bash
npm run package
```

To make a distributable application:

```bash
npm run make
```