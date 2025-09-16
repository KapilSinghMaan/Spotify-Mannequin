let currentSong = new Audio();
let songs;
let currFolder;
let currVol;

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

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
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
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.classList.add("fa-pause")
    }
    document.querySelector(".songname").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/Songs/`);

    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");

    let cardgroup = document.querySelector(".card-group")
    let array = Array.from(anchors);

    for (let index = 3; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/Songs")) {
            let folder = e.href.split("/").slice(-1)[0];

            let a = await fetch(`http://127.0.0.1:5500/Songs/${folder}/info.json`)
            let response = await a.json();
            cardgroup.innerHTML = cardgroup.innerHTML + `<div data-folder="${response.foldername}" class="card rounded-3 px-1">
                            <div class="card-play">
                                <p class="position-absolute p-2 bg-success rounded-circle d-inline"><i
                                        class="fa-solid fa-play"></i></p>
                            </div>
                            <img src="/Songs/${folder}/cover.jpeg" class="card-img-top rounded-3" alt="...">
                            <div class="card-body">
                                <h5 class="card-title text-white">${response.title}</h5>
                                <p class="card-text text-white ">${response.description}</p>
                            </div>
                        </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
        })
    })
}

async function main() {

    displayAlbums();

    await getSongs(`Songs/${currFolder}`)
    playMusic(songs[0], true)

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
        document.querySelector(".songtime").innerHTML = `${secToMin(currentSong.currentTime)}/${secToMin(currentSong.duration)}`
        document.querySelector(".seekbar-circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".seekbar-circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100;
    })

    next.addEventListener("click", () => {
        console.log(songs);
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    })

    document.querySelector(".changevolume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currVol=parseInt(e.target.value) / 100;
        currentSong.volume = currVol;
    })

    document.querySelector(".changevolume>i").addEventListener("click", e => {
        if (document.querySelector(".changevolume>i").classList.contains("fa-volume-high")) {
            document.querySelector(".changevolume>i").classList.remove("fa-volume-high");
            document.querySelector(".changevolume>i").classList.add("fa-volume-xmark");
            currentSong.volume=0;
        }
        else {
            document.querySelector(".changevolume>i").classList.remove("fa-volume-xmark");
            document.querySelector(".changevolume>i").classList.add("fa-volume-high");
            currentSong.volume=currVol;
        }

    })

}

main()
