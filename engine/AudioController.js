//контроллер аудио. Версия все еще в работе.
function AudioController() {
	this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	this.gainNode = this.audioCtx.createGain();
}

AudioController.prototype.setAudioSource = function (listMusic) {
	//после загрузки данных нам доступен массив со звуками
	//декодируем его согласно спецификации
	// и отправляем в буфер
	this.sourceBuffer = [];
	var audioData;
	for (var i = 0; i < listMusic.length; i++) {
		audioData = listMusic[i];
		this.audioCtx.decodeAudioData(audioData, this.getBuffer.bind(this));
	}
};

AudioController.prototype.getBuffer = function (buffer) {
	//создаем для каждого трека свой буфер с данными
	//инициализируем запуск треков
	var sourceOutput = this.audioCtx.createBufferSource();
	sourceOutput.buffer = buffer;
	this.sourceBuffer.push(sourceOutput);
	this.sourceBuffer[this.sourceBuffer.length - 1].loop = true;
	this.sourceBuffer[this.sourceBuffer.length - 1].start(0);
};


AudioController.prototype.disconnectTrack = function (lastTrack) {
	//определяем если предыдущий трек проигрывался, то отключаем его
	if (lastTrack != undefined) {
		this.sourceBuffer[lastTrack].disconnect();
	}
};
AudioController.prototype.play = function (state) {
	//определяем предыдущий трек
	this.lastTrack = this.activeTrack;
	//определяем состояние игры
	//под каждое состояние своя музыка
	//если состояние изменилось, то выполняем переподключение трека 
	if (this.state != state) {
		var track;
		switch (state) {
			case 'menu':
				track = 0;
				break;
			case 'play':
				track = randomTrack(2, 4);
				break;
			case 'options':
				track = 0;
				break;
			case 'quit':
				track = 1;
				break;
		}

		this.activeTrack = track;
		this.disconnectTrack(this.lastTrack);
		this.sourceBuffer[this.activeTrack].connect(this.gainNode);
		this.gainNode.connect(this.audioCtx.destination);
		this.gainNode.gain.value = 0.2;

		this.state = state;
	}

	function randomTrack(min, max) {
		return Math.floor(min + (Math.random() * (max - min)));
	}

};

