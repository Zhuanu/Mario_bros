export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'mario');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.1);
        this.setCollideWorldBounds(true);

        // Charger les animations à partir du fichier JSON
        this.loadAnimations(scene);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.direction = 'right';
    }

    loadAnimations(scene) {
        const animations = scene.cache.json.get('marioAnimations');
        for (const key in animations['sprites']) {
            const anim = animations['sprites'][key];
            scene.anims.create({
                key: anim.name,
                frames: scene.anims.generateFrameNumbers('mario', {start: anim.start, end: anim.end}),
                frameRate: anim.frameRate,
                repeat: anim.repeat
            });
        }
    }

    update() {
        this.setVelocityX(0);

        // Déterminer la direction
        if (this.cursors.left.isDown) {
            this.setVelocityX(-160);
            if (this.body.touching.down) this.anims.play('mario_run2', true);
            this.direction = 'left';
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(160);
            if (this.body.touching.down) this.anims.play('mario_run', true);
            this.direction = 'right';
        } else {
            // Gérer les animations en fonction de l'état du personnage
            if (this.body.touching.down) {
                if (this.cursors.space.isDown) {
                    this.setVelocityY(-330);
                    this.playJumpAnimation();
                } else {
                    this.playIdleAnimation();
                }
            } else {
                this.playJumpAnimation();
            }
        } 
        
        if (this.body.touching.down) {
            if (this.cursors.space.isDown) {
                this.setVelocityY(-330);
                this.playJumpAnimation();
            }
        }
    }

    playJumpAnimation() {
        if (this.direction === 'right') {
            this.anims.play('mario_jump', true);
        } else {
            this.anims.play('mario_jump2', true);
        }
    }

    playIdleAnimation() {
        if (this.direction === 'right') {
            this.anims.play('mario_idle', true);
        } else {
            this.anims.play('mario_idle2', true);
        }
    }

}
