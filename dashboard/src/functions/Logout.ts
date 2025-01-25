export const logout = (navigate: any) => {
    document.cookie = "token=";
    navigate('/login')

}