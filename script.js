// Space Scene Configuration
class SpaceScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.earth = null;
        this.moon = null;
        this.rockets = [];
        this.starTrekShips = [];
        this.stars = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isLoaded = false;
        this.hoveredObject = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createStarField();
        this.createEarth();
        this.createMoon();
        this.createRockets();
        this.createStarTrekFleet();
        this.createNebula();
        this.setupEventListeners();
        this.animate();
        this.hideLoadingScreen();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 100, 1000);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.camera.position.set(0, 0, 50);
    }

    createRenderer() {
        const canvas = document.getElementById('space-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Sun light (main directional light)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(100, 100, 50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);

        // Blue accent light
        const blueLight = new THREE.PointLight(0x00ffff, 0.5, 100);
        blueLight.position.set(-50, 30, 30);
        this.scene.add(blueLight);

        // Purple accent light
        const purpleLight = new THREE.PointLight(0xff00ff, 0.5, 100);
        purpleLight.position.set(50, -30, 30);
        this.scene.add(purpleLight);
    }

    createStarField() {
        // Create multiple star layers with different colors and sizes
        this.createStarLayer(15000, 0xffffff, 1.5, 2000); // White stars
        this.createStarLayer(8000, 0x88ccff, 2.0, 1800);  // Blue stars
        this.createStarLayer(5000, 0xffaa88, 2.5, 1600);  // Orange stars
        this.createStarLayer(3000, 0xff8888, 3.0, 1400);  // Red giants
        
        // Create distant galaxies
        this.createGalaxies();
        
        // Create nebulae
        this.createNebulae();
        
        // Create asteroid belt
        this.createAsteroidBelt();
        
        // Create space dust
        this.createSpaceDust();
        
        // Create comets
        this.createComets();
        
        // Create satellites
        this.createSatellites();
    }

    createStarLayer(count, color, size, distance) {
        const starGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * distance;
            positions[i3 + 1] = (Math.random() - 0.5) * distance;
            positions[i3 + 2] = (Math.random() - 0.5) * distance;
            
            // Color variation
            const colorObj = new THREE.Color(color);
            colorObj.multiplyScalar(0.5 + Math.random() * 0.5);
            colors[i3] = colorObj.r;
            colors[i3 + 1] = colorObj.g;
            colors[i3 + 2] = colorObj.b;
            
            // Size variation
            sizes[i] = size * (0.5 + Math.random() * 0.5);
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const starMaterial = new THREE.PointsMaterial({
            vertexColors: true,
            sizeAttenuation: false,
            transparent: true,
            opacity: 0.8
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
        
        if (!this.stars) this.stars = stars; // Keep reference to first layer
    }

    createGalaxies() {
        for (let i = 0; i < 6; i++) {
            const galaxy = this.createSpiralGalaxy();
            galaxy.position.set(
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000
            );
            galaxy.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            this.scene.add(galaxy);
        }
    }

    createSpiralGalaxy() {
        const galaxyGroup = new THREE.Group();
        const arms = 3;
        const armStars = 2000;
        
        for (let armIndex = 0; armIndex < arms; armIndex++) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(armStars * 3);
            const colors = new Float32Array(armStars * 3);
            
            for (let i = 0; i < armStars; i++) {
                const i3 = i * 3;
                const t = i / armStars;
                const radius = t * 200;
                const angle = armIndex * (Math.PI * 2 / arms) + t * Math.PI * 6;
                
                positions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 20;
                positions[i3 + 1] = (Math.random() - 0.5) * 20;
                positions[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 20;
                
                // Galaxy core is brighter
                const coreDistance = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
                const brightness = Math.max(0.2, 1 - coreDistance / 200);
                
                colors[i3] = 0.8 * brightness;     // R
                colors[i3 + 1] = 0.6 * brightness; // G
                colors[i3 + 2] = 1.0 * brightness; // B
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const material = new THREE.PointsMaterial({
                size: 1,
                vertexColors: true,
                transparent: true,
                opacity: 0.6,
                sizeAttenuation: false
            });
            
            const armMesh = new THREE.Points(geometry, material);
            galaxyGroup.add(armMesh);
        }
        
        return galaxyGroup;
    }

    createNebulae() {
        const nebulaColors = [
            { color: 0xff6b9d, name: 'pink' },
            { color: 0x00ffff, name: 'cyan' },
            { color: 0x9d4edd, name: 'purple' },
            { color: 0xffd60a, name: 'gold' },
            { color: 0x06ffa5, name: 'green' }
        ];
        
        for (let i = 0; i < 8; i++) {
            const nebula = this.createSingleNebula(nebulaColors[i % nebulaColors.length]);
            nebula.position.set(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
            );
            this.scene.add(nebula);
        }
    }

    createSingleNebula(colorData) {
        const nebulaGroup = new THREE.Group();
        
        // Main nebula cloud
        const geometry = new THREE.SphereGeometry(80 + Math.random() * 120, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: colorData.color,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        
        const mainCloud = new THREE.Mesh(geometry, material);
        nebulaGroup.add(mainCloud);
        
        // Add smaller cloud layers
        for (let i = 0; i < 3; i++) {
            const subGeometry = new THREE.SphereGeometry(40 + Math.random() * 60, 16, 16);
            const subMaterial = new THREE.MeshBasicMaterial({
                color: colorData.color,
                transparent: true,
                opacity: 0.05 + Math.random() * 0.05,
                side: THREE.DoubleSide
            });
            
            const subCloud = new THREE.Mesh(subGeometry, subMaterial);
            subCloud.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
            nebulaGroup.add(subCloud);
        }
        
        return nebulaGroup;
    }

    createAsteroidBelt() {
        this.asteroids = [];
        const asteroidCount = 200;
        
        for (let i = 0; i < asteroidCount; i++) {
            const asteroid = this.createSingleAsteroid();
            
            // Position in belt around solar system
            const angle = Math.random() * Math.PI * 2;
            const radius = 150 + Math.random() * 50;
            
            asteroid.position.set(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 20,
                Math.sin(angle) * radius
            );
            
            asteroid.userData = {
                type: 'asteroid',
                angle: angle,
                radius: radius,
                speed: 0.001 + Math.random() * 0.002
            };
            
            this.asteroids.push(asteroid);
            this.scene.add(asteroid);
        }
    }

    createSingleAsteroid() {
        const size = 0.5 + Math.random() * 2;
        const geometry = new THREE.DodecahedronGeometry(size, 0);
        
        // Randomize vertices for irregular shape
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i] *= 0.8 + Math.random() * 0.4;
            vertices[i + 1] *= 0.8 + Math.random() * 0.4;
            vertices[i + 2] *= 0.8 + Math.random() * 0.4;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshPhongMaterial({
            color: 0x8b7355,
            shininess: 1,
            transparent: true,
            opacity: 0.8
        });
        
        return new THREE.Mesh(geometry, material);
    }

    createSpaceDust() {
        const dustGeometry = new THREE.BufferGeometry();
        const dustCount = 50000;
        const positions = new Float32Array(dustCount * 3);
        const colors = new Float32Array(dustCount * 3);
        
        for (let i = 0; i < dustCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 4000;
            positions[i + 1] = (Math.random() - 0.5) * 4000;
            positions[i + 2] = (Math.random() - 0.5) * 4000;
            
            // Dust color variations
            const dustColor = Math.random();
            if (dustColor < 0.6) {
                colors[i] = 0.4;     // R
                colors[i + 1] = 0.4; // G  
                colors[i + 2] = 0.6; // B (bluish)
            } else {
                colors[i] = 0.6;     // R
                colors[i + 1] = 0.4; // G
                colors[i + 2] = 0.2; // B (brownish)
            }
        }
        
        dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        dustGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const dustMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            sizeAttenuation: true
        });
        
        this.spaceDust = new THREE.Points(dustGeometry, dustMaterial);
        this.scene.add(this.spaceDust);
    }

    createComets() {
        this.comets = [];
        const cometCount = 3;
        
        for (let i = 0; i < cometCount; i++) {
            const comet = this.createSingleComet();
            
            // Set up orbital path
            comet.userData = {
                type: 'comet',
                angle: Math.random() * Math.PI * 2,
                semiMajorAxis: 300 + Math.random() * 200,
                eccentricity: 0.5 + Math.random() * 0.4,
                speed: 0.002 + Math.random() * 0.003,
                inclination: (Math.random() - 0.5) * Math.PI / 4
            };
            
            this.comets.push(comet);
            this.scene.add(comet);
        }
    }

    createSingleComet() {
        const cometGroup = new THREE.Group();
        
        // Comet nucleus
        const nucleusGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const nucleusMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444,
            shininess: 5
        });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        cometGroup.add(nucleus);
        
        // Coma (gas and dust cloud around nucleus)
        const comaGeometry = new THREE.SphereGeometry(3, 16, 16);
        const comaMaterial = new THREE.MeshBasicMaterial({
            color: 0x88aaff,
            transparent: true,
            opacity: 0.2
        });
        const coma = new THREE.Mesh(comaGeometry, comaMaterial);
        cometGroup.add(coma);
        
        // Tail particles
        const tailGeometry = new THREE.BufferGeometry();
        const tailCount = 1000;
        const positions = new Float32Array(tailCount * 3);
        const colors = new Float32Array(tailCount * 3);
        
        for (let i = 0; i < tailCount; i++) {
            const i3 = i * 3;
            const distance = i / tailCount * 50;
            
            positions[i3] = -distance + (Math.random() - 0.5) * 5;
            positions[i3 + 1] = (Math.random() - 0.5) * 3;
            positions[i3 + 2] = (Math.random() - 0.5) * 3;
            
            const intensity = 1 - distance / 50;
            colors[i3] = 0.8 * intensity;
            colors[i3 + 1] = 0.9 * intensity;
            colors[i3 + 2] = 1.0 * intensity;
        }
        
        tailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        tailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const tailMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });
        
        const tail = new THREE.Points(tailGeometry, tailMaterial);
        cometGroup.add(tail);
        
        return cometGroup;
    }

    createSatellites() {
        this.satellites = [];
        const satelliteCount = 5;
        
        for (let i = 0; i < satelliteCount; i++) {
            const satellite = this.createSingleSatellite();
            
            satellite.userData = {
                type: 'satellite',
                angle: Math.random() * Math.PI * 2,
                radius: 35 + Math.random() * 20,
                speed: 0.02 + Math.random() * 0.03,
                altitude: Math.random() * 10 - 5
            };
            
            this.satellites.push(satellite);
            this.scene.add(satellite);
        }
    }

    createSingleSatellite() {
        const satelliteGroup = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(1, 0.8, 0.6);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            shininess: 100
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        satelliteGroup.add(body);
        
        // Solar panels
        for (let i = 0; i < 2; i++) {
            const panelGeometry = new THREE.BoxGeometry(0.05, 1.5, 1);
            const panelMaterial = new THREE.MeshPhongMaterial({
                color: 0x001144,
                shininess: 200
            });
            const panel = new THREE.Mesh(panelGeometry, panelMaterial);
            panel.position.x = i === 0 ? 1 : -1;
            satelliteGroup.add(panel);
        }
        
        // Antenna
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 8);
        const antennaMaterial = new THREE.MeshPhongMaterial({
            color: 0x666666,
            shininess: 50
        });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.y = 1.4;
        satelliteGroup.add(antenna);
        
        // Dish
        const dishGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16);
        const dishMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 100
        });
        const dish = new THREE.Mesh(dishGeometry, dishMaterial);
        dish.position.y = 0.6;
        dish.position.z = 0.5;
        dish.rotateX(Math.PI / 4);
        satelliteGroup.add(dish);
        
        return satelliteGroup;
    }

    // Utility function to convert latitude/longitude to 3D vector position on a sphere
    latLonToVector3(lat, lon, radius) {
        // Convert degrees to radians
        const latRad = (lat * Math.PI) / 180;
        const lonRad = (lon * Math.PI) / 180;
        
        // Convert spherical coordinates to Cartesian coordinates
        const x = radius * Math.cos(latRad) * Math.cos(lonRad);
        const y = radius * Math.sin(latRad);
        const z = radius * Math.cos(latRad) * Math.sin(lonRad);
        
        return new THREE.Vector3(x, y, z);
    }

    createEarth() {
        // Ultra-high detail Earth geometry
        const earthGeometry = new THREE.SphereGeometry(8, 256, 256);
        
        // Create ultra-realistic Earth material with advanced texturing
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff,
            shininess: 80,
            transparent: false,
            specular: 0x333333,
            reflectivity: 0.4
        });

        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.earth.position.set(-20, 0, 0);
        this.earth.castShadow = true;
        this.earth.receiveShadow = true;
        this.earth.userData = { type: 'earth' };
        this.scene.add(this.earth);

        // Enhanced multi-layer atmosphere
        this.createUltraRealisticAtmosphere();
        
        // Create hyper-detailed continents with topographical variation
        this.createHyperDetailedContinents();
        
        // Add dynamic polar ice caps with seasonal variation
        this.createDynamicPolarIceCaps();
        
        // Add multiple cloud layers with weather patterns
        this.createAdvancedCloudLayers();
        
        // Add ultra-realistic ocean with wave simulation
        this.createUltraRealisticOceans();
        
        // Add city lights for night side
        this.createCityLights();
        
        // Add aurora effects at poles
        this.createAuroraEffects();
        
        // Add atmospheric glow and scattering
        this.createAtmosphericScattering();
    }

    createUltraRealisticAtmosphere() {
        // Troposphere layer
        const troposphereGeometry = new THREE.SphereGeometry(8.2, 128, 128);
        const troposphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide
        });
        const troposphere = new THREE.Mesh(troposphereGeometry, troposphereMaterial);
        troposphere.position.copy(this.earth.position);
        this.scene.add(troposphere);
        
        // Stratosphere layer
        const stratosphereGeometry = new THREE.SphereGeometry(8.5, 128, 128);
        const stratosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x6699ff,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide
        });
        const stratosphere = new THREE.Mesh(stratosphereGeometry, stratosphereMaterial);
        stratosphere.position.copy(this.earth.position);
        this.scene.add(stratosphere);
        
        // Mesosphere layer
        const mesosphereGeometry = new THREE.SphereGeometry(8.8, 64, 64);
        const mesosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x4477dd,
            transparent: true,
            opacity: 0.05,
            side: THREE.BackSide
        });
        const mesosphere = new THREE.Mesh(mesosphereGeometry, mesosphereMaterial);
        mesosphere.position.copy(this.earth.position);
        this.scene.add(mesosphere);
        
        // Thermosphere layer
        const thermosphereGeometry = new THREE.SphereGeometry(9.2, 64, 64);
        const thermosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x2255bb,
            transparent: true,
            opacity: 0.03,
            side: THREE.BackSide
        });
        const thermosphere = new THREE.Mesh(thermosphereGeometry, thermosphereMaterial);
        thermosphere.position.copy(this.earth.position);
        this.scene.add(thermosphere);
    }

    createHyperDetailedContinents() {
        // Generate realistic continental shapes with heightmaps
        const continents = [
            // North America
            { lat: 45, lon: -100, size: 2.5, height: 0.3, color: 0x228b22 },
            { lat: 60, lon: -120, size: 1.8, height: 0.2, color: 0x8fbc8f }, // Canada
            { lat: 30, lon: -95, size: 2.0, height: 0.25, color: 0x32cd32 }, // USA
            { lat: 20, lon: -100, size: 1.2, height: 0.15, color: 0x9acd32 }, // Mexico
            
            // South America
            { lat: -10, lon: -60, size: 2.2, height: 0.4, color: 0x228b22 },
            { lat: -30, lon: -70, size: 1.5, height: 0.6, color: 0x8b4513 }, // Andes
            { lat: 0, lon: -65, size: 2.0, height: 0.1, color: 0x006400 }, // Amazon
            
            // Europe
            { lat: 55, lon: 10, size: 1.8, height: 0.2, color: 0x9acd32 },
            { lat: 45, lon: 45, size: 1.2, height: 0.3, color: 0x8fbc8f }, // Russia west
            
            // Asia
            { lat: 55, lon: 100, size: 3.5, height: 0.35, color: 0x228b22 }, // Siberia
            { lat: 30, lon: 105, size: 2.8, height: 0.25, color: 0x9acd32 }, // China
            { lat: 20, lon: 77, size: 2.0, height: 0.3, color: 0x32cd32 }, // India
            { lat: 30, lon: 35, size: 1.0, height: 0.15, color: 0xdaa520 }, // Middle East
            { lat: 60, lon: 90, size: 2.5, height: 0.8, color: 0x8b7355 }, // Himalayas
            
            // Africa
            { lat: 0, lon: 20, size: 2.5, height: 0.2, color: 0x228b22 },
            { lat: -20, lon: 25, size: 2.0, height: 0.3, color: 0x8fbc8f },
            { lat: 10, lon: 0, size: 1.8, height: 0.1, color: 0xdaa520 }, // Sahara
            
            // Australia
            { lat: -25, lon: 135, size: 1.5, height: 0.2, color: 0xdaa520 },
            
            // Antarctica
            { lat: -85, lon: 0, size: 2.8, height: 0.5, color: 0xf0f8ff }
        ];

        continents.forEach(continent => {
            const position = this.latLonToVector3(continent.lat, continent.lon, 8 + continent.height);
            
            // Create continent geometry with varied topology
            const continentGeometry = new THREE.SphereGeometry(continent.size, 32, 32);
            const continentMaterial = new THREE.MeshPhongMaterial({
                color: continent.color,
                shininess: 10,
                transparent: true,
                opacity: 0.9
            });
            
            const continentMesh = new THREE.Mesh(continentGeometry, continentMaterial);
            continentMesh.position.copy(position);
            continentMesh.scale.setScalar(0.3);
            
            // Add mountain ranges and valleys
            if (continent.height > 0.4) {
                for (let i = 0; i < 5; i++) {
                    const mountainGeometry = new THREE.ConeGeometry(0.3, continent.height * 2, 8);
                    const mountainMaterial = new THREE.MeshPhongMaterial({
                        color: 0x8b7355,
                        shininess: 5
                    });
                    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
                    mountain.position.copy(position);
                    mountain.position.add(new THREE.Vector3(
                        (Math.random() - 0.5) * continent.size * 0.6,
                        continent.height * 0.5,
                        (Math.random() - 0.5) * continent.size * 0.6
                    ));
                    this.scene.add(mountain);
                }
            }
            
            this.scene.add(continentMesh);
        });
    }

    createDynamicPolarIceCaps() {
        // North Pole ice cap with dynamic seasonal variation
        const northIceGeometry = new THREE.SphereGeometry(2.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 3);
        const northIceMaterial = new THREE.MeshPhongMaterial({
            color: 0xf0f8ff,
            shininess: 100,
            transparent: true,
            opacity: 0.9,
            specular: 0x88ccff
        });
        const northIceCap = new THREE.Mesh(northIceGeometry, northIceMaterial);
        northIceCap.position.copy(this.earth.position);
        northIceCap.position.y += 6;
        this.scene.add(northIceCap);
        
        // South Pole ice cap (Antarctica) - larger and more permanent
        const southIceGeometry = new THREE.SphereGeometry(3.0, 64, 32, 0, Math.PI * 2, Math.PI * 2/3, Math.PI / 3);
        const southIceMaterial = new THREE.MeshPhongMaterial({
            color: 0xe6f3ff,
            shininess: 120,
            transparent: true,
            opacity: 0.95,
            specular: 0x99ddff
        });
        const southIceCap = new THREE.Mesh(southIceGeometry, southIceMaterial);
        southIceCap.position.copy(this.earth.position);
        southIceCap.position.y -= 6;
        this.scene.add(southIceCap);
        
        // Add icebergs around Antarctica
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const icebergGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.7);
            const icebergMaterial = new THREE.MeshPhongMaterial({
                color: 0xf0f8ff,
                shininess: 80
            });
            const iceberg = new THREE.Mesh(icebergGeometry, icebergMaterial);
            iceberg.position.copy(this.earth.position);
            iceberg.position.x += Math.cos(angle) * 10;
            iceberg.position.z += Math.sin(angle) * 10;
            iceberg.position.y -= 7 + Math.random() * 2;
            iceberg.rotation.set(
                Math.random() * 0.5,
                Math.random() * Math.PI * 2,
                Math.random() * 0.5
            );
            this.scene.add(iceberg);
        }
    }

    createAdvancedCloudLayers() {
        // Low-level cumulus clouds
        const lowCloudGeometry = new THREE.SphereGeometry(8.4, 128, 128);
        const lowCloudMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            alphaTest: 0.1
        });
        const lowClouds = new THREE.Mesh(lowCloudGeometry, lowCloudMaterial);
        lowClouds.position.copy(this.earth.position);
        this.scene.add(lowClouds);
        
        // Mid-level stratus clouds
        const midCloudGeometry = new THREE.SphereGeometry(8.6, 96, 96);
        const midCloudMaterial = new THREE.MeshBasicMaterial({
            color: 0xf5f5f5,
            transparent: true,
            opacity: 0.25,
            alphaTest: 0.1
        });
        const midClouds = new THREE.Mesh(midCloudGeometry, midCloudMaterial);
        midClouds.position.copy(this.earth.position);
        this.scene.add(midClouds);
        
        // High-level cirrus clouds
        const highCloudGeometry = new THREE.SphereGeometry(8.8, 64, 64);
        const highCloudMaterial = new THREE.MeshBasicMaterial({
            color: 0xfafaff,
            transparent: true,
            opacity: 0.15,
            alphaTest: 0.1
        });
        const highClouds = new THREE.Mesh(highCloudGeometry, highCloudMaterial);
        highClouds.position.copy(this.earth.position);
        this.scene.add(highClouds);
        
        // Storm systems
        for (let i = 0; i < 8; i++) {
            const stormGeometry = new THREE.SphereGeometry(1.5, 32, 32);
            const stormMaterial = new THREE.MeshBasicMaterial({
                color: 0x555555,
                transparent: true,
                opacity: 0.6
            });
            const storm = new THREE.Mesh(stormGeometry, stormMaterial);
            const lat = (Math.random() - 0.5) * 120; // Avoid poles for storms
            const lon = Math.random() * 360;
            storm.position.copy(this.latLonToVector3(lat, lon, 8.5));
            this.scene.add(storm);
            
            // Add lightning effects
            const lightningGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const lightningMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                emissive: 0xffff00,
                transparent: true,
                opacity: Math.random()
            });
            const lightning = new THREE.Mesh(lightningGeometry, lightningMaterial);
            lightning.position.copy(storm.position);
            this.scene.add(lightning);
        }
    }

    createUltraRealisticOceans() {
        // Ocean base layer with wave simulation
        const oceanGeometry = new THREE.SphereGeometry(7.98, 256, 256);
        const oceanMaterial = new THREE.MeshPhongMaterial({
            color: 0x006994,
            shininess: 200,
            transparent: true,
            opacity: 0.8,
            specular: 0x88ccff,
            reflectivity: 0.9
        });
        const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
        ocean.position.copy(this.earth.position);
        this.scene.add(ocean);
        
        // Deep ocean trenches
        const trenchPositions = [
            { lat: 11, lon: 142 }, // Mariana Trench
            { lat: -23, lon: -71 }, // Peru-Chile Trench
            { lat: 36, lon: 140 }, // Japan Trench
            { lat: -55, lon: -60 } // South Sandwich Trench
        ];
        
        trenchPositions.forEach(trench => {
            const trenchGeometry = new THREE.CylinderGeometry(0.8, 0.3, 2, 16);
            const trenchMaterial = new THREE.MeshPhongMaterial({
                color: 0x001122,
                shininess: 50
            });
            const trenchMesh = new THREE.Mesh(trenchGeometry, trenchMaterial);
            trenchMesh.position.copy(this.latLonToVector3(trench.lat, trench.lon, 7.5));
            trenchMesh.lookAt(this.earth.position);
            this.scene.add(trenchMesh);
        });
        
        // Ocean currents visualization
        for (let i = 0; i < 20; i++) {
            const currentGeometry = new THREE.BoxGeometry(0.2, 0.1, 5);
            const currentMaterial = new THREE.MeshBasicMaterial({
                color: 0x4499ff,
                transparent: true,
                opacity: 0.6
            });
            const current = new THREE.Mesh(currentGeometry, currentMaterial);
            const lat = (Math.random() - 0.5) * 140;
            const lon = Math.random() * 360;
            current.position.copy(this.latLonToVector3(lat, lon, 8.02));
            current.userData = { 
                speed: 0.01 + Math.random() * 0.02,
                direction: Math.random() * Math.PI * 2
            };
            this.scene.add(current);
        }
    }

    createCityLights() {
        // Major city light clusters
        const majorCities = [
            { lat: 40.7, lon: -74, intensity: 1.0 }, // New York
            { lat: 51.5, lon: 0, intensity: 0.9 }, // London
            { lat: 35.7, lon: 139.7, intensity: 1.0 }, // Tokyo
            { lat: 48.9, lon: 2.3, intensity: 0.8 }, // Paris
            { lat: 55.8, lon: 37.6, intensity: 0.7 }, // Moscow
            { lat: 39.9, lon: 116.4, intensity: 0.9 }, // Beijing
            { lat: 28.6, lon: 77.2, intensity: 0.8 }, // Delhi
            { lat: -33.9, lon: 151.2, intensity: 0.6 }, // Sydney
            { lat: -23.5, lon: -46.6, intensity: 0.7 }, // São Paulo
            { lat: 19.4, lon: -99.1, intensity: 0.6 } // Mexico City
        ];

        majorCities.forEach(city => {
            const lightGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const lightMaterial = new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                emissive: 0xffaa00,
                emissiveIntensity: city.intensity,
                transparent: true,
                opacity: 0.8
            });
            const cityLight = new THREE.Mesh(lightGeometry, lightMaterial);
            cityLight.position.copy(this.latLonToVector3(city.lat, city.lon, 8.05));
            this.scene.add(cityLight);
            
            // Add surrounding suburban glow
            for (let i = 0; i < 8; i++) {
                const suburbGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const suburbMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffcc44,
                    emissive: 0xffcc44,
                    emissiveIntensity: city.intensity * 0.3,
                    transparent: true,
                    opacity: 0.4
                });
                const suburbLight = new THREE.Mesh(suburbGeometry, suburbMaterial);
                const offset = new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                );
                suburbLight.position.copy(cityLight.position);
                suburbLight.position.add(offset);
                this.scene.add(suburbLight);
            }
        });
    }

    createAuroraEffects() {
        // Northern Aurora (Aurora Borealis)
        const northAuroraGeometry = new THREE.RingGeometry(9, 12, 32);
        const northAuroraMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            emissive: 0x004422,
            emissiveIntensity: 0.5
        });
        const northernAurora = new THREE.Mesh(northAuroraGeometry, northAuroraMaterial);
        northernAurora.position.copy(this.earth.position);
        northernAurora.position.y += 12;
        northernAurora.rotation.x = Math.PI / 2;
        this.scene.add(northernAurora);
        
        // Southern Aurora (Aurora Australis)
        const southAuroraGeometry = new THREE.RingGeometry(9, 12, 32);
        const southAuroraMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0088,
            transparent: true,
            opacity: 0.25,
            side: THREE.DoubleSide,
            emissive: 0x440022,
            emissiveIntensity: 0.4
        });
        const southernAurora = new THREE.Mesh(southAuroraGeometry, southAuroraMaterial);
        southernAurora.position.copy(this.earth.position);
        southernAurora.position.y -= 12;
        southernAurora.rotation.x = Math.PI / 2;
        this.scene.add(southernAurora);
        
        // Aurora curtain effects
        for (let i = 0; i < 16; i++) {
            const curtainGeometry = new THREE.PlaneGeometry(2, 8);
            const curtainMaterial = new THREE.MeshBasicMaterial({
                color: 0x44ff88,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide,
                emissive: 0x226644,
                emissiveIntensity: 0.3
            });
            const curtain = new THREE.Mesh(curtainGeometry, curtainMaterial);
            const angle = (i / 16) * Math.PI * 2;
            curtain.position.copy(this.earth.position);
            curtain.position.x += Math.cos(angle) * 11;
            curtain.position.z += Math.sin(angle) * 11;
            curtain.position.y += 8 + Math.sin(i) * 3;
            curtain.lookAt(this.earth.position);
            this.scene.add(curtain);
        }
    }

    createAtmosphericScattering() {
        // Rayleigh scattering effect (blue sky)
        const scatteringGeometry = new THREE.SphereGeometry(9.5, 64, 64);
        const scatteringMaterial = new THREE.MeshBasicMaterial({
            color: 0x4477ff,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const scattering = new THREE.Mesh(scatteringGeometry, scatteringMaterial);
        scattering.position.copy(this.earth.position);
        this.scene.add(scattering);
        
        // Terminator line (day/night boundary)
        const terminatorGeometry = new THREE.RingGeometry(8, 8.1, 64);
        const terminatorMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4400,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        const terminator = new THREE.Mesh(terminatorGeometry, terminatorMaterial);
        terminator.position.copy(this.earth.position);
        terminator.rotation.x = Math.PI / 2;
        terminator.rotation.z = Math.PI / 4;
        this.scene.add(terminator);
    }

    createRealisticContinents() {
        const continentData = [
            // Africa
            { lat: 0, lon: 20, size: 2.5, color: 0x228B22 },
            { lat: -20, lon: 25, size: 1.8, color: 0x32CD32 },
            
            // Asia
            { lat: 40, lon: 100, size: 3.2, color: 0x228B22 },
            { lat: 20, lon: 80, size: 2.1, color: 0x90EE90 },
            
            // North America
            { lat: 45, lon: -100, size: 2.8, color: 0x228B22 },
            { lat: 30, lon: -95, size: 1.5, color: 0x32CD32 },
            
            // South America
            { lat: -15, lon: -60, size: 2.2, color: 0x228B22 },
            { lat: -25, lon: -55, size: 1.3, color: 0x90EE90 },
            
            // Europe
            { lat: 55, lon: 20, size: 1.2, color: 0x32CD32 },
            
            // Australia
            { lat: -25, lon: 135, size: 1.1, color: 0x228B22 },
            
            // Greenland
            { lat: 72, lon: -40, size: 0.8, color: 0xF0F8FF },
            
            // Antarctica (ice)
            { lat: -80, lon: 0, size: 2.5, color: 0xF0F8FF },
            { lat: -85, lon: 90, size: 2.0, color: 0xF8F8FF },
            { lat: -85, lon: 180, size: 2.0, color: 0xF0F8FF },
            { lat: -85, lon: -90, size: 2.0, color: 0xF8F8FF }
        ];

        continentData.forEach(continent => {
            const continentGeometry = new THREE.SphereGeometry(continent.size * 0.3, 16, 16);
            const continentMaterial = new THREE.MeshPhongMaterial({
                color: continent.color,
                shininess: continent.color === 0xF0F8FF ? 80 : 10 // Ice is more reflective
            });

            const continentMesh = new THREE.Mesh(continentGeometry, continentMaterial);
            
            // Convert lat/lon to 3D position on sphere
            const phi = (90 - continent.lat) * Math.PI / 180;
            const theta = (continent.lon + 180) * Math.PI / 180;
            const radius = 8.1;
            
            continentMesh.position.set(
                this.earth.position.x + radius * Math.sin(phi) * Math.cos(theta),
                this.earth.position.y + radius * Math.cos(phi),
                this.earth.position.z + radius * Math.sin(phi) * Math.sin(theta)
            );
            
            this.scene.add(continentMesh);
        });
        
        // Add mountain ranges
        this.createMountainRanges();
    }

    createMountainRanges() {
        const mountainData = [
            // Himalayas
            { lat: 28, lon: 84, height: 0.3 },
            // Andes
            { lat: -20, lon: -70, height: 0.25 },
            // Rockies
            { lat: 45, lon: -110, height: 0.2 },
            // Alps
            { lat: 46, lon: 8, height: 0.15 }
        ];

        mountainData.forEach(mountain => {
            const mountainGeometry = new THREE.ConeGeometry(0.2, mountain.height, 8);
            const mountainMaterial = new THREE.MeshPhongMaterial({
                color: 0x8B4513,
                shininess: 5
            });

            const mountainMesh = new THREE.Mesh(mountainGeometry, mountainMaterial);
            
            const phi = (90 - mountain.lat) * Math.PI / 180;
            const theta = (mountain.lon + 180) * Math.PI / 180;
            const radius = 8.1;
            
            const x = this.earth.position.x + radius * Math.sin(phi) * Math.cos(theta);
            const y = this.earth.position.y + radius * Math.cos(phi);
            const z = this.earth.position.z + radius * Math.sin(phi) * Math.sin(theta);
            
            mountainMesh.position.set(x, y, z);
            mountainMesh.lookAt(this.earth.position);
            mountainMesh.rotateX(Math.PI / 2);
            
            this.scene.add(mountainMesh);
        });
    }

    createPolarIceCaps() {
        // North pole ice cap
        const northIceGeometry = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.3);
        const iceMaterial = new THREE.MeshPhongMaterial({
            color: 0xF0F8FF,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        
        const northIce = new THREE.Mesh(northIceGeometry, iceMaterial);
        northIce.position.set(this.earth.position.x, this.earth.position.y + 6.5, this.earth.position.z);
        this.scene.add(northIce);
        
        // South pole ice cap
        const southIce = northIce.clone();
        southIce.position.set(this.earth.position.x, this.earth.position.y - 6.5, this.earth.position.z);
        southIce.rotation.x = Math.PI;
        this.scene.add(southIce);
    }

    createCloudLayer() {
        const cloudGeometry = new THREE.SphereGeometry(8.4, 64, 64);
        const cloudMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        // Create cloud texture pattern
        const cloudCanvas = document.createElement('canvas');
        cloudCanvas.width = 256;
        cloudCanvas.height = 128;
        const cloudContext = cloudCanvas.getContext('2d');
        
        // Generate cloud pattern
        cloudContext.fillStyle = 'rgba(255, 255, 255, 0)';
        cloudContext.fillRect(0, 0, 256, 128);
        
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 128;
            const radius = 10 + Math.random() * 20;
            const opacity = 0.3 + Math.random() * 0.4;
            
            cloudContext.beginPath();
            cloudContext.arc(x, y, radius, 0, Math.PI * 2);
            cloudContext.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            cloudContext.fill();
        }
        
        const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
        cloudMaterial.map = cloudTexture;
        
        this.cloudLayer = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.cloudLayer.position.copy(this.earth.position);
        this.scene.add(this.cloudLayer);
    }

    createOceanReflections() {
        // Add subtle ocean highlights
        const oceanGeometry = new THREE.SphereGeometry(8.05, 64, 64);
        const oceanMaterial = new THREE.MeshPhongMaterial({
            color: 0x006699,
            shininess: 200,
            transparent: true,
            opacity: 0.7,
            specular: 0x88ccff
        });
        
        const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
        ocean.position.copy(this.earth.position);
        this.scene.add(ocean);
    }

    createMoon() {
        // Ultra-high detail Moon geometry
        const moonGeometry = new THREE.SphereGeometry(2, 256, 256);
        const moonMaterial = new THREE.MeshPhongMaterial({
            color: 0xc4c4c4,
            shininess: 2,
            specular: 0x222222,
            bumpScale: 0.02
        });

        this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
        this.moon.position.set(20, 0, 0);
        this.moon.castShadow = true;
        this.moon.receiveShadow = true;
        this.moon.userData = { type: 'moon' };
        this.scene.add(this.moon);

        // Create ultra-realistic moon surface features
        this.createUltraRealisticMoonSurface();
        
        // Add lunar regolith (surface dust)
        this.createLunarRegolith();
        
        // Add Apollo landing sites
        this.createApolloLandingSites();
        
        // Add lunar mountains and valleys
        this.createLunarTopography();
        
        // Add far side features
        this.createFarSideFeatures();
    }

    createUltraRealisticMoonSurface() {
        // Major lunar craters with hyper-accurate positioning and features
        const majorCraters = [
            // Tycho crater - most prominent ray crater
            { lat: -43.3, lon: -11.2, size: 0.16, depth: 0.08, name: 'Tycho', hasRays: true, age: 'young' },
            // Copernicus crater - spectacular terraced walls
            { lat: 9.7, lon: -20.1, size: 0.14, depth: 0.06, name: 'Copernicus', hasCentralPeak: true },
            // Clavius - ancient heavily cratered
            { lat: -58.4, lon: -14.1, size: 0.22, depth: 0.07, name: 'Clavius', age: 'ancient' },
            // Aristoteles - sharp rim
            { lat: 50.2, lon: 17.4, size: 0.10, depth: 0.04, name: 'Aristoteles' },
            // Plato - dark floor
            { lat: 51.6, lon: -9.4, size: 0.12, depth: 0.03, name: 'Plato', darkFloor: true },
            // Eratosthenes - transitional crater
            { lat: 14.5, lon: -11.3, size: 0.09, depth: 0.04, name: 'Eratosthenes' },
            // Alphonsus - central peak with dark halo
            { lat: -13.4, lon: -2.8, size: 0.13, depth: 0.05, name: 'Alphonsus', hasCentralPeak: true },
            // Petavius - spectacular wall slump
            { lat: -25.1, lon: 60.4, size: 0.15, depth: 0.06, name: 'Petavius' }
        ];

        majorCraters.forEach(crater => {
            this.createDetailedLunarCrater(crater);
        });

        // Major maria (lunar seas) with accurate shapes and darkness
        const majorMaria = [
            // Mare Tranquillitatis (Sea of Tranquility) - Apollo 11 landing site
            { lat: 8.5, lon: 23.4, size: 0.35, depth: 0.015, name: 'Mare Tranquillitatis', 
              color: 0x2a2a2a, hasApollo: 11 },
            // Mare Imbrium (Sea of Rains) - largest circular mare
            { lat: 32.8, lon: -15.6, size: 0.45, depth: 0.02, name: 'Mare Imbrium', 
              color: 0x2d2d2d },
            // Mare Serenitatis (Sea of Serenity) - Apollo 17 nearby
            { lat: 23.0, lon: 17.5, size: 0.28, depth: 0.018, name: 'Mare Serenitatis', 
              color: 0x282828, hasApollo: 17 },
            // Mare Crisium (Sea of Crises) - isolated circular mare
            { lat: 17.0, lon: 59.1, size: 0.26, depth: 0.016, name: 'Mare Crisium', 
              color: 0x252525 },
            // Mare Orientale (Eastern Sea) - multi-ring basin
            { lat: -19.4, lon: -92.8, size: 0.30, depth: 0.025, name: 'Mare Orientale', 
              color: 0x232323, multiRing: true },
            // Mare Nectaris (Sea of Nectar)
            { lat: -15.2, lon: 35.5, size: 0.22, depth: 0.014, name: 'Mare Nectaris', 
              color: 0x272727 },
            // Mare Fecunditatis (Sea of Fertility)
            { lat: -7.8, lon: 51.3, size: 0.24, depth: 0.016, name: 'Mare Fecunditatis', 
              color: 0x262626 },
            // Mare Humorum (Sea of Moisture)
            { lat: -24.4, lon: -38.6, size: 0.20, depth: 0.015, name: 'Mare Humorum', 
              color: 0x2b2b2b }
        ];

        majorMaria.forEach(mare => {
            this.createDetailedMare(mare);
        });

        // Add thousands of smaller craters for realism
        this.createMicroCraterField();
    }

    createDetailedLunarCrater(crater) {
        const position = this.latLonToVector3(crater.lat, crater.lon, 2 + crater.depth);
        
        // Main crater rim
        const rimGeometry = new THREE.TorusGeometry(crater.size, crater.depth * 0.3, 16, 32);
        const rimMaterial = new THREE.MeshPhongMaterial({
            color: 0xd0d0d0,
            shininess: 5
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.copy(this.latLonToVector3(crater.lat, crater.lon, 2));
        rim.lookAt(this.moon.position);
        this.scene.add(rim);
        
        // Crater floor
        const floorGeometry = new THREE.SphereGeometry(crater.size * 0.8, 24, 24);
        const floorColor = crater.darkFloor ? 0x404040 : 0x909090;
        const floorMaterial = new THREE.MeshPhongMaterial({
            color: floorColor,
            shininess: 1
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.copy(this.latLonToVector3(crater.lat, crater.lon, 2 - crater.depth * 0.7));
        floor.scale.set(1, 0.1, 1);
        this.scene.add(floor);
        
        // Central peak (if specified)
        if (crater.hasCentralPeak) {
            const peakGeometry = new THREE.ConeGeometry(crater.size * 0.2, crater.depth * 0.6, 12);
            const peakMaterial = new THREE.MeshPhongMaterial({
                color: 0xe0e0e0,
                shininess: 8
            });
            const peak = new THREE.Mesh(peakGeometry, peakMaterial);
            peak.position.copy(floor.position);
            peak.position.y += crater.depth * 0.3;
            this.scene.add(peak);
        }
        
        // Ray system (for young craters like Tycho)
        if (crater.hasRays) {
            for (let i = 0; i < 12; i++) {
                const rayGeometry = new THREE.BoxGeometry(0.02, 0.01, crater.size * 3);
                const rayMaterial = new THREE.MeshBasicMaterial({
                    color: 0xf0f0f0,
                    transparent: true,
                    opacity: 0.3
                });
                const ray = new THREE.Mesh(rayGeometry, rayMaterial);
                ray.position.copy(rim.position);
                ray.rotation.y = (i / 12) * Math.PI * 2;
                this.scene.add(ray);
            }
        }
        
        // Terraced walls (for complex craters)
        if (crater.size > 0.12) {
            for (let t = 0; t < 3; t++) {
                const terraceGeometry = new THREE.TorusGeometry(
                    crater.size * (0.8 - t * 0.2), 
                    crater.depth * 0.1, 
                    8, 16
                );
                const terraceMaterial = new THREE.MeshPhongMaterial({
                    color: 0xb0b0b0,
                    shininess: 3
                });
                const terrace = new THREE.Mesh(terraceGeometry, terraceMaterial);
                terrace.position.copy(rim.position);
                terrace.position.y -= crater.depth * 0.3 * (t + 1);
                terrace.lookAt(this.moon.position);
                this.scene.add(terrace);
            }
        }
    }

    createDetailedMare(mare) {
        const position = this.latLonToVector3(mare.lat, mare.lon, 2 - mare.depth);
        
        // Main mare surface
        const mareGeometry = new THREE.SphereGeometry(mare.size, 64, 64);
        const mareMaterial = new THREE.MeshPhongMaterial({
            color: mare.color,
            shininess: 1,
            specular: 0x111111
        });
        const mareSurface = new THREE.Mesh(mareGeometry, mareMaterial);
        mareSurface.position.copy(position);
        mareSurface.scale.set(1, 0.05, 1); // Flatten to represent lava plains
        this.scene.add(mareSurface);
        
        // Multi-ring structure (for complex basins like Mare Orientale)
        if (mare.multiRing) {
            for (let ring = 1; ring <= 3; ring++) {
                const ringGeometry = new THREE.TorusGeometry(mare.size * ring * 0.4, 0.02, 8, 32);
                const ringMaterial = new THREE.MeshPhongMaterial({
                    color: 0xa0a0a0,
                    shininess: 4
                });
                const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
                ringMesh.position.copy(position);
                ringMesh.lookAt(this.moon.position);
                this.scene.add(ringMesh);
            }
        }
        
        // Wrinkle ridges (common in maria)
        for (let i = 0; i < 5; i++) {
            const ridgeGeometry = new THREE.BoxGeometry(mare.size * 0.8, 0.01, 0.05);
            const ridgeMaterial = new THREE.MeshPhongMaterial({
                color: 0x808080,
                shininess: 2
            });
            const ridge = new THREE.Mesh(ridgeGeometry, ridgeMaterial);
            ridge.position.copy(position);
            ridge.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * mare.size * 0.6,
                0.01,
                (Math.random() - 0.5) * mare.size * 0.6
            ));
            ridge.rotation.y = Math.random() * Math.PI;
            this.scene.add(ridge);
        }
        
        // Add Apollo landing site markers
        if (mare.hasApollo) {
            const landerGeometry = new THREE.BoxGeometry(0.02, 0.03, 0.02);
            const landerMaterial = new THREE.MeshPhongMaterial({
                color: 0xffd700,
                shininess: 100,
                emissive: 0x332200
            });
            const lander = new THREE.Mesh(landerGeometry, landerMaterial);
            lander.position.copy(position);
            lander.position.y += 0.02;
            this.scene.add(lander);
            
            // American flag
            const flagGeometry = new THREE.PlaneGeometry(0.02, 0.015);
            const flagMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                side: THREE.DoubleSide
            });
            const flag = new THREE.Mesh(flagGeometry, flagMaterial);
            flag.position.copy(lander.position);
            flag.position.x += 0.03;
            flag.position.y += 0.01;
            this.scene.add(flag);
        }
    }

    createMicroCraterField() {
        // Add 500+ small craters for ultra-realism
        for (let i = 0; i < 500; i++) {
            const lat = (Math.random() - 0.5) * 180;
            const lon = (Math.random() - 0.5) * 360;
            const size = 0.02 + Math.random() * 0.08;
            const depth = size * 0.3;
            
            const microCraterGeometry = new THREE.SphereGeometry(size, 12, 12);
            const microCraterMaterial = new THREE.MeshPhongMaterial({
                color: 0x888888 + Math.random() * 0x333333,
                shininess: 1
            });
            const microCrater = new THREE.Mesh(microCraterGeometry, microCraterMaterial);
            microCrater.position.copy(this.latLonToVector3(lat, lon, 2 - depth * 0.5));
            microCrater.scale.set(1, 0.2, 1);
            this.scene.add(microCrater);
        }
    }

    createLunarRegolith() {
        // Regolith dust particles
        const regolithCount = 50000;
        const regolithGeometry = new THREE.BufferGeometry();
        const regolithPositions = new Float32Array(regolithCount * 3);
        
        for (let i = 0; i < regolithCount; i++) {
            const lat = (Math.random() - 0.5) * 180;
            const lon = (Math.random() - 0.5) * 360;
            const pos = this.latLonToVector3(lat, lon, 2.01);
            
            regolithPositions[i * 3] = pos.x;
            regolithPositions[i * 3 + 1] = pos.y;
            regolithPositions[i * 3 + 2] = pos.z;
        }
        
        regolithGeometry.setAttribute('position', new THREE.BufferAttribute(regolithPositions, 3));
        
        const regolithMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.005,
            transparent: true,
            opacity: 0.6
        });
        
        const regolith = new THREE.Points(regolithGeometry, regolithMaterial);
        this.scene.add(regolith);
    }

    createApolloLandingSites() {
        const apolloSites = [
            { mission: 11, lat: 0.674, lon: 23.473, name: 'Sea of Tranquility' },
            { mission: 12, lat: -3.013, lon: -23.422, name: 'Ocean of Storms' },
            { mission: 14, lat: -3.646, lon: -17.472, name: 'Fra Mauro' },
            { mission: 15, lat: 26.063, lon: 3.654, name: 'Hadley-Apennine' },
            { mission: 16, lat: -8.601, lon: 15.499, name: 'Descartes' },
            { mission: 17, lat: 20.191, lon: 30.774, name: 'Taurus-Littrow' }
        ];

        apolloSites.forEach(site => {
            // Landing module
            const lmGeometry = new THREE.CylinderGeometry(0.015, 0.02, 0.025, 8);
            const lmMaterial = new THREE.MeshPhongMaterial({
                color: 0xc0c0c0,
                shininess: 50
            });
            const landingModule = new THREE.Mesh(lmGeometry, lmMaterial);
            landingModule.position.copy(this.latLonToVector3(site.lat, site.lon, 2.015));
            this.scene.add(landingModule);
            
            // Plaque
            const plaqueGeometry = new THREE.BoxGeometry(0.01, 0.005, 0.01);
            const plaqueMaterial = new THREE.MeshBasicMaterial({
                color: 0xffd700
            });
            const plaque = new THREE.Mesh(plaqueGeometry, plaqueMaterial);
            plaque.position.copy(landingModule.position);
            plaque.position.y += 0.02;
            this.scene.add(plaque);
            
            // Footprints trail
            for (let i = 0; i < 20; i++) {
                const footprintGeometry = new THREE.SphereGeometry(0.003, 6, 6);
                const footprintMaterial = new THREE.MeshPhongMaterial({
                    color: 0x666666,
                    shininess: 1
                });
                const footprint = new THREE.Mesh(footprintGeometry, footprintMaterial);
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 0.1;
                footprint.position.copy(landingModule.position);
                footprint.position.x += Math.cos(angle) * distance;
                footprint.position.z += Math.sin(angle) * distance;
                footprint.scale.set(0.5, 0.1, 1);
                this.scene.add(footprint);
            }
        });
    }

    createLunarTopography() {
        // Montes Apenninus (Lunar Apennine Mountains)
        const apennineRange = [
            { lat: 19.9, lon: 1.9, height: 0.15 },
            { lat: 20.7, lon: 2.4, height: 0.18 },
            { lat: 21.2, lon: 2.8, height: 0.12 },
            { lat: 22.1, lon: 3.2, height: 0.16 }
        ];

        apennineRange.forEach(peak => {
            const mountainGeometry = new THREE.ConeGeometry(0.05, peak.height, 12);
            const mountainMaterial = new THREE.MeshPhongMaterial({
                color: 0xdddddd,
                shininess: 10
            });
            const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
            mountain.position.copy(this.latLonToVector3(peak.lat, peak.lon, 2 + peak.height * 0.5));
            this.scene.add(mountain);
        });
        
        // Vallis Alpes (Alpine Valley)
        const valleyGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.05);
        const valleyMaterial = new THREE.MeshPhongMaterial({
            color: 0x666666,
            shininess: 2
        });
        const valley = new THREE.Mesh(valleyGeometry, valleyMaterial);
        valley.position.copy(this.latLonToVector3(48.5, 3.2, 1.98));
        this.scene.add(valley);
    }

    createFarSideFeatures() {
        // South Pole-Aitken Basin (largest impact crater in solar system)
        const spaBasinGeometry = new THREE.SphereGeometry(0.6, 64, 64);
        const spaBasinMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a1a1a,
            shininess: 1
        });
        const spaBasin = new THREE.Mesh(spaBasinGeometry, spaBasinMaterial);
        spaBasin.position.copy(this.latLonToVector3(-56, 180, 1.9));
        spaBasin.scale.set(1, 0.08, 1);
        this.scene.add(spaBasin);
        
        // Von Kármán crater (Chang'e-4 landing site)
        const vonKarmanGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const vonKarmanMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333,
            shininess: 2
        });
        const vonKarman = new THREE.Mesh(vonKarmanGeometry, vonKarmanMaterial);
        vonKarman.position.copy(this.latLonToVector3(-45.4, 177.6, 1.95));
        vonKarman.scale.set(1, 0.1, 1);
        this.scene.add(vonKarman);
        
        // Chinese Chang'e-4 lander
        const changeLanderGeometry = new THREE.BoxGeometry(0.008, 0.006, 0.008);
        const changeLanderMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            shininess: 80,
            emissive: 0x110000
        });
        const changeLander = new THREE.Mesh(changeLanderGeometry, changeLanderMaterial);
        changeLander.position.copy(vonKarman.position);
        changeLander.position.y += 0.004;
        this.scene.add(changeLander);
    }

    createMare(mare) {
        const mareGeometry = new THREE.SphereGeometry(mare.size, 32, 32);
        const mareMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444, // Dark basalt color
            shininess: 1
        });

        const mareMesh = new THREE.Mesh(mareGeometry, mareMaterial);
        
        // Convert lat/lon to 3D position on moon surface
        const phi = (90 - mare.lat) * Math.PI / 180;
        const theta = (mare.lon + 180) * Math.PI / 180;
        const radius = 2.01;
        
        mareMesh.position.set(
            this.moon.position.x + radius * Math.sin(phi) * Math.cos(theta),
            this.moon.position.y + radius * Math.cos(phi),
            this.moon.position.z + radius * Math.sin(phi) * Math.sin(theta)
        );
        
        this.scene.add(mareMesh);
    }

    createLunarCrater(crater) {
        // Crater rim
        const rimGeometry = new THREE.RingGeometry(crater.size * 0.8, crater.size, 16);
        const rimMaterial = new THREE.MeshPhongMaterial({
            color: 0xe0e0e0,
            side: THREE.DoubleSide,
            shininess: 5
        });
        
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        
        // Crater floor
        const floorGeometry = new THREE.CircleGeometry(crater.size * 0.7, 16);
        const floorMaterial = new THREE.MeshPhongMaterial({
            color: 0x909090,
            shininess: 1
        });
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        
        // Position on moon surface
        const phi = (90 - crater.lat) * Math.PI / 180;
        const theta = (crater.lon + 180) * Math.PI / 180;
        const radius = 2.02;
        
        const x = this.moon.position.x + radius * Math.sin(phi) * Math.cos(theta);
        const y = this.moon.position.y + radius * Math.cos(phi);
        const z = this.moon.position.z + radius * Math.sin(phi) * Math.sin(theta);
        
        rim.position.set(x, y, z);
        floor.position.set(x, y, z);
        
        // Orient to surface
        rim.lookAt(this.moon.position);
        floor.lookAt(this.moon.position);
        
        // Add central peak for larger craters
        if (crater.size > 0.1) {
            const peakGeometry = new THREE.ConeGeometry(crater.size * 0.1, crater.depth * 2, 8);
            const peakMaterial = new THREE.MeshPhongMaterial({
                color: 0xd0d0d0,
                shininess: 10
            });
            
            const peak = new THREE.Mesh(peakGeometry, peakMaterial);
            peak.position.set(x, y, z);
            peak.lookAt(this.moon.position);
            peak.rotateX(Math.PI / 2);
            this.scene.add(peak);
        }
        
        this.scene.add(rim);
        this.scene.add(floor);
    }

    createRandomCraters() {
        for (let i = 0; i < 50; i++) {
            const crater = {
                lat: (Math.random() - 0.5) * 180,
                lon: (Math.random() - 0.5) * 360,
                size: 0.03 + Math.random() * 0.08,
                depth: 0.01 + Math.random() * 0.02
            };
            
            this.createLunarCrater(crater);
        }
    }

    createLunarHighlands() {
        // Create elevated areas (highlands)
        for (let i = 0; i < 20; i++) {
            const highlandGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 16, 16);
            const highlandMaterial = new THREE.MeshPhongMaterial({
                color: 0xf0f0f0,
                shininess: 5
            });

            const highland = new THREE.Mesh(highlandGeometry, highlandMaterial);
            
            const phi = Math.random() * Math.PI;
            const theta = Math.random() * Math.PI * 2;
            const radius = 2.05;
            
            highland.position.set(
                this.moon.position.x + radius * Math.sin(phi) * Math.cos(theta),
                this.moon.position.y + radius * Math.cos(phi),
                this.moon.position.z + radius * Math.sin(phi) * Math.sin(theta)
            );
            
            this.scene.add(highland);
        }
    }

    createLunarRilles() {
        // Create lunar valleys/rilles
        for (let i = 0; i < 5; i++) {
            const rilleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
            const rilleMaterial = new THREE.MeshPhongMaterial({
                color: 0x606060,
                shininess: 1
            });

            const rille = new THREE.Mesh(rilleGeometry, rilleMaterial);
            
            const phi = Math.random() * Math.PI;
            const theta = Math.random() * Math.PI * 2;
            const radius = 2.02;
            
            rille.position.set(
                this.moon.position.x + radius * Math.sin(phi) * Math.cos(theta),
                this.moon.position.y + radius * Math.cos(phi),
                this.moon.position.z + radius * Math.sin(phi) * Math.sin(theta)
            );
            
            rille.lookAt(this.moon.position);
            rille.rotateX(Math.PI / 2);
            
            this.scene.add(rille);
        }
    }

    createStarTrekFleet() {
        // Create different Star Trek ship types
        this.createEnterprise();
        this.createVoyager();
        this.createDefiant();
        this.createKlingonBirdOfPrey();
        this.createRomulanWarbird();
    }

    createEnterprise() {
        const enterprise = new THREE.Group();
        
        // Main hull (saucer section)
        const saucerGeometry = new THREE.CylinderGeometry(6, 6, 1.5, 32);
        const saucerMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            shininess: 100,
            specular: 0x444444
        });
        const saucer = new THREE.Mesh(saucerGeometry, saucerMaterial);
        saucer.rotation.x = Math.PI / 2;
        enterprise.add(saucer);
        
        // Bridge
        const bridgeGeometry = new THREE.SphereGeometry(1.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const bridgeMaterial = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa,
            shininess: 80
        });
        const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
        bridge.position.y = 1.5;
        enterprise.add(bridge);
        
        // Engineering hull
        const engineeringGeometry = new THREE.CylinderGeometry(2, 3, 8, 16);
        const engineeringMaterial = new THREE.MeshPhongMaterial({
            color: 0xdddddd,
            shininess: 90
        });
        const engineeringHull = new THREE.Mesh(engineeringGeometry, engineeringMaterial);
        engineeringHull.position.z = -6;
        engineeringHull.position.y = -2;
        enterprise.add(engineeringHull);
        
        // Nacelles (warp engines)
        for (let i = 0; i < 2; i++) {
            const nacelleGeometry = new THREE.CylinderGeometry(0.8, 0.8, 12, 12);
            const nacelleMaterial = new THREE.MeshPhongMaterial({
                color: 0x4444ff,
                shininess: 200,
                emissive: 0x001155
            });
            const nacelle = new THREE.Mesh(nacelleGeometry, nacelleMaterial);
            nacelle.rotation.z = Math.PI / 2;
            nacelle.position.x = i === 0 ? 4 : -4;
            nacelle.position.y = -1;
            nacelle.position.z = -8;
            
            // Warp coils
            for (let j = 0; j < 5; j++) {
                const coilGeometry = new THREE.TorusGeometry(1, 0.1, 8, 16);
                const coilMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00ffff,
                    emissive: 0x004444
                });
                const coil = new THREE.Mesh(coilGeometry, coilMaterial);
                coil.position.copy(nacelle.position);
                coil.position.z += (j - 2) * 2;
                coil.rotation.z = Math.PI / 2;
                enterprise.add(coil);
            }
            
            enterprise.add(nacelle);
        }
        
        // Deflector dish
        const deflectorGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const deflectorMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            emissive: 0x332200,
            transparent: true,
            opacity: 0.8
        });
        const deflector = new THREE.Mesh(deflectorGeometry, deflectorMaterial);
        deflector.position.z = -2;
        deflector.position.y = -2;
        enterprise.add(deflector);
        
        // Position and add to scene
        enterprise.position.set(80, 20, 30);
        enterprise.scale.setScalar(0.8);
        enterprise.userData = { 
            type: 'starTrekShip',
            shipClass: 'Constitution',
            name: 'USS Enterprise NCC-1701',
            originalPosition: enterprise.position.clone(),
            speed: 0.005
        };
        
        this.starTrekShips.push(enterprise);
        this.scene.add(enterprise);
    }

    createVoyager() {
        const voyager = new THREE.Group();
        
        // Main hull
        const hullGeometry = new THREE.BoxGeometry(8, 2, 12);
        const hullMaterial = new THREE.MeshPhongMaterial({
            color: 0xbbbbbb,
            shininess: 90
        });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        voyager.add(hull);
        
        // Command section
        const commandGeometry = new THREE.BoxGeometry(6, 1.5, 4);
        const commandMaterial = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa,
            shininess: 100
        });
        const command = new THREE.Mesh(commandGeometry, commandMaterial);
        command.position.y = 1.75;
        command.position.z = 2;
        voyager.add(command);
        
        // Variable geometry nacelles
        for (let i = 0; i < 2; i++) {
            const nacelleGroup = new THREE.Group();
            
            const nacelleGeometry = new THREE.BoxGeometry(1.5, 1, 8);
            const nacelleMaterial = new THREE.MeshPhongMaterial({
                color: 0x6666ff,
                shininess: 150,
                emissive: 0x001166
            });
            const nacelle = new THREE.Mesh(nacelleGeometry, nacelleMaterial);
            nacelleGroup.add(nacelle);
            
            nacelleGroup.position.x = i === 0 ? 5 : -5;
            nacelleGroup.position.y = 1;
            nacelleGroup.position.z = -2;
            
            voyager.add(nacelleGroup);
        }
        
        // Position and add to scene
        voyager.position.set(-70, 15, -40);
        voyager.scale.setScalar(0.6);
        voyager.userData = { 
            type: 'starTrekShip',
            shipClass: 'Intrepid',
            name: 'USS Voyager NCC-74656',
            originalPosition: voyager.position.clone(),
            speed: 0.008
        };
        
        this.starTrekShips.push(voyager);
        this.scene.add(voyager);
    }

    createDefiant() {
        const defiant = new THREE.Group();
        
        // Main hull (more angular/aggressive design)
        const hullGeometry = new THREE.BoxGeometry(4, 1.5, 6);
        const hullMaterial = new THREE.MeshPhongMaterial({
            color: 0x999999,
            shininess: 120
        });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        defiant.add(hull);
        
        // Forward section
        const forwardGeometry = new THREE.ConeGeometry(2, 3, 8);
        const forwardMaterial = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa,
            shininess: 100
        });
        const forward = new THREE.Mesh(forwardGeometry, forwardMaterial);
        forward.rotation.x = -Math.PI / 2;
        forward.position.z = 4.5;
        defiant.add(forward);
        
        // Compact nacelles
        for (let i = 0; i < 2; i++) {
            const nacelleGeometry = new THREE.BoxGeometry(0.8, 0.8, 4);
            const nacelleMaterial = new THREE.MeshPhongMaterial({
                color: 0x5555ff,
                shininess: 180,
                emissive: 0x001188
            });
            const nacelle = new THREE.Mesh(nacelleGeometry, nacelleMaterial);
            nacelle.position.x = i === 0 ? 2.5 : -2.5;
            nacelle.position.z = -1;
            defiant.add(nacelle);
        }
        
        // Position and add to scene
        defiant.position.set(50, -10, 60);
        defiant.scale.setScalar(0.7);
        defiant.userData = { 
            type: 'starTrekShip',
            shipClass: 'Defiant',
            name: 'USS Defiant NX-74205',
            originalPosition: defiant.position.clone(),
            speed: 0.012
        };
        
        this.starTrekShips.push(defiant);
        this.scene.add(defiant);
    }

    createKlingonBirdOfPrey() {
        const birdOfPrey = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.SphereGeometry(3, 16, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x336633,
            shininess: 60
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.scale.set(1, 0.5, 1.5);
        birdOfPrey.add(body);
        
        // Wings
        for (let i = 0; i < 2; i++) {
            const wingGeometry = new THREE.ConeGeometry(4, 8, 3);
            const wingMaterial = new THREE.MeshPhongMaterial({
                color: 0x224422,
                shininess: 40
            });
            const wing = new THREE.Mesh(wingGeometry, wingMaterial);
            wing.rotation.x = Math.PI / 2;
            wing.rotation.z = i === 0 ? Math.PI / 6 : -Math.PI / 6;
            wing.position.x = i === 0 ? 3 : -3;
            wing.position.z = -2;
            birdOfPrey.add(wing);
        }
        
        // Command section
        const commandGeometry = new THREE.SphereGeometry(1.5, 12, 12);
        const commandMaterial = new THREE.MeshPhongMaterial({
            color: 0x445544,
            shininess: 80
        });
        const command = new THREE.Mesh(commandGeometry, commandMaterial);
        command.position.y = 1;
        birdOfPrey.add(command);
        
        // Position and add to scene
        birdOfPrey.position.set(-90, 25, 20);
        birdOfPrey.scale.setScalar(0.8);
        birdOfPrey.userData = { 
            type: 'starTrekShip',
            shipClass: 'Bird-of-Prey',
            name: 'IKS Rotarran',
            originalPosition: birdOfPrey.position.clone(),
            speed: 0.007
        };
        
        this.starTrekShips.push(birdOfPrey);
        this.scene.add(birdOfPrey);
    }

    createRomulanWarbird() {
        const warbird = new THREE.Group();
        
        // Main hull (distinctive Romulan design)
        const hullGeometry = new THREE.SphereGeometry(4, 16, 16);
        const hullMaterial = new THREE.MeshPhongMaterial({
            color: 0x444466,
            shininess: 100
        });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        hull.scale.set(1, 0.3, 2);
        warbird.add(hull);
        
        // Wings (distinctive bird-like shape)
        for (let i = 0; i < 2; i++) {
            const wingGeometry = new THREE.ConeGeometry(6, 10, 4);
            const wingMaterial = new THREE.MeshPhongMaterial({
                color: 0x333355,
                shininess: 80
            });
            const wing = new THREE.Mesh(wingGeometry, wingMaterial);
            wing.rotation.x = Math.PI / 2;
            wing.rotation.z = i === 0 ? Math.PI / 4 : -Math.PI / 4;
            wing.position.x = i === 0 ? 4 : -4;
            wing.position.z = -3;
            warbird.add(wing);
        }
        
        // Command section
        const commandGeometry = new THREE.BoxGeometry(3, 1, 4);
        const commandMaterial = new THREE.MeshPhongMaterial({
            color: 0x555577,
            shininess: 120
        });
        const command = new THREE.Mesh(commandGeometry, commandMaterial);
        command.position.y = 1;
        command.position.z = 2;
        warbird.add(command);
        
        // Position and add to scene
        warbird.position.set(60, 30, -70);
        warbird.scale.setScalar(0.7);
        warbird.userData = { 
            type: 'starTrekShip',
            shipClass: 'D\'deridex',
            name: 'IRW Valdore',
            originalPosition: warbird.position.clone(),
            speed: 0.006
        };
        
        this.starTrekShips.push(warbird);
        this.scene.add(warbird);
    }

    createRockets() {
        for (let i = 0; i < 3; i++) {
            const rocket = this.createSingleRocket();
            rocket.position.set(
                Math.random() * 80 - 40,
                Math.random() * 40 - 20,
                Math.random() * 40 - 20
            );
            rocket.userData = { 
                type: 'rocket',
                originalPosition: rocket.position.clone(),
                speed: 0.01 + Math.random() * 0.02
            };
            this.rockets.push(rocket);
            this.scene.add(rocket);
        }
    }

    createSingleRocket() {
        const rocketGroup = new THREE.Group();

        // Main rocket body (more realistic proportions)
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.6, 6, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xf5f5f5,
            shininess: 100,
            specular: 0x444444
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        rocketGroup.add(body);

        // Rocket nose cone (more aerodynamic)
        const noseGeometry = new THREE.ConeGeometry(0.4, 1.5, 16);
        const noseMaterial = new THREE.MeshPhongMaterial({
            color: 0xff4444,
            shininess: 80
        });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.y = 3.75;
        rocketGroup.add(nose);

        // Command module (crew compartment)
        const commandGeometry = new THREE.CylinderGeometry(0.35, 0.4, 1.2, 16);
        const commandMaterial = new THREE.MeshPhongMaterial({
            color: 0x2255aa,
            shininess: 60
        });
        const commandModule = new THREE.Mesh(commandGeometry, commandMaterial);
        commandModule.position.y = 2.4;
        rocketGroup.add(commandModule);

        // Service module
        const serviceGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
        const serviceMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333,
            shininess: 40
        });
        const serviceModule = new THREE.Mesh(serviceGeometry, serviceMaterial);
        serviceModule.position.y = 1.0;
        rocketGroup.add(serviceModule);

        // Fuel tanks (multiple sections)
        for (let i = 0; i < 2; i++) {
            const tankGeometry = new THREE.CylinderGeometry(0.55, 0.6, 1.8, 16);
            const tankMaterial = new THREE.MeshPhongMaterial({
                color: 0xdddddd,
                shininess: 90
            });
            const tank = new THREE.Mesh(tankGeometry, tankMaterial);
            tank.position.y = -0.5 - (i * 2);
            rocketGroup.add(tank);
            
            // Tank separators
            const separatorGeometry = new THREE.CylinderGeometry(0.62, 0.62, 0.1, 16);
            const separatorMaterial = new THREE.MeshPhongMaterial({
                color: 0x444444,
                shininess: 20
            });
            const separator = new THREE.Mesh(separatorGeometry, separatorMaterial);
            separator.position.y = -1.4 - (i * 2);
            rocketGroup.add(separator);
        }

        // Rocket fins (more aerodynamic shape)
        for (let i = 0; i < 4; i++) {
            const finGeometry = new THREE.ConeGeometry(0.3, 1.5, 3);
            const finMaterial = new THREE.MeshPhongMaterial({
                color: 0x222222,
                shininess: 30
            });
            const fin = new THREE.Mesh(finGeometry, finMaterial);
            fin.position.y = -2.5;
            fin.position.x = Math.cos(i * Math.PI / 2) * 0.8;
            fin.position.z = Math.sin(i * Math.PI / 2) * 0.8;
            fin.rotateZ(i * Math.PI / 2);
            fin.rotateX(Math.PI / 2);
            rocketGroup.add(fin);
        }

        // Engine nozzles (multiple for realism)
        const mainEngineGeometry = new THREE.ConeGeometry(0.3, 1.2, 16);
        const engineMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444,
            shininess: 100
        });
        const mainEngine = new THREE.Mesh(mainEngineGeometry, engineMaterial);
        mainEngine.position.y = -4.1;
        rocketGroup.add(mainEngine);

        // Secondary engines
        for (let i = 0; i < 4; i++) {
            const secEngineGeometry = new THREE.ConeGeometry(0.15, 0.8, 12);
            const secEngine = new THREE.Mesh(secEngineGeometry, engineMaterial);
            secEngine.position.y = -3.8;
            secEngine.position.x = Math.cos(i * Math.PI / 2) * 0.4;
            secEngine.position.z = Math.sin(i * Math.PI / 2) * 0.4;
            rocketGroup.add(secEngine);
        }

        // Rocket exhaust flames
        this.createRocketExhaust(rocketGroup);
        
        // Add details like windows, antennas, etc.
        this.addRocketDetails(rocketGroup);

        return rocketGroup;
    }

    createRocketExhaust(rocketGroup) {
        // Main engine exhaust
        const mainExhaustGeometry = new THREE.ConeGeometry(0.25, 2.5, 16);
        const mainExhaustMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.8
        });
        const mainExhaust = new THREE.Mesh(mainExhaustGeometry, mainExhaustMaterial);
        mainExhaust.position.y = -5.8;
        rocketGroup.add(mainExhaust);

        // Secondary exhausts
        for (let i = 0; i < 4; i++) {
            const secExhaustGeometry = new THREE.ConeGeometry(0.12, 1.5, 12);
            const secExhaustMaterial = new THREE.MeshBasicMaterial({
                color: 0x0088ff,
                transparent: true,
                opacity: 0.6
            });
            const secExhaust = new THREE.Mesh(secExhaustGeometry, secExhaustMaterial);
            secExhaust.position.y = -5.0;
            secExhaust.position.x = Math.cos(i * Math.PI / 2) * 0.4;
            secExhaust.position.z = Math.sin(i * Math.PI / 2) * 0.4;
            rocketGroup.add(secExhaust);
        }

        // Exhaust particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 2;
            positions[i3 + 1] = -6 - Math.random() * 4;
            positions[i3 + 2] = (Math.random() - 0.5) * 2;
            
            // Hot exhaust colors
            colors[i3] = 0.2 + Math.random() * 0.8;     // R
            colors[i3 + 1] = 0.5 + Math.random() * 0.5; // G
            colors[i3 + 2] = 1.0;                       // B
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true
        });

        const exhaustParticles = new THREE.Points(particleGeometry, particleMaterial);
        rocketGroup.add(exhaustParticles);
    }

    addRocketDetails(rocketGroup) {
        // Command module windows
        for (let i = 0; i < 6; i++) {
            const windowGeometry = new THREE.CircleGeometry(0.08, 8);
            const windowMaterial = new THREE.MeshBasicMaterial({
                color: 0x88ddff,
                transparent: true,
                opacity: 0.8
            });
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.y = 2.4;
            window.position.x = Math.cos(i * Math.PI / 3) * 0.36;
            window.position.z = Math.sin(i * Math.PI / 3) * 0.36;
            window.lookAt(
                window.position.x * 2,
                window.position.y,
                window.position.z * 2
            );
            rocketGroup.add(window);
        }

        // Communication antenna
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
        const antennaMaterial = new THREE.MeshPhongMaterial({
            color: 0x666666,
            shininess: 50
        });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.y = 4.5;
        antenna.rotateZ(Math.PI / 6);
        rocketGroup.add(antenna);

        // Solar panels
        for (let i = 0; i < 2; i++) {
            const panelGeometry = new THREE.BoxGeometry(0.1, 2, 1.5);
            const panelMaterial = new THREE.MeshPhongMaterial({
                color: 0x001133,
                shininess: 200
            });
            const panel = new THREE.Mesh(panelGeometry, panelMaterial);
            panel.position.y = 1.0;
            panel.position.x = i === 0 ? 1.2 : -1.2;
            rocketGroup.add(panel);
        }

        // Thruster clusters
        for (let i = 0; i < 8; i++) {
            const thrusterGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
            const thrusterMaterial = new THREE.MeshPhongMaterial({
                color: 0x333333,
                shininess: 80
            });
            const thruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
            thruster.position.y = 0.2;
            thruster.position.x = Math.cos(i * Math.PI / 4) * 0.7;
            thruster.position.z = Math.sin(i * Math.PI / 4) * 0.7;
            thruster.rotateX(Math.PI / 2);
            rocketGroup.add(thruster);
        }
    }

    createNebula() {
        const nebulaGeometry = new THREE.SphereGeometry(200, 32, 32);
        const nebulaMaterial = new THREE.MeshBasicMaterial({
            color: 0x663399,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        this.scene.add(nebula);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('click', (event) => this.onMouseClick(event));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        this.mouse.x = this.mouseX;
        this.mouse.y = this.mouseY;

        // Raycasting for hover effects
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.earth, this.moon, ...this.rockets]);

        // Reset all info panels
        document.querySelectorAll('.info-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        if (intersects.length > 0) {
            const object = intersects[0].object;
            let panelId = '';
            
            if (object.userData.type === 'earth' || object.parent?.userData?.type === 'earth') {
                panelId = 'earth-info';
            } else if (object.userData.type === 'moon' || object.parent?.userData?.type === 'moon') {
                panelId = 'moon-info';
            } else if (object.userData.type === 'rocket' || object.parent?.userData?.type === 'rocket') {
                panelId = 'rocket-info';
            }

            if (panelId) {
                const panel = document.getElementById(panelId);
                panel.classList.add('active');
                panel.style.left = event.clientX + 20 + 'px';
                panel.style.top = event.clientY - 50 + 'px';
            }

            this.hoveredObject = object.userData.type === 'rocket' ? 
                (object.parent || object) : object;
        } else {
            this.hoveredObject = null;
        }
    }

    onMouseClick(event) {
        // Handle click interactions
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.earth, this.moon, ...this.rockets]);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            if (object.userData.type === 'earth') {
                showSection('about');
            } else if (object.userData.type === 'moon') {
                showSection('projects');
            } else if (object.userData.type === 'rocket' || object.parent?.userData?.type === 'rocket') {
                showSection('resume');
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.0005;

        // Rotate Earth
        if (this.earth) {
            this.earth.rotation.y += 0.01;
        }

        // Orbit Moon around Earth
        if (this.moon) {
            const moonDistance = 30;
            this.moon.position.x = this.earth.position.x + Math.cos(time * 0.5) * moonDistance;
            this.moon.position.z = this.earth.position.z + Math.sin(time * 0.5) * moonDistance;
            this.moon.rotation.y += 0.005;
        }

        // Animate rockets with realistic exhaust effects
        this.rockets.forEach((rocket, index) => {
            const speed = rocket.userData.speed;
            const radius = 60;
            const offset = index * (Math.PI * 2 / 3);
            
            rocket.position.x = Math.cos(time * speed + offset) * radius;
            rocket.position.z = Math.sin(time * speed + offset) * radius;
            rocket.position.y = Math.sin(time * speed * 2 + offset) * 20;
            
            // Look at the direction of movement
            const nextX = Math.cos(time * speed + offset + 0.1) * radius;
            const nextZ = Math.sin(time * speed + offset + 0.1) * radius;
            rocket.lookAt(nextX, rocket.position.y, nextZ);

            // Animate exhaust particles
            rocket.children.forEach(child => {
                if (child.type === 'Points') {
                    const positions = child.geometry.attributes.position.array;
                    for (let i = 1; i < positions.length; i += 3) {
                        positions[i] -= 0.2; // Move particles down
                        if (positions[i] < -15) {
                            positions[i] = -6; // Reset particle position
                        }
                    }
                    child.geometry.attributes.position.needsUpdate = true;
                }
            });

            // Hover effect
            if (this.hoveredObject === rocket) {
                rocket.scale.setScalar(1.2);
                rocket.children.forEach(child => {
                    if (child.material && child.material.emissive) {
                        child.material.emissive.setHex(0x002200);
                    }
                });
            } else {
                rocket.scale.setScalar(1);
                rocket.children.forEach(child => {
                    if (child.material && child.material.emissive) {
                        child.material.emissive.setHex(0x000000);
                    }
                });
            }
        });

        // Animate Star Trek ships
        this.starTrekShips.forEach(ship => {
            const time = Date.now() * ship.userData.speed;
            
            // Create patrol patterns for different ship types
            switch (ship.userData.shipClass) {
                case 'Constitution': // Enterprise - circular patrol around Earth
                    ship.position.x = Math.cos(time) * 80 + 10;
                    ship.position.z = Math.sin(time) * 80 + 10;
                    ship.position.y = 20 + Math.sin(time * 2) * 5;
                    ship.lookAt(0, 0, 0); // Look towards Earth
                    break;
                    
                case 'Intrepid': // Voyager - figure-8 pattern
                    ship.position.x = Math.cos(time) * 70 - 20;
                    ship.position.z = Math.sin(time * 2) * 40 - 10;
                    ship.position.y = 15 + Math.cos(time * 3) * 8;
                    ship.rotation.y = time * 0.5;
                    break;
                    
                case 'Defiant': // Defiant - aggressive zigzag patrol
                    ship.position.x = 50 + Math.sin(time * 2) * 30;
                    ship.position.z = 60 + Math.cos(time * 1.5) * 40;
                    ship.position.y = -10 + Math.sin(time * 4) * 15;
                    ship.rotation.z = Math.sin(time * 3) * 0.3;
                    break;
                    
                case 'Bird-of-Prey': // Klingon - predatory circling
                    ship.position.x = -90 + Math.cos(time * 0.8) * 50;
                    ship.position.z = 20 + Math.sin(time * 0.8) * 60;
                    ship.position.y = 25 + Math.sin(time * 1.2) * 10;
                    ship.rotation.y = -time * 0.8;
                    // Wing movement simulation
                    ship.children.forEach((child, index) => {
                        if (index === 1 || index === 2) { // Wings
                            child.rotation.x = Math.PI / 2 + Math.sin(time * 2) * 0.2;
                        }
                    });
                    break;
                    
                case 'D\'deridex': // Romulan Warbird - stealthy approach
                    ship.position.x = 60 + Math.sin(time * 0.6) * 40;
                    ship.position.z = -70 + Math.cos(time * 0.4) * 50;
                    ship.position.y = 30 + Math.cos(time * 0.8) * 12;
                    ship.rotation.y = time * 0.3;
                    // Cloaking effect simulation
                    ship.traverse(child => {
                        if (child.isMesh) {
                            child.material.opacity = 0.7 + Math.sin(time * 5) * 0.3;
                        }
                    });
                    break;
            }
            
            // Add warp trail effects for nacelles
            if (ship.userData.shipClass === 'Constitution' || ship.userData.shipClass === 'Intrepid') {
                ship.children.forEach(child => {
                    if (child.material && child.material.emissive) {
                        const intensity = (Math.sin(time * 10) + 1) * 0.5;
                        child.material.emissive.setHex(child.material.emissive.getHex());
                        child.material.emissiveIntensity = intensity;
                    }
                });
            }
        });

        // Animate asteroids in their belt
        if (this.asteroids) {
            this.asteroids.forEach(asteroid => {
                asteroid.userData.angle += asteroid.userData.speed;
                asteroid.position.x = Math.cos(asteroid.userData.angle) * asteroid.userData.radius;
                asteroid.position.z = Math.sin(asteroid.userData.angle) * asteroid.userData.radius;
                
                // Rotate asteroid
                asteroid.rotation.x += 0.01;
                asteroid.rotation.y += 0.005;
                asteroid.rotation.z += 0.003;
            });
        }

        // Animate cloud layer rotation
        if (this.cloudLayer) {
            this.cloudLayer.rotation.y += 0.0002;
        }

        // Animate space dust
        if (this.spaceDust) {
            this.spaceDust.rotation.y += 0.00005;
            this.spaceDust.rotation.x += 0.00002;
        }

        // Animate comets with elliptical orbits
        if (this.comets) {
            this.comets.forEach(comet => {
                comet.userData.angle += comet.userData.speed;
                
                // Calculate elliptical orbit position
                const a = comet.userData.semiMajorAxis;
                const e = comet.userData.eccentricity;
                const angle = comet.userData.angle;
                const r = a * (1 - e * e) / (1 + e * Math.cos(angle));
                
                comet.position.x = r * Math.cos(angle);
                comet.position.z = r * Math.sin(angle) * Math.cos(comet.userData.inclination);
                comet.position.y = r * Math.sin(angle) * Math.sin(comet.userData.inclination);
                
                // Point tail away from sun (origin)
                comet.lookAt(0, 0, 0);
                
                // Rotate nucleus
                comet.children[0].rotation.x += 0.02;
                comet.children[0].rotation.y += 0.01;
            });
        }

        // Animate satellites orbiting Earth
        if (this.satellites) {
            this.satellites.forEach(satellite => {
                satellite.userData.angle += satellite.userData.speed;
                
                const radius = satellite.userData.radius;
                const angle = satellite.userData.angle;
                
                satellite.position.x = this.earth.position.x + Math.cos(angle) * radius;
                satellite.position.z = this.earth.position.z + Math.sin(angle) * radius;
                satellite.position.y = this.earth.position.y + satellite.userData.altitude;
                
                // Point solar panels toward sun
                satellite.lookAt(100, 100, 50);
                
                // Rotate satellite slowly
                satellite.rotation.z += 0.005;
            });
        }

        // Rotate stars slowly with multiple layers
        if (this.stars) {
            this.stars.rotation.y += 0.0001;
        }

        // Camera movement based on mouse
        this.camera.position.x += (this.mouseX * 10 - this.camera.position.x) * 0.02;
        this.camera.position.y += (-this.mouseY * 10 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.isLoaded = true;
            }, 500);
        }, 2000);
    }
}

