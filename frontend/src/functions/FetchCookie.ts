export const setCookie = ({ name, value, expires = new Date(), path = '/' }: { name: string; value: string; expires?: Date; path?: string }) => {
    if (document != undefined) {
        document.cookie = `${name}=${value};expires=${expires};path=${path}`
    }
}

export const setCookieTheme = (theme: 'dark' | 'light') => {
    const date = new Date(Date.now() + 30 * 24 * 3600 * 1000)
    if (document != undefined) {
        document.cookie = `theme=${theme};expires=${date};path=/`

    }
}


export const fetchCookie = (name: string): string => {
    let value: any = '';
    if (document != undefined) {
        let arr = document.cookie.split(';')
        value = arr.map((e) => {
            let regex = new RegExp(name);
            if (e.match(regex)) {
                return value = e.split('=')[1].trim()
            }
            return value = ''
        })
        return value.join('')
    }
    return value

}


export const fetchTheme = (): 'dark' | 'light' | null => {
    let theme = fetchCookie('theme');
    if (theme === 'dark' || theme === 'light') {
        return theme
    }
    return null
}