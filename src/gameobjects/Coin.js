export class Coin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'items');

        // Ajouter la pièce à la scène et activer la physique
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0, 0);
        this.setBounce(0.5);
        this.setGravityY(1000);

        if (!scene.anims.exists('coinJump')) {
            scene.anims.create({
                key: 'coinJump',
                frames: [
                    { key: 'items', frame: 253 },
                    { key: 'items', frame: 254 },
                    { key: 'items', frame: 255 },
                    { key: 'items', frame: 256 }
                ],
                frameRate: 20,
                repeat: -1
            });
        }

        this.anims.play('coinJump', true);

        // Faire sauter la pièce dès sa création
        this.body.setVelocityY(-600);

        // Faire disparaître la pièce après un délai
        setTimeout(() => {
            this.destroy();
        }, 600);
    }
}
