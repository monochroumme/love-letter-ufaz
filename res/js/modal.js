// essentians
let username,
	roomSize,
	roomCode;

// essentials
// TODO
function createRoom() {
	if (!roomSize)
		return;

	// server api call: /api/create-room

	// get server response
	let res = false;
	if (res) {
		// hide the modal and load data to the game
	} else {
		// show error modal with the error message
		showErrorModal('error msg');
	}
}
// TODO
function enterRoom() {
	if (!roomCode)
		return;

	// server api call: /api/enter-room

	// get server response
	let res = false;
	if (res) {
		// if the game is still going then show the error modal with the message
		// hide the modal and load data to the game
	} else {
		// show error modal with the error message
		showErrorModal('error msg');
	}
}

// -------------

window.onload = () => {
	let modal = document.querySelector('.game-modal');
	setTimeout(() => {
		modal.classList.add('active');
	}, 2000);
};

let usernameButton = document.querySelector('#modal-username button'),
	usernameInput = document.querySelector('#modal-username input');
function setUsername() {
	username = usernameInput.value;
	usernameButton.disabled = true;
	document.querySelector('#modal-menu-welcome').innerHTML = `Welcome ${username}!`;
	setModalContent('#modal-menu');
}

usernameButton.onclick = setUsername;
usernameInput.addEventListener("keyup", e => {
	if (event.keyCode == 13) { // enter
		event.preventDefault();
		usernameButton.click();
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

let menuCreate = document.querySelector('#modal-menu-create'),
	menuEnter = document.querySelector('#modal-menu-enter');
menuCreate.onclick = () => { setModalContent('#modal-create') };
menuEnter.onclick = () => { setModalContent('#modal-enter') };

let modalCreate2 = document.querySelector('#modal-create-2'),
	modalCreate3 = document.querySelector('#modal-create-3'),
	modalCreate4 = document.querySelector('#modal-create-4'),
	modalEnterCodeButton = document.querySelector('#modal-enter-code button'),
	modalEnterCodeInput = document.querySelector('#modal-enter-code input');
modalCreate2.onclick = () => {
	roomSize = 2;
	createRoom();
};
modalCreate3.onclick = () => {
	roomSize = 3;
	createRoom();
};
modalCreate4.onclick = () => {
	roomSize = 4;
	createRoom();
};
modalEnterCodeButton.onclick = () => {
	roomCode = modalEnterCodeInput.value;
	enterRoom();
};

let modalErrorMessageButton = document.querySelector('#modal-error-message button');
modalErrorMessageButton.onclick = () => {
	location.reload();
}
function showErrorModal(msg) {
	document.querySelector('#modal-error-message p').innerHTML = msg;
	setModalContent('#modal-error');
}
