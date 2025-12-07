import Globe from 'https://esm.sh/globe.gl';
import * as d3 from 'https://esm.sh/d3';

document.addEventListener('DOMContentLoaded', () => {
    console.log('FindYourSocial.io loaded successfully');

    const globeContainer = document.getElementById('globe-viz');

    if (globeContainer) {
        // Initialize Globe
        const world = Globe()
            (globeContainer)
            .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
            .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundColor('rgba(0,0,0,0)')
            .showGlobe(true) // Restore sphere for ocean
            .showAtmosphere(true) // Atmosphere looks good with dark mode
            .atmosphereColor('#3b82f6')
            .atmosphereAltitude(0.1)
            .width(globeContainer.offsetWidth)
            .height(globeContainer.offsetHeight)
            .pointOfView({ altitude: 2.5 }); // Initial zoom

        // Auto-rotate
        world.controls().autoRotate = false;
        world.controls().autoRotateSpeed = 0.5;

        // Load Country Borders
        fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(countries => {
                world.polygonsData(countries.features)
                    .polygonCapColor(() => '#1e293b') // Dark slate for land
                    .polygonSideColor(() => 'rgba(0,0,0,0)')
                    .polygonStrokeColor(() => '#94a3b8') // Light grey for borders
                    .polygonAltitude(0.01);

                // Zoom-dependent labels logic
                const updateLabels = () => {
                    const altitude = world.pointOfView().altitude;
                    // Show labels if zoomed in (altitude < 1.5)
                    if (altitude < 1.5) {
                        world.labelsData(countries.features)
                            .labelLat(d => d3.geoCentroid(d)[1])
                            .labelLng(d => d3.geoCentroid(d)[0])
                            .labelText(d => d.properties.ADMIN)
                            .labelSize(1.5)
                            .labelDotRadius(0)
                            .labelColor(() => '#f8fafc')
                            .labelResolution(2)
                            .labelAltitude(0.02);
                    } else {
                        world.labelsData([]); // Hide labels
                    }
                };

                // Attach listener to controls
                world.controls().addEventListener('change', updateLabels);

                // Initial check
                updateLabels();
            });

        // Handle Resize
        const onResize = () => {
            // Update container dimensions if needed via CSS, then tell globe
            // For simplicity, we rely on the container's size
            world.width(globeContainer.offsetWidth);
            world.height(globeContainer.offsetHeight);
        };
        window.addEventListener('resize', onResize);
    }

    // Add simple intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
});
