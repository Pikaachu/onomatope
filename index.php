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
	
</head>
<body class="flex-box" id="main-menu">
    <main class="flex-box">
        <div class="wrapper flex-box">
            <div class="main-title">ペラペラオノマトペ</div>
            <div class="main-links">
                <a href="card.php" class="btn btn-main-menu">わくわくコース</a>
            </div>
            <div class="sub-links">
                <a href="category.php" class="btn btn-sub-menu">カテゴリー</a>
                <a href="backend/quiz.php" class="btn btn-sub-menu">コツコツクイズ</a>
            </div>
            
            <button id="voice-toggle">音声コマンドをオン</button>
            <div id="voice-status"></div>
        </div>
    </main>
<script src="script.js"></script>
</body>
</html>