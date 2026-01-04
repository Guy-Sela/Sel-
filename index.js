document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Header Scroll Logic
    const header = document.getElementById('main-header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Scrolling down
                    header.classList.add('header-hidden');
                } else {
                    // Scrolling up
                    header.classList.remove('header-hidden');
                }
                
                // Add background to header when scrolled past hero
                if (currentScrollY > window.innerHeight - 80) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Hero Background Logic (Mixed Videos and Iframes)
    const heroBg = document.getElementById('hero-bg');
    const backgroundItems = [
        { type: 'video', src: 'meditativeclocks/clocksInBackground/Ebb&FlowYoga.mp4' },
        { type: 'iframe', src: 'meditativeclocks/clocks/abstract_hourglass/index.html' },
        { type: 'video', src: 'meditativeclocks/clocksInBackground/Escalator - hourglass.mp4' },
        { type: 'iframe', src: 'meditativeclocks/clocks/universe_clock/index.html' },
        { type: 'video', src: 'meditativeclocks/clocksInBackground/PastPresentFutureAirport.mp4' },
        { type: 'iframe', src: 'meditativeclocks/clocks/serendipity/index.html' },
        { type: 'video', src: 'meditativeclocks/clocksInBackground/Serendipity BMW.mp4' },
        { type: 'iframe', src: 'meditativeclocks/clocks/present_past_and_future/index.html' },
        { type: 'video', src: 'meditativeclocks/clocksInBackground/street- univarse.mp4' },
        { type: 'iframe', src: 'meditativeclocks/clocks/the_ebb_and_flow_of_time/index.html' }
    ];

    let currentIndex = 0;
    const elements = [];

    // Initialize all elements
    backgroundItems.forEach((item, index) => {
        let el;
        if (item.type === 'video') {
            el = document.createElement('video');
            el.src = item.src;
            el.muted = true;
            el.loop = true;
            el.playsInline = true;
        } else {
            el = document.createElement('iframe');
            el.src = item.src;
        }
        
        el.classList.add('hero-media'); // Shared class for styling
        if (index === 0) el.classList.add('active');
        
        heroBg.appendChild(el);
        elements.push(el);
    });

    // Start the first video if it's a video
    if (elements[0].tagName === 'VIDEO') {
        elements[0].play().catch(e => console.log("Auto-play prevented:", e));
    }

    // Cycle Logic
    setInterval(() => {
        const currentEl = elements[currentIndex];
        
        // 1. Fade out current
        currentEl.classList.remove('active');
        
        // Wait for fade out to finish
        setTimeout(() => {
            if (currentEl.tagName === 'VIDEO') {
                currentEl.pause();
                currentEl.currentTime = 0;
            }

            // 2. Prepare next
            currentIndex = (currentIndex + 1) % elements.length;
            const nextEl = elements[currentIndex];

            // Start video if needed
            if (nextEl.tagName === 'VIDEO') {
                nextEl.play().catch(e => console.log("Play error:", e));
            }
            
            // 3. Fade in next
            nextEl.classList.add('active');
        }, 2000); // Wait for 2s fade out to complete before showing next

    }, 8000); // Switch every 8 seconds
});