function Game() {

	var running = true;//состояние главного игрового цикла
	var gameREADY = false;
	var states = {
		//все состояния игры
		menu: 'menu',
		play: 'play',
		options: 'options',
		quit: 'quit'
	};
	//первоначальное состояние
	var STATE = states.menu;

	//---НАСТРОЙКИ ИГРЫ---//
	var pixelAspectRatio = 9 / 16;
	var currentWidth = 960;
	var screen = {width: currentWidth, height: pixelAspectRatio * currentWidth};

	//описываем ресурсы игры
	//массивы для хранения данных
	var sprites = [];
	var audio = [];
	//массивы имен данных, которые надо закачать
	var imageList = [
		'spaceStars.png',
		'milky_way.jpg',
		'nebula.jpg',
		'bullet.png',
		'ship.png',
		'cur.png',
		'view.png',
		'asteroid.png'
	];

	var audioList = [
		'Title.wav',
		'Level1.wav',
		'Level2.wav',
		'Level3.wav',
		'Ending.wav'
	];
	//---НАСТРОЙКИ ИГРЫ конец---//

	//ПЕРЕМЕННЫЕ ОБЛАСТИ//
	var loaded = false;
	var noiseReady = false;
	//ПЕРЕМЕННЫЕ ОБЛАСТИ конец//

	//обьявляем объекты
	var body; //тело программы
	var mainScreen; //главный блок. В нем будет отображаться все DOM объекты
	var display; //экран игры
	var gameUI; //пользовательский интерфейс
	var appConsole; //игровая консоль. Для вывода данных, событий и прочего
	var audioController; //Контроллер аудио WIP
	var noise; //генератор шума
	var imgLoader;
	var audioLoader;
	var displayBg;
	var fadeOverflow;
	var mainMenu;
	var levelController;
	var inputController;
	var player;


	//добавляем элементы в дом
	body = new Body("body");
	mainScreen = new BlockModel("mainScreen", screen.width, screen.height, body);
	displayBg = new Display("displayBg", screen.width, screen.height, mainScreen);
	display = new Display("display", screen.width, screen.height, mainScreen);
	fadeOverflow = new Display("fadeOverflow", screen.width, screen.height, mainScreen);
	gameUI = new BlockModel("gameUI", screen.width, screen.height, mainScreen);
	appConsole = new AppConsole(gameUI);
	mainMenu = new Menu(gameUI);
	//mainMenu.setUpMenu();
	audioController = new AudioController();
	noise = new Noise(screen.width, screen.height, mainScreen);
	inputController = new InputController();
	player = new Player(inputController.input, display, sprites);
	levelController = new LevelController(display, player);
	//генерируем шум как только становиться доступна ссылка на объект
	//генерация будет идти асинхронно в Update и не должна повлиять на ход скачивания файлов
	initNoiseGeneratingEvent();
	//создаем загрузчик ресурсов и подписываемся на его события
	//подключаем обработчик событий загрузчика ресурсов
	initLoadEvents();
	//события меню
	initMenuEvents();
	//запускаем главный цикл игры
	run();

	//this.inputController = new InputController(this.display);

	function readyCheck() {
		if (loaded && noiseReady) {
			appConsole.addMsg('Ура все загрузилось!');
			appConsole.addMsg('Приятной игры... :)');
			noise.setReady(true);
			gameREADY = true;
			loaded = null;
			noiseReady = null;
			return null;
		}
		return true;
	}

	function initLoadEvents() {
		appConsole.addMsg('Загружаем картинки и звуки');
		//ПЕРЕМЕННЫЕ ОБЛАСТИ//
		//создадим массив в который будем записывать количество пойманных событий инициации загрузки
		//что бы потом удалить ненужные переменный а в дальнейшем и подписки на события
		var loaderCounter = 0;
		var stateLoading = false;
		var consoleLogger = [];
		//ПЕРЕМЕННЫЕ ОБЛАСТИ конец//
		document.addEventListener("loaderStart", onLoaderStart);
		function onLoaderStart(event) {
			//обработчик события начала загрузки данных. Вывод сообщения в консоль
			//каждому оповещению создаем уникальный ID
			//и запоминаем строку в которую будет записывать прогресс в событии onLoaderProgress
			var logItem = {
				id: event.detail.targetId,
				msgRef: appConsole.addMsg('Progress ' + 0 + '%')
			};
			consoleLogger.push(logItem);

			loaderCounter++;
			stateLoading = true;

		}

		document.addEventListener("loaderProgressCustom", onLoaderProgress);
		function onLoaderProgress(event) {
			//обработчик события прогресса загрузки данных. Вывод сообщения в консоль
			//проверяем массов с логами на наличие уникальных строк
			//вписываем в эти строки наш прогресс
			appConsole.setActive(true);
			for (var i = 0; i < consoleLogger.length; i++) {
				if (consoleLogger[i].id == event.detail.targetId)
					consoleLogger[i].msgRef.block.innerHTML = 'Progress ' + event.detail.progress + '%';
			}
		}

		document.addEventListener("loaderEnd", onLoaderEnd);
		function onLoaderEnd() {
			//обработчик события конца загрузки данных. Вывод сообщения в консоль

			loaderCounter--;
			if (stateLoading && loaderCounter == 0) {
				//все данные загружены
				document.dispatchEvent(importComplete);
				//обнулим слушатели запросов, а так же объекты запросов. Они нам больше не нужны
				imgLoader = null;
				audioLoader = null;
				consoleLogger = null;
				stateLoading = null;
				loaderCounter = null;
				document.removeEventListener("loaderStart", onLoaderStart);
				document.removeEventListener("loaderProgressCustom", onLoaderProgress);
				document.removeEventListener("loaderEnd", onLoaderEnd);
			}
		}

		//создаем событие которое будет появляться когда все данные загружены
		var importComplete = new Event("importComplete");
		//создадим слушателя для отслеживания завершения импорта всех данных
		document.addEventListener("importComplete", onImportComplete);
		function onImportComplete() {
			loaded = true;
			//после загрузки можно включить музыку и звуки
			audioController.setAudioSource(audio);
			levelController.setSprites(sprites);
		}

		imgLoader = new ResourceLoader('src/img/', imageList, sprites, '');
		audioLoader = new ResourceLoader('src/audio/', audioList, audio, 'arraybuffer');
	}

	function initNoiseGeneratingEvent() {
		var logger = null;
		document.addEventListener("generateProgress", onNoiseProgress);
		function onNoiseProgress(event) {
			appConsole.setActive(true);
			if (logger != null) {
				appConsole.editMsg(logger.block.id, 'Генерируем шумы. Progress ' + event.detail.progress + '%');
			} else {
				logger = appConsole.addMsg('Генерируем шумы. Progress ' + event.detail.progress + '%');
			}
			if (event.detail.progress == 100) {
				noiseReady = true;
			}
		}
	}

	function initMenuEvents() {
		document.addEventListener('menuPlayEvent', onPlayEvent);
		document.addEventListener('menuOptionsEvent', onOptionsEvent);
		document.addEventListener('menuQuitEvent', onQuitEvent);
		document.addEventListener('optionsClosed', onOptionsClosed);
	}

	function onOptionsClosed() {
		STATE = states.menu;
	}

	function onPlayEvent() {
		mainMenu.setActive(false);
		levelController.setLayerBg(sprites[1]);
		levelController.setScrollBg(sprites[0]);
		player.setSprite(sprites);
		STATE = states.play;
	}

	function onOptionsEvent() {
		STATE = states.options;
	}

	function onQuitEvent() {
		sayGoodbay();
	}

	function sayGoodbay() {
		appConsole.addMsg('');
		appConsole.addMsg('-------------------------');
		appConsole.addMsg('До свидания!');
		appConsole.addMsg('Уже уходите?');
		appConsole.addMsg('-------------------------');
		mainMenu.setActive(false);
		STATE = states.quit;
	}

	function setBg() {
		//работаем с задним фоном displayBg
		if (displayBg.layers.length == 0) {
			displayBg.addLayer(sprites[2]);
			displayBg.addAnimatedLayer(sprites[0]);
		}
		if (fadeOverflow.bgAlpha > 0) {
			//fadeOverflow.fade(1);
		}
		if (fadeOverflow.layers.length == 0) {
			fadeOverflow.addColorOverflowLayer();
		}
		if (fadeOverflow.layers[0].opacity > 0) {
			fadeOverflow.fadeColorOverflowLayer(fadeOverflow.layers);
		}
	}

	function run() {
		cycle();
		function cycle() {
			if (running) {
				update();
				render();
				window.requestAnimationFrame(cycle);
			} else {
				window.cancelAnimationFrame(cycle);
			}
		}
	}

	function update() {
		//обновляем состояния всех объектовю Объект должен иметь прото update!
		//проверка готовности игры
		if (readyCheck() != null) {
			readyCheck();
		}
		appConsole.Update();
		noise.Update();
		mainMenu.update(STATE);
		inputController.update(STATE);
		if (gameREADY) {
			if (audioController.sourceBuffer.length > 4) {
				audioController.play(STATE);
			}
			//основные функции одновления игры
			if (STATE == states.menu) {
				mainMenu.setActive(true);
				setBg();
				displayBg.animateLayer(displayBg.layers);
			}
			if (STATE == states.play) {
				if (fadeOverflow.layers[0].opacity > 0) {
					fadeOverflow.fadeColorOverflowLayer(fadeOverflow.layers);
				}
				levelController.update();
				player.update();
			}


		}

	}

	function render() {
		if (gameREADY) {
			//отрисовываем состояния видимых объектов. Объект должен иметь прото render!
			displayBg.draw();
			fadeOverflow.draw();
			mainMenu.draw();

			if (STATE == states.play) {
				levelController.draw();
				player.draw();
			}

		}

	}

}





