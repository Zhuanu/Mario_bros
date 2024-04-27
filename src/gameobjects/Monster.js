export class Monster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, "monsters");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setup(type);

        // Configurer la physique du monstre
        this.active = false;
        this.velocity = -160;
        this.setVelocityX(0);
    }

    // Méthode pour initialiser ou reconfigurer le monstre
    setup(type) {
        this.monsterType = type;
        switch (type) {
            case 'goomba':
                this.loadGoombaAnimations(this.scene);
                this.anims.play('goomba-walk', true);
                this.setSize(64, 64);
                this.setOffset(0, 64);
                break;
            case 'koopa':
                this.loadKoopaAnimations(this.scene);
                this.anims.play('koopa-walk', true);
                this.setSize(64, 96);
                this.setOffset(0, 32);
                break;
            default:
                this.setFrame(0);
                break;
        }
    }

    loadGoombaAnimations(scene) {
        // Créer une animation de marche pour le Goomba
        if (!scene.anims.exists('goomba-walk')) {
            scene.anims.create({
                key: 'goomba-walk',
                frames: [
                    { key: 'monsters', frame: 0 },
                    { key: 'monsters', frame: 1 }
                ],
                frameRate: 10,
                repeat: -1
            });
        }
    }

    loadKoopaAnimations(scene) {
        // Créer une animation de marche pour le Goomba
        if (!scene.anims.exists('koopa-walk')) {
            scene.anims.create({
                key: 'koopa-walk',
                frames: [
                    { key: 'monsters', frame: 6 },
                    { key: 'monsters', frame: 7 }
                ],
                frameRate: 10,
                repeat: -1
            });
        }
    }
    

    hitByPlayer(player) {
        if (this.body.touching.up) {   
            // Faire sauter le joueur
            player.setVelocityY(-player.jump);

            if (this.monsterType === 'goomba') {
                this.setVelocityX(0);
                this.anims.stop();
                this.setFrame(2);

                this.scene.addScore(100);

                // Faire disparaître le monstre après un court délai
                this.scene.time.delayedCall(400, () => {
                    const index = this.scene.monsters.indexOf(this);
                    this.scene.monsters.splice(index, 1);
                    this.destroy();
                }, this);
            } else if (this.monsterType === 'koopa') {
                this.monsterType = 'koopa-shell';
                this.setVelocityX(0);
                this.anims.stop();
                this.setFrame(10);
                this.setSize(64, 64);
                this.setOffset(0, 56);
                this.velocity = 600;
            }
        } else {
            if (this.monsterType === 'koopa-shell') {
                if (player.body.touching.left)
                    this.setVelocityX(-600);
                else if (player.body.touching.right)
                    this.setVelocityX(600);
            } else {
                player.handlePlayerHit();
            }
        }
    }

    hitByBlock(block) {
        if (this.body.touching.left || this.body.touching.right) {
            this.velocity = -this.velocity;
            this.setVelocityX(this.velocity);
        }
    }

    hitByMonster(monster) {
        this.setVelocityX(this.velocity);
        this.scene.addScore(200);
        const index = this.scene.monsters.indexOf(monster);
        this.scene.monsters.splice(index, 1);
        monster.destroy();
    }

}
