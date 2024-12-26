export function redirect(url) {
    window.history.replaceState({ page: 'new-page' }, 'New Page Title', url);
}

export function redirectToLogin() {
    redirect('/auth/login')
    return null
}