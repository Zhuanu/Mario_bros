import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // Récupérer les valeurs du registre
        const score = this.registry.get('highscore');
        const coins = this.registry.get('coins');
        const lives = this.registry.get('lives');

        this.add.image(this.game.config.width/2, this.game.config.height/2, 'background');

        const logo = this.add.image(this.game.config.width/2, -270, 'logo');
        this.tweens.add({
            targets: logo,
            y: 325,
            duration: 1000,
            ease: 'Bounce'
        });

        const fontSize = 32;

        // Afficher les valeurs du registre
        this.add.bitmapText(32, 32, 'MarioFont', `MARIO\n ${score}`, fontSize);
        this.add.bitmapText(512, 32, 'MarioFont', `COINS\n ${coins}`, fontSize).setOrigin(0.5, 0);
        this.add.bitmapText(1024 - 32, 32, 'MarioFont', `LIVES: ${lives}`, fontSize).setOrigin(1, 0);

        const instructions = [
            'Click to Start!'
        ]

        this.add.bitmapText(512, 660, 'MarioFont', instructions, fontSize).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('Stage');
        });
    }
}
