import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    preload() {
        this.load.image('gameover', 'assets/gameover.png');
    }

    create ()
    {
        this.add.image(this.game.config.width/2, this.game.config.height/2, 'gameover');

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
