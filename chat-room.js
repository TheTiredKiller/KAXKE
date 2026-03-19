(function () {
    const db = window.SNOENERGY_DB;
    const chatConfig = window.SNOENERGY_CHAT_CONFIG || {};
    const rooms = window.SNOENERGY_CHAT_ROOMS || [];
    const authStorageKey = chatConfig.storageKeys ? chatConfig.storageKeys.auth : 'syn4rgyChatAuthenticated';
    const emailStorageKey = chatConfig.storageKeys ? chatConfig.storageKeys.email : 'syn4rgyChatEmail';
    const chatUsers = chatConfig.users || {};
    const roomId = document.body.getAttribute('data-chat-room');
    const currentRoom = rooms.find(function (room) {
        return room.id === roomId;
    });
    const savedChatEmail = (localStorage.getItem(emailStorageKey) || '').toLowerCase();
    const isAuthenticated = localStorage.getItem(authStorageKey) === 'true';
    const roomIdentity = document.getElementById('roomIdentity');
    const chatMessages = document.getElementById('chatMessages');
    const chatMessageForm = document.getElementById('chatMessageForm');
    const chatMessageInput = document.getElementById('chatMessage');
    const chatRoomLogoutButton = document.getElementById('chatRoomLogoutButton');

    if (!currentRoom) {
        window.location.href = 'Chats.html';
        return;
    }

    if (!isAuthenticated || !Object.prototype.hasOwnProperty.call(chatUsers, savedChatEmail)) {
        window.location.href = 'Chats.html';
        return;
    }

    if (currentRoom.members.indexOf(savedChatEmail) === -1) {
        window.location.href = 'Chats.html';
        return;
    }

    roomIdentity.textContent = 'Logged in as: ' + (chatUsers[savedChatEmail] || savedChatEmail);

    function escapeHtml(text) {
        return String(text || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderMessages(snapshot) {
        const rawMessages = snapshot.val() || {};
        const messages = Object.values(rawMessages).sort(function (a, b) {
            return (a.createdAt || 0) - (b.createdAt || 0);
        });

        if (messages.length === 0) {
            chatMessages.innerHTML = '<p class="muted">No messages yet. Start the chat.</p>';
            return;
        }

        chatMessages.innerHTML = messages.map(function (item) {
            return '<div class="chat-message">' +
                '<p class="chat-message-name">' + escapeHtml(item.name || 'Member') + '</p>' +
                '<p class="chat-message-body">' + escapeHtml(item.message || '').replace(/\n/g, '<br>') + '</p>' +
                '<p class="chat-message-time muted">' + (item.createdAt ? new Date(item.createdAt).toLocaleString() : '') + '</p>' +
                '</div>';
        }).join('');

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    db.ref('chatRooms/' + currentRoom.id + '/messages').orderByChild('createdAt').on('value', renderMessages, function () {
        chatMessages.innerHTML = '<p class="muted">Messages are unavailable right now.</p>';
    });

    chatMessageForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const message = chatMessageInput.value.trim();
        if (!message) {
            return;
        }

        const newMessageRef = db.ref('chatRooms/' + currentRoom.id + '/messages').push();
        newMessageRef.set({
            email: savedChatEmail,
            name: chatUsers[savedChatEmail] || savedChatEmail,
            message: message,
            createdAt: Date.now()
        }).then(function () {
            chatMessageForm.reset();
            chatMessageInput.focus();
        }).catch(function () {
            alert('Message could not be sent right now.');
        });
    });

    chatRoomLogoutButton.addEventListener('click', function () {
        localStorage.removeItem(authStorageKey);
        localStorage.removeItem(emailStorageKey);
        window.location.href = 'Chats.html';
    });
})();
