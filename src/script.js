import { startGame } from "./game.js";

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startGame");
  const restartButton = document.getElementById("restartGame");
  const settingsButton = document.getElementById("settingsButton");
  const backButton = document.getElementById("backButton");

  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", startGame);
  settingsButton.addEventListener("click", showSettingsMenu);
  backButton.addEventListener("click", hideSettingsMenu);

  function showSettingsMenu() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("settingsMenu").classList.remove("hidden");
  }

  function hideSettingsMenu() {
    document.getElementById("settingsMenu").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
  }
});
