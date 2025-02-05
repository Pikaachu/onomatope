<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/quiz.css">
    <link rel="stylesheet" href="css/progress.css">
    <title>クイズ</title>
    <!-- fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800;900&display=swap"
        rel="stylesheet">
    <!-- script -->
    <script src="https://cdn.socket.io/4.0.1/socket.io.min.js"></script>

    <style>
        #result {
            margin-top: 10px;
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>


<body class="flex-box-top" id="flash-card">



    <main class="flex-box" id="quiz">

        <h1 class="no-flex"> クイズ</h1>

        <div class="img-box" style="width: 30%;"></div>

        <button class="btn-pre-next" id="btn-next"><i class="fa-solid fa-caret-right"></i></button>
       


        <div class="right-hand" style="width: 50%;">

            <div class="top" style="display: flex;  flex;align-items: center;gap: 40px; margin-bottom: 20px;">
                <div class="em-ba" style="display: flex;">
                    <img id="emote" class="emote" src="../images/emotion/happy1.png" alt="emote"
                        style="cursor: pointer; width: 90px;">


                </div>
                <div class="text-container">

                    <span id="dynamic-text">オノマトペを当ててみて！</span>
                </div>
            </div>

            <div class="text flex-box">
                <div class="box">
                    <i class="fa-solid fa-microphone"></i>
                    <span id="user-speech">きらきら</span>
                </div>
            </div>
            <span id="power1">感情: &nbsp;<div id="power"></div></span>
            <div class="progress-bar">

                <div class="progress-fill"></div>
            </div>


            <div id="result">フェッドバック:</div>
        </div>

        <button class="mic-button" id="voice-toggle">マイクオン</button>

    </main>

    

        	<!-- 説明　Pop Up -->
	<div id="popup-overlay"></div>
	<div id="explanation-popup">
		<h2 id="popup-title">ヒント（Hint）</h2>
		<p id="popup-explanation">
			「きらきら」は、輝く、光り輝く様子を表現する擬音語です。キラキラと光る宝石、晴れた日の太陽、きらめく星など、まぶしく輝く様子を生き生きと描写します。
		</p>
		<button id="close-explanation">閉じる</button>
	</div>


   <button class="btn btn-top btn-right btn-control btn-round"><i class="fa-solid fa-light fa-lightbulb" id="fa-lightbulb"></i></button>




    <a href="../index.php" class="btn btn-top btn-left btn-control btn-round flex-box"><i
            class="fa-solid fa-house"></i></a>
 

    <!-- <audio id="onomatope-audio">
        <source src="audio/キラキラ.mp3" type="audio/mpeg">
        お使いのブラウザーは音声再生に対応していません。
    </audio> -->

    <script src="https://kit.fontawesome.com/9670cd3151.js" crossorigin="anonymous"></script>

    <script src="javascript/script.js"></script>
    <script src="javascript/pop-up.js"></script>
</body>

</html>