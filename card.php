<?php include 'db_get_category.php'; ?>
<!DOCTYPE html>
<html lang="ja">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>ワクワクコース</title>
	<!-- fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800;900&display=swap"
		rel="stylesheet">
	<!-- css -->
	<link rel="stylesheet" href="effect/effect.css">
	<link rel="stylesheet" href="css/style.css">
</head>

<body class="flex-box" id="flash-card">

	<!-- main body of card -->
	<main class="flex-box">
		<!-- カテゴリー選択 -->
		<select name="category" id="category-list">
			<option value="0">全て</option>
			<?php foreach ($categoryList as $category): ?>
				<option value="<?= $category['id'] ?>"><?= $category['name'] ?></option>
			<?php endforeach; ?>
		</select>
		<!-- Card Container -->
		<div class="wrapper" id="card-container">
			<div class="card flex-box">
				<div class="title">
					<h1 id="onomatope-title"></h1>
					<span id="onomatope-romaji"></span>
				</div>
				<div class="image flex-box">
					<img src="" alt="" id="onomatope-image">
				</div>
			</div>
		</div>
		<!-- 左右ボタン -->
		<button class="btn-pre-next" id="btn-prev" title="前"><i class="fa-solid fa-caret-left"></i></button>
		<button class="btn-pre-next" id="btn-next" title="次"><i class="fa-solid fa-caret-right"></i></button>
		<div id="EffectContainer"></div>
		</div>

		<div class="text flex-box">
			<div class="box">
				<i class="fa-solid fa-microphone" id="mic-icon"></i>
				<span id="user-speech">マイクをONにして話してみてください！</span>
			</div>
		</div>
	</main>

	<!-- 説明　Pop Up -->
	<div id="popup-overlay"></div>
	<div id="explanation-popup">
		<h2 id="popup-title">説明</h2>
		<p id="popup-explanation"></p>
		<button id="close-explanation">閉じる</button>
	</div>

	<!-- buttons -->
	<a href="index.php" class="btn btn-top btn-left btn-control btn-round flex-box" title="ホーム"><i class="fa-solid fa-house"></i></a>
	<a href="category.php" class="btn btn-top btn-left btn-control btn-round flex-box" id="btn-category" title="カテゴリー"><i class="fa-solid fa-list"></i></a>
	<button id="btn-effect" class="btn btn-top btn-right btn-control btn-round" title="音声"><i class="fa-solid fa-volume-low"></i></button>
	<button class="btn btn-bottom btn-left btn-control btn-explanation" title="説明">説明</button>
	<button class="btn btn-bottom btn-right btn-control btn-round" title="お気に入り"><i class="fa-solid fa-heart"></i></button>

	<!-- js -->
	<script src="https://kit.fontawesome.com/9670cd3151.js" crossorigin="anonymous"></script>
	<script src="effect/effect.js"></script>
	<script src="card.js"></script>
</body>

</html>