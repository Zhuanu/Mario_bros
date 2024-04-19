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
            frameHeight: 48
        });
        this.load.json('marioAnimations', 'assets/sprites/Mario.json');
        this.load.json('platform', 'assets/sprites/BackgroundSprites.json');
    }

    create() {
        this.add.image(512, 384, 'stage');
        this.player = new Player(this, 100, 450);

        this.platforms = this.physics.add.staticGroup(); // Groupe pour tous les blocs statiques

        for (let i = 32; i < this.game.config.width; i += 32) { // Assumer une largeur de bloc de 32 pixels
            this.platforms.add(new Block(this, i, this.game.config.height - 32, 0)); // '0' est l'indice de frame pour le bloc de sol
        }
    
        // Ajouter le joueur et configurer la collision avec le sol
        this.player = new Player(this, 100, 450);
        this.physics.add.collider(this.player, this.platforms);
    
        this.physics.add.collider(this.player, this.platforms);  // Assurez-vous que 'platforms' est bien défini
    }

    update() {
        this.player.update();
    }
}
