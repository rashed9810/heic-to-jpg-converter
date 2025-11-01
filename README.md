<div align="center">

#  HEIC to JPG Converter

<p align="center">
  <img src="https://img.shields.io/badge/HEIC%20to%20JPG-Converter-0ea5e9?style=for-the-badge" alt="HEIC to JPG Converter"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Pillow-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Pillow"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"/>
</p>

<h3 align="center">A modern, elegant web application for converting HEIC/HEIF images to JPG format</h3>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-technologies">Technologies</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-license">License</a>
</p>

</div>

---

##  Overview

This full stack web application provides an ideal solution for converting HEIC/HEIF images (commonly used by Apple devices) to the universally compatible JPG format. Built with modern technologies including React, FastAPI, and Tailwind CSS, it offers a beautiful user interface with advanced image processing capabilities.

##  Features

<div align="center">
<table>
  <tr>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/48/upload-to-cloud.png" width="48" height="48" alt="Upload"/><br />
      <b>Easy Upload</b><br />
      <sub>Drag and drop or select HEIC/HEIF images with automatic interface</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/48/settings.png" width="48" height="48" alt="Advanced Options"/><br />
      <b>Advanced Options</b><br />
      <sub>Control quality, resize, and rotate images with precision</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/48/visible.png" width="48" height="48" alt="Live Preview"/><br />
      <b>Live Preview</b><br />
      <sub>See your converted image before downloading</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/48/combo-chart.png" width="48" height="48" alt="Stats"/><br />
      <b>Conversion Stats</b><br />
      <sub>View file size reduction and conversion time</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/48/responsive.png" width="48" height="48" alt="Responsive"/><br />
      <b>Responsive Design</b><br />
      <sub>Works perfectly on desktop and mobile devices</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/48/security-checked.png" width="48" height="48" alt="Secure"/><br />
      <b>Secure Processing</b><br />
      <sub>Files are processed locally and not stored permanently</sub>
    </td>
  </tr>
</table>
</div>

##  Demo

<div align="center">

###  User Interface

<img src="https://via.placeholder.com/800x450.png?text=HEIC+to+JPG+Converter+Screenshot" alt="HEIC to JPG Converter Screenshot" width="80%"/>

###  Conversion Process

1. **Upload** - Drag & drop your HEIC file
2. **Configure** - Adjust quality and other settings
3. **Convert** - Process with one click
4. **Download** - Get your JPG instantly

</div>

##  Architecture

<div align="center">
<img src="https://via.placeholder.com/800x400.png?text=HEIC+to+JPG+Converter+Architecture" alt="Architecture Diagram" width="80%"/>
</div>

This application follows a modern client-server architecture with a clear separation of concerns:

- **Frontend**: React.js application with component-based UI and state management
- **Backend**: FastAPI server providing RESTful endpoints for image processing
- **Communication**: HTTP/JSON for data exchange between frontend and backend
- **Image Processing**: Specialized libraries for efficient HEIC to JPG conversion

### Project Structure

```
├── backend/               # Python FastAPI backend
│   ├── minimal_server.py  # Enhanced FastAPI server with HEIC support
│   ├── requirements.txt   # Python dependencies
│   └── temp/              # Temporary file storage
│
├── frontend/              # React.js frontend
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # React components (Header, FileUploader, etc.)
│   │   ├── utils/         # Utility functions (API, file handling)
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # Entry point
│   ├── index.html         # HTML template
│   ├── package.json       # Node.js dependencies
│   └── tailwind.config.js # Tailwind CSS configuration
│
├── .gitignore             # Git ignore file
├── README.md              # Project documentation
└── run-app.ps1            # PowerShell script to run the application
```

##  Getting Started

<div align="center">
<img src="https://img.icons8.com/fluency/96/rocket.png" width="96" height="96" alt="Rocket"/>
</div>

### Prerequisites

<table>
  <tr>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/color/48/nodejs.png" width="48" height="48" alt="Node.js"/><br />
      <b>Node.js</b><br />
      <sub>v14 or later</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/color/48/python.png" width="48" height="48" alt="Python"/><br />
      <b>Python</b><br />
      <sub>v3.8 or later</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/color/48/npm.png" width="48" height="48" alt="npm"/><br />
      <b>npm</b><br />
      <sub>Latest version</sub>
    </td>
  </tr>
