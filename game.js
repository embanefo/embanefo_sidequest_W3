// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawGame() → what the game screen looks like
// 2) input handlers → what happens when the player clicks or presses keys
// 3) helper functions specific to this screen

// ------------------------------
// Button data
// ------------------------------
// This object stores all the information needed to draw
// and interact with the button on the game screen.
// Keeping this in one object makes it easier to move,
// resize, or restyle the button later.
const gameBtn = {
  x: 400, // x position (centre of the button)
  y: 550, // y position (centre of the button)
  w: 260, // width
  h: 90, // height
  label: "PRESS HERE", // text shown on the button
};

const endBtn = {
  x: 400,
  y: 700,
  w: 220,
  h: 70,
  label: "END GAME",
};

let gameStarted = false;
let x, y;
let r = 40;

// ------------------------------
// Main draw function for this screen
// ------------------------------
// drawGame() is called from main.js *only*
// when currentScreen === "game"
function drawGame() {
  background(181, 101, 118);

  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Screen", width / 2, 160);

  textSize(18);

  if (!gameStarted) {
    text("Click the button to begin.", width / 2, 210);

    // Draw button ONLY before the game starts
    drawGameButton(gameBtn);

    // Cursor changes only for button hover
    cursor(isHover(gameBtn) ? HAND : ARROW);
    return; // stop here so circle doesn't draw yet
  }

  // After game starts:
  text("Click the circle to spawn the next one.", width / 2, 210);

  // Draw the circle target
  fill(255, 0, 0);
  circle(x, y, r * 2);

  drawGameButton(endBtn);

  // Cursor becomes a hand when hovering the circle or the button
  const overCircle = dist(mouseX, mouseY, x, y) < r;
  const overEndBtn = isHover(endBtn);
  cursor(overCircle || overEndBtn ? HAND : ARROW);
}

// ------------------------------
// Button drawing helper
// ------------------------------
// This function is responsible *only* for drawing the button.
// It does NOT handle clicks or game logic.
function drawGameButton({ x, y, w, h, label }) {
  rectMode(CENTER);

  // Check if the mouse is hovering over the button
  // isHover() is defined in main.js so it can be shared
  const hover = isHover({ x, y, w, h });

  noStroke();

  // Change button colour when hovered
  // This gives visual feedback to the player
  fill(
    hover
      ? color(180, 220, 255, 220) // lighter blue on hover
      : color(200, 220, 255, 190), // normal state
  );

  // Draw the button rectangle
  rect(x, y, w, h, 14); // last value = rounded corners

  // Draw the button text
  fill(0);
  textSize(28);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}

// ------------------------------
// Mouse input for this screen
// ------------------------------
// This function is called from main.js
// only when currentScreen === "game"
function gameMousePressed() {
  // Only trigger the outcome if the button is clicked
  if (!gameStarted) {
    if (isHover(gameBtn)) {
      gameStarted = true;
      newTarget();
    }
    return;
  }

  if (isHover(endBtn)) {
    currentScreen = "lose";
    return;
  }

  // After start: clicking the circle spawns the next one
  checkhit(mouseX, mouseY);
}

// ------------------------------
// Keyboard input for this screen
// ------------------------------
// Allows keyboard-only interaction (accessibility + design)
function gameKeyPressed() {
  if (!gameStarted && keyCode === ENTER) {
    gameStarted = true;
    newTarget();
    return;
  }

  if (gameStarted && keyCode === ENTER) {
    checkhit(mouseX, mouseY);
  }
}

// ------------------------------
// Game logic: click the circle
// ------------------------------
// This function decides what happens next in the game.
// It does NOT draw anything.
function checkhit(mx, my) {
  //check if the circle
  let d = dist(mx, my, x, y);
  if (d < r) {
    newTarget();
  }
}

function newTarget() {
  x = random(r, width - r);
  y = random(r, height - r);
}
