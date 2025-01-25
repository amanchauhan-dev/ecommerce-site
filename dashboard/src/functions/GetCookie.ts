export const fetchCookieToken = () => {
    let token;
    let arr = document.cookie.split(';');
    token = arr.map((e) => {
        let regex = new RegExp(/token/g)
        if (e.match(regex)) {
            return token = e.split('=')[1].trim()
        } else {
            return token = ''
        }
    })
    return token.join('')
}  

export const fetchCookieTheme = (): 'dark' | 'light' => {
    let value;
    let arr = document.cookie.split(';');
    value = arr.map((e) => {
        let regex = new RegExp(/theme/g)
        if (e.match(regex)) {
            return value = e.split('=')[1].trim()
        } else {
            return value = ''
        }
    })
    let theme = value.join('')
    if (theme === 'dark' || theme === 'light') {
        return theme
    }
    return 'dark'
}