import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor () {
        super('Boot');
    }

    preload () {
        this.load.image('preloader', 'assets/preloader.png');
    }

    create () {
        // Initialiser les valeurs du registre
        this.registry.set('highscore', 0);
        this.registry.set('coins', 0);
        this.registry.set('lives', 3);

        this.scene.start('Preloader');
    }
}
