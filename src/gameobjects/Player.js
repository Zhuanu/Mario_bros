export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'mario');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 460;
        this.jump = 575;
        this.bigJump = 675;
        this.setBounce(0);
        this.setGravityY(800);

        // Charger les animations à partir du fichier JSON
        this.loadAnimations(scene);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.direction = 'right';

        this.jumpTimer = 0; // Timer pour mesurer la durée de maintien de la touche de saut
        this.isJumping = false; // Indicateur de saut en cours
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

        if (this.body.touching.down) {
            // Déterminer la direction
            if (this.cursors.left.isDown) {
                this.setVelocityX(-this.speed);
                this.anims.play('mario_run2', true);
                this.direction = 'left';
            } else if (this.cursors.right.isDown) {
                this.setVelocityX(this.speed);
                this.anims.play('mario_run', true);
                this.direction = 'right';
            } else {
                this.playIdleAnimation();
            }

            // Sauter
            if (this.cursors.space.isDown) {
                this.isJumping = true;
                this.jumpTimer = 0;
                this.setVelocityY(-this.jump);
                this.playJumpAnimation();
            }
        } else {

            // Déterminer la direction
            if (this.cursors.left.isDown) {
                this.setVelocityX(-this.speed / 1.5);
                if (this.isJumping)
                    this.anims.play('mario_jump2', true);
                else 
                    this.anims.play('mario_idle2', true)
                this.direction = 'left';
            } else if (this.cursors.right.isDown) {
                this.setVelocityX(this.speed / 1.5);
                if (this.isJumping)
                    this.anims.play('mario_jump', true);
                else 
                    this.anims.play('mario_idle', true)
                this.direction = 'right';
            }

            this.playJumpAnimation();
            if (this.cursors.space.isDown && this.isJumping) {
                this.jumpTimer++;
                if (this.jumpTimer > 25) {
                    this.setVelocityY(-this.bigJump);
                    this.isJumping = false;
                }
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
