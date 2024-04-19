import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'preloader');
    }

    preload() {
        this.load.setPath('assets');

        this.load.image('background', 'background.png');
        this.load.atlas('logo', 'img/title_screen.png', 'sprites/Logo.json');
    }

    create() {

        let logo = this.add.sprite(0, 0, 'logo', 'SuperMarioBrosLogo');
        logo.frame.cutWidth *= 2.5;
        logo.frame.cutHeight *= 2.5;

        // Faire tomber le logo
        this.scene.transition({
            target: 'MainMenu',
            duration: 1000,
            moveBelow: true,
            onUpdate: (progress) => {
                this.cameras.main.setAlpha( - progress);
            }
        });

        //  When the transition completes, it will move automatically to the MainMenu scene
    }
}
