window.addEventListener("load", function () {
	const audioFiles = [
		"audio/dokidoki.mp3",
		"audio/kirakira.mp3",
		"audio/moyamoya.mp3",
		"audio/zaza.mp3",
		"audio/tonton.mp3",
		"audio/fuwafuwa.mp3",
		"audio/atsuatsu.mp3",
		"audio/gorogoro.mp3",
		"audio/pachipachi.mp3",
		"audio/shiin.mp3",
	];

	audioFiles.forEach(function (file) {
		const audio = new Audio(file);
		audio.preload = "auto";
	});
});

const btn = document.getElementById("btn-effect");
const effectContainer = document.getElementById("EffectContainer");

var effectList = {
	kirakira: kirakira,
	dokidoki: dokidoki,
	moyamoya: moyamoya,
	zaza: zaza,
	tonton: tonton,
	fuwafuwa: fuwafuwa,
	atsuatsu: atsuatsu,
	gorogoro: gorogoro,
	pachipachi: pachipachi,
	shiin: shiin,
};

btn.addEventListener("click", () => {
	let cardActive = document.querySelectorAll(".card.active");
    let effectName = cardActive[0].querySelector(".title").dataset.effect;
    effectList[effectName]();
	playAudio("audio/" + effectName);
});

var audio;
function playAudio(name) {
	audio = new Audio(name + ".mp3");
	audio.addEventListener("ended", () => {
		document.getElementById("EffectContainer").innerHTML = '';
	});
	audio.play();
}

