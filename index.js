//icons
const playIcon = '<i class="fas fa-play"></i>'
const pauseIcon = '<i class="fas fa-pause"></i>'
const refreshIcon = '<i class="fas fa-redo"></i>'
const volumeUpIcon = '<i class="fas fa-volume-up"></i>'
const volumeDownIcon = '<i class="fas fa-volume-down"></i>'
const volumeMuteIcon = '<i class="fas fa-volume-mute"></i>'

function Class(param){
    return document.getElementsByClassName(param)[0]
}

const player = Class('all')
const video = Class('video')
const panel = Class('panel')
const playButton = Class('play')
const muteButton = Class('mute')
const timeIndicator = Class('time-indicator')
const fullscreenButton = Class('fullscreen')
const playButtonMiddle = Class('playbutton-middle')

$('.volume').slider({
    range: 'min',
    min: 0,
    max: 100,
    value: 50,
    create: function(e, ui){
      video.volume = $('.volume').slider('value')/100
      let icon = ''
      if(video.volume == 0){
        video.muted = true
        icon = volumeMuteIcon
      }
      else{
        video.muted = false
        icon = volumeUpIcon
      }
      muteButton.innerHTML = icon
    },
    slide: function(e, ui){
      video.volume = ui.value/100
      let icon = ''
      if(video.volume == 0){
        video.muted = true
        icon = volumeMuteIcon
      }
      else{
        video.muted = false
        icon = volumeUpIcon
      }
      muteButton.innerHTML = icon
    }
})
$('.playback').slider({
    range: 'min',
    min: 0,
    max: 10000,
    create: function(e, ui){},
    slide: function(e, ui){
      video.currentTime = ui.value/10000 * video.duration
    }
})

function calculateDuration(){
  let total = video.duration - video.currentTime
  let minutes = Math.floor(total / 60)
  let seconds = Math.round(total % 60)
  if(minutes < 10){
    minutes = `0${minutes}`
  }
  if (seconds < 10){
    seconds = `0${seconds}`
  }
  if(total > 0){
    timeIndicator.textContent = `${minutes}:${seconds}`
  }
}

function rotatePlayButton(){
  if(!playButton.style.transform){
    playButton.style.transform = 'rotate(360deg)'
  }
  else{
    if(playButton.style.transform == 'rotate(360deg)'){
      playButton.style.transform = 'rotate(-360deg)'
    }
    else{
      playButton.style.transform = 'rotate(360deg)'
    }
  }
}

function toggleMute(){
  video.muted = !video.muted

  if(video.muted){
    $('.volume').slider({
      value: 0
    })
  }
  else{
    $('.volume').slider({
      value: video.volume*100
    })
  }
  const icon = video.muted ? volumeMuteIcon : volumeUpIcon
  if(video.volume == 0){
    video.volume = 0.5
    $('.volume').slider({
      value: 50
    })
    muteButton.innerHTML = volumeUpIcon
  }
  else{
    muteButton.innerHTML = icon
  }
}

function togglePlay(){
  video.paused ? video.play() : video.pause()
  const icon = video.paused ? playIcon : pauseIcon
  playButton.innerHTML = icon
  rotatePlayButton()
  toggleMiddlePlayButton()
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&
    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else {
      console.log("not supported");
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

function updateProgressBar(){
  $('.playback').slider({
    value: (video.currentTime/video.duration)*10000
  })
  calculateDuration()
}

function toggleMiddlePlayButton(){
  playButtonMiddle.style.opacity = video.paused ? 1 : 0;
}

function showRefreshButton(){
  playButton.innerHTML = refreshIcon
  playButtonMiddle.style.opacity = 1
}
let delay
function hideControlPanel(){
  if(!video.paused){
    delay = setTimeout(function(){
      panel.style.bottom = '-30px'
      panel.style.opacity = 0
      panel.style.pointerEvents = 'none'
    }, 2000);
  }
}
function showControlPanel(){
  clearTimeout(delay)
  panel.style.pointerEvents = 'auto'
  panel.style.bottom = '6px'
  panel.style.opacity = 1
}
video.addEventListener('loadedmetadata', calculateDuration)
video.addEventListener('timeupdate', updateProgressBar)
video.addEventListener('ended', showRefreshButton)
video.addEventListener('click', togglePlay)
player.addEventListener('mouseout', hideControlPanel)
player.addEventListener('mouseover', showControlPanel)
playButton.addEventListener('click', togglePlay)
muteButton.addEventListener('click', toggleMute)
fullscreenButton.addEventListener('click', toggleFullScreen)