// Navigation and UI Functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const targetLink = document.querySelector(`[href="#${sectionId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
}

// Mission Timer
function updateMissionTime() {
    const startTime = new Date('2025-01-01T00:00:00');
    const now = new Date();
    const diff = now - startTime;
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timeElement = document.getElementById('mission-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Navigation Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the space scene
    const spaceScene = new SpaceScene();
    
    // Setup navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
        });
    });
    
    // Start mission timer
    updateMissionTime();
    setInterval(updateMissionTime, 1000);
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Transmission received! Thank you for your message.');
            this.reset();
        });
    }
    
    // Download resume button
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadResume();
        });
    }
});

// Resume download function
function downloadResume() {
    // Create a link to download the actual PDF file
    const link = document.createElement('a');
    link.href = './Abhipreet_Choudhary_Resume.pdf';
    link.download = 'Abhipreet_Choudhary_Resume.pdf';
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message with space theme
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #00ffff, #ff00ff);
        color: #000;
        padding: 15px 25px;
        border-radius: 10px;
        font-family: 'Orbitron', monospace;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.5s ease-out;
        box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
    `;
    notification.textContent = '🚀 Resume Download Initiated!';
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add some particle effects on hover
function createParticleEffect(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = '#00ffff';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.animation = 'particle-float 1s ease-out forwards';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Add CSS for particle animation and notifications
const style = document.createElement('style');
style.textContent = `
@keyframes particle-float {
    0% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0);
    }
}

