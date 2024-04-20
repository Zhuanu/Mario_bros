import { Player } from '../gameobjects/Player';
import { Block } from '../gameobjects/Block';

export class Stage extends Phaser.Scene {
    constructor () {
        super('Stage');
    }

    preload() {
        this.load.image('stage', 'assets/background_stage.png');
        this.load.spritesheet('mario', 'assets/img/characters.gif', {
            frameWidth: 32,
            frameHeight: 64
        });
        this.load.spritesheet('tiles', 'assets/img/tiles.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.json('marioAnimations', 'assets/sprites/Mario.json');
        this.load.json('backgroundSprites', 'assets/sprites/BackgroundSprites.json');
    }

    create() {
        this.background = this.add.image(this.game.config.width, this.game.config.height, 'stage');
        this.background.setOrigin(1, 1);

        // Ajouter le sol
        this.ground = this.createGround(32);

        this.brick = [new Block(this, 128, this.game.config.height - 256, "breakable"), new Block(this, 160, this.game.config.height - 256, "question")]
        this.brick.forEach(block => block.setScale(2));

        // Ajouter le joueur et configurer la collision avec le sol
        this.player = new Player(this, 100, this.game.config.height - 128);
        this.player.setScale(2);

        this.physics.add.collider(this.player, this.ground);
        // Vérifie la collision du joueur avec les blocs
        this.physics.add.collider(this.player, this.brick, function(player, brick) {
            // Vérifie si le joueur touche le dessous du bloc et que le joueur est en train de tomber
            if (player.y > brick.y && brick.breakable) {
                brick.destroy();
            }
        }, null, this);

        
    }

    update() {
        this.player.update();
        // Écouter l'événement de mise à jour de la scène
        this.events.on('update', this.updateCamera, this);
        // this.events.on('update', this.updateBackground, this);
    }


    createGround(nbPixels) {
        const numberOfBlocks = Math.ceil(this.game.config.width / nbPixels);
        // Crée une liste de blocs
        const blocks = [];
        for (let i = 0; i < numberOfBlocks + 1; i++) {
            let block = new Block(this, i * nbPixels, this.game.config.height - nbPixels * 2, "solid");
            blocks.push(block);
            block = new Block(this, i * nbPixels, this.game.config.height - nbPixels, "solid");
            blocks.push(block);
        }
        // pour agrandir les blocs 
        blocks[0].frame.cutHeight *= 2;
        blocks[0].frame.cutWidth *= 2;

        return blocks;
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
        }
    }
}