</table>

### Quick Start

The easiest way to get started is using the provided PowerShell script:

```powershell
.\run-app.ps1
```

This script will:

1. Start the backend server on port 8000
2. Start the frontend development server on port 5173
3. Open the application in your default browser

### Manual Setup

#### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install required packages
pip install pillow fastapi uvicorn python-multipart pillow-heif

# Run the server
python -m uvicorn minimal_server:app --host 0.0.0.0 --port 8000
```

The backend server will run at http://localhost:8000

#### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will run at http://localhost:5173

##  How to Use

<div align="center">
<img src="https://img.icons8.com/fluency/96/user-manual.png" width="96" height="96" alt="User Manual"/>
</div>

### Step-by-Step Guide

1. **Upload an Image**

   - Click on the upload area or drag and drop a HEIC/HEIF image
   - The application will display the file information

2. **Configure Options** (Optional)

   - Open the "Conversion Options" panel
   - Adjust JPEG quality (1-100)
   - Enable resizing and set custom dimensions
   - Apply rotation if needed

3. **Convert the Image**

   - Click the "Convert to JPG" button
   - The application will process your image

4. **View and Download**
   - Preview the converted image
   - See conversion statistics (original size, converted size, compression ratio)
   - Click the "Download JPG" button to save the image

##  API Endpoints

The backend provides the following RESTful endpoints:

| Endpoint                      | Method | Description                |
| ----------------------------- | ------ | -------------------------- |
| `/api/health`                 | GET    | Check API health           |
| `/api/v1/convert`             | POST   | Convert HEIC/HEIF to JPG   |
| `/api/v1/download/{filename}` | GET    | Download a converted image |

##  Technologies

<div align="center">
<table>
  <tr>
    <th>Frontend</th>
    <th>Backend</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li><b>React.js</b> - UI library</li>
        <li><b>Tailwind CSS</b> - Utility-first CSS framework</li>
        <li><b>Framer Motion</b> - Animation library</li>
        <li><b>React Dropzone</b> - File upload component</li>
        <li><b>Axios</b> - HTTP client</li>
        <li><b>React Toastify</b> - Toast notifications</li>
      </ul>
    </td>
    <td>
      <ul>
        <li><b>Python</b> - Programming language</li>
        <li><b>FastAPI</b> - Web framework</li>
        <li><b>Pydantic</b> - Data validation</li>
        <li><b>Pillow-HEIF</b> - HEIC/HEIF image processing</li>
        <li><b>Pillow</b> - Image manipulation</li>
        <li><b>Uvicorn</b> - ASGI server</li>
      </ul>
    </td>
  </tr>
</table>
</div>

##  Key Features Implementation

### HEIC to JPG Conversion

The core functionality uses `pillow-heif` to handle HEIC files and convert them to JPG format:

```python
# Register HEIF opener with Pillow
pillow_heif.register_heif_opener()

# Open HEIC file with Pillow
with Image.open(input_path) as img:
    # Convert to RGB mode if needed
    if img.mode != 'RGB':
        img = img.convert('RGB')

    # Apply image processing (resize, rotate, etc.)
    # ...

    # Save as JPG with specified quality
    img.save(output_path, "JPEG", quality=quality, optimize=True)
```

### Drag and Drop Interface

The frontend uses React Dropzone for an intuitive file upload experience:

```jsx
const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  accept: {
    "image/heic": [".heic", ".heif"],
    "application/octet-stream": [".heic", ".heif"],
  },
  maxFiles: 1,
  multiple: false,
});
```

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  About the Developer

I'm a passionate Software Engineer with expertise in modern web technologies. This project demonstrates my ability to:

- Build beautiful, responsive user interfaces with React and Tailwind CSS
- Develop robust backend services with Python and FastAPI
- Implement complex image processing functionality
- Create seamless user experiences with thoughtful UI/UX design

Feel free to reach out for collaboration or employment opportunities!

---

<div align="center">
</div>
