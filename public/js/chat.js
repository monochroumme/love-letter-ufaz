// REQUIRES modal.js (pre)

let chatWindow = document.querySelector('#chat-window'),
	chatWrapper = document.querySelector('#chat-wrapper');
	chat = document.querySelector('#chat');
	chatInput = document.querySelector('#chat-input');

chatInput.addEventListener('keyup', e => {
	if (e.keyCode == 13 && chatInput.value.trim() != '') { // enter
		sendChatMessage(chatInput.value.trim());
		chatInput.value = '';
	}
});

function initChat() {
	clearChat();
	chatWindow.classList.add('active');
	setTimeout(() => {
		chatWindow.classList.add('visible');
	}, 1);
}

function eliminateChat() {
	clearChat();
	chatWindow.classList.remove('visible');
	setTimeout(() => {
		chatWindow.classList.remove('active');
	}, 250);
}

function clearChat() {
	chat.innerHTML = '';
}

function sendChatMessage(message) {
	socket.emit('chat-message', {
		from: 'USER',
		nickname,
		message: message
	});
}

function fillChat(msgs) {
	for (let i = 0; i < msgs.length; i++) {
		let msgEl = document.createElement('span');
		msgEl.classList.add('chat__message');
		if (msgs[i].from == 'SERVER') {
			msgEl.classList.add('chat__message--server');
			msgEl.innerHTML = msgs[i].message;
			chat.innerHTML += msgEl.outerHTML;
		} else if (msgs[i].from == 'USER') {
			msgEl.innerHTML = `${msgs[i].nickname}: ${msgs[i].message}`;
			chat.innerHTML += msgEl.outerHTML;
		}
	}
	chatWrapper.scrollTop = chatWrapper.scrollHeight;
}

function addChatMessage(data) {
	if (data.from) {
		if (data.from == 'SERVER') {
			addChatServerMessage(data.message);
		} else if (data.from == 'USER') {
			let msgEl = document.createElement('span');
			msgEl.classList.add('chat__message');
			msgEl.innerHTML = `${data.nickname}: ${data.message}`;
			chat.appendChild(msgEl);
		}
		chatWrapper.scrollTop = chatWrapper.scrollHeight;
	} else {
		console.error('ERROR: addChatMessage got data without a sender (data.from == undefined)');
	}
}

function addChatServerMessage(message) {
	let msgEl = document.createElement('span');
	msgEl.classList.add('chat__message');
	msgEl.classList.add('chat__message--server');
	msgEl.innerHTML = message;
	chat.innerHTML += msgEl.outerHTML;
}

socket.on('chat-message', data => {
	addChatMessage(data);
});
