// REQUIRES chat.js (in general)

const socket = io();

// essentians
let nickname,
	roomSize = 2, // 2 / 3 / 4
	roomStatus = 'CLOSED', // OPEN / CLOSED
	roomCode,
	dataAdjustable = true,
	maxTokens,
	players = [],
	inGame = false,
	inRoomModal = false,
	isReady = false;

// essentials
function createRoom() {
	// host stuff
	socket.on('room-host', () => {
		socket.off('room-host');
		modalRoomReady.innerHTML = 'Start the game!';
	});

	// listen to the server response
	listenRoomConnected();

	// make server api call
	socket.emit('room-create', {
		nickname: nickname.substring(0, 31),
		roomSize,
		roomStatus
	});
}

function enterRoom() {
	// listen to the server response
	listenRoomConnected();

	// make server api call
	socket.emit('room-connect', {
		nickname: nickname.substring(0, 31),
		roomCode
	});
}

// -------------

// show the modal after 2 seconds after the page is loaded
let modal;
window.onload = () => {
	modal = document.querySelector('.game-modal');
	setTimeout(() => {
		modal.classList.add('active');
	}, 2000);
};

const nicknameButton = document.querySelector('#modal-nickname button'),
			nicknameInput = document.querySelector('#modal-nickname input');
function setNickname() {
	nickname = nicknameInput.value;
	if (nickname.trim() == '')
		return;
	nicknameButton.disabled = true;
	document.querySelector('#modal-menu-welcome').innerHTML = `Welcome ${nickname}!`;
	setModalContent('#modal-menu');
}

nicknameButton.onclick = setNickname;
nicknameInput.addEventListener("keyup", e => {
	if (event.keyCode == 13) { // enter
		event.preventDefault();
		nicknameButton.click();
	}
});

let modalContent = document.querySelector('#modal-welcome');
function setModalContent(id) {
	modalContent.classList.remove('active');
	setTimeout(() => {
		modalContent.classList.add('hidden');
		modalContent = document.querySelector(id);
		modalContent.classList.remove('hidden');
		setTimeout(() => {
			modalContent.classList.add('active');
		}, 1);
	}, 300);
}

const menuCreate = document.querySelector('#modal-menu-create'),
	menuEnter = document.querySelector('#modal-menu-enter');
menuCreate.onclick = () => { setModalContent('#modal-create') };
menuEnter.onclick = () => { setModalContent('#modal-enter') };

const modalCreate2 = document.querySelector('#modal-create-2'),
	modalCreate3 = document.querySelector('#modal-create-3'),
	modalCreate4 = document.querySelector('#modal-create-4'),
	modalEnterCodeButton = document.querySelector('#modal-enter-code button'),
	modalEnterCodeInput = document.querySelector('#modal-enter-code input');
modalCreate2.onclick = () => {
	if (!dataAdjustable)
		return;

	roomSize = 2;
	modalCreate2.classList.add('active');
	modalCreate3.classList.remove('active');
	modalCreate4.classList.remove('active');
};
modalCreate3.onclick = () => {
	if (!dataAdjustable)
		return;
	
	roomSize = 3;
	modalCreate2.classList.remove('active');
	modalCreate3.classList.add('active');
	modalCreate4.classList.remove('active');
};
modalCreate4.onclick = () => {
	if (!dataAdjustable)
		return;
	
	roomSize = 4;
	modalCreate2.classList.remove('active');
	modalCreate3.classList.remove('active');
	modalCreate4.classList.add('active');
};
modalEnterCodeButton.onclick = () => {
	roomCode = modalEnterCodeInput.value;
	modalEnterCodeButton.disabled = true;
	enterRoom();
};

const roomOpenClosedWrapper = document.querySelector('#room-open-closed-wrapper'),
	roomOpenClosedButton = document.querySelector('#room-open-closed-button'),
	roomOpenClosedStatus = document.querySelector('#room-open-closed-status'),
	createRoomButton = document.querySelector('#create-room-button');