@keyframes slideIn {
    0% {
        transform: translateX(100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    0% {
        transform: translateX(0);
        opacity: 1;
    }
    100% {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

// Add particle effects on certain interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-button') || 
        e.target.classList.contains('explore-btn') ||
        e.target.classList.contains('submit-btn')) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createParticleEffect(
                    e.clientX + (Math.random() * 20 - 10),
                    e.clientY + (Math.random() * 20 - 10)
                );
            }, i * 100);
        }
    }
});

// ===== SPACE INVADERS 90s RETRO GAME =====
class SpaceInvadersGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameSpeed = 60; // FPS
        
        // Game objects
        this.player = null;
        this.bullets = [];
        this.invaders = [];
        this.invaderBullets = [];
        this.barriers = [];
        this.powerUps = [];
        
        // Game settings
        this.invaderSpeed = 1;
        this.invaderDirection = 1;
        this.invaderDropSpeed = 20;
        this.lastShot = 0;
        this.shotCooldown = 250; // milliseconds
        
        // Input handling
        this.keys = {};
        
        this.init();
    }
    
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.setupEventListeners();
        this.resetGame();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.shoot();
            }
            if (e.code === 'KeyP') {
                this.pauseGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.bullets = [];
        this.invaderBullets = [];
        this.powerUps = [];
        
        this.createPlayer();
        this.createInvaders();
        this.createBarriers();
        this.updateUI();
    }
    
    createPlayer() {
        this.player = {
            x: this.canvas.width / 2 - 25,
            y: this.canvas.height - 60,
            width: 50,
            height: 30,
            speed: 5,
            color: '#00ffff'
        };
    }
    
    createInvaders() {
        this.invaders = [];
        const rows = 5;
        const cols = 10;
        const invaderWidth = 40;
        const invaderHeight = 30;
        const spacing = 50;
        const startX = 50;
        const startY = 50;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const invaderType = row < 2 ? 'elite' : row < 4 ? 'soldier' : 'scout';
                this.invaders.push({
                    x: startX + col * spacing,
                    y: startY + row * spacing,
                    width: invaderWidth,
                    height: invaderHeight,
                    type: invaderType,
                    alive: true,
                    animFrame: 0,
                    points: invaderType === 'elite' ? 30 : invaderType === 'soldier' ? 20 : 10
                });
            }
        }
    }
    
    createBarriers() {
        this.barriers = [];
        const barrierCount = 4;
        const barrierWidth = 80;
        const barrierHeight = 60;
        const spacing = (this.canvas.width - (barrierCount * barrierWidth)) / (barrierCount + 1);
        
        for (let i = 0; i < barrierCount; i++) {
            const barrier = {
                x: spacing + i * (barrierWidth + spacing),
                y: this.canvas.height - 200,
                width: barrierWidth,
                height: barrierHeight,
                blocks: []
            };
            
            // Create destructible blocks
            const blockSize = 4;
            const blocksX = Math.floor(barrierWidth / blockSize);
            const blocksY = Math.floor(barrierHeight / blockSize);
            
            for (let bx = 0; bx < blocksX; bx++) {
                barrier.blocks[bx] = [];
                for (let by = 0; by < blocksY; by++) {
                    // Create barrier shape (arch-like)
                    const centerX = blocksX / 2;
                    const distFromCenter = Math.abs(bx - centerX);
                    const archHeight = Math.floor(blocksY * 0.7);
                    const gateHeight = Math.floor(blocksY * 0.4);
                    
                    if (by < archHeight && (distFromCenter > 2 || by < gateHeight)) {
                        barrier.blocks[bx][by] = true;
                    } else {
                        barrier.blocks[bx][by] = false;
                    }
                }
            }
            
            this.barriers.push(barrier);
        }
    }
    
    shoot() {
        const now = Date.now();
        if (now - this.lastShot > this.shotCooldown) {
            this.bullets.push({
                x: this.player.x + this.player.width / 2 - 2,
                y: this.player.y,
                width: 4,
                height: 10,
                speed: 7,
                color: '#ffff00'
            });
            this.lastShot = now;
            this.playSound('shoot');
        }
    }
    
    invaderShoot() {
        if (this.invaders.length === 0) return;
        
        // Random chance for invaders to shoot
        if (Math.random() < 0.001 + (this.level * 0.0005)) {
            const frontInvaders = this.getFrontInvaders();
            if (frontInvaders.length > 0) {
                const shooter = frontInvaders[Math.floor(Math.random() * frontInvaders.length)];
                this.invaderBullets.push({
                    x: shooter.x + shooter.width / 2 - 2,
                    y: shooter.y + shooter.height,
                    width: 4,
                    height: 10,
                    speed: 3,
                    color: '#ff0066'
                });
            }
        }
    }
    
    getFrontInvaders() {
        const columns = {};
        this.invaders.forEach(invader => {
            if (invader.alive) {
                const col = Math.floor(invader.x / 50);
                if (!columns[col] || invader.y > columns[col].y) {
                    columns[col] = invader;
                }
            }
        });
        return Object.values(columns);
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.updatePlayer();
        this.updateBullets();
        this.updateInvaders();
        this.updateInvaderBullets();
        this.checkCollisions();
        this.invaderShoot();
        this.checkWinLose();
    }
    
    updatePlayer() {
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > -bullet.height;
        });
    }
    
    updateInvaders() {
        let shouldDrop = false;
        
        // Check if any invader hits the edge
        this.invaders.forEach(invader => {
            if (invader.alive) {
                if ((invader.x <= 0 && this.invaderDirection === -1) || 
                    (invader.x >= this.canvas.width - invader.width && this.invaderDirection === 1)) {
                    shouldDrop = true;
                }
            }
        });
        
        if (shouldDrop) {
            this.invaderDirection *= -1;
            this.invaders.forEach(invader => {
                if (invader.alive) {
                    invader.y += this.invaderDropSpeed;
                }
            });
        }
        
        // Move invaders
        this.invaders.forEach(invader => {
            if (invader.alive) {
                invader.x += this.invaderSpeed * this.invaderDirection;
                invader.animFrame = (invader.animFrame + 0.1) % 2;
            }
        });
    }
    
    updateInvaderBullets() {
        this.invaderBullets = this.invaderBullets.filter(bullet => {
            bullet.y += bullet.speed;
            return bullet.y < this.canvas.height;
        });
    }
    
    checkCollisions() {
        // Player bullets vs invaders
        this.bullets.forEach((bullet, bulletIndex) => {
            this.invaders.forEach((invader, invaderIndex) => {
                if (invader.alive && this.collision(bullet, invader)) {
                    this.invaders[invaderIndex].alive = false;
                    this.bullets.splice(bulletIndex, 1);
                    this.score += invader.points;
                    this.updateUI();
                    this.playSound('invaderDeath');
                    
                    // Chance to spawn power-up
                    if (Math.random() < 0.1) {
                        this.spawnPowerUp(invader.x, invader.y);
                    }
                }
            });
        });
        
        // Invader bullets vs player
        this.invaderBullets.forEach((bullet, bulletIndex) => {
            if (this.collision(bullet, this.player)) {
                this.invaderBullets.splice(bulletIndex, 1);
                this.lives--;
                this.updateUI();
                this.playSound('playerHit');
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        });
        
        // Bullets vs barriers
        [...this.bullets, ...this.invaderBullets].forEach((bullet, bulletIndex, bulletArray) => {
            this.barriers.forEach(barrier => {
                if (this.collision(bullet, barrier)) {
                    this.damageBarrier(barrier, bullet);
                    bulletArray.splice(bulletIndex, 1);
                }
            });
        });
        
        // Invaders vs player (direct collision)
        this.invaders.forEach(invader => {
            if (invader.alive && this.collision(invader, this.player)) {
                this.gameOver();
            }
        });
    }
    
    collision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    damageBarrier(barrier, bullet) {
        const relativeX = Math.floor((bullet.x - barrier.x) / 4);
        const relativeY = Math.floor((bullet.y - barrier.y) / 4);
        
        // Damage area around impact
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const bx = relativeX + dx;
                const by = relativeY + dy;
                if (bx >= 0 && bx < barrier.blocks.length && 
                    by >= 0 && by < barrier.blocks[0].length) {
                    barrier.blocks[bx][by] = false;
                }
            }
        }
    }
    
    spawnPowerUp(x, y) {
        const powerUpTypes = ['rapid-fire', 'multi-shot', 'shield'];
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        this.powerUps.push({
            x: x,
            y: y,
            width: 20,
            height: 20,
            type: type,
            speed: 2,
            color: type === 'rapid-fire' ? '#ffff00' : type === 'multi-shot' ? '#ff6600' : '#00ff00'
        });
    }
    
    checkWinLose() {
        const aliveInvaders = this.invaders.filter(invader => invader.alive);
        
        if (aliveInvaders.length === 0) {
            this.nextLevel();
        }
        
        // Check if invaders reached the bottom
        aliveInvaders.forEach(invader => {
            if (invader.y + invader.height >= this.canvas.height - 100) {
                this.gameOver();
            }
        });
    }
    
    nextLevel() {
        this.level++;
        this.invaderSpeed += 0.5;
        this.shotCooldown = Math.max(150, this.shotCooldown - 20);
        
        this.createInvaders();
        this.createBarriers();
        this.updateUI();
        this.playSound('levelUp');
    }
    
    gameOver() {
        this.gameRunning = false;
        this.showGameOverScreen();
    }
    
    showGameOverScreen() {
        const gameOverHTML = `
            <div class="game-over-screen">
                <h3>GAME OVER</h3>
                <p>Final Score: ${this.score}</p>
                <p>Level Reached: ${this.level}</p>
                <button onclick="spaceInvadersGame.startGame()">PLAY AGAIN</button>
                <button onclick="toggleSpaceInvaders()">EXIT</button>
            </div>
        `;
        
        document.getElementById('space-invaders-container').insertAdjacentHTML('beforeend', gameOverHTML);
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars background
        this.drawStars();
        
        // Draw player
        this.drawPlayer();
        
        // Draw invaders
        this.drawInvaders();
        
        // Draw bullets
        this.drawBullets();
        
        // Draw barriers
        this.drawBarriers();
        
        // Draw power-ups
        this.drawPowerUps();
        
        // Draw UI elements
        this.drawUI();
    }
    
    drawStars() {
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 100; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 73) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }
    
    drawPlayer() {
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Draw player cannon
        this.ctx.fillRect(this.player.x + this.player.width/2 - 3, this.player.y - 10, 6, 10);
    }
    
    drawInvaders() {
        this.invaders.forEach(invader => {
            if (invader.alive) {
                let color;
                switch (invader.type) {
                    case 'elite': color = '#ff0066'; break;
                    case 'soldier': color = '#00ff66'; break;
                    default: color = '#ffff00'; break;
                }
                
                this.ctx.fillStyle = color;
                
                // Simple animated invader sprite
                const frame = Math.floor(invader.animFrame);
                if (frame === 0) {
                    this.ctx.fillRect(invader.x + 5, invader.y, invader.width - 10, invader.height);
                    this.ctx.fillRect(invader.x, invader.y + 10, invader.width, 10);
                } else {
                    this.ctx.fillRect(invader.x, invader.y, invader.width, invader.height - 10);
                    this.ctx.fillRect(invader.x + 5, invader.y + 20, invader.width - 10, 10);
                }
            }
        });
    }
    
    drawBullets() {
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        this.invaderBullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }
    
    drawBarriers() {
        this.barriers.forEach(barrier => {
            this.ctx.fillStyle = '#00ff00';
            barrier.blocks.forEach((column, x) => {
                column.forEach((block, y) => {
                    if (block) {
                        this.ctx.fillRect(barrier.x + x * 4, barrier.y + y * 4, 4, 4);
                    }
                });
            });
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            this.ctx.fillStyle = powerUp.color;
            this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        });
    }
    
    drawUI() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Orbitron, monospace';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        this.ctx.fillText(`Lives: ${this.lives}`, 10, 50);
        this.ctx.fillText(`Level: ${this.level}`, 10, 70);
        
        if (this.gamePaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#00ffff';
            this.ctx.font = '48px Orbitron, monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.textAlign = 'left';
        }
    }
    
    updateUI() {
        document.getElementById('game-score').textContent = this.score;
        document.getElementById('game-lives').textContent = this.lives;
        document.getElementById('game-level').textContent = this.level;
    }
    
    playSound(type) {
        // Create simple sound effects using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch (type) {
            case 'shoot':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
                break;
            case 'invaderDeath':
                oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
                break;
            case 'playerHit':
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                break;
            case 'levelUp':
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    startGame() {
        // Remove any existing game over screen
        const gameOverScreen = document.querySelector('.game-over-screen');
        if (gameOverScreen) {
            gameOverScreen.remove();
        }
        
        this.resetGame();
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameLoop();
    }
    
    pauseGame() {
        this.gamePaused = !this.gamePaused;
        document.getElementById('pause-btn').textContent = this.gamePaused ? 'RESUME' : 'PAUSE';
    }
    
    gameLoop() {
        if (this.gameRunning) {
            this.update();
            this.render();
            setTimeout(() => this.gameLoop(), 1000 / this.gameSpeed);
        }
    }
}

// Global game instance
let spaceInvadersGame = null;

// Game control functions
function toggleSpaceInvaders() {
    const gameContainer = document.getElementById('space-invaders-container');
    
    if (gameContainer.classList.contains('hidden')) {
        // Show game
        gameContainer.classList.remove('hidden');
        if (!spaceInvadersGame) {
            spaceInvadersGame = new SpaceInvadersGame();
        }
        spaceInvadersGame.startGame();
    } else {
        // Hide game
        gameContainer.classList.add('hidden');
        if (spaceInvadersGame) {
            spaceInvadersGame.gameRunning = false;
        }
    }
}

function pauseGame() {
    if (spaceInvadersGame) {
        spaceInvadersGame.pauseGame();
    }
}
