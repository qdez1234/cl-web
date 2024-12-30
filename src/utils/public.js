import app from "../main"
export function handleChangeLanguage(value){
    localStorage.setItem('language_local', value)
    app.config.globalProperties.$locale.value = value
    window.location.reload();
}