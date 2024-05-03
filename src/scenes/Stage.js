import { Player } from '../gameobjects/Player';
import { Block } from '../gameobjects/Block';
import { Item } from '../gameobjects/Item';
import { Monster } from '../gameobjects/Monster';

export class Stage extends Phaser.Scene {
    constructor () {
        super('Stage');
        this.caseSize = 64;
        this.ground = [];
        this.blocks = [];
        this.monsters = [];
        this.koopas = [];
        this.items = [];
        this.coins = [];

        this.addScore = this.addScore.bind(this);
        this.addCoin = this.addCoin.bind(this);
        this.removeLive = this.removeLive.bind(this);
    }

    preload() {
        // Chargement des ressources
        this.load.json('levelData', 'assets/levels/Level1-1.json');

        this.load.image('stage', 'assets/background_stage.png');
        this.load.image('backgroundObjects', 'assets/img/backgroundObjects.png');
        this.load.image('endCastle', 'assets/img/endCastle.png');
        
        this.load.spritesheet('tiles', 'assets/img/tiles.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet('mario', 'assets/img/characters.png', {
            frameWidth: 64,
            frameHeight: 128
        }); 
        this.load.spritesheet('monsters', 'assets/img/monsters.png', {
            frameWidth: 64,
            frameHeight: 128
        });
        this.load.spritesheet('items', 'assets/img/items.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.json('marioAnimations', 'assets/sprites/Mario.json');

        this.load.audio('mainTheme', 'assets/sfx/main_theme.ogg');
        this.load.audio('jump', 'assets/sfx/small_jump.ogg');
        this.load.audio('brickBump', 'assets/sfx/brick-bump.ogg');
        this.load.audio('coin', 'assets/sfx/coin.ogg');
        this.load.audio('powerUp', 'assets/sfx/powerup.ogg');
        this.load.audio('stomp', 'assets/sfx/stomp.ogg');
        this.load.audio('death', 'assets/sfx/death.wav');
        this.load.audio('powerUpAppear', 'assets/sfx/powerup_appears.ogg');
        this.load.audio('gameOver', 'assets/sfx/game_over.wav');
        this.load.audio('stageClear', 'assets/sfx/stage_clear.wav');
        this.load.audio('breakBlock', 'assets/sfx/breakblock.wav');
    }

    create() {
        this.background = this.add.image(this.game.config.width, this.game.config.height, 'stage');
        this.background.setOrigin(1, 1);
  
        // Récupérer les données du niveau
        const levelData = this.cache.json.get('levelData');
        const levelLayers = levelData.level.layers;
        const levelEntities = levelData.level.entities;
        this.levelLength = levelData.length;
        this.endOfLevel = false;

        let x = 0;
        // On répète l'image de fond pour couvrir toute la longueur du niveau
        while (x < this.levelLength * this.caseSize) {
            this.add.image(x, 0, 'backgroundObjects').setOrigin(0, 0);
            x += 48 * this.caseSize;
        }

        this.add.image(this.levelLength * this.caseSize, 0, 'endCastle').setOrigin(1, 0);

        // Ajouter les couches du niveau
        this.createLayers(levelLayers);

        // Ajouter les entités du niveau
        this.createEntities(levelEntities);

        // Ajouter le joueur
        this.player = new Player(this, 3*this.caseSize, this.game.config.height - 192);
        this.input.keyboard.resetKeys();

        // Ajouter la collision avec le sol
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.monsters, this.ground);
        this.physics.add.collider(this.items, this.ground);

        // Vérifier la collision du joueur avec les autres entités
        this.physics.add.collider(this.player, this.blocks, (player, block) => {
            block.hitByPlayer(player);
        }, null, this);
        this.physics.add.collider(this.player, this.monsters, (player, monster) => {
            monster.hitByPlayer(player);
        }, null, this);
        this.physics.add.collider(this.player, this.items, (player, item) => {
            item.hitByPlayer(player);
        }, null, this);

