export class Monster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, "monsters"); // "monsters" est le nom de la feuille de sprite pour les monstres
        this.setup(type);
        this.setOrigin(0, 0);

        // Ajouter l'objet à la scène et à la physique
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configurer la physique du monstre
        this.velocity = 160;
        this.setVelocityX(this.velocity);
        this.anims.play('goomba-walk', true);
    }

    // Méthode pour initialiser ou reconfigurer le monstre
    setup(type) {
        let animations;
        switch (type) {
            case 'goomba':
                this.loadGoombaAnimations(this.scene);
                break;
            case 'koopa':
                // choisi le sprite du Koopa
                this.setFrame(1);
                break;
            // Ajoutez d'autres types de monstres au besoin
            default:
                this.setFrame(0); // Défaut au sprite du Goomba
                break;
        }
    }

    loadGoombaAnimations(scene) {
        // Créer une animation de marche pour le Goomba
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

    hitByPlayer(player) {
        // Vérifier si la collision se produit par le haut du monstre
        if (player.body.touching.down && player.y < this.y) {   
            this.setVelocityX(0);
            this.anims.stop();
            this.setFrame(2);

            // Faire sauter le joueur
            player.setVelocityY(-player.jump);

            // Faire disparaître le monstre après un court délai
            this.scene.time.delayedCall(400, () => {
                this.destroy();
            }, [], this);
        }
    }

    hitByBlock(block) {
        this.velocity = -this.velocity;
        this.setVelocityX(this.velocity);
    }

}