function kirakira() {
	
	const sparkleSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#fed84d">
<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
</svg>`;

	for (let i = 0; i < 80; i++) {
		const x = Math.random() * window.innerWidth;
		const y = Math.random() * window.innerHeight;

		const sparkle = document.createElement("div");
		sparkle.className = "sparkle";
		sparkle.innerHTML = sparkleSVG;
		sparkle.style.left = `${x}px`;
		sparkle.style.top = `${y}px`;
		sparkle.style.setProperty("--x", `${Math.random() * 300 - 100}`);
		sparkle.style.setProperty("--y", `${Math.random() * 300 - 100}`);
		effectContainer.appendChild(sparkle);

		sparkle.addEventListener("animationend", () => {
			sparkle.remove();
		});
	}
}

function dokidoki() {
	effectContainer.innerHTML = '';

	const wrapper = document.createElement("div");
	wrapper.classList.add("dokidoki-wrapper");

	const heart = document.createElement("div");
	heart.classList.add("heart");

	wrapper.appendChild(heart);

	effectContainer.appendChild(wrapper);

}

// moyamoya.js
let moyamoyaInterval;  // グローバル変数としてインターバルを管理

function moyamoya() {
    // エフェクトをリセット
    effectContainer.innerHTML = '';

    const imagePaths = [
        "images/moyamoya/もやもや1.png",
        "images/moyamoya/もやもや2.png",
        "images/moyamoya/もやもや3.png",
        "images/moyamoya/もやもや4.png",
        "images/moyamoya/もやもや5.png",
        "images/moyamoya/もやもや6.png"
    ];

    let currentImageIndex = 0;

    moyamoyaInterval = setInterval(function () {
        const newImg = document.createElement('img');
        newImg.className = "moyamoya-img";
        newImg.src = imagePaths[currentImageIndex];
        newImg.alt = `もやもや ${currentImageIndex + 1}`;
        effectContainer.appendChild(newImg);
        newImg.style.opacity = 1;

        const oldImg = effectContainer.querySelector('img');
        if (oldImg && oldImg !== newImg) {
            oldImg.style.opacity = 0;
            setTimeout(function () {
                effectContainer.removeChild(oldImg);
            }, 20);
        }
        currentImageIndex = (currentImageIndex + 1) % imagePaths.length;
    }, 100);

    setTimeout(function () {
        clearInterval(moyamoyaInterval);
        effectContainer.innerHTML = '';
    }, 3020);
}

function zaza() {

	const existingCanvas = document.getElementById("zazaCanvas");
	if (existingCanvas) {
		existingCanvas.remove();
	}

	const canvas = document.createElement("canvas");
	canvas.id = "zazaCanvas";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	document.body.appendChild(canvas);

	const ctx = canvas.getContext("2d");

	const rainDrops = [];
	const numberOfDrops = 500;
	const rainColor = "rgba(181, 217, 237, 0.7)";
	let animationFrameId = null;

	function RainDrop() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.length = Math.random() * 20 + 10;
		this.speed = Math.random() * 5 + 2;
		this.opacity = Math.random() * 0.5 + 0.3;
	}

	RainDrop.prototype.draw = function () {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x, this.y + this.length);
		ctx.strokeStyle = rainColor.replace("0.7", this.opacity.toString());
		ctx.lineWidth = 2;
		ctx.lineCap = "round";
		ctx.stroke();
	};

	RainDrop.prototype.update = function () {
		this.y += this.speed;
		if (this.y > canvas.height) {
			this.y = -this.length;
			this.x = Math.random() * canvas.width;
		}
		this.draw();
	};

	function init() {
		rainDrops.length = 0;
		for (let i = 0; i < numberOfDrops; i++) {
			rainDrops.push(new RainDrop());
		}
	}

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (const drop of rainDrops) {
			drop.update();
		}
		animationFrameId = requestAnimationFrame(animate);
	}

	function fadeOutCanvas() {
		let opacity = 1;

		function fade() {
			opacity -= 0.02;
			if (opacity <= 0) {
				opacity = 0;
				cancelAnimationFrame(animationFrameId);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				rainDrops.length = 0;
				canvas.remove();
				return;
			}

			canvas.style.opacity = opacity;
			requestAnimationFrame(fade);
		}

		fade();
	}

	canvas.style.opacity = 1;
	init();
	animate();
	setTimeout(fadeOutCanvas, 6000);

	window.addEventListener("resize", function () {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		init();
	});
}

function tonton() {
	const container = document.getElementById("EffectContainer");

	const svgImage = document.createElement('img');
	svgImage.src = 'images/tonton/Tonton.svg';
	svgImage.alt = 'tonton Image';
	svgImage.classList.add('SVGImage');

	container.appendChild(svgImage);

	svgImage.classList.add('blink');

	svgImage.addEventListener('animationend', () => {
		svgImage.classList.remove('blink');
		svgImage.classList.add('fade-out');

		svgImage.addEventListener('transitionend', () => {
			svgImage.remove();
		});
	});
}

function fuwafuwa() {

	const cloud = document.createElement('div');
	cloud.classList.add('cloud');

	cloud.style.left = `40%`;
	cloud.style.top = `40%`;
	cloud.style.transform = `translateY(-50%)`;

	const reversedCloud = document.createElement('div');
	reversedCloud.classList.add('cloud', 'reverse');

	reversedCloud.style.right = `40%`;
	reversedCloud.style.top = `40%`;
	reversedCloud.style.transform = `translateY(-50%)`;


	// reversedCloud.style.left = `${buttonRect.left - 150}px`;
	// reversedCloud.style.top = `${buttonRect.top}px`;

	effectContainer.appendChild(cloud);
	effectContainer.appendChild(reversedCloud);

	setTimeout(() => {
		cloud.style.transition = 'opacity 1s ease';
		reversedCloud.style.transition = 'opacity 1s ease';
		cloud.style.opacity = '0';
		reversedCloud.style.opacity = '0';

		setTimeout(() => {
			cloud.remove();
			reversedCloud.remove();
		}, 1000);
	}, 2000);
}

function atsuatsu() {
    var palette = [
        '#ffffff', '#f7f7f7', '#2f0f07', '#470f07',
        '#571707', '#671f07', '#771f07', '#8f2707',
        '#9f2f07', '#af3f07', '#bf4707', '#c74707',
        '#df4f07', '#df5707', '#df5707', '#d75f07',
        '#d7670f', '#cf6f0f', '#cf770f', '#cf7f0f',
        '#cf8717', '#c78717', '#c78f17', '#c7971f',
        '#bf9f1f', '#bf9f1f', '#bfa727', '#bfa727',
        '#bfaf2f', '#b7af2f', '#b7b72f', '#b7b737',
        '#cfcf6f', '#dfdf9f', '#efefc7', '#ffffff'
    ];

    var global = {
        w: 0,
        h: 0
    };
    var scale = 4;
    var dots = [];
    var ctx = null;

    global.w = Math.round(window.innerWidth / scale);
    global.h = Math.round(window.innerHeight / scale);

    const canvas = document.createElement("canvas");
    canvas.id = "atuatuCanvas";
    canvas.width = global.w * scale;
    canvas.height = global.h * scale;
    effectContainer.appendChild(canvas);

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'new content';
    }

    canvas.style.display = 'block';

    for (var x = 0; x < global.w; x++) {
        for (var y = 0; y < global.h; y++) {
            dots[y * global.w + x] = y == global.h - 1 ? 35 : 0;
        }
    }

    window.requestAnimationFrame(updateAtuatu);

    function updateAtuatu() {
        if (ctx == null) return;
        window.requestAnimationFrame(updateAtuatu);

        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, global.w * scale, global.h * scale);

        for (var x = 0; x < global.w; x++) {
            var xp = x * scale;
            for (var y = 1; y < global.h; y++) {
                var rand = Math.round(Math.random() * 3);
                var from = y * global.w + x;
                var to = from - global.w - rand + 1;
                dots[to] = dots[from] - (rand & 2);

                var index = Math.max(0, dots[from]);
                if (index == 0) continue;
                ctx.fillStyle = palette[index];
                ctx.fillRect(xp, y * scale, scale, scale);
            }
        }
    }
}

function gorogoro() {
	const canvas = document.createElement("canvas");
	canvas.id = "lightning";
	let cw = canvas.width = window.innerWidth;
	let ch = canvas.height = window.innerHeight;
	effectContainer.appendChild(canvas);
	let cl = new canvasLightning(canvas, cw, ch);
	cl.init();
}

var canvasLightning = function (c, cw, ch) {

	this.init = function () {
		this.loop();
	};

	var _this = this;
	this.c = c;
	this.ctx = c.getContext('2d');
	this.cw = cw;
	this.ch = ch;
	this.mx = 0;
	this.my = 0;

	this.now = Date.now();
	this.delta = 0
	this.then = this.now;

	this.lightning = [];
	this.lightTimeCurrent = 0;
	this.lightTimeTotal = 50;

	this.rand = function (rMi, rMa) {
		return ~~((Math.random() * (rMa - rMi + 1)) + rMi);
	};

	this.createL = function (x, y, canSpawn) {
		this.lightning.push({
			x: x,
			y: y,
			xRange: this.rand(5, 30),
			yRange: this.rand(5, 25),
			path: [{
				x: x,
				y: y
			}],
			pathLimit: this.rand(10, 35),
			canSpawn: canSpawn,
			hasFired: false,
			grower: 0,
			growerLimit: 5
		});
	};

	this.updateL = function () {
		var i = this.lightning.length;
		while (i--) {
			var light = this.lightning[i];

			light.grower += this.delta;

			if (light.grower >= light.growerLimit) {
				light.grower = 0;
				light.growerLimit *= 1.05

				light.path.push({
					x: light.path[light.path.length - 1].x + (this.rand(0, light.xRange) - (light.xRange / 2)),
					y: light.path[light.path.length - 1].y + (this.rand(0, light.yRange))
				});

				if (light.path.length > light.pathLimit) {
					this.lightning.splice(i, 1)
				}
				light.hasFired = true;
			}
		}
	};

	this.renderL = function () {
		var i = this.lightning.length;
		while (i--) {
			var light = this.lightning[i];

			this.ctx.strokeStyle = 'hsla(240, 52%, 34%, ' + this.rand(10, 100) / 100 + ')';
			this.ctx.shadowBlur = 10;
			this.ctx.shadowColor = "rgba(0,0,0,0.4)";
			this.ctx.lineWidth = 1;
			if (this.rand(0, 30) == 0) {
				this.ctx.lineWidth = 2;
			}
			if (this.rand(0, 60) == 0) {
				this.ctx.lineWidth = 3;
			}
			if (this.rand(0, 90) == 0) {
				this.ctx.lineWidth = 4;
			}

			this.ctx.beginPath();

			var pathCount = light.path.length;
			this.ctx.moveTo(light.x, light.y);
			for (var pc = 0; pc < pathCount; pc++) {

				this.ctx.lineTo(light.path[pc].x, light.path[pc].y);

				if (light.canSpawn) {
					if (this.rand(0, 100) == 0) {
						light.canSpawn = false;
						this.createL(light.path[pc].x, light.path[pc].y, false);
					}
				}
			}

			if (!light.hasFired) {
				this.ctx.fillStyle = 'rgba(158, 118, 178, ' + this.rand(4, 12) / 100 + ')';
				this.ctx.fillRect(0, 0, this.cw, this.ch);
			}

			if (this.rand(0, 60) == 0) {
				this.ctx.fillStyle = 'rgba(158, 118, 178, ' + this.rand(1, 3) / 100 + ')';
				this.ctx.fillRect(0, 0, this.cw, this.ch);
			}

			this.ctx.stroke();
		}
	};


	this.lightningTimer = function () {
		this.lightTimeCurrent += this.delta;
		if (this.lightTimeCurrent >= this.lightTimeTotal) {
			var newX = this.rand(100, cw - 100);
			var newY = this.rand(0, ch / 2);
			var createCount = this.rand(1, 3);
			while (createCount--) {
				this.createL(newX, newY, true);
			}
			this.lightTimeCurrent = 0;
			this.lightTimeTotal = this.rand(200, 1500);
		}
	}

	this.clearCanvas = function () {
		this.ctx.globalCompositeOperation = 'destination-out';
		this.ctx.fillStyle = 'rgba(0,0,0,' + this.rand(1, 30) / 100 + ')';
		this.ctx.fillRect(0, 0, this.cw, this.ch);
		this.ctx.globalCompositeOperation = 'source-over';
	};


	window.addEventListener('resize', () => {
		this.cw = this.c.width = window.innerWidth;
		this.ch = this.c.height = window.innerHeight;
	});


	this.loop = function () {
		requestAnimationFrame(this.loop.bind(this));

		this.now = Date.now();
		this.delta = this.now - this.then;
		this.then = this.now;

		this.clearCanvas();
		this.updateL();
		this.lightningTimer();
		this.renderL();
	};

};

function pachipachi() {

	const clapIcon = `
		<div class="clap-wrap">
		<svg class="clapping" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
			 viewBox="-270 87 417.1 387" style="enable-background:new -270 87 417.1 387;" xml:space="preserve">

		<path class="left-hand" d="M-268.1,338l21.7-21.7c2.3-2.3,3.5-5.3,3.5-8.5v-55.7c0-5.6,2.2-10.9,6.2-14.9l32.4-32.4
			c2.1-2.1,5.8-1.8,7.4,0.8c2.8,4.4,5,11.4-1.4,18.9c-5.1,5.9-10.3,10.9-13.7,14.1c-2.2,2-2.2,5.4-0.1,7.5l0,0c2,2,5.3,2,7.3,0
			l87.6-87.6c4.6-4.6,12.2-4.6,16.8,0l0,0c4.6,4.6,4.6,12.2,0,16.8l-66.2,66.2c-2.4,2.4-2.4,6.4,0,8.8l0,0c2.4,2.4,6.4,2.4,8.8,0
			l74.5-75.3c4.6-4.7,12.2-4.7,16.9,0l1.8,1.8c4.6,4.6,4.6,12.1,0.1,16.8l-70.4,71.3c-2.2,2.3-2.2,5.9,0,8.2l0,0
			c2.3,2.3,5.9,2.3,8.2,0l61.2-61.2c4.6-4.6,12.2-4.6,16.8,0l0.2,0.2c4.6,4.6,4.6,12.2,0,16.8l-67.1,67.1c-1.7,1.7-1.7,4.6,0,6.3l0,0
			c1.7,1.7,4.6,1.7,6.3,0l50.7-50.7c3.9-3.9,10.1-3.9,13.9,0l0,0c3.9,3.9,3.9,10.1,0,13.9l-98.2,98.2c-1.2,1.2-2.6,2.2-4.1,3
			c-5.3,2.5-18.3,7.7-35.5,6.6l-13.7,13.6c-2.1,2.1-5.4,2.4-7.8,0.7l-63.6-44.8C-269.3,341.7-269.5,339.4-268.1,338z"/>
  
		<path class="right-hand" d="M-208.1,398l21.7-21.7c2.3-2.3,3.5-5.3,3.5-8.5v-55.7c0-5.6,2.2-10.9,6.2-14.9l32.4-32.4
			c2.1-2.1,5.8-1.8,7.4,0.8c2.8,4.4,5,11.4-1.4,18.9c-5.1,5.9-10.3,10.9-13.7,14.1c-2.2,2-2.2,5.4-0.1,7.5l0,0c2,2,5.3,2,7.3,0
			l87.6-87.6c4.6-4.6,12.2-4.6,16.8,0l0,0c4.6,4.6,4.6,12.2,0,16.8l-66.2,66.2c-2.4,2.4-2.4,6.4,0,8.8l0,0c2.4,2.4,6.4,2.4,8.8,0
			l74.5-75.3c4.6-4.7,12.2-4.7,16.9,0l1.8,1.8c4.6,4.6,4.6,12.1,0.1,16.8l-70.4,71.3c-2.2,2.3-2.2,5.9,0,8.2l0,0
			c2.3,2.3,5.9,2.3,8.2,0l61.2-61.2c4.6-4.6,12.2-4.6,16.8,0l0.2,0.2c4.6,4.6,4.6,12.2,0,16.8L-55.6,356c-1.7,1.7-1.7,4.6,0,6.3l0,0
			c1.7,1.7,4.6,1.7,6.3,0l50.7-50.7c3.9-3.9,10.1-3.9,13.9,0l0,0c3.9,3.9,3.9,10.1,0,13.9l-98.2,98.2c-1.2,1.2-2.6,2.2-4.1,3
			c-5.3,2.5-18.3,7.7-35.5,6.6l-13.7,13.6c-2.1,2.1-5.4,2.4-7.8,0.7l-63.6-44.8C-209.3,401.7-209.5,399.4-208.1,398z"/>

		<line class="sound sound1" x1="-169.4" y1="170.9" x2="-154.9" y2="185.4"/>
		<line class="sound sound2" x1="-135" y1="136.8" x2="-120.4" y2="151.4"/>
		<line class="sound sound3" x1="-77.3" y1="111.1" x2="-77.3" y2="135.1"/>
		<line class="sound sound4" x1="11.6" y1="168.9" x2="-3" y2="183.4"/>
		<line class="sound sound5" x1="-20.9" y1="137.8" x2="-35.4" y2="152.4"/>
		<line class="sound sound6" x1="35.6" y1="202.9" x2="21" y2="217.4"/>
	</svg></div>`;
	effectContainer.innerHTML = clapIcon;

	const leftHand = document.querySelector('.left-hand');
	const rightHand = document.querySelector('.right-hand');
	const sound = document.querySelectorAll('.sound');

	leftHand.style.animation = 'none';
	leftHand.offsetHeight;
	leftHand.style.animation = '';

	rightHand.style.animation = 'none';
	rightHand.offsetHeight;
	rightHand.style.animation = '';

	sound.forEach(item => {
		item.style.animation = 'none';
		item.offsetHeight;
		item.style.animation = '';
	});
}

function shiin() {
  const circleSize = 80;
  const numCircles = 3;
  const spacing = 150;

  const totalWidth = numCircles * circleSize + (numCircles - 1) * spacing;

  const startX = (window.innerWidth - totalWidth) / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < numCircles; i++) {
    const delay = i * 1000;

    setTimeout(() => {
      const circle = document.createElement("div");
      circle.style.position = "absolute";
      circle.style.width = `${circleSize}px`;
      circle.style.height = `${circleSize}px`;
      circle.style.borderRadius = "50%";
      circle.style.backgroundColor = "#000";
      circle.style.left = `${startX + i * (circleSize + spacing)}px`;
      circle.style.top = `${centerY - circleSize / 2}px`;

      effectContainer.appendChild(circle);
    }, delay);
  }
}
