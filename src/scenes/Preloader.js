import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        // Ajouter l'image de préchargement
        this.add.image(this.game.config.width/2, this.game.config.height/2, 'preloader');
    }

    preload() {
        this.load.setPath('assets');

        this.load.image('background', 'background.png');
        this.load.image('logo', 'img/title_screen.png');
        this.load.bitmapFont('MarioFont', 'marioFont.png', 'marioFont.fnt');
    }

    create() {
        // Faire tomber le logo
        this.scene.transition({
            target: 'MainMenu',
            duration: 1000,
            moveBelow: true,
            onUpdate: (progress) => {
                this.cameras.main.setAlpha( - progress);
            }
        });
    }
}
