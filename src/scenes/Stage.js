import { Player } from '../gameobjects/Player';
import { Block } from '../gameobjects/Block';
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

        this.load.json('levelData', 'assets/levels/Level1-1.json');

        this.load.image('stage', 'assets/background_stage.png');
        this.load.image('backgroundObjects', 'assets/img/backgroundObjects.png');
        
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
    }

    create() {
        this.background = this.add.image(this.game.config.width, this.game.config.height, 'stage');
        this.background.setOrigin(1, 1);
  
        const levelData = this.cache.json.get('levelData');
        const levelLayers = levelData.level.layers;
        const levelEntities = levelData.level.entities;

        this.levelLength = levelData.length;

        if (levelData.id === 0) {
            let x = 0;
            while (x < this.levelLength * this.caseSize) {
                this.add.image(x, 0, 'backgroundObjects').setOrigin(0, 0);
                x += 48 * this.caseSize;
            }
        }

        // Ajouter les couches du niveau
        this.createLayers(levelLayers);

        // Ajouter les entités du niveau
        this.createEntities(levelEntities);

        // Ajouter le joueur
        this.player = new Player(this, 100, this.game.config.height - 192);

        // Ajouter la collision avec le sol
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.monsters, this.ground);
        this.physics.add.collider(this.items, this.ground);

        // Vérifier la collision du joueur avec les entités, les blocs et les objets
        this.physics.add.collider(this.player, this.blocks, (player, block) => {
            block.hitByPlayer(player);
        }, null, this);
        this.physics.add.collider(this.player, this.monsters, (player, monster) => {
            monster.hitByPlayer(player);
        }, null, this);
        this.physics.add.collider(this.player, this.items, (player, item) => {
            item.hitByPlayer(player);
        }, null, this);

        this.physics.add.collider(this.monsters, this.blocks, (monster, block) => {
            monster.hitByBlock(block);
        }, null, this);
        this.physics.add.collider(this.items, this.blocks, (item, block) => {
            item.hitByBlock(block);
        }, null, this);

        this.physics.add.collider(this.koopas, this.monsters, (koopa, monster) => {
            koopa.hitByMonster(monster);
        }, null, this);

        const fontSize = 32;

        //  Get the current highscore from the registry
        const score = this.registry.get('highscore');
        const coins = this.registry.get('coins');
        const lives = this.registry.get('lives');

        // Add bitmap text for score, time, and lives
        this.scoreText = this.add.bitmapText(32, 32, 'MarioFont', `MARIO\n${score.toString().padStart(6, '0')}`, fontSize);
        this.coinsText = this.add.bitmapText(512, 32, 'MarioFont', `COINS\n${coins.toString().padStart(3, '0')}`, fontSize).setOrigin(0.5, 0);
        this.livesText = this.add.bitmapText(1024 - 32, 32, 'MarioFont', `LIVES\n${lives}`, fontSize).setOrigin(1, 0);

    }

    update() {
        this.player.update();

        for (const monster of this.monsters) {
            if (!monster.active && this.isEntityWithinCamera(monster)) {
                monster.setVelocityX(monster.velocity);
                monster.active = true;
            }
        }

        // Écouter l'événement de mise à jour de la scène
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
                                const block = new Block(this, i * this.caseSize, this.game.config.height - this.caseSize * j, "solid");
                                this.ground.push(block);
                            }
                        }
                    });
                    break;
                case 'sky':
                    // Créer le ciel
                    // ...
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
                        const length = entity[2]-1;
                        for (let i = 0; i < length; i++) {
                            this.blocks.push(new Block(this, x, y - i*this.caseSize, "pipe_3"));
                            this.blocks.push(new Block(this, x + this.caseSize, y - i*this.caseSize, "pipe_4"));
                        }
                        this.blocks.push(new Block(this, x, y - length*this.caseSize, "pipe_1"));
                        this.blocks.push(new Block(this, x + this.caseSize, y - length*this.caseSize, "pipe_2"));
                        break;
                    case 'stairs':
                        x = entity[0] * this.caseSize;
                        y = this.game.config.height - this.caseSize * entity[1];
                        let width = entity[2];
                        let height = entity[3];
                        let direction = entity[4];
                        if (direction === 'right') {
                            for (let i = 0; i < width; i++) {
                                if (i > height-1) {
                                    for (let j = 0; j <= height-1; j++) {
                                        this.blocks.push(new Block(this, x + i*this.caseSize, y - j*this.caseSize, "stairs"));
                                    }
                                } else {
                                    for (let j = 0; j <= i; j++) {
                                        this.blocks.push(new Block(this, x + i*this.caseSize, y - j*this.caseSize, "stairs"));
                                    }
                                }
                            }
                        } else {
                            for (let i = 0; i < width; i++) {
                                if (i > height-1) {
                                    for (let j = 0; j <= height-1; j++) {
                                        this.blocks.push(new Block(this, x + (width-i-1)*this.caseSize, y - j*this.caseSize, "stairs"));
                                    }
                                } else {
                                    for (let j = 0; j <= i; j++) {
                                        this.blocks.push(new Block(this, x + (width-i-1)*this.caseSize, y - j*this.caseSize, "stairs"));
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

        this.time.delayedCall(2000, () => {
            if (lives === 1) {
                this.removeScene();
                this.scene.start('GameOver');
                this.registry.set('lives', 3);
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

}
