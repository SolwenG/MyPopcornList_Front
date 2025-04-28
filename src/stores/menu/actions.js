export default {
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen
    },
    setMobileMode(value) {
        this.isMobileMode = value
    },
    setLanguage(flag, i18n) {
        this.selectedFlag = flag
        i18n.locale.value = flag.value
        document.querySelector('html').setAttribute('lang', flag.value)
    }
}
