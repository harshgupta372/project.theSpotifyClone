let currentSong=new Audio();
let songs;

let currfolder;
console.log('lets write some java script ')
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
   
async function getSongs(folder) {
    currfolder=folder;
    let a = await fetch(` /${folder}/`)
    
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
     songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
            let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
            songUL.innerHTML = ""
            for (const song of songs) {
                songUL.innerHTML = songUL.innerHTML + `<li> 
                
                <img class="invert" src="/img/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")} </div>
                    <div> </div>
                </div>
                    <div class="playnow">
                        <img class="invert" id="play0" src="/img/play1.svg" alt="">
                    </div>
            </li>`
        }
        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
            e.addEventListener("click",element=>{
        
               
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        })
         return songs
    }
    
    

const playMusic=(track,pause=false)=>{ 
    currentSong.src=`/${currfolder }/`+track
    if(!pause){

        currentSong.play() 
        play.src="/img/pause.svg"
    }
document.querySelector(".songinfo").innerHTML=decodeURI(track)
document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}
async function displayalbums (){
   console.log("displaying albums")
    let a = await fetch(` /songs/`)
    
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    let cardcontainer=document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")){
let folder=(e.href.split("/").slice(-2)[0])
let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
let response = await a.json();
console.log(response)
cardcontainer.innerHTML=cardcontainer.innerHTML+` <div data-folder="${folder}" class="card"><div class="play">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="29"
    stroke="black" fill="green">
    <circle cx="12" cy="12" r="10" stroke-width="1.5" />
    <path
        d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
        stroke="black" stroke-width="2" stroke-linejoin="round" />
</svg>
</div>
<img src= "/songs/${folder}/cover.jpeg" alt="">
<h2> ${response.title} </h2>
<p> ${response.description}</p>
</div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })
    })
}
async function main() {
        await getSongs("songs/arijit")
    playMusic(songs[0],true)
     await displayalbums()
    }
play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="/img/pause.22.svg"
    }
    else{
        currentSong.pause()
        play.src="/img/play.svg"
    }
})
 
  
currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
})
document.querySelector(".seekbar").addEventListener("click",e=>{
   let percent=(e.offsetX/e.target.getBoundingClientRect().width )*100
    document.querySelector(".circle").style.left=percent+"%";
   currentSong.currentTime=((currentSong.duration))*percent/100
})
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
})
  document.querySelector(".closeicon").addEventListener("click",()=>{
    document.querySelector(".left").style.left= "-120%"
  })

previous.addEventListener("click", () => {
    currentSong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1])
    }
})

// Add an event listener to next
next.addEventListener("click", () => {
    currentSong.pause()
    console.log("Next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }
})
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value, "/ 100")
    currentSong.volume = parseInt(e.target.value) / 100
    if (currentSong.volume >0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace(" mute.svg", "volume.svg")
    }
})

 document.querySelector(".volume> img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src= e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume=0
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src=e.target.src.replace( "mute.svg","volume.svg",)
       currentSong=.1
       document.querySelector(".range").getElementsByTagName("input")[0].value= 10;
    }

 })

 
main()
