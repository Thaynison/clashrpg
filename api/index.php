<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RPG Game</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container position-relative">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div id="gameArea">
          <div id="player" class="rounded-circle"></div>
          <div class="row status_hv">
            <div class="col">
              <div id="healthBar" class="progress">
                <div id="health" class="progress-bar bg-success" role="progressbar" style="width: 100%"></div>
              </div>
            </div>
            <div class="col">
              <div id="armorBar" class="progress">
                <div id="armor" class="progress-bar bg-rose" role="progressbar" style="width: 100%"></div>
              </div>
            </div>
          </div>
          <div id="collectible" class="rounded-circle"></div>
          <div id="damageDisplay"></div>
          <div id="experienceBar" class="progress">
            <div id="experience" class="progress-bar bg-primary" role="progressbar" style="width: 0%"></div>
            <div id="levelDisplay">Level: 1</div>
          </div>
        </div>
        <div id="alertContainer" class="position-absolute" style="bottom: 0; left: 0; right: 0;"></div>
      </div>
    </div>
  </div>
  <div id="console"></div>
  <script src="script.js"></script>
</body>
</html>
