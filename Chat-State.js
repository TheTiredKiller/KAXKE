window.SNOENERGY_CHAT_STATE = {
    getGroupSeenKey: function (email, roomId) {
        return 'snoenergySeenGroup::' + email + '::' + roomId;
    },
    getPrivateSeenKey: function (email, roomId) {
        return 'snoenergySeenPrivate::' + email + '::' + roomId;
    },
    getPrivateRoomId: function (emailA, emailB) {
        return 'private-' + [emailA, emailB].sort().map(function (email) {
            return email.replace(/[^a-z0-9]/gi, '-');
        }).join('--');
    },
    getSeenTimestamp: function (key) {
        return Number(localStorage.getItem(key) || 0);
    },
    setSeenTimestamp: function (key, timestamp) {
        localStorage.setItem(key, String(timestamp || 0));
    }
};
