export const user = (() => {
    try {
        return JSON.parse(localStorage.user)
    } catch (e) {
        console.error(e);
        const newUser = {
            x: Math.floor(Math.random() * 19),
            y: Math.floor(Math.random() * 19),
        }
        localStorage.user = JSON.stringify(newUser)
        return newUser
    }
})();

export const cps = (() => {
    try {
        return JSON.parse(localStorage.myCps) || []
    } catch (e) {
        console.error(e);
        return []
    }
})();

export const otherCps = (() => {
    try {
        return JSON.parse(localStorage.otherCps) || []
    } catch (e) {
        console.error(e);
        return []
    }
})();