roomOpenClosedButton.onclick = () => {
	if (!dataAdjustable)
		return;
	
	if (roomStatus == 'OPEN') {
		roomStatus = 'CLOSED';
		roomOpenClosedWrapper.classList.remove('active');
		roomOpenClosedStatus.innerHTML = 'Closed';
	} else {
		roomStatus = 'OPEN';
		roomOpenClosedWrapper.classList.add('active');
		roomOpenClosedStatus.innerHTML = 'Open';
	}
}
createRoomButton.onclick = () => {
	createRoomButton.disabled = true;
	createRoom();
}

const modalErrorMessageButton = document.querySelector('#modal-error-message button');
modalErrorMessageButton.onclick = () => {
	location.reload();
}
function showErrorModal(msg) {
	document.querySelector('#modal-error-message p').innerHTML = msg;
	setModalContent('#modal-error');
}
socket.on('modal-error', data => {
	showErrorModal(data.message);
	eliminateChat();
});

const modalRoomCode = document.querySelector('#modal-room-code'),
			modalRoomReady = document.querySelector('#modal-room-ready'),
			modalRoomTable = document.querySelector('#modal-room-table');
modalRoomReady.onclick = () => {
	socket.on('update-ready-player-button', status => {
		socket.off('update-ready-player-button');
		isReady = status;
		if (isReady)
			modalRoomReady.innerHTML = 'Not ready';
		else 
			modalRoomReady.innerHTML = 'Ready!';
	});

	socket.emit('update-ready', !isReady);
}
function updateModalRoom(data) {
	roomCode = data.roomCode;
	players = data.players;
	maxTokens = data.maxTokens;

	modalRoomCode.innerHTML = data.roomCode;
	modalRoomTable.innerHTML = '';
	for (let i = 0; i < data.players.length; i++) {
		let item = document.createElement('div'),
				itemTitle = document.createElement('span'),
				itemLeft = document.createElement('div'),
				itemRight = document.createElement('div'),
				itemHearts = document.createElement('div'),
				itemBeam = document.createElement('div'),
				itemPopup = document.createElement('div'),
				itemPopupSpan = document.createElement('span');
		item.classList.add('game-modal__room__table__item');
		itemHearts.classList.add('game-modal__room__table__item__hearts');
		itemLeft.classList.add('game-modal__room__table__item__left');
		itemRight.classList.add('game-modal__room__table__item__right');
		itemBeam.classList.add('beam');
		itemPopup.classList.add('popup');
		itemTitle.innerHTML = data.players[i].nickname;
		modalRoomTable.appendChild(item);
		item.appendChild(itemLeft);
		item.appendChild(itemRight);
		itemLeft.appendChild(itemTitle);
		itemLeft.appendChild(itemHearts);
		itemRight.appendChild(itemBeam);
		itemBeam.appendChild(itemPopup);
		itemPopup.appendChild(itemPopupSpan);
		if (data.players[i].status) {
			itemPopupSpan.innerHTML = 'Ready';
			itemBeam.classList.add('active');
		} else {
			itemPopupSpan.innerHTML = 'Not ready';
			itemBeam.classList.remove('active');
		}
		for (let j = 0; j < data.maxTokens; j++) {
			let heart = document.createElement('img');
			if (j < data.players[i].tokens)
				heart.src = 'pics/token-bfilled.svg';
			else heart.src = 'pics/token-bunfilled.svg';
			itemHearts.appendChild(heart);
		}
		if (i != data.players.length - 1) {
			let line = document.createElement('div');
			line.classList.add('line');
			modalRoomTable.appendChild(line);
		}
	}
}

socket.on('update-room-modal', roomModalData => {
	if (inRoomModal) {
		updateModalRoom(roomModalData);
	}
});

function listenRoomConnected() {
	initChat();
	addChatServerMessage('please wait...');
	dataAdjustable = false;

	socket.on('room-connected', data => {
		// stop listening to the room-connected event
		// since it will not be received anymore
		socket.off('room-connected');

		// changing the title and the url of the page
   	document.title = 'Love Letter - In Game';
   	window.history.pushState({
   		"pageTitle": document.title
   	}, "", `${data.roomModalData.roomCode}`);

   	// show the room modal
		inRoomModal = true;
		fillChat(data.chat);
   	updateModalRoom(data.roomModalData);
		setModalContent('#modal-room');
	});
}
