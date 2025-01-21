// A-Frame Components
AFRAME.registerComponent("click-detector", {
  init: function () {
    this.currentMarker = null;

    this.handleMarkerFound = this.handleMarkerFound.bind(this);
    this.handleMarkerLost = this.handleMarkerLost.bind(this);
    this.handleTap = this.handleTap.bind(this);

    this.el.addEventListener("markerFound", this.handleMarkerFound);
    this.el.addEventListener("markerLost", this.handleMarkerLost);
    this.el.addEventListener("click", this.handleTap);
    this.el.addEventListener("touchstart", this.handleTap);
  },
  remove: function () {
    this.el.removeEventListener("markerFound", this.handleMarkerFound);
    this.el.removeEventListener("markerLost", this.handleMarkerLost);
    this.el.removeEventListener("click", this.handleTap);
  },
  handleMarkerFound: function (e) {
    this.currentMarker = e.target;
    console.log("Marker found!!!");
  },
  handleMarkerLost: function () {
    this.currentMarker = null;
    console.log("Marker lost.");
  },
  handleTap: function (e) {
    const link = this.currentMarker
        ? this.currentMarker.getAttribute("clickable")
        : e.target.getAttribute("clickable");
    link && window.open(link, "_blank");
  },
});


document.querySelector('#mcqueen-marker').addEventListener('click', () => {
  window.location.href = 'https://en.wikipedia.org/wiki/Lightning_McQueen';
});


document.querySelector('#knuckles-marker').addEventListener('click', () => {
  window.location.href = 'https://www.youtube.com/watch?v=VcRz9EMC-Y0';
});


document.querySelector('#goat-marker').addEventListener('click', () => {
  window.location.href = 'https://fha2713.github.io/Motion/GOAT.mp4';
});


document.getElementById('fullScreenButton').addEventListener('click', () => {
  const view = document.getElementById('view'); // The <body> element with id="view"

  if (!document.fullscreenElement) {
    // Request fullscreen mode
    view.requestFullscreen()
        .then(() => console.log('Entered fullscreen mode'))
        .catch(err => console.error(`Error entering fullscreen: ${err}`));
  } else {
    // Exit fullscreen mode
    document.exitFullscreen()
        .then(() => console.log('Exited fullscreen mode'))
        .catch(err => console.error(`Error exiting fullscreen: ${err}`));
  }
});

