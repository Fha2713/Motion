// Define constants
const fullScreenDocument = document.documentElement;
const navBar = document.querySelector("nav");
const mainElement = document.getElementById("main");
const fullScreenButton = document.getElementById("fullScreenButton");

// Fullscreen Mode Functions
function fullscreenEnabled() {
  return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
  );
}

function toggleFullscreen() {
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
      fullScreenDocument.webkitRequestFullscreen();
    } else if (fullScreenDocument.msRequestFullscreen) {
      fullScreenDocument.msRequestFullscreen();
    }
  }
}

function handleFullscreenChange() {
  navBar.style.display = fullscreenEnabled() ? "none" : "block";
}

if (fullScreenButton) {
  fullScreenButton.addEventListener("click", toggleFullscreen);
}

document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("mozfullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("msfullscreenchange", handleFullscreenChange);

// Load HTML dynamically
function loadHtmlContent(url, targetElementId) {
  fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${url}: ${response.statusText}`);
        }
        return response.text();
      })
      .then((html) => {
        document.getElementById(targetElementId).innerHTML = html;
      })
      .catch((error) => {
        console.error("Error loading HTML content:", error);
      });
}

// Example: Load marker.html into the main section
loadHtmlContent("marker.html", "main");

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
  },
  handleTap: function (e) {
    const link = this.currentMarker
        ? this.currentMarker.getAttribute("clickable")
        : e.target.getAttribute("clickable");
    link && window.open(link, "_blank");
  },
});
