  const textContainer = document.getElementById('alteText');
  const image = document.getElementById('displayedImage');
  const words = ["Your Students", "Your Clients", " & Friends"];
  const lowQualityImages =  ["./images/custom/African_student_low.jpg", "./images/custom/client_low.jpg", "./images/custom/friends_low.jpg"]; // Low-quality image URL
  const highQualityImages = ["./images/custom/African_student_high.jpg", "./images/custom/client_high.jpg", "./images/custom/friends_high.jpg"]; // Add image URLs
  let currentIndex = 0;
  
   // Preload the low-quality image and set the loading attribute to "lazy"
   const preloadedLowQualityImages = lowQualityImages.map((imageUrl) => {
        let img = new Image();
        img.src = imageUrl;
        img.loading = "lazy";
        return img;
   });

   // Preload the high-quality images
   const preloadedHighQualityImages = highQualityImages.map((imageUrl) => {
       let img = new Image();
       img.src = imageUrl;
       img.loading = "lazy";
       return img;
   });

  function writeAndErase() {
      if (currentIndex >= words.length) {
          currentIndex = 0; // Reset to the first word if we've reached the end
      }

      const word = words[currentIndex];
      const currentText = textContainer.textContent;
      const wordLength = word.length;
      const interval = 100; // Time in milliseconds for each character

      for (let i = 0; i <= wordLength; i++) {
          setTimeout(() => {
              textContainer.textContent = currentText + word.substring(0, i);
              if (i === wordLength) {
                setTimeout(() => {
                    erase();
                    showImage();
                }, 1000);
              }
          }, i * interval);
      }
  }

  function erase() {
      const currentText = textContainer.textContent;
      const interval = 50; // Time in milliseconds for each character

      for (let i = currentText.length; i >= 0; i--) {
          setTimeout(() => {
              textContainer.textContent = currentText.substring(0, i);
              if (i === 0) {
                  currentIndex++;
                  writeAndErase();
              }
          }, (currentText.length - i) * interval);
      }
  }

    // function showImage() {
       

    //     image.style.opacity = 0; // Initially set image to be transparent
    //     image.style.display = 'block'; // Make the image visible

    //     // Use jQuery to animate the image's opacity for a fade-in effect
    //     $(image).animate({ opacity: 1 }, 1000);

    //     // Preload the high-quality image if it's not already loaded
    //     const highQualityImage = preloadedHighQualityImages[currentIndex % highQualityImages.length];

    //     if (highQualityImage.complete) {
    //        // Change the image source when showing the image

    //         image.src = preloadedHighQualityImages[currentIndex % highQualityImages.length].src;
    //         image.style.opacity = 1;
    //     } else {
    //         // Change the image source when showing the image
    //         console.log('low')
         
    //         image.src = preloadedLowQualityImages[currentIndex % lowQualityImages.length].src;
    //         image.style.opacity = 1;
    //     }
    // }
    function showImage() {
        const highQualityImage = preloadedHighQualityImages[currentIndex % highQualityImages.length];

        // Check if the high-quality image has finished loading
        if (highQualityImage.complete) {
            // Change the image source to high quality
            image.src = highQualityImage.src;
        } else {
            // Change the image source to low quality
            image.src = preloadedLowQualityImages[currentIndex % lowQualityImages.length].src;
        }

        // Apply the CSS class to trigger the fade-in effect
        image.classList.add("fade-in");
    }
    
  writeAndErase(); // Start the process

