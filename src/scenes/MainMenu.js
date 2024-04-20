import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        //  Get the current highscore from the registry
        const score = this.registry.get('highscore');
        const time = this.registry.get('time');
        const lives = this.registry.get('lives');

        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add.image(this.game.config.width/2, this.game.config.height/2, 'background');

        const logo = this.add.image(420, -270, 'logo');

        this.tweens.add({
            targets: logo,
            y: 350,
            duration: 1000,
            ease: 'Bounce'
        });

        this.add.text(32, 32, `MARIO : ${score}`, textStyle);
        this.add.text(1024/2, 32, `TIME : ${time}`, textStyle).setAlign('center').setOrigin(0.5, 0);
        this.add.text(1024 - 32, 32, `LIVES : ${lives}`, textStyle).setOrigin(1, 0);

        const instructions = [
            'Click to Start!'
        ]

        this.add.text(512, 550, instructions, textStyle).setAlign('center').setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Stage');

        });
    }
}
