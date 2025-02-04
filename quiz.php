<?php include 'db_get_category.php'; ?>
<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ワクワクコース</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        #category-list {
            display: none;
        }

        /* Overlay for popup */
        #popup-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(77, 77, 77, 0.5);
            z-index: 999;
        }

        img.emote {
            width: 80px;
        }

        .right-hand {
            width: 200px;
        }
    </style>
</head>

<body class="flex-box" id="flash-card">

    <main class="flex-box" id="quiz">

        <div class="img-box" style="width: 30%;"></div>
        <button class="btn-pre-next" id="btn-next"><i class="fa-solid fa-caret-right"></i></button>

        <div class="right-hand" style="width: 50%;">
            <div class="text flex-box">
                <div class="box">
                    <i class="fa-solid fa-microphone"></i>
                    <span id="user-speech">きらきら</span>
                </div>
            </div>

            <!-- Emoji and text div -->
            <img class="emote" src="images/cool.png" alt="emote">
            <div class="text-container">
                <span id="dynamic-text">Dynamic Text</span>
            </div>
        </div>

    </main>

    <a href="index.php" class="btn btn-top btn-left btn-control btn-round flex-box"><i class="fa-solid fa-house"></i></a>
    <button class="btn btn-top btn-right btn-control btn-round"><i class="fa-solid fa-volume-low"></i></button>

    <!-- Audio -->
    <audio id="onomatope-audio">
        <source src="audio/キラキラ.mp3" type="audio/mpeg">
        お使いのブラウザーは音声再生に対応していません。
    </audio>

    <script src="https://kit.fontawesome.com/9670cd3151.js" crossorigin="anonymous"></script>
    <script src="quiz.js"></script>
</body>

</html>
