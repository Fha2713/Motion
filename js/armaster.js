
const fullScreenDocument = document.getElementById("scene");
const navBar = document.querySelector("nav");
const fullScreenButton = document.getElementById("fullScreenButton");


// Funktion, um Fullscreen zu überprüfen
function fullscreenEnabled() {
  return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
  );
}

function handleFullscreenChange() {
  fullscreenEnabled()
      ? (navBar.style.display = "none")
      : (navBar.style.display = "block");
}


// Funktion, um Fullscreen zu aktivieren oder zu deaktivieren
function toggleFullscreen() {
  if (fullscreenEnabled()) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    if (fullScreenDocument.requestFullscreen) {
      fullScreenDocument.requestFullscreen().catch(err => console.error("Error entering fullscreen:", err));
    } else if (fullScreenDocument.webkitRequestFullscreen) {
      fullScreenDocument.webkitRequestFullscreen();
    } else if (fullScreenDocument.msRequestFullscreen) {
      fullScreenDocument.msRequestFullscreen();
    }
  }
}

// Event-Listener für den Fullscreen-Button
if (fullScreenButton) {
  fullScreenButton.addEventListener("click", toggleFullscreen);
}

// Event-Listener für Fullscreen-Änderungen
document.addEventListener("fullscreenchange", () => {
  console.log("Fullscreen state changed");
});

document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("mozfullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("msfullscreenchange", handleFullscreenChange);


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
