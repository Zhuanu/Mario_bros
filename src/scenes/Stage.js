import { Player } from '../gameobjects/Player';
import { Block } from '../gameobjects/Block';
import { BackgroundObject } from '../gameobjects/BackgroundObject';
import { Monster } from '../gameobjects/Monster';

export class Stage extends Phaser.Scene {
    constructor () {
        super('Stage');
        this.caseSize = 64;
        this.ground = [];
        this.blocks = [];
        this.monsters = [];
        this.items = [];
        this.backgroundObjects = [];
    }

    preload() {

        this.load.json('levelData', 'assets/levels/Level1-1.json');

        this.load.image('stage', 'assets/background_stage.png');

        this.load.spritesheet('tiles', 'assets/img/tiles.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet('mario', 'assets/img/characters.png', {
            frameWidth: 64,
            frameHeight: 64
        }); 
        this.load.spritesheet('monsters', 'assets/img/monsters.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet('items', 'assets/img/monsters.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.json('backgroundSprites', 'assets/sprites/BackgroundSprites.json');
        this.load.json('marioAnimations', 'assets/sprites/Mario.json');
        this.load.json('goombaAnimations', 'assets/sprites/Goomba.json');
        
    }

    create() {
        this.background = this.add.image(this.game.config.width, this.game.config.height, 'stage');
        this.background.setOrigin(1, 1);

        const levelData = this.cache.json.get('levelData');
        const levelObjects = levelData.level.objects;
        const levelLayers = levelData.level.layers;
        const levelEntities = levelData.level.entities;

        // Ajouter les couches du niveau
        this.createLayers(levelLayers);

        // Ajouter le décor du niveau
        this.createObjects(levelObjects);

        // Ajouter les entités du niveau
        this.createEntities(levelEntities);

        // Ajouter le joueur
        this.player = new Player(this, 100, this.game.config.height - 192);

        // Ajouter la collision avec le sol
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.monsters, this.ground);