        // Vérifier la collision avec les blocs
        this.physics.add.collider(this.monsters, this.blocks, (monster, block) => {
            monster.hitByBlock(block);
        }, null, this);
        this.physics.add.collider(this.items, this.blocks, (item, block) => {
            item.hitByBlock(block);
        }, null, this);

        // Vérifier la collision entre les koopas et les autres monstres
        this.physics.add.collider(this.koopas, this.monsters, (koopa, monster) => {
            koopa.hitByMonster(monster);
        }, null, this);

        const fontSize = 32;

        // Récupérer les valeurs du registre
        const score = this.registry.get('highscore');
        const coins = this.registry.get('coins');
        const lives = this.registry.get('lives');

        // Afficher les valeurs du registre
        this.scoreText = this.add.bitmapText(32, 32, 'MarioFont', `MARIO\n${score.toString().padStart(6, '0')}`, fontSize);
        this.coinsText = this.add.bitmapText(512, 32, 'MarioFont', `COINS\n${coins.toString().padStart(3, '0')}`, fontSize).setOrigin(0.5, 0);
        this.livesText = this.add.bitmapText(1024 - 32, 32, 'MarioFont', `LIVES\n${lives}`, fontSize).setOrigin(1, 0);

        this.music = this.sound.add('mainTheme');
        this.music.play({
            loop: true // Pour lire en boucle la musique
        });

