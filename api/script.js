document.addEventListener('DOMContentLoaded', function() {
  const player = document.getElementById('player');
  const gameArea = document.getElementById('gameArea');
  const healthBar = document.getElementById('health');
  const armorBar = document.getElementById('armor');
  const collectible = document.getElementById('collectible');
  const damageDisplay = document.getElementById('damageDisplay');
  const experienceBar = document.getElementById('experience');
  const levelDisplay = document.getElementById('levelDisplay');
  const consoleArea = document.getElementById('console');
  let obstacles = [];
  let playerX = 400;
  let playerY = 300;
  let playerHealth = 100;
  let playerArmor = 50;
  const maxArmor = 100;
  let experience = 0;
  let level = 1;
  let experienceNeeded = 5 * level;
  let collectibleX = Math.random() * (gameArea.offsetWidth - 40);
  let collectibleY = Math.random() * (gameArea.offsetHeight - 40);

  function updatePlayerPosition() {
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
  }

  function updateHealthBar() {
    healthBar.style.width = playerHealth + '%';
    if (playerHealth <= 0) {
      playerHealth = 0;
      showAlert('danger', 'Game Over!');
      resetGame();
    }
  }

  function updateArmorBar() {
    armorBar.style.width = playerArmor + '%';
    if (playerArmor <= 0) {
      playerArmor = 0;
    }
  }

  function takeDamage(damage) {
    if (playerArmor > 0) {
      const remainingDamage = Math.max(0, damage - playerArmor);
      playerArmor = Math.max(0, playerArmor - damage);
      playerHealth = Math.max(0, playerHealth - remainingDamage);
    } else {
      playerHealth = Math.max(0, playerHealth - damage);
    }

    updateHealthBar();
    updateArmorBar();
  }

  function updateExperienceBar() {
    experienceBar.style.width = (experience / experienceNeeded) * 100 + '%';
    if (experience >= experienceNeeded) {
      levelUp();
    }
  }

  function levelUp() {
    level++;
    experienceNeeded = 5 * level;
    experience = 0;
    levelDisplay.textContent = 'Level: ' + level;
    showAlert('success', 'Level Up! You are now level ' + level);
  }

  function movePlayer(directionX, directionY) {
    playerX += directionX;
    playerY += directionY;

    playerX = Math.max(0, Math.min(playerX, gameArea.offsetWidth - player.offsetWidth));
    playerY = Math.max(0, Math.min(playerY, gameArea.offsetHeight - player.offsetHeight));

    updatePlayerPosition();

    checkCollisions();
  }

  function generateObstacles(numObstacles) {
    for (let i = 0; i < numObstacles; i++) {
      const obstacle = document.createElement('div');
      obstacle.className = 'obstacle rounded-circle';
      obstacle.style.top = Math.random() * (gameArea.offsetHeight - 40) + 'px';
      obstacle.style.left = Math.random() * (gameArea.offsetWidth - 40) + 'px';
      gameArea.appendChild(obstacle);
      obstacles.push(obstacle);
    }
  }

  function moveEnemies() {
    obstacles.forEach(function(obstacle) {
      const directionX = Math.random() * 10 - 5;
      const directionY = Math.random() * 10 - 5;

      let obstacleX = obstacle.offsetLeft + directionX;
      let obstacleY = obstacle.offsetTop + directionY;

      obstacleX = Math.max(0, Math.min(obstacleX, gameArea.offsetWidth - obstacle.offsetWidth));
      obstacleY = Math.max(0, Math.min(obstacleY, gameArea.offsetHeight - obstacle.offsetHeight));

      obstacle.style.left = obstacleX + 'px';
      obstacle.style.top = obstacleY + 'px';
    });

    if (obstacles.length === 0 || obstacles.length <= 3) {
      generateObstacles(10);
    }
  }

  function moveCollectible() {
    collectible.style.left = collectibleX + 'px';
    collectible.style.top = collectibleY + 'px';
  }

  function checkCollisions() {
    obstacles.forEach(function(obstacle, index) {
      const obstacleRect = obstacle.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();
      if (
        playerRect.left < obstacleRect.right &&
        playerRect.right > obstacleRect.left &&
        playerRect.top < obstacleRect.bottom &&
        playerRect.bottom > obstacleRect.top
      ) {
        const damage = 10;
        obstacle.parentNode.removeChild(obstacle);
        takeDamage(damage);
        displayDamage(damage);
        obstacles.splice(index, 1);
        experience += 1;
        updateExperienceBar();
      }
    });

    const collectibleRect = collectible.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    if (
      playerRect.left < collectibleRect.right &&
      playerRect.right > collectibleRect.left &&
      playerRect.top < collectibleRect.bottom &&
      playerRect.bottom > collectibleRect.top
    ) {
      collectibleX = Math.random() * (gameArea.offsetWidth - 40);
      collectibleY = Math.random() * (gameArea.offsetHeight - 40);
      playerArmor = Math.min(maxArmor, playerArmor + 20);
      updateArmorBar();
    }
  }

  function displayDamage(damage) {
    damageDisplay.textContent = `Damage: ${damage}`;
  }

  function resetGame() {
    playerX = 400;
    playerY = 300;
    playerHealth = 100;
    playerArmor = 50;
    collectibleX = Math.random() * (gameArea.offsetWidth - 40);
    collectibleY = Math.random() * (gameArea.offsetHeight - 40);
    updatePlayerPosition();
    updateHealthBar();
    updateArmorBar();
    obstacles.forEach(function(obstacle) {
      if (obstacle.parentNode) {
        obstacle.parentNode.removeChild(obstacle);
      }
    });
    obstacles = [];
    generateObstacles(10);
  }

  function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
      <strong>${message}</strong>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    `;

    const alertContainer = document.getElementById('alertContainer');
    alertContainer.appendChild(alertDiv);

    setTimeout(function() {
      alertDiv.remove();
    }, 3000);
  }

  setInterval(moveEnemies, 1000);
  setInterval(moveCollectible, 3000);

  document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;

    let damageDealt = false;
    obstacles.forEach(function(obstacle, index) {
      const obstacleRect = obstacle.getBoundingClientRect();
      if (
        clickX >= obstacleRect.left &&
        clickX <= obstacleRect.right &&
        clickY >= obstacleRect.top &&
        clickY <= obstacleRect.bottom
      ) {
        const damage = 10;
        obstacle.parentNode.removeChild(obstacle);
        takeDamage(damage);
        displayDamage(damage);
        obstacles.splice(index, 1);
        damageDealt = true;
      }
    });
    
    if (!damageDealt) {
      consoleArea.innerHTML += "No enemy targeted.<br>";
    }
  });

  document.addEventListener('keydown', function(event) {
    switch(event.key) {
      case 'ArrowUp':
        movePlayer(0, -10);
        break;
      case 'ArrowDown':
        movePlayer(0, 10);
        break;
      case 'ArrowLeft':
        movePlayer(-10, 0);
        break;
      case 'ArrowRight':
        movePlayer(10, 0);
        break;
    }
  });
});