        // Vérifier la collision du joueur avec les entités et les blocs
        this.physics.add.collider(this.player, this.blocks, (player, block) => {
            block.hitByPlayer(player);
        }, null, this);
        this.physics.add.collider(this.player, this.monsters, (player, monster) => {
            monster.hitByPlayer(player);
        }, null, this);
        this.physics.add.collider(this.monsters, this.blocks, (monster, block) => {
            monster.hitByBlock(block);
        }, null, this);
    }

    update() {
        this.player.update();

        // Écouter l'événement de mise à jour de la scène
        this.events.on('update', this.updateCamera, this);
        // this.events.on('update', this.updateBackground, this);
    }

    createObjects(objectsData) {
        for (const objectType in objectsData) {
            const objectArray = objectsData[objectType];
            objectArray.forEach(object => {
                const x = object[0] * this.caseSize;
                const y = this.game.config.height - this.caseSize * object[1];
                switch (objectType) {
                    case 'hill':
                        this.backgroundObjects.push(new BackgroundObject(this, x, y, "hill_1"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + this.caseSize, y, "hill_4"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + 2*this.caseSize, y, "hill_3"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + this.caseSize, y - this.caseSize, "hill_2"));
                        break;
                    case 'bigHill':
                        this.backgroundObjects.push(new BackgroundObject(this, x, y, "hill_1"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + this.caseSize, y, "hill_4"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + 2*this.caseSize, y, "hill_5"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + 3*this.caseSize, y, "hill_6"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + 4*this.caseSize, y, "hill_3"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + this.caseSize, y - this.caseSize, "hill_1"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + 2*this.caseSize, y - this.caseSize, "hill_5"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + 3*this.caseSize, y - this.caseSize, "hill_3"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + 2*this.caseSize, y - 2*this.caseSize, "hill_2"));
                        break;
                    case 'oneBush' :
                        this.backgroundObjects.push(new BackgroundObject(this, x - this.caseSize, y, "bush_1"));
                        this.backgroundObjects.push(new BackgroundObject(this, x, y, "bush_2"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + this.caseSize, y, "bush_3"));
                        break;
                    case 'twoBush' :
                        this.backgroundObjects.push(new BackgroundObject(this, x - this.caseSize, y, "bush_1"));
                        this.backgroundObjects.push(new BackgroundObject(this, x, y, "bush_2"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + this.caseSize, y, "bush_2"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + 2 * this.caseSize, y, "bush_3"));
                        break;
                    case 'threeBush' :
                        this.backgroundObjects.push(new BackgroundObject(this, x - this.caseSize, y, "bush_1"));
                        this.backgroundObjects.push(new BackgroundObject(this, x, y, "bush_2"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + this.caseSize, y, "bush_2"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + 2 * this.caseSize, y, "bush_2"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + 3 * this.caseSize, y, "bush_3"));
                        break;
                    case 'oneCloud':
                        this.backgroundObjects.push(new BackgroundObject(this, x - this.caseSize, y , "cloud_4"));
                        this.backgroundObjects.push(new BackgroundObject(this, x, y, "cloud_5"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + this.caseSize, y, "cloud_6"));
                        this.backgroundObjects.push(new BackgroundObject(this, x - this.caseSize, y - this.caseSize, "cloud_1"));
                        this.backgroundObjects.push(new BackgroundObject(this, x, y - this.caseSize, "cloud_2"));
                        this.backgroundObjects.push(new BackgroundObject(this, x + this.caseSize, y - this.caseSize, "cloud_3"));
                        break;
                    default:
                        break;
                }
            });
        }
    }

    createLayers(layersData) {
        for (const layerType in layersData) {
            const layerBounds = layersData[layerType];
            switch (layerType) {
                case 'ground':
                    // Créer le sol
                    const groundBoundsX = layerBounds.x;
                    const groundBoundsY = layerBounds.y;
                    const startX = groundBoundsX[0];
                    const endX = groundBoundsX[1];
                    const startY = groundBoundsY[0];
                    const endY = groundBoundsY[1];
                    // Créer des blocs de sol dans les plages spécifiées
                    for (let x = startX; x <= endX; x++) {
                        for (let y = startY; y <= endY; y++) {
                            const block = new Block(this, x * this.caseSize, this.game.config.height - this.caseSize * y, "solid");
                            this.ground.push(block);
                        }
                    }
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
                        const x = entity[0] * this.caseSize;
                        const y = this.game.config.height - this.caseSize * entity[1];
                        const length = entity[2]-1;
                        for (let i = 0; i < length; i++) {
                            this.blocks.push(new Block(this, x, y - i*this.caseSize, "pipe_3"));
                            this.blocks.push(new Block(this, x + this.caseSize, y - i*this.caseSize, "pipe_4"));
                        }
                        this.blocks.push(new Block(this, x, y - length*this.caseSize, "pipe_1"));
                        this.blocks.push(new Block(this, x + this.caseSize, y - length*this.caseSize, "pipe_2"));
                        break;
                    case 'goomba':
                        const goomba = new Monster(this, entity[0] * this.caseSize, this.game.config.height - this.caseSize * entity[1], "goomba");
                        this.monsters.push(goomba);
                        break;
                    case 'koopa':
                        // Créer des Koopas
                        // ...
                        break;
                    default:
                        break;
                }
            });
        }
    }

    updateCamera() {
        // Calculer la position x de la moitié de l'écran
        const halfScreenWidth = this.cameras.main.width / 2 ;
    
        // Vérifier si le joueur a dépassé la moitié de l'écran en x
        if (this.player.x > halfScreenWidth) {
            // Calculer le décalage en x pour suivre le joueur
            const offsetX = this.player.x - halfScreenWidth;
    
            // Définir la position de la caméra pour suivre le joueur
            this.cameras.main.setScroll(offsetX, 0);

            // Déplacer le fond (background) avec la caméra
            this.background.x = this.cameras.main.scrollX + this.game.config.width;
        }
    }
}