        this.jumpSfx = this.sound.add('jump');
        this.brickBumpSfx = this.sound.add('brickBump');
        this.coinSfx = this.sound.add('coin');
        this.powerUpSfx = this.sound.add('powerUp');
        this.powerUpAppearSfx = this.sound.add('powerUpAppear');
        this.stompSfx = this.sound.add('stomp');
        this.deathSfx = this.sound.add('death');
        this.gameOverSfx = this.sound.add('gameOver');
        this.stageClearSfx = this.sound.add('stageClear');
        this.breakBlockSfx = this.sound.add('breakBlock');
    }

    update() {
        this.player.update();

        // Empêcher le joueur de sortir de l'écran
        if (this.player.x < 0) {
            this.player.x = 0;
        }

        // Vérifier si le joueur a atteint la fin du niveau
        if (!this.endOfLevel && this.player.x > (this.levelLength - 13)*this.caseSize) {
            this.endLevel();
        }

        // Activer les monstres seulement lorsqu'ils sont dans la zone visible de la caméra
        for (const monster of this.monsters) {
            if (!monster.active && this.isEntityWithinCamera(monster)) {
                monster.setVelocityX(monster.velocity);
                monster.active = true;
            }
        }

        this.events.on('update', this.updateCamera, this);
    }

    createLayers(layersData) {
        for (const layerType in layersData) {
            const layerBounds = layersData[layerType];
            switch (layerType) {
                case 'ground':
                    // Créer le sol
                    layerBounds.forEach(groundData => {
                        const [x, y, width, height] = groundData;
                        for (let i = x; i < x+width; i++) {
                            for (let j = y; j < y+height; j++) {
                                const block = new Block(this, i * this.caseSize, this.game.config.height - this.caseSize * j, "ground");
                                this.ground.push(block);
                            }
                        }
                    });
                    break;
                default:
                    break;
            }
        }
    }

    createEntities(entitiesData) {
        let x;
        let y;
        for (const entityType in entitiesData) {
            const entityArray = entitiesData[entityType];
            entityArray.forEach(entity => {
                switch (entityType) {
                    case 'brick':
                        const brick = new Block(this, entity[0] * this.caseSize, this.game.config.height - this.caseSize * entity[1], "brick");
                        this.blocks.push(brick);
                        break;
                    case 'coinBox':
                        const coinBox = new Block(this, entity[0] * this.caseSize, this.game.config.height - this.caseSize * entity[1], "coinBox");
                        this.blocks.push(coinBox);
                        break;
                    case 'randomBox':
                        const randomBox = new Block(this, entity[0] * this.caseSize, this.game.config.height - this.caseSize * entity[1], "randomBox", entity[2]);
                        this.blocks.push(randomBox);
                        break;
                    case 'pipe':
                        x = entity[0] * this.caseSize;
                        y = this.game.config.height - this.caseSize * entity[1];
                        let pipe;
                        const length = entity[2]-1; // Longueur du tuyau
                        for (let i = 0; i < length; i++) {
                            pipe = new Block(this, x, y - i*this.caseSize, "pipe_3");
                            pipe.body.checkCollision.up = false; // Désactiver la collision avec le haut pour éviter que Mario ne reste bloqué
                            this.blocks.push(pipe);
                            pipe = new Block(this, x + this.caseSize, y - i*this.caseSize, "pipe_4");
                            pipe.body.checkCollision.up = false; 
                            this.blocks.push(pipe);
                        }
                        this.blocks.push(new Block(this, x, y - length*this.caseSize, "pipe_1"));
                        this.blocks.push(new Block(this, x + this.caseSize, y - length*this.caseSize, "pipe_2"));
                        break;
                    case 'stairs':
                        x = entity[0] * this.caseSize;
                        y = this.game.config.height - this.caseSize * entity[1];
                        let width = entity[2]; // Largeur de l'escalier
                        let height = entity[3]; // Hauteur de l'escalier
                        let direction = entity[4]; // Direction de l'escalier
                        let stair;
                        if (direction === 'right') {
                            for (let i = 0; i < width; i++) {
                                if (i > height-1) {
                                    for (let j = 0; j <= height-1; j++) {
                                        stair = new Block(this, x + i*this.caseSize, y - j*this.caseSize, "stairs");
                                        stair.body.checkCollision.up = (j === height-1); // Désactiver la collision avec le haut pour éviter que Mario ne reste bloqué
                                        this.blocks.push(stair);
                                    }
                                } else {
                                    for (let j = 0; j <= i; j++) {
                                        stair = new Block(this, x + i*this.caseSize, y - j*this.caseSize, "stairs");
                                        stair.body.checkCollision.up = (j === i);
                                        this.blocks.push(stair);
                                    }
                                }
                            }
                        } else {
                            for (let i = 0; i < width; i++) {
                                if (i > height-1) {
                                    for (let j = 0; j <= height-1; j++) {
                                        stair = new Block(this, x + (width-i-1)*this.caseSize, y - j*this.caseSize, "stairs");
                                        stair.body.checkCollision.up = (j === height-1); // Désactiver la collision avec le haut pour éviter que Mario ne reste bloqué
                                        this.blocks.push(stair);
                                    }
                                } else {
                                    for (let j = 0; j <= i; j++) {
                                        stair = new Block(this, x + (width-i-1)*this.caseSize, y - j*this.caseSize, "stairs");
                                        stair.body.checkCollision.up = (j === i);
                                        this.blocks.push(stair);
                                    }  
                                }
                            }
                        }
                        break;
                    case 'goomba':
                        const goomba = new Monster(this, entity[0] * this.caseSize, this.game.config.height - this.caseSize * entity[1], "goomba");
                        this.monsters.push(goomba);
                        break;
                    case 'koopa':
                        const koopa = new Monster(this, entity[0] * this.caseSize, this.game.config.height - this.caseSize * entity[1], "koopa");
                        this.monsters.push(koopa);
                        this.koopas.push(koopa);
                        break;
                    default:
                        break;
                }
            });
        }

        // Ajouter le drapeau de fin de niveau
        this.flag = new Item(this, (this.levelLength - 13)*this.caseSize - 32, this.game.config.height - this.caseSize*12, "flag");  
        this.items.push(this.flag);
        this.blocks.push(new Block(this, (this.levelLength - 13)*this.caseSize, this.game.config.height - this.caseSize*3, "stairs"));
    }

    updateCamera() {
        // Calculer la position x de la fin de l'écran
        const endScreenX = this.cameras.main.scrollX + this.cameras.main.width;

        // Vérifier si la fin de la scène est atteinte
        if (endScreenX >= this.levelLength * this.caseSize) {
            // Calculer le décalage en x pour aligner les éléments sur la fin de la scène
            const offsetX = endScreenX - this.levelLength * this.caseSize;

            // Définir la position de la caméra pour rester alignée avec la fin de la scène
            this.cameras.main.setScroll(this.levelLength * this.caseSize - this.cameras.main.width, 0);

            // Déplacer les éléments du score, des pièces et des vies pour les aligner sur la fin de la scène
            this.scoreText.x = this.cameras.main.scrollX + 32 - offsetX;
            this.coinsText.x = this.cameras.main.scrollX + this.cameras.main.width / 2 - offsetX;
            this.livesText.x = this.cameras.main.scrollX + this.cameras.main.width - 32 - offsetX;
        } else {
            // Si la fin de la scène n'est pas atteinte, continuer à suivre le joueur
            const halfScreenWidth = this.cameras.main.width / 2;
            if (this.player.x > halfScreenWidth) {
                const offsetX = this.player.x - halfScreenWidth;
                this.cameras.main.setScroll(offsetX, 0);
                this.background.x = this.cameras.main.scrollX + this.game.config.width;
                this.scoreText.x = this.cameras.main.scrollX + 32;
                this.coinsText.x = this.cameras.main.scrollX + halfScreenWidth;
                this.livesText.x = this.cameras.main.scrollX + this.game.config.width - 32;
            }
        }
    }

    isEntityWithinCamera(entity) {
        // Récupérer la position horizontale de la caméra et sa largeur
        const cameraX = this.cameras.main.scrollX;
        const cameraWidth = this.cameras.main.width;

        // Vérifier si l'entité est à l'intérieur de la zone visible de la caméra
        return (entity.x >= cameraX && entity.x <= cameraX + cameraWidth);
    }

    addScore(points) {
        const score = this.registry.get('highscore');
        this.registry.set('highscore', score + points);
        this.scoreText.setText(`MARIO\n${(score + points).toString().padStart(6, '0')}`);
    }

    addCoin() {
        const coins = this.registry.get('coins');
        this.registry.set('coins', coins + 1);
        this.coinsText.setText(`COINS\n${(coins + 1).toString().padStart(3, '0')}`);
    }

    removeLive() {
        const lives = this.registry.get('lives');
        this.registry.set('lives', lives - 1);
        this.livesText.setText(`LIVES\n${lives - 1}`);

        this.time.delayedCall(3000, () => {
            if (lives === 1) {
                this.gameOverSfx.play();
                this.removeScene();
                this.scene.start('GameOver');
                // Réinitialiser les valeurs du registre
                this.registry.set('lives', 3);
                this.registry.set('highscore', 0);
                this.registry.set('coins', 0);
            } else {
                this.removeScene();
                this.create();
            }
        }, [], this);
    }

    removeScene() {
        // Supprimer tous les objets de la scène
        this.ground.forEach(ground => ground.destroy());
        this.blocks.forEach(block => block.destroy());
        this.monsters.forEach(monster => monster.destroy());
        this.koopas.forEach(koopa => koopa.destroy());
        this.items.forEach(item => item.destroy());
        this.player.destroy();

        // Vider les listes d'objets
        this.ground = [];
        this.blocks = [];
        this.monsters = [];
        this.koopas = [];
        this.items = [];

        this.cameras.main.scrollX = 0;
    }

    endLevel() {
        this.flag.hitByPlayer(this.player); // Faire descendre le drapeau
        this.music.stop();
        this.stageClearSfx.play();
        this.endOfLevel = true;
        this.input.keyboard.enabled = false;
        this.input.keyboard.resetKeys();
        this.player.setVelocityX(0);
        this.time.delayedCall(1500, () => {
            this.player.cursors.right.isDown = true; // Faire marcher Mario vers le château
        }, [], this);
        this.time.delayedCall(2400, () => { 
            this.player.alpha = 0; // Faire entrer Mario dans le château
            this.player.cursors.right.isDown = false;
        }, [], this);
        this.time.delayedCall(5500, () => {
            this.scene.start('Win');
        }, [], this);
    }

}
