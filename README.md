# Abhipreet's Space Portfolio - 3D Interactive Resume

A stunning 3D space-themed portfolio website showcasing Abhipreet Choudhary's Full Stack Development expertise with interactive Earth, Moon, and rockets featuring real-time animations and hover effects.

## About Abhipreet Choudhary

**Full Stack Developer at Wipro Limited**  
**Email:** abhipreet.choudhary@wipro.com  
**Phone:** +91 8279351865

Full stack developer with expertise in both Java and Python ecosystems. Experienced in building secure, scalable systems for banking, retail, and healthcare domains. Skilled in Spring Boot, Angular, React, and microservices architecture. Passionate about clean architecture, AI integration, and continuous learning through multiple proof-of-concept projects.

## Features

🌍 **Realistic 3D Earth** - Rotating planet with detailed continents, oceans, polar ice caps, cloud layers, and atmospheric effects
🌙 **Detailed Moon** - Authentic lunar surface with major craters (Tycho, Copernicus), maria (seas), highlands, and rilles
🚀 **Advanced Rockets** - Multi-stage spacecraft with realistic components, exhaust effects, solar panels, and communication systems
⭐ **Multi-Layer Star Field** - 30,000+ stars in different colors, sizes, and distances creating depth
🌌 **Spiral Galaxies** - 6 distant galaxies with realistic spiral arm structures and core brightness
🌠 **Colorful Nebulae** - 8 dynamic nebulae in various colors (pink, cyan, purple, gold, green) with layered cloud effects
☄️ **Orbiting Comets** - 3 comets with realistic elliptical orbits, glowing coma, and particle tails
🛰️ **Earth Satellites** - 5 detailed satellites with solar panels orbiting Earth
🪨 **Asteroid Belt** - 200+ irregular asteroids with realistic rotation and orbital motion
✨ **Space Dust** - 50,000 micro-particles creating atmospheric depth
🎨 **Advanced Lighting** - Multiple light sources including sun, ambient, and colored accent lights
📱 **Responsive Design** - Optimized for all devices and screen sizes
🎯 **Interactive Elements** - Click on space objects to navigate sections
💫 **Particle Effects** - Beautiful animations on button interactions

## Key Projects Featured

### 🏦 Banking Management System
- **Technologies:** Java, Spring Boot, Angular, Microservices
- **Features:** Account management, fund transfers, transaction history
- **Achievements:** 99.9% data consistency, JWT authentication, ACID compliance

### 🛒 Online Retail Store  
- **Technologies:** Java, Spring Boot, React, SQL
- **Features:** E-commerce workflow, product catalog, checkout system
- **Achievements:** 40% latency reduction, Swagger documentation

### 🏥 Doctor-Patient Interaction Scribe
- **Technologies:** Python, FastAPI, Whisper AI, React
- **Features:** Real-time transcription, RAG pipeline, diagnostic support
- **Achievements:** AI-powered symptom analysis, live summarization

## Professional Experience

**Wipro Limited, Greater Noida** - *Project Engineer | Full Stack Developer*
- Developed secure POC systems using Java, Spring Boot, React, Angular
- Implemented real-time medical transcription with AI integration
- Built JWT authentication and scalable RESTful APIs
- Achieved 40% latency reduction in system performance

## Technical Expertise

- **Languages:** Java, Python, JavaScript, SQL
- **Frameworks:** Spring Boot, Angular, React, FastAPI, Hibernate  
- **Tools:** Git, GitHub Copilot, Eclipse IDE, Maven, Postman, Swagger, Linux
- **Technologies:** JWT, Microservices, Hugging Face Transformers, RAG
- **Architectures:** RESTful APIs, Microservices, MVC

## Technologies Used

- **Three.js** - 3D graphics and animations
- **HTML5** - Modern semantic markup
- **CSS3** - Advanced styling with animations and gradients
- **JavaScript ES6+** - Interactive functionality and scene management
- **Orbitron Font** - Futuristic typography

## Setup Instructions

1. **Clone or Download** the project files to your local machine
2. **Open** `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. **Enjoy** the 3D space experience!

## Customization Guide

### Personal Information
Edit the following sections in `index.html`:

```html
<!-- Update your name and title -->
<h1 class="hero-title">Welcome to My Universe</h1>
<p class="hero-subtitle">Your personal tagline here</p>

<!-- Update contact information -->
<a href="mailto:your.email@space.com" class="contact-link">
    <span>📧</span>
    <span>your.email@space.com</span>
</a>
```

### Resume Timeline
Modify the timeline section in `index.html`:

```html
<div class="timeline-item">
    <div class="timeline-date">2024</div>
    <div class="timeline-content">
        <h3>Your Job Title</h3>
        <p>Your job description and achievements</p>
    </div>
</div>
```

### Projects
Update the projects grid with your own work:

```html
<div class="project-card">
    <h3>Your Project Name</h3>
    <p>Project description and impact</p>
    <div class="project-tech">
        <span>Technology 1</span>
        <span>Technology 2</span>
    </div>
</div>
```

### Colors and Styling
The main color scheme uses:
- Primary: `#00ffff` (Cyan)
- Secondary: `#ff00ff` (Magenta)  
- Accent: `#ffff00` (Yellow)
- Background: `#000000` (Black)

To change colors, update the CSS variables in `styles.css`.

### 3D Scene Customization
Modify 3D elements in `script.js`:

```javascript
// Change Earth size
const earthGeometry = new THREE.SphereGeometry(8, 64, 64);

// Adjust rocket count
for (let i = 0; i < 3; i++) { // Change number here

// Modify orbit speeds
this.earth.rotation.y += 0.01; // Earth rotation speed
```

## Performance Notes

- The website uses WebGL for 3D rendering with 100,000+ particles and objects
- Multi-layered star fields with 30,000+ stars optimized for 60fps
- Advanced shader materials for realistic lighting and atmospheric effects
- Dynamic LOD (Level of Detail) for distant objects
- Efficient particle systems for comets, asteroids, and space dust
- Loading screen provides time for complex 3D assets to initialize

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## File Structure

```
SpaceZero/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations  
├── script.js       # 3D scene and interactions
└── README.md       # This documentation
```

## Live Demo Features

1. **Hover over space objects** to see information panels
2. **Click on Earth** to view About section
3. **Click on Moon** to see Projects
4. **Click on Rockets** to access Resume
5. **Navigation menu** for direct section access
6. **Mission timer** showing elapsed time
7. **Particle effects** on button clicks

## Advanced Customization

### Adding New 3D Objects
```javascript
// Create custom geometry
const customGeometry = new THREE.BoxGeometry(1, 1, 1);
const customMaterial = new THREE.MeshPhongMaterial({color: 0x00ffff});
const customMesh = new THREE.Mesh(customGeometry, customMaterial);
this.scene.add(customMesh);
```

### Custom Animations
```javascript
// Add to animate() function
customMesh.rotation.x += 0.01;
customMesh.position.y = Math.sin(time) * 10;
```

### Resume Download
Replace the alert in the download button with actual file download:

```javascript
downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'path/to/your/resume.pdf';
    link.download = 'Your_Name_Resume.pdf';
    link.click();
});
```

## Support

For questions or customization help, please refer to:
- [Three.js Documentation](https://threejs.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

## License

This project is open source and available under the MIT License.

---

**Ready to launch your career into the digital cosmos? 🚀**
