let currentSong=new Audio();

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

const playMusic=(track)=>{
    currentSong.src="/songs/"+track;
    currentSong.play();
}

async function main() {
    let songs =await getSongs()

    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`<li class="position-relative d-flex align-items-center border py-1 rounded-2 my-3 small">
                            <i class="fa-solid fa-music mx-2"></i>
                            <div class="songList-info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Kapil Singh Maan</div>
                            </div>
                            <div class="songList-play position-absolute end-0 me-1">
                                <i class="fa-solid fa-play"></i>
                            </div>
                        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".songList-info").firstElementChild.innerHTML.trim())
        })
    })
}

main()
