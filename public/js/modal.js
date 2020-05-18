// REQUIRES chat.js (in general)

const socket = io();

// essentians
let nickname,
	roomSize = 2, // 2 / 3 / 4
	roomStatus = 'CLOSED', // OPEN / CLOSED
	roomCode,
	dataAdjustable = true,
	roomModalReady = false,
	maxTokens;

// essentials
function createRoom() {
 	initChat();
 	addChatServerMessage('please wait...');
	dataAdjustable = false;

	// host stuff
	socket.on('room-host', () => {
		modalRoomReady.innerHTML = 'Start the game!';
	});
	// listen to the server response
	socket.on('room-created', data => {
		// stop listening to the room-created event
		// since it will not be received anymore
		socket.off('room-created');

		roomCode = data.roomCode;
		maxTokens = data.maxTokens;
		// changing the title and the url of the page
   	document.title = 'Love Letter - In Game';
   	window.history.pushState({
   		"pageTitle": document.title
   	}, "", `${roomCode}`);

   	// show the room modal
   	updateModalRoom({
   		roomCode,
   		maxTokens,
   		players: [
   			{
   				nickname: 'monochroumme',
   				tokens: 2,
   				status: 'NOT READY'
   			},
   			{
   				nickname: 'ruf',
   				tokens: 5,
   				status: 'READY'
   			},
   			{
   				nickname: 'covid',
   				tokens: 3,
   				status: 'NOT READY'
   			},
   			{
   				nickname: 'magic',
   				tokens: 0,
   				status: 'NOT READY'
   			}
   		]
   	});
		setModalContent('#modal-room');
	});

	// make server api call
	socket.emit('room-create', {
		nickname: nickname.slice(30),
		roomSize,
		roomStatus
	});
}

function enterRoom() {
	initChat();
	addChatServerMessage('please wait...');
	dataAdjustable = false;
	// listen to the server response
	socket.on('room-connected', data => {
		// stop listening to the room-connected event
		// since it will not be received anymore
		socket.off('room-connected');

		// changing the title and the url of the page
     	document.title = 'Love Letter - In Game';
     	window.history.pushState({
     		"pageTitle": document.title
     	}, "", `${roomCode}`);

     	// add all messages to chat
     	fillChat(data.chat);
	});

	// make server api call
	socket.emit('room-connect', {
		nickname: nickname.slice(30),
		roomCode
	});
}

// -------------

// show the modal after 2 seconds after the page is loaded
window.onload = () => {
	let modal = document.querySelector('.game-modal');
	setTimeout(() => {
		modal.classList.add('active');
	}, 2000);
};

const nicknameButton = document.querySelector('#modal-nickname button'),
			nicknameInput = document.querySelector('#modal-nickname input');
function setUsername() {
	nickname = nicknameInput.value;
	nicknameButton.disabled = true;
	document.querySelector('#modal-menu-welcome').innerHTML = `Welcome ${nickname}!`;
	setModalContent('#modal-menu');
}

nicknameButton.onclick = setUsername;
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
	socket.emit('game-start');
}
function updateModalRoom() {

}
