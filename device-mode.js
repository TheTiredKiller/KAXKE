(function () {
    function applyDeviceMode() {
        const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
        const isTouchDevice = navigator.maxTouchPoints > 0;
        const isMobileAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        const isMobile = isMobileViewport || (isTouchDevice && isMobileAgent);

        document.body.classList.remove('device-pc', 'device-mobile');
        document.body.classList.add(isMobile ? 'device-mobile' : 'device-pc');
        document.body.setAttribute('data-device-mode', isMobile ? 'mobile' : 'pc');
    }

    document.addEventListener('DOMContentLoaded', applyDeviceMode);
    window.addEventListener('resize', applyDeviceMode);
    window.addEventListener('orientationchange', applyDeviceMode);
})();
