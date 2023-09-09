// const backgrounds = document.getElementsByClassName('background');

        // // Initialize the states
        // let bgStates = Array.from(backgrounds).map(bg => {
        //     const initialSize = parseInt(window.getComputedStyle(bg).getPropertyValue('font-size'));
        //     return {
        //         element: bg,
        //         fontSize: initialSize,
        //         initialSize: initialSize,
        //         direction: -1,
        //         skew: 0
        //     };
        // });

        // let lastTime = 0;
        // const interval = 1000 / 30; // Approximately 30 fps

        // function updateState(state) {
        //     state.fontSize += state.direction;

        //     if (state.fontSize <= 200) {
        //         state.direction = 0;
        //         setTimeout(() => {
        //             // state.element.style.transform = 'perspective(10px) rotate3d(10, 20, 30, 5deg)';
        //             state.direction = 1;
        //         }, 3000)
        //     } else if (state.fontSize >= state.initialSize + 700) {
        //         // state.element.style.transform = 'none';
        //         state.direction = -1;
        //     }
        // }
        // function draw(state) {
        //     state.element.style.fontSize = `${state.fontSize}px`;
        // }


        // function animate(timestamp) {
        //     const deltaTime = timestamp - lastTime;

        //     if (deltaTime > interval) {
        //         bgStates.forEach(state => {
        //             updateState(state);
        //             draw(state);
        //         });

        //         lastTime = timestamp - (deltaTime % interval);
        //     }

        //     requestAnimationFrame(animate);
        // }

        // requestAnimationFrame(animate);


        // const backgrounds = document.getElementsByClassName('background');

        // // Easing function
        // function easeInOutQuad(t) {
        //     return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        // }

        // // Initialize the states
        // let bgStates = Array.from(backgrounds).map(bg => {
        //     const initialSize = parseInt(window.getComputedStyle(bg).getPropertyValue('font-size'));
        //     return {
        //         element: bg,
        //         fontSize: initialSize,
        //         lowerBound: 200,
        //         upperBound: 1500,
        //         direction: -1,
        //         progress: 0, // to control easing
        //         skew: 0
        //     };
        // });

        // let lastTime = 0;
        // const interval = 1000 / 30; // Approximately 30 fps

        // function updateState(state) {
        //     state.progress += 0.001; // Adjusted for slower transition

        //     const easedProgress = easeInOutQuad(state.progress);

        //     if (state.direction === -1) {
        //         // Transitioning to the lower bound
        //         const changeAmount = easedProgress * (state.fontSize - state.lowerBound);
        //         state.fontSize -= Math.max(0.5, changeAmount); // Ensure at least 0.5px decrement
        //     } else {
        //         // Transitioning to the upper bound
        //         const changeAmount = easedProgress * (state.upperBound - state.fontSize);
        //         state.fontSize += Math.max(0.5, changeAmount); // Ensure at least 0.5px increment
        //     }

        //     if (state.fontSize <= state.lowerBound) {
        //         state.direction = 1; // Switch to increasing direction
        //         state.progress = 0; // Reset progress
        //     } else if (state.fontSize >= state.upperBound) {
        //         state.direction = -1; // Switch to decreasing direction
        //         state.progress = 0; // Reset progress
        //     }
        // }

        // function draw(state) {
        //     state.element.style.fontSize = `${state.fontSize}px`;
        // }

        // function animate(timestamp) {
        //     const deltaTime = timestamp - lastTime;

        //     if (deltaTime > interval) {
        //         bgStates.forEach(state => {
        //             updateState(state);
        //             draw(state);
        //         });

        //         lastTime = timestamp - (deltaTime % interval);
        //     }

        //     requestAnimationFrame(animate);
        // }

        // requestAnimationFrame(animate);
