(function () {
    const CURRENT_APP_VERSION = '1.0.0';
    const UPDATE_DISMISS_KEY = 'snoenergyDismissedUpdateVersion';
    const DATABASE_URL = 'https://senkick-5b737-default-rtdb.asia-southeast1.firebasedatabase.app';

    function parseVersion(version) {
        return String(version || '')
            .split('.')
            .map(function (part) {
                const parsed = parseInt(part, 10);
                return Number.isNaN(parsed) ? 0 : parsed;
            });
    }

    function compareVersions(left, right) {
        const leftParts = parseVersion(left);
        const rightParts = parseVersion(right);
        const length = Math.max(leftParts.length, rightParts.length);

        for (let index = 0; index < length; index += 1) {
            const leftValue = leftParts[index] || 0;
            const rightValue = rightParts[index] || 0;

            if (leftValue > rightValue) {
                return 1;
            }

            if (leftValue < rightValue) {
                return -1;
            }
        }

        return 0;
    }

    function shouldShowForThisDevice() {
        return document.body.classList.contains('device-mobile');
    }

    function createUpdateBanner(updateInfo) {
        const existingBanner = document.getElementById('appUpdateBanner');
        if (existingBanner) {
            existingBanner.remove();
        }

        const banner = document.createElement('aside');
        banner.id = 'appUpdateBanner';
        banner.className = 'app-update-banner';

        const title = document.createElement('p');
        title.className = 'app-update-title';
        title.textContent = 'App update available';

        const message = document.createElement('p');
        message.className = 'app-update-text';
        message.textContent = updateInfo.message || ('A newer S: No Energy app build (' + updateInfo.latestVersion + ') is available.');

        const actions = document.createElement('div');
        actions.className = 'app-update-actions';

        if (updateInfo.downloadUrl) {
            const linkText = document.createElement('p');
            linkText.className = 'app-update-url';
            linkText.textContent = 'Download link: ' + updateInfo.downloadUrl;
            banner.appendChild(linkText);

            const downloadLink = document.createElement('a');
            downloadLink.className = 'button-link app-update-link';
            downloadLink.href = updateInfo.downloadUrl;
            downloadLink.target = '_blank';
            downloadLink.rel = 'noreferrer';
            downloadLink.textContent = 'Get Update';
            actions.appendChild(downloadLink);
        } else {
            const missingLinkText = document.createElement('p');
            missingLinkText.className = 'app-update-url';
            missingLinkText.textContent = 'Download link missing. Add appUpdates/downloadUrl in Firebase before sending this update.';
            banner.appendChild(missingLinkText);
        }

        const dismissButton = document.createElement('button');
        dismissButton.type = 'button';
        dismissButton.className = 'app-update-dismiss';
        dismissButton.textContent = updateInfo.force ? 'Okay' : 'Later';
        dismissButton.addEventListener('click', function () {
            localStorage.setItem(UPDATE_DISMISS_KEY, updateInfo.latestVersion);
            banner.remove();
        });
        actions.appendChild(dismissButton);

        banner.appendChild(title);
        banner.appendChild(message);
        banner.appendChild(actions);
        document.body.appendChild(banner);
    }

    function checkForAppUpdate() {
        if (!shouldShowForThisDevice()) {
            return;
        }

        function handleUpdateInfo(updateInfo) {
            const latestVersion = String(updateInfo.latestVersion || '').trim();
            const dismissedVersion = localStorage.getItem(UPDATE_DISMISS_KEY);

            if (!latestVersion || compareVersions(latestVersion, CURRENT_APP_VERSION) <= 0) {
                const existingBanner = document.getElementById('appUpdateBanner');
                if (existingBanner) {
                    existingBanner.remove();
                }
                return;
            }

            if (!updateInfo.force && dismissedVersion === latestVersion) {
                return;
            }

            createUpdateBanner({
                latestVersion: latestVersion,
                message: updateInfo.message,
                downloadUrl: updateInfo.downloadUrl,
                force: Boolean(updateInfo.force)
            });
        }

        if (window.SNOENERGY_DB) {
            window.SNOENERGY_DB.ref('appUpdates').on('value', function (snapshot) {
                handleUpdateInfo(snapshot.val() || {});
            }, function (error) {
                console.error('App update check failed:', error);
            });
            return;
        }

        fetch(DATABASE_URL + '/appUpdates.json')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Update request failed with status ' + response.status);
                }

                return response.json();
            })
            .then(function (updateInfo) {
                handleUpdateInfo(updateInfo || {});
            })
            .catch(function (error) {
                console.error('App update check failed:', error);
            });
    }

    document.addEventListener('DOMContentLoaded', checkForAppUpdate);
})();
