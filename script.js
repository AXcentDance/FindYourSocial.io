import createGlobe from 'https://cdn.skypack.dev/cobe';

document.addEventListener('DOMContentLoaded', () => {
    console.log('FindYourSocial.io loaded successfully');

    // Globe Initialization
    let phi = 0;
    const canvas = document.getElementById("cobe");

    if (canvas) {
        let currentPhi = 0;
        let currentTheta = 0;
        const doublePi = Math.PI * 2;
        const onResize = () => canvas.width = canvas.offsetWidth * 2;
        window.addEventListener('resize', onResize);
        onResize();

        let currentScale = 1;
        let targetScale = 1;

        // Interaction State
        let pointerInteracting = null;
        let pointerInteractionMovement = 0;
        let phi = 0;
        let theta = 0;

        const globe = createGlobe(canvas, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: [
                // Random markers for "modern points" effect
                { location: [37.7595, -122.4367], size: 0.03 }, // SF
                { location: [40.7128, -74.0060], size: 0.03 }, // NYC
                { location: [51.5074, -0.1278], size: 0.03 }, // London
                { location: [35.6762, 139.6503], size: 0.03 }, // Tokyo
                { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
                { location: [48.8566, 2.3522], size: 0.03 }, // Paris
                { location: [52.5200, 13.4050], size: 0.03 }, // Berlin
                { location: [1.3521, 103.8198], size: 0.03 }, // Singapore
                { location: [-23.5505, -46.6333], size: 0.03 }, // Sao Paulo
                { location: [19.4326, -99.1332], size: 0.03 }, // Mexico City
            ],
            onRender: (state) => {
                // Called on every animation frame.
                if (!pointerInteracting) {
                    phi += 0.005;
                }

                // Smoothly interpolate rotation
                state.phi = phi + currentPhi;
                state.theta = theta + currentTheta;

                // Smoothly interpolate scale
                currentScale += (targetScale - currentScale) * 0.1;
                state.scale = currentScale;

                state.width = 600 * 2;
                state.height = 600 * 2;
            },
        });

        // Drag Control
        canvas.addEventListener('pointerdown', (e) => {
            pointerInteracting = e.clientX - currentPhi;
            canvas.style.cursor = 'grabbing';
        });

        canvas.addEventListener('pointerup', () => {
            pointerInteracting = null;
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('pointerout', () => {
            pointerInteracting = null;
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('mousemove', (e) => {
            if (pointerInteracting !== null) {
                const delta = e.clientX - pointerInteracting;
                currentPhi = delta * 0.005;
            }
        });

        // Touch support for mobile drag
        canvas.addEventListener('touchmove', (e) => {
            if (pointerInteracting !== null && e.touches[0]) {
                e.preventDefault(); // Prevent scrolling while dragging globe
                const delta = e.touches[0].clientX - pointerInteracting;
                currentPhi = delta * 0.005;
            }
        }, { passive: false });

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches[0]) {
                pointerInteracting = e.touches[0].clientX - currentPhi;
                canvas.style.cursor = 'grabbing';
            }
        }, { passive: true });

        canvas.addEventListener('touchend', () => {
            pointerInteracting = null;
            canvas.style.cursor = 'grab';
        });

        // Zoom Control
        canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            const direction = e.deltaY > 0 ? -1 : 1;
            targetScale += direction * 0.1;
            // Clamp scale
            targetScale = Math.min(Math.max(targetScale, 0.5), 3);
        });
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
