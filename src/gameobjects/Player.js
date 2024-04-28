export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'mario');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 460;
        this.jump = 700;
        this.bigJump = 805;

        this.setBounce(0);
        this.setGravityY(800);

        // Charger les animations à partir du fichier JSON
        this.loadAnimations(scene);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.scene.input.keyboard.enabled = true;
        this.direction = 'right';
        this.isDead = false;

        this.makeSmall();

        this.jumpTimer = 0; // Timer pour mesurer la durée de maintien de la touche de saut
        this.isJumping = false; // Indicateur de saut en cours
    }

    loadAnimations(scene) {
        const animations = scene.cache.json.get('marioAnimations');
        for (const key in animations['sprites']) {
            const anim = animations['sprites'][key];
            if (!scene.anims.exists(anim.name)) {
                scene.anims.create({
                    key: anim.name,
                    frames: scene.anims.generateFrameNumbers('mario', {start: anim.start, end: anim.end}),
                    frameRate: anim.frameRate,
                    repeat: anim.repeat
                });
            }
        }
    } 

    // Fonction pour rendre Mario grand
    makeBig() {
        if (!this.isBig) {
            this.isBig = true;
            if (this.isBig) {
                if (this.direction === 'right') {
                    this.anims.play('mario_big_jump', true);
                } else {
                    this.anims.play('mario_big_jump2', true);
                }
            } 
            this.setSize(64, 128);
            this.setOffset(0, 0);
            this.setPosition(this.x, this.y - this.scene.caseSize); 
        }
    }

    // Fonction pour rendre Mario petit
    makeSmall() {
        this.isBig = false;
        this.setSize(64, 64);
        this.setOffset(0, 0);
        this.setPosition(this.x, this.y + this.scene.caseSize);
    }

    handlePlayerHit() {
        if (this.isBig) {
            this.body.enable = false;
            this.makeSmall();
            this.scene.time.delayedCall(200, () => {
                this.alpha = 1;
                this.body.enable = true;
            }, [], this);
        } else {
            this.die();
        }
    }

    update() {
        if (!this.isDead) {
            if (this.y > this.scene.game.config.height) {
                this.die();
            }
            this.setVelocityX(0);

            if (this.body.touching.down) {
                // Déterminer la direction
                if (this.cursors.left.isDown) {
                    this.setVelocityX(-this.speed);
                    this.direction = 'left';
                    this.playRunAnimation();
                } else if (this.cursors.right.isDown) {
                    this.setVelocityX(this.speed);
                    this.direction = 'right';
                    this.playRunAnimation();
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
                if (this.isJumping)
                    this.playJumpAnimation();

                // Déterminer la direction
                if (this.cursors.left.isDown) {
                    this.setVelocityX(-this.speed / 1.5);
                    this.direction = 'left';
                } else if (this.cursors.right.isDown) {
                    this.setVelocityX(this.speed / 1.5);
                    this.direction = 'right';
                }
                
                if (this.cursors.space.isDown && this.isJumping) {
                    this.jumpTimer++;
                    if (this.jumpTimer > 25) {
                        this.setVelocityY(-this.bigJump);
                        this.isJumping = false;
                    }
                } else {
                    this.isJumping = false;
                }
            }
        }  
    }

    playJumpAnimation() {
        if (this.isBig) {
            if (this.direction === 'right') {
                this.anims.play('mario_big_jump', true);
            } else {
                this.anims.play('mario_big_jump2', true);
            }
        } else {
            if (this.direction === 'right') {
            this.anims.play('mario_jump', true);
            } else {
                this.anims.play('mario_jump2', true);
            }
        }
    }

    playIdleAnimation() {
        if (this.isBig) {
            if (this.direction === 'right') {
                this.anims.play('mario_big_idle', true);
            } else {
                this.anims.play('mario_big_idle2', true);
            }
        } else {
            if (this.direction === 'right') {
                this.anims.play('mario_idle', true);
            } else {
                this.anims.play('mario_idle2', true);
            }
        }
    }

    playRunAnimation() {
        if (this.isBig) {
            if (this.direction === 'right') {
                this.anims.play('mario_big_run', true);
            } else {
                this.anims.play('mario_big_run2', true);
            }
        } else {
            if (this.direction === 'right') {
                this.anims.play('mario_run', true);
            } else {
                this.anims.play('mario_run2', true);
            }
        }
    }

    playBreakAnimation() {
        if (this.isBig) {
            if (this.direction === 'right') {
                this.anims.play('mario_big_break', true);
            } else {
                this.anims.play('mario_big_break2', true);
            }
        } else {
            if (this.direction === 'right') {
                this.anims.play('mario_break', true);
            } else {
                this.anims.play('mario_break2', true);
            }
        }
    }

    die() {
        this.isDead = true;

        this.anims.play('mario_dead', true);
        this.scene.input.keyboard.enabled = false;
        this.setVelocityX(0);
        this.setVelocityY(-this.jump);
        this.setGravityY(800);

        this.body.checkCollision.none = true;

        this.scene.removeLive();
    }

}
