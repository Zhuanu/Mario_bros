import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor () {
        super('Boot');
    }

    preload () {
        this.load.image('preloader', 'assets/preloader.png');
    }

    create () {
        //  A global value to store the highscore in
        this.registry.set('highscore', 0);
        this.registry.set('time', 500);
        this.registry.set('lives', 3);

        this.scene.start('Preloader');
    }
}
