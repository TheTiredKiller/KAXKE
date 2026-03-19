document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('transition-enabled');

    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            document.body.classList.add('page-ready');
        });
    });

    document.querySelectorAll('a[href]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            const href = link.getAttribute('href');

            if (!href || href.charAt(0) === '#') {
                return;
            }

            if (link.target === '_blank' || link.hasAttribute('download')) {
                return;
            }

            const targetUrl = new URL(link.href, window.location.href);
            const currentUrl = new URL(window.location.href);

            if (targetUrl.origin !== currentUrl.origin) {
                return;
            }

            const targetFile = targetUrl.pathname.split('/').pop().toLowerCase();
            const currentFile = currentUrl.pathname.split('/').pop().toLowerCase();

            if (targetFile === 'chats.html' || currentFile === 'chats.html') {
                return;
            }

            if (targetUrl.href === currentUrl.href) {
                return;
            }

            event.preventDefault();
            document.body.classList.remove('page-ready');
            document.body.classList.add('page-exit');

            window.setTimeout(function () {
                window.location.href = link.href;
            }, 260);
        });
    });
});
