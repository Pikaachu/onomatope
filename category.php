<?php include 'db_get_category.php'; ?>
<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ペラペラオノマトペ</title>
    <!-- fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800;900&display=swap"
        rel="stylesheet">
    <!-- css -->
    <link rel="stylesheet" href="css/style.css">

    <style>
      .mic-container{
      
       
        z-index: 2;
      }
    
        /* Horizontal and Vertical Lines */
        main::before,
        main::after {
            content: '';
            position: absolute;
            background-color: #000;
            z-index: 1;
        }

        /* Horizontal Line */
        main::before {
            width: 100%;
            height: 2px;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
        }

        /* Vertical Line */
        main::after {
            width: 2px;
            height: 100%;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
        }

    </style>

</head>

<body>

    <body class="flex-box" id="flash-card">
        <main class="flex-box">

            <div id="category-container">

                <div class="wrapper">
                    <div class="box-container">

                        <?php foreach ($categoryList as $index => $category): ?>

                            <?php
                            $position = '';
                            if ($category['id'] == 1) $position = 'top-left';
                            elseif ($category['id'] == 2) $position = 'top-right';
                            elseif ($category['id'] == 3) $position = 'bottom-left';
                            elseif ($category['id'] == 4) $position = 'bottom-right';
                            ?>
                            <a class="box-c <?= $position ?>"
                                href="card.php?category=<?= $category['id'] ?>"
                                data-category-id="<?= $category['id'] ?>"
                                data-audio="<?= htmlspecialchars($category['audio_path']) ?>"
                                data-image="<?= htmlspecialchars($category['image_path']) ?>"
                                data-position="<?= $position ?>">
                                <?= htmlspecialchars($category['name']) ?>
                            </a>
                        <?php endforeach; ?>
                    </div>

                    <!-- Container for hover images -->
                    <div id="hover-images-container">
                        <img id="hover-image-1" class="hover-image" src="" alt="">
                        <img id="hover-image-2" class="hover-image" src="" alt="">
                        <img id="hover-image-3" class="hover-image" src="" alt="">
                        <img id="hover-image-4" class="hover-image" src="" alt="">
                    </div>


                    <!-- Transparent effect image -->
                    <img id="effect-image" class="effect-image" src="" alt="Effect Image">


                    <!-- buttons -->
                    <a href="index.php" class="btn btn-top btn-left btn-control btn-round flex-box" style="z-index: 1000"><i class="fa-solid fa-house"></i></a>
                </div>

            </div>

            <!-- for マイク  -->
            
        </main>
        
        <!-- js -->
        <script src="https://kit.fontawesome.com/9670cd3151.js" crossorigin="anonymous"></script>
        <script>
            document.addEventListener("DOMContentLoaded", function() {
                const hoverImages = document.querySelectorAll(".hover-image");

                // Initialize images with faint opacity and set their positions
                document.querySelectorAll(".box-c").forEach(box => {
                    const categoryId = box.getAttribute("data-category-id");
                    const imageUrl = box.getAttribute("data-image");
                    const position = box.getAttribute("data-position");
                    const hoverImage = document.getElementById(`hover-image-${categoryId}`);

                    if (hoverImage && imageUrl) {
                        hoverImage.src = imageUrl; // Set the image source on page load
                        hoverImage.style.opacity = "0.3"; // Initially faint
                        hoverImage.style.display = "block"; // Ensure it's visible
                        hoverImage.style.transition = "opacity 0.3s ease-in-out"; // Smooth transition

                        // Positioning Logic
                        hoverImage.style.position = "absolute"; // Absolute positioning
                        hoverImage.style.top = "auto";
                        hoverImage.style.right = "auto";
                        hoverImage.style.bottom = "auto";
                        hoverImage.style.left = "auto";

                        // Set position based on the category
                        if (position === "top-right") {
                            hoverImage.style.top = "10px";
                            hoverImage.style.right = "10px";
                        } else if (position === "top-left") {
                            hoverImage.style.top = "10px";
                            hoverImage.style.left = "10px";
                        } else if (position === "bottom-left") {
                            hoverImage.style.bottom = "10px";
                            hoverImage.style.left = "10px";
                        } else if (position === "bottom-right") {
                            hoverImage.style.bottom = "10px";
                            hoverImage.style.right = "10px";
                        }
                    }

                    // Hover event to make the image fully visible
                    box.addEventListener("mouseenter", function() {
                        if (hoverImage) {
                            hoverImage.style.opacity = "1"; // Fully visible on hover
                        }
                    });

                    // Leave event to return image back to faint
                    box.addEventListener("mouseleave", function() {
                        if (hoverImage) {
                            hoverImage.style.opacity = "0.3"; // Back to faint when not hovering
                        }
                    });

                    box.addEventListener("click", function(event) {
                        event.preventDefault(); // Prevent default link action

                        const audioPath = this.getAttribute("data-audio");
                        const categoryId = this.getAttribute("data-category-id");
                        const effectImage = document.getElementById("effect-image");

                        // Fetch the image path dynamically from the category data
                        const imagePath = this.getAttribute("data-image");

                        // Show effect image
                        effectImage.src = imagePath;
                        effectImage.style.opacity = "1";
                        effectImage.style.width = "100%";
                        effectImage.style.height = "auto";

                        // Play audio
                        if (audioPath) {
                            let audio = new Audio(audioPath);
                            audio.play();
                        }


                        setTimeout(() => {
                            window.location.href = this.href;
                        }, 1500); // 1 second delay
                    });
                });
            });
        </script>

    </body>

</html>