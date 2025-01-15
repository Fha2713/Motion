let positionWatcher;

// Functions to handle Fullscreen
function fullscreenEnabled() {
  return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
  );
}

function handleFullscreenChange() {
  const navBar = document.querySelector("nav");
  fullscreenEnabled()
      ? (navBar.style.display = "none")
      : (navBar.style.display = "block");
}

const fullScreenButton = document.getElementById("fullScreenButton");
if (fullScreenButton) {
  fullScreenButton.addEventListener("click", () => {
    const fullScreenDocument = document.documentElement;
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
  });
}

document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("mozfullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("msfullscreenchange", handleFullscreenChange);

// register AFRAME component that logs coordinates for debugging
AFRAME.registerComponent("log-coordinates", {
  init: function () {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        console.log(
            `Geolocation API Coordinates\nLatitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`
        );
        console.log(`Geolocation API Accuracy: ${position.coords.accuracy}`);
      });
    } else {
      console.log("Geolocation API is not supported by this browser.");
    }
  },
  remove: function () {
    navigator.geolocation.clearWatch(positionWatcher);
  },
});

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

// Function to load additional HTML content dynamically
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

// Dynamically load marker.html into the main content area
loadHtmlContent("marker.html", "main");
