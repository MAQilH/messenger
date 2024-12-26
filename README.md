# Messenger Project

This repository contains a fully functional messenger application split into three main components:

1. **Server**: The backend of the application (`server-messenger`).
2. **Client (Pure JavaScript)**: A front-end built with HTML, CSS, and JavaScript (`client-messenger`).
3. **Client (React)**: An alternative front-end built with React (`clientr-messenger`).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
  - [Server Setup](#server-setup)
  - [Client (Pure JavaScript) Setup](#client-pure-javascript-setup)
  - [Client (React) Setup](#client-react-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

This messenger application is designed to showcase the development of a complete messaging platform, featuring real-time communication and user-friendly interfaces. The project is divided into three repositories to provide flexibility in exploring different technologies for building the front-end.

## Features

- **Server**
  - Real-time communication using WebSockets.
  - Authentication and user management.
  - RESTful APIs for message handling.

- **Client (Pure JavaScript)**
  - Lightweight and fast front-end.
  - Responsive design with HTML and CSS.
  - Supports core messaging features.

- **Client (React)**
  - Modern and dynamic front-end using React.
  - Component-based architecture for scalability.
  - Enhanced user experience with advanced features.

## Installation

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js
- npm or yarn
- A modern web browser

### Server Setup

1. Navigate to the `server-messenger` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. The server will run on `http://localhost:3000` by default.

### Client (Pure JavaScript) Setup

1. Navigate to the `client-messenger` directory.
2. No build steps are required; simply open `index.html` in a browser.

### Client (React) Setup

1. Navigate to the `clientr-messenger` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. Access the application in your browser at `http://localhost:3000`.

## Usage

1. Start the server and one of the client applications (Pure JavaScript or React).
2. Open the client application in your browser.
3. Sign up or log in to access the messenger.
4. Start sending and receiving messages in real-time.

## Project Structure

```plaintext
messenger/
├── server-messenger/
│   ├── src/
│   ├── package.json
│   └── ...
├── client-messenger/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── ...
├── clientr-messenger/
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear and descriptive messages.
4. Push your changes to your fork.
5. Open a pull request to the main repository.

## License

This project is licensed under the [MIT License](./LICENSE).

---

Feel free to explore and improve the project. Your feedback is highly appreciated!

