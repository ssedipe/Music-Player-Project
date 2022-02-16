'use strict'

const audioSrc = Array.from(document.querySelector('audio').children)

const audio_play = document.querySelector('audio')

const append_album = document.querySelector('.append_album')
const repeat_logo = document.querySelector('.repeat_logo')
const now_playing_display = document.querySelector('.now_playing_display')
const album_image = document.querySelector('.album_image')
const play_button = document.querySelector('.pl')
const stop_button = document.querySelector('.pa')
const repeat_button = document.querySelector('.repeat')
const mute_button = document.querySelector('.mut')
const next_button = document.querySelector('.next')
const prev_button = document.querySelector('.prev')
const pause_button = document.querySelector('.pause')
const timiming = document.querySelector('.timiming')
const play_all_button = document.querySelector('.play_all')
const play_pause_container = document.querySelector('.play_pause_container')
const player_container = document.querySelector('.player_container')
const re_logo = document.querySelector('.re_logo')
const muteSign = document.querySelector('.m')
const resume_button = document.querySelector('.resume')
const rep = document.querySelector('.rp')
const ind = document.querySelector('.ind')
const range_indicator = document.getElementById('range_indicator')
let playing_started = false
let currentSrc;
let currentIndex;
let track_to_play;
let stopeTime;
let c2 = 0
let track_current_time;
let stp_duration;

const result = (function albumObject() {
    const album_array = []
    return function (artist, title, src, img) {
        const album_obj = {
            'artist': artist,
            'title': title,
            'src': src,
            'image': img
        }
        album_array.push(album_obj)
        return album_array
    }
}())

result('Coldplay -', 'Hardest Part', `${audioSrc[0].src}`, 'https://cdns-images.dzcdn.net/images/artist/e65d62ecd00b8bf1ba89073943ac62a1/500x500.jpg')
result('DIVV -', 'Human', `${audioSrc[1].src}`, 'https://www.nme.com/wp-content/uploads/2019/10/Diiv4-scaled.jpg')
result('Cloud Nothings -', 'Our Plan', `${audioSrc[2].src}`, 'https://www.nme.com/wp-content/uploads/2021/02/Cloud-Nothings.jpg')
result('Caveman -', 'Human', `${audioSrc[3].src}`, 'https://i.ytimg.com/vi/E87ofsnIxxc/maxresdefault.jpg')
result('Beautiful Nubia -', 'Seven Lives', `${audioSrc[4].src}`, 'https://upload.wikimedia.org/wikipedia/commons/8/83/Beautiful_Nubia_in_performance_2013.jpg')
result('Beautiful Nubia -', 'Jangbalajugbu', `${audioSrc[5].src}`, 'https://pan-african-music.com/wp-content/uploads/2018/11/Beautiful-Nubia.jpg')
const album = result('Car Seat Headrest -', 'Drunk Driver', `${audioSrc[6].src}`, 'https://guitar.com/wp-content/uploads/2020/04/Car-Seat-Headrest-11@1400x1050.jpg')

function getImage(arr) {
    const img = arr.map(function (i) {
        return i.image
    })
    return img
}

const url = getImage(album)

function loop_and_append_object(arr) {
    const div_parent = arr.map(function (i, index) {
        const html = `<span>${i.artist}</span> <span>${i.title}</span></span>`
        const div = document.createElement('div')
        div.setAttribute('data-sc', audioSrc[index].src)
        div.setAttribute('data-url', url[index])
        div.setAttribute('data-index', index)
        div.classList.add('style_div_playlist', 's')
        div.insertAdjacentHTML('afterbegin', html)
        append_album.prepend(div)
        return div
    })
    return div_parent
}

let tracks = loop_and_append_object(album)

append_album.addEventListener('dblclick', function (e) {
    effectNowPlaying(0)
    play_all_button.disabled = true
    const dv_closest = e.target.closest('.s')
    if (dv_closest) {
        track_to_play = dv_closest
        takeTrackToPlay(track_to_play, now_playing_display, album_image)
        compareElement(append_album, track_to_play)
        clearInterval(stp_duration)
    } else {
        return;
    }
})

function compareElement(arr, el) {
    Array.from(arr.children).forEach(function (i) {
        if (i === el) {
            i.style.background = 'lightgray'
        } else {
            i.style.background = ''
        }
    })
    return el
}

function effectNowPlaying(n) {
    now_playing_display.style.transform = `translateX(${n}px)`
}

function takeTrackToPlay(el, dis, img) {
    const getMp3Dataset = el.dataset.sc
    displaySongStatus(el, dis, 'Now Playing...')
    audio_play.src = getMp3Dataset
    const image = el.dataset.url
    img.src = image
    audio_play.play()
    playing_started = true
    ui_play()
}

function displaySongStatus(el, d, msg) {
    const [art_name, tk_name] = [el.firstElementChild.textContent, el.firstElementChild.nextElementSibling.textContent]
    d.innerHTML = `<div>${msg}...</div><span>${art_name}</span> <span>${tk_name}</span>`
    album_image.src = el.dataset.url
}

function ui_play() {
    play_button.style.display = 'none'
    stop_button.style.display = 'inline-block'
}

stop_button.addEventListener('click', function () {
    ui_pause(audio_play)
    clearInterval(stopeTime)
    play_all_button.disabled = false
    setTimeout(function () {
        effectNowPlaying(190)
    }, 800)

})

function ui_pause(aud) {
    if (playing_started) {
        aud.pause()
        displaySongStatus(track_to_play, now_playing_display, 'STOPPED!')
        play_button.style.display = 'inline-block'
        stop_button.style.display = 'none'
    }
}

