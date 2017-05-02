function ResourceLoader(fromDir, nameList, toArray, responseType) {
	//проверим какаой тип файла будем скачивать
	switch (responseType) {
		case ('image' || ''):
			//обработчик каринок специальные условия
			responseType = '';
			break;
		case ('audio' || 'arraybuffer'):
			//обработчик аудио специальные условия
			responseType = 'arraybuffer';
			break;
	}

	var regFiles = [];
	var responseIndex;
	var totalRequestSize = 0;
	var countCalculatedRequests = 0;
	var progressFool = 0;

	var uniqueId = randomSeed();

	//создаем три события. Начало загрузки, прогресс загрузки, конец загрузки для всего объекта loader
	var loaderStart = new CustomEvent("loaderStart", {
		detail: {
			targetId:uniqueId
		}
	});
	//оповещаем, что загрузка начилась
	document.dispatchEvent(loaderStart);
	//событие прогресса создано в теле ответов в событии progress
	var loaderEnd = new Event("loaderEnd");

	//создаем запрос для каждого файла
	for (responseIndex = 0; responseIndex < nameList.length; responseIndex++) {
		regFiles[responseIndex] = new XMLHttpRequest();
		regFiles[responseIndex].index = responseIndex;
		regFiles[responseIndex].loadStart = false;
		regFiles[responseIndex].fileSize = null;
		regFiles[responseIndex].progressLoaded = 0;
		regFiles[responseIndex].open("GET", fromDir + nameList[responseIndex], true);
		regFiles[responseIndex].responseType = responseType;
		regFiles[responseIndex].addEventListener("loadstart", responseStart);
		regFiles[responseIndex].addEventListener("progress", responseProgress);
		regFiles[responseIndex].addEventListener("load", responseLoaded);
		regFiles[responseIndex].send();
	}


	function responseStart(event) {
		regFiles[event.target.index].loadStart = true;
	}

	function responseProgress(event) {
		var eventIndex = event.target.index;
		var progressByIndex = 0;

		if (event.lengthComputable) {
			//расчет текущего прогресса в каждом запросе отдельно
			regFiles[eventIndex].progressLoaded = event.loaded;
			for (var i = 0; i < nameList.length; i++) {
				progressByIndex += regFiles[i].progressLoaded;
				//console.log('progressFool', regFiles[i].progressLoaded);
			}
			//высчитываем полный размер для каждого запроса в отдельности
			// суммируем для получения полного размера всех запросов
			// (вхождение один раз для каждого запроса)
			if (regFiles[eventIndex].loadStart && regFiles[eventIndex].fileSize == null) {
				regFiles[eventIndex].fileSize = event.total;
				totalRequestSize += regFiles[eventIndex].fileSize;
				countCalculatedRequests++;
			}
			//выполняется когда подсчитан полный размер запроса
			// если выполнять данный код раньше, чем будет подсчитан полный размер,
			// то в процесе вывода прогресс может скакать от большего к меньшему
			if (countCalculatedRequests == nameList.length) {
				progressFool = Math.floor((progressByIndex / totalRequestSize) * 100);
			}

			var loaderProgressCustom = new CustomEvent("loaderProgressCustom", {
				detail: {
					progress: progressFool,
					targetId: uniqueId
				}
			});
			document.dispatchEvent(loaderProgressCustom);

		} else {
			// Если невозможно высчитать полный размер файла
		}
	}

	function responseLoaded(event) {
		//извлекаем загруженные данные
		var eventIndex = event.target.index;
		regFiles[eventIndex].blob = event.target;

		if (progressFool == 100) {
			for (var i = 0; i < nameList.length; i++) {
				switch (responseType) {
					case '':
						//обработчик каринок специальные условия
						regFiles[i].file = new Image();
						regFiles[i].file.src = regFiles[i].blob.responseURL;
						break;
					case 'arraybuffer':
						//обработчик аудио специальные условия
						regFiles[i].file = regFiles[i].blob.response;
						break;
				}
				toArray.push(regFiles[i].file);
			}
			//оповещаем, что загрузка закончена
			document.dispatchEvent(loaderEnd);
		}
	}

}