let currentSong = new Audio();

function secToMin(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSec = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSec = String(remainingSec).padStart(2, '0');

    return `${formattedMinutes}:${formattedSec}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track;
    if(!pause){
        currentSong.play();
        play.classList.add("fa-pause")
    }
    document.querySelector(".songname").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
    let songs = await getSongs()
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li class="position-relative d-flex align-items-center border py-1 rounded-2 my-3 small">
                            <i class="fa-solid fa-music mx-2"></i>
                            <div class="songList-info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Kapil Singh Maan</div>
                            </div>
                            <div class="songList-play position-absolute end-0 me-1">
                                <i class="fa-solid fa-play cursor-pointer"></i>
                            </div>
                        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".songList-info").firstElementChild.innerHTML.trim())
        })
    })

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.classList.add("fa-pause")
            play.classList.remove("fa-play")
        }
        else {
            currentSong.pause();
            play.classList.add("fa-play")
            play.classList.remove("fa-pause")
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secToMin(currentSong.currentTime)}/${secToMin(currentSong.duration)}`
        document.querySelector(".seekbar-circle").style.left=(currentSong.currentTime/currentSong.duration)*100 +"%";
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".seekbar-circle").style.left=percent+"%";
        currentSong.currentTime=(currentSong.duration)*percent/100;
    })
}

main()