play_button.addEventListener('click', function () {
    play_btn()
})

function play_btn() {
    if (playing_started && audio_play.paused) {
        effectNowPlaying(0)
        play_button.style.display = 'none'
        stop_button.style.display = 'inline-block'
        rsong('none', 'inline-block')
        audio_play.src = currentSrc
        displaySongStatus(track_to_play, now_playing_display, 'Now Playing...')
        audio_play.play()
    }
}

repeat_button.addEventListener('click', function () {
    repeat_song(audio_play)
})

function repeat_song(aud) {
    if (playing_started && rep.textContent === 'OFF') {
        aud.loop = true
        rep.textContent = 'ON'
        re_logo.style.display = 'inline-block'
    } else if (rep.textContent === 'ON') {
        rep.textContent = 'OFF'
        re_logo.style.display = 'none'
        aud.loop = false
    }
}

mute_button.addEventListener('click', function () {
    if (playing_started && ind.textContent === 'OFF') {
        audio_play.muted = true
        ind.textContent = 'ON'
        muteSign.style.display = 'inline-block'
    } else if (ind.textContent === 'ON') {
        ind.textContent = 'OFF'
        muteSign.style.display = 'none'
        audio_play.muted = false
    }
})

audio_play.addEventListener('playing', function (e) {
    playing_started = true
    rangeBar(range_indicator, audio_play)
    play_all_button.disabled = true
    playStopBtnDisplay('inline-block', 'none', 'inline-block')
    clearInterval(stp_duration)
    songDurationDisplay(audio_play.currentTime, timiming)
    displaySongStatus(track_to_play, now_playing_display, 'Now Playing...')
    compareElement(append_album, track_to_play)
    currentSrc = e.target.src
})

function rangeBar(el, aud) {
    el.max = aud.duration
    const stp = setInterval(function () {
        el.value = aud.currentTime
        if (aud.ended === true || aud.paused === true) {
            clearInterval(stp)
        }
    }, 1000)
}

audio_play.addEventListener('ended', function () {
    clearInterval(stp_duration)
    play_all_button.disabled = false
    playStopBtnDisplay('none', 'inline-block', 'none')

})

function playStopBtnDisplay(n, p, s) {
    now_playing_display.style.display = n
    play_button.style.display = p
    stop_button.style.display = s
}

range_indicator.addEventListener('dblclick', function (e) {
    e.preventDefault()
    getRangeValue(this)
    clearInterval(stp_duration)
})

function getRangeValue(rng) {
    if (playing_started) {
        audio_play.currentTime = rng.value
    }
}

next_button.addEventListener('click', prevNext.bind(null, nextSong))
prev_button.addEventListener('click', prevNext.bind(null, prevSong))

function prevNext(fn) {
    try {
        let track_index = fn(track_to_play)
        let [next_track_to_play] = findSong(track_index)
        audio_play.src = next_track_to_play.dataset.sc
        audio_play.play()
        track_to_play = next_track_to_play
        rsong('none', 'inline-block')
        effectNowPlaying(0)
        clearInterval(stp_duration)
    } catch {
        return;
    }
}

function nextSong(currentSong) {
    if (playing_started)
        currentIndex = Number(currentSong.dataset.index)
    currentIndex++
    return currentIndex
}

function prevSong(currentSong) {
    if (playing_started)
        currentIndex = Number(currentSong.dataset.index)
    currentIndex--
    return currentIndex
}

function findSong(index) {
    let fnd_track = tracks.filter(function (i) {
        return +i.dataset.index === index
    })
    return fnd_track
}

play_all_button.addEventListener('click', function () {
    this.disabled = true
    effectNowPlaying(0)
    clearInterval(stp_duration)
    audio_play.src = tracks[c2].dataset.sc
    track_to_play = tracks[c2]
    audio_play.play()

    stopeTime = setInterval(function () {
        if (audio_play.ended) {
            c2++
            audio_play.src = tracks[c2].dataset.sc
            audio_play.play()
            track_to_play = tracks[c2]
        }

        if (c2 === album.length - 1) {
            c2 = 0
            clearInterval(stopeTime)
        }
    }, 1000)
})

pause_button.addEventListener('click', function () {
    track_current_time = audio_play.currentTime
    pauseAudio(audio_play)

})

function pauseAudio(aud) {
    if (playing_started && aud.paused === false) {
        audio_play.pause()
        aud.currentTime = track_current_time
        rsong('inline-block', 'none')
    }
}

audio_play.addEventListener('pause', function () {
    play_button.style.display = 'inline-block'
    stop_button.style.display = 'none'
    clearInterval(stp_duration)
})

resume_button.addEventListener('click', function () {
    resumeSong(audio_play)
})

function resumeSong(aud) {
    if (playing_started) {
        rsong('none', 'inline-block')
        aud.currentTime = track_current_time
        audio_play.play()
    }
}

function rsong(r, p) {
    resume_button.style.display = r
    pause_button.style.display = p
}

function songDurationDisplay(sec, el) {
    stp_duration = setInterval(function () {
        let s = ++sec
        let refine = (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s

        if (audio_play.ended === true) {
            clearInterval(stp_duration)
        }
        el.textContent = refine.slice(0, 5)
    }, 1000)
}

function playContainerEffect(v, time) {
    setTimeout(function () {
        play_pause_container.style.transform = `translateY(${v}px)`
    }, time)
}

player_container.addEventListener('mouseout', function () {
    if (playing_started) {
        playContainerEffect(51, 0)
    }
})

player_container.addEventListener('mouseover', function () {
    playContainerEffect(0, 0)
})



