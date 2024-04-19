export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'mario');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        // Charger les animations à partir du fichier JSON
        this.loadAnimations(scene);
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    loadAnimations(scene) {
        const animations = scene.cache.json.get('marioAnimations');
        for (const key in animations) {
            const anim = animations[key];
            scene.anims.create({
                key: anim.key,
                frames: scene.anims.generateFrameNumbers('mario', { frames: anim.frames }),
                frameRate: anim.frameRate,
                repeat: anim.repeat
            });
        }
    }

    update() {
        this.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.setVelocityX(-160);
            this.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(160);
            this.anims.play('right', true);
        } else {
            this.anims.stop();
            this.setFrame(4);
        }

        if (this.cursors.space.isDown && this.body.touching.down) {
            this.setVelocityY(-330);
        }
    }
}
