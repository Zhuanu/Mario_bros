import { Scene } from 'phaser';

export class Win extends Scene
{
    constructor ()
    {
        super('Win');
    }

    preload() {
        this.load.image('win', 'assets/win.png');
    }

    create ()
    {
        this.add.image(this.game.config.width/2, this.game.config.height/2, 'win');
    }
}
