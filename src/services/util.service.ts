export const utilService = {
    saveToStorage,
    loadFromStorage,
    saveToSession,
    loadFromSession,
    getRandomIntInc,
    getRandomColor,
    makeId,
    delay,
    getHeaderLinks,
    getIcon,
    getLorem,
    getRandomNames,
    getRandomUsername,
    timeAgo
}


function delay(ms = 1500) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

function saveToStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage<T>(key: string): T[] | null {
    let data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
}

function saveToSession(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value))
}

function loadFromSession(key: string) {
    let data = sessionStorage.getItem(key)
    return data ? JSON.parse(data) : null
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function makeId(length = 5) {
    var txt = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function getRandomIntInc(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getHeaderLinks() {
    return [
        {
            path: '/',
            name: 'Home'
        },
        {
            path: '/explore',
            name: 'explore'
        },
    ]
}

function getIcon(iconName: string) {
    interface IconsMap {
        [key: string]: string
    }
    const iconMap: IconsMap = {
        logo: 'https://res.cloudinary.com/dokgseqgj/image/upload/v1679493265/useful-items_bawwnb.png',
        hamburger: 'https://res.cloudinary.com/dokgseqgj/image/upload/v1685287498/hamburger-menu_a0alzo.ico',
        delete: 'https://res.cloudinary.com/dokgseqgj/image/upload/v1679760132/delete_aixeha.ico',
        edit: 'https://res.cloudinary.com/dokgseqgj/image/upload/v1679760130/edit_du3e36.ico',
        info: 'https://res.cloudinary.com/dokgseqgj/image/upload/v1679760107/info_ii1yd6.ico',
        addImg: 'https://res.cloudinary.com/dokgseqgj/image/upload/v1679503713/add-image_i58iy2.png',
        Hammer: 'https://res.cloudinary.com/dokgseqgj/image/upload/v1679493254/Hammer_ck25gz.png',
        Saw: 'https://res.cloudinary.com/dokgseqgj/image/upload/v1679493261/Saw_vpnv9i.png',
        Wrench: 'https://res.cloudinary.com/dokgseqgj/image/upload/v1679493275/Wrench_qp5fdp.png',
        success: 'https://res.cloudinary.com/dokgseqgj/image/upload/v1679760119/success_sdvaid.ico',
        error: 'https://res.cloudinary.com/dokgseqgj/image/upload/v1679760126/error_hfyagg.ico'
    }
    return iconMap[iconName]
}

function getLorem(): string {
    return 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt eum quaerat eligendi amet asperiores repudiandae itaque excepturi nam cupiditate omnis, eos saepe veritatis dicta necessitatibus delectus ratione consectetur accusamus? Laboriosam.'
}

function getRandomNames(): string[] {
    return [
        'Baba Jom',
        'John Doe',
        'Alice Smith',
        'David Johnson',
        'Emma Brown',
        'Michael Davis',
        'Olivia Wilson',
        'James Martinez',
        'Sophia Anderson',
        'William Taylor'
    ]
}

function getRandomUsername(): string {
    const adjectives = ['happy', 'sad', 'funny', 'brave', 'clever', 'kind', 'gentle', 'wild', 'smart', 'silly']
    const nouns = ['cat', 'dog', 'bird', 'elephant', 'lion', 'tiger', 'monkey', 'dolphin', 'snake', 'panda']

    const randomAdjective = adjectives[getRandomIntInc(0, adjectives.length - 1)]
    const randomNoun = nouns[getRandomIntInc(0, nouns.length - 1)]

    return randomAdjective + '_' + randomNoun
}

function timeAgo(timestamp: number) {
    const currentTime = Date.now()
    const diff = currentTime - timestamp

    if (diff < 0) {
        return 'In the future'
    } else if (diff < 60 * 60 * 1000) {
        const minutes = Math.floor(diff / (60 * 1000))
        return `${minutes}m`
    } else if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000))
        return `${hours}h`
    } else {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000))
        return `${days}d`
    }
}