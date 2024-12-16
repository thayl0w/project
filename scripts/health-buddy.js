document.addEventListener('DOMContentLoaded', () => {
    console.log('Welcome to BudgetBuddy!');

    // Select all images inside the .feature-card elements
    const images = document.querySelectorAll('.feature-card img');

    // Loop through each image and add a load event listener
    images.forEach(img => {
        img.addEventListener('load', () => {
            // Once the image is loaded, add the 'loaded' class to trigger fade-in
            img.classList.add('loaded');
        });
    });

    // Optionally, log when all images are ready (helpful for debugging)
    const allImagesLoaded = () => {
        let loadedCount = 0;
        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
            }
        });

        if (loadedCount === images.length) {
            console.log('All images are loaded and ready!');
        }
    };

    // Check the images every 1 second to log when they are ready
    setInterval(allImagesLoaded, 1000);
});