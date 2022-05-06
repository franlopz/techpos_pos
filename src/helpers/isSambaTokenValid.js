export const isSambaTokenValid = async () => {

    let isValid = false
    let expireat = window.localStorage.getItem('expiresin');
    return (Date.now() < expireat ?
        !isValid :
        isValid)
}