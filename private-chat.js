(function () {
    const db = window.SNOENERGY_DB;
    const chatConfig = window.SNOENERGY_CHAT_CONFIG || {};
    const authStorageKey = chatConfig.storageKeys ? chatConfig.storageKeys.auth : 'syn4rgyChatAuthenticated';
    const emailStorageKey = chatConfig.storageKeys ? chatConfig.storageKeys.email : 'syn4rgyChatEmail';
    const chatUsers = chatConfig.users || {};
    const chatState = window.SNOENERGY_CHAT_STATE || {};
    const savedChatEmail = (localStorage.getItem(emailStorageKey) || '').toLowerCase();
    const isAuthenticated = localStorage.getItem(authStorageKey) === 'true';
    const params = new URLSearchParams(window.location.search);
    const targetEmail = (params.get('user') || '').toLowerCase();
    const privateChatTitle = document.getElementById('privateChatTitle');
    const privateChatSubtitle = document.getElementById('privateChatSubtitle');
    const privateChatIdentity = document.getElementById('privateChatIdentity');
    const privateMemberSearch = document.getElementById('privateMemberSearch');
    const privateMemberList = document.getElementById('privateMemberList');
    const privateChatMessages = document.getElementById('privateChatMessages');
    const privateChatForm = document.getElementById('privateChatForm');
    const privateChatMessage = document.getElementById('privateChatMessage');
    const privateChatLogoutButton = document.getElementById('privateChatLogoutButton');

    if (!isAuthenticated || !Object.prototype.hasOwnProperty.call(chatUsers, savedChatEmail)) {
        window.location.href = 'Chats.html';
        return;
    }

    if (!targetEmail || !Object.prototype.hasOwnProperty.call(chatUsers, targetEmail) || targetEmail === savedChatEmail) {
        window.location.href = 'Chats.html';
        return;
    }

    const participants = [savedChatEmail, targetEmail].sort();
    const privateRoomId = 'private-' + participants.map(function (email) {
        return email.replace(/[^a-z0-9]/gi, '-');
    }).join('--');
    const seenKey = chatState.getPrivateSeenKey ? chatState.getPrivateSeenKey(savedChatEmail, privateRoomId) : '';

    privateChatTitle.textContent = 'Private Chat';
    privateChatSubtitle.textContent = chatUsers[targetEmail] || targetEmail;
    privateChatIdentity.textContent = 'Logged in as: ' + (chatUsers[savedChatEmail] || savedChatEmail);

    function escapeHtml(text) {
        return String(text || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderMemberList(searchTerm) {
        const normalizedSearch = String(searchTerm || '').trim().toLowerCase();
        const members = Object.keys(chatUsers)
            .filter(function (email) {
                return email !== savedChatEmail;
            })
            .filter(function (email) {
                const name = chatUsers[email] || email;
                return !normalizedSearch || name.toLowerCase().indexOf(normalizedSearch) !== -1;
            })
            .sort(function (a, b) {
                return (chatUsers[a] || a).localeCompare(chatUsers[b] || b);
            });

        if (members.length === 0) {
            privateMemberList.innerHTML = '<p class="muted">No members found.</p>';
            return;
        }

        privateMemberList.innerHTML = members.map(function (email) {
            const isActive = email === targetEmail;
            return '<a class="messenger-contact ' + (isActive ? 'messenger-contact-active' : '') + '" href="private-chat.html?user=' + encodeURIComponent(email) + '">' +
                '<span class="messenger-contact-name">' + escapeHtml(chatUsers[email] || email) + '</span>' +
                '<span class="messenger-contact-email">' + escapeHtml(email) + '</span>' +
                '</a>';
        }).join('');
    }

    function renderMessages(snapshot) {
        const rawMessages = snapshot.val() || {};
        const messages = Object.values(rawMessages).sort(function (a, b) {
            return (a.createdAt || 0) - (b.createdAt || 0);
        });

        if (messages.length === 0) {
            privateChatMessages.innerHTML = '<p class="muted">No messages yet. Start the private chat.</p>';
            return;
        }

        privateChatMessages.innerHTML = messages.map(function (item) {
            const isOwn = item.email === savedChatEmail;
            return '<div class="chat-message ' + (isOwn ? 'chat-message-own' : 'chat-message-other') + '">' +
                '<p class="chat-message-name">' + escapeHtml(item.name || 'Member') + '</p>' +
                '<p class="chat-message-body">' + escapeHtml(item.message || '').replace(/\n/g, '<br>') + '</p>' +
                '<p class="chat-message-time muted">' + (item.createdAt ? new Date(item.createdAt).toLocaleString() : '') + '</p>' +
                '</div>';
        }).join('');

        privateChatMessages.scrollTop = privateChatMessages.scrollHeight;

        if (messages.length > 0 && seenKey) {
            chatState.setSeenTimestamp(seenKey, messages[messages.length - 1].createdAt || 0);
        }
    }

    db.ref('privateChats/' + privateRoomId + '/messages').orderByChild('createdAt').on('value', renderMessages, function () {
        privateChatMessages.innerHTML = '<p class="muted">Private chat is unavailable right now.</p>';
    });

    privateChatForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const message = privateChatMessage.value.trim();
        if (!message) {
            return;
        }

        const newMessageRef = db.ref('privateChats/' + privateRoomId + '/messages').push();
        newMessageRef.set({
            email: savedChatEmail,
            name: chatUsers[savedChatEmail] || savedChatEmail,
            target: targetEmail,
            message: message,
            createdAt: Date.now()
        }).then(function () {
            privateChatForm.reset();
            privateChatMessage.focus();
        }).catch(function () {
            alert('Message could not be sent right now.');
        });
    });

    privateChatLogoutButton.addEventListener('click', function () {
        localStorage.removeItem(authStorageKey);
        localStorage.removeItem(emailStorageKey);
        window.location.href = 'Chats.html';
    });

    privateMemberSearch.addEventListener('input', function () {
        renderMemberList(privateMemberSearch.value);
    });

    renderMemberList('');
})();
