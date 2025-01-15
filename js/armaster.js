let currentMode;

const fullScreenDocument = document.documentElement;
const mainElement = document.getElementById("main");
const navBar = document.querySelector("nav");
const fullScreenButton = document.getElementById("fullScreenButton");

const modeToggle = document.getElementById("mode-toggle");


// errors if navigation is unavailable
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert(
          "User denied the request for Geolocation. Application won't work properly."
      );
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

// function to switch between indoor and outdoor mode
function switchMode(mode) {
  console.log(`Switch: ${mode}`);
  let arDoc;

  if (mode == OUTDOOR) {
    arDoc = "location_part.html";
    modeToggle.checked = false;
  } else {
    arDoc = "marker_part.html";
    modeToggle.checked = true;
  }

  currentMode = mode;
  localStorage.setItem("lastMode", mode);

  fetch(arDoc)
      .then((response) => response.text())
      .then((html) => {
        mainElement.innerHTML = html;
        const video = document.querySelector("video");

        video && video.remove();
      });
}


// Functions to handle Fullscreen
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

if (fullScreenButton) {
  fullScreenButton.addEventListener("click", () => {
    if (fullscreenEnabled()) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (fullScreenDocument.requestFullscreen) {
        fullScreenDocument.requestFullscreen();
      } else if (fullScreenDocument.webkitRequestFullscreen) {
        /* Safari */
        fullScreenDocument.webkitRequestFullscreen();
      } else if (fullScreenDocument.msRequestFullscreen) {
        /* IE11 */
        fullScreenDocument.msRequestFullscreen();
      }
    }
  });
}

document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("mozfullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("msfullscreenchange", handleFullscreenChange);


// registering an AFRAME component for handling clicks on AR elements
AFRAME.registerComponent("click-detector", {
  init: function () {
    this.currentMarker = null;
    this.lock = false;

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
  },
  handleTap: function (e) {
    const link = this.currentMarker
        ? this.currentMarker.getAttribute("clickable")
        : e.target.getAttribute("clickable");
    link && window.open(link, "_blank");
  },
});