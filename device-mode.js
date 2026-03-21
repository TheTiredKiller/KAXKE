(function () {
    function lockPortraitOnMobile() {
        const isMobileAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        const orientationApi = screen.orientation;

        if (!isMobileAgent || !orientationApi || typeof orientationApi.lock !== 'function') {
            return;
        }

        orientationApi.lock('portrait').catch(function () {
            // Some mobile browsers only allow orientation lock in installed/app contexts.
        });
    }

    function applyDeviceMode() {
        const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
        const isTouchDevice = navigator.maxTouchPoints > 0;
        const isMobileAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        const isMobile = isMobileViewport || (isTouchDevice && isMobileAgent);
        const isLandscape = window.matchMedia('(orientation: landscape)').matches;

        document.body.classList.remove('device-pc', 'device-mobile');
        document.body.classList.add(isMobile ? 'device-mobile' : 'device-pc');
        document.body.setAttribute('data-device-mode', isMobile ? 'mobile' : 'pc');
        document.body.classList.toggle('device-mobile-landscape', isMobile && isLandscape);
    }

    document.addEventListener('DOMContentLoaded', function () {
        applyDeviceMode();
        lockPortraitOnMobile();
    });
    window.addEventListener('resize', applyDeviceMode);
    window.addEventListener('orientationchange', function () {
        applyDeviceMode();
        lockPortraitOnMobile();
    });
})();
