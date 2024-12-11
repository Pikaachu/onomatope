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

<body class="flex-box" id="flash-card">
	<main class="flex-box">
		
		<div class="wrapper flex-box">
			<div class="title">
				<h1 id="onomatope-title">きらきら</h1>
				<span id="onomatope-romaji">(Kira Kira)</span>
			</div>

			<div class="image flex-box">
				<button class="btn-pre flex-box"><i class="fa-solid fa-caret-left"></i></button>
				<img src="images/kirakira.jpg" alt="オノマトペ例">
				<button class="btn-next flex-box"><i class="fa-solid fa-caret-right"></i></button>
			</div>
			
			<div class="text flex-box">
				<div class="box">
					<i class="fa-solid fa-microphone"></i>
					<span id="user-speech">きらきら</span>
				</div>
			</div>
		</div>
		
	</main>

	<!-- buttons -->
	 <a href="index.php" class="btn btn-top btn-left btn-control btn-round flex-box"><i class="fa-solid fa-house"></i></a>
	 <button class="btn btn-top btn-right btn-control btn-round"><i class="fa-solid fa-volume-low"></i></button>
	 <button class="btn btn-bottom btn-left btn-control btn-explanation">説明</button>
	 <button class="btn btn-bottom btn-right btn-control btn-round"><i class="fa-solid fa-heart"></i></button>



	<!-- js -->
	<script src="https://kit.fontawesome.com/9670cd3151.js" crossorigin="anonymous"></script>
	<script src="js/script.js"></script>
</body>

</html>