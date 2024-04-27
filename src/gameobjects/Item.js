export class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, "items");
        this.setOrigin(0, 0);

        // Ajouter l'objet à la scène et à la physique
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configurer la physique de l'objet
        this.body.allowGravity = true;
        this.velocity = 160;
        this.setVelocityX(this.velocity);
    }

    // Méthode pour initialiser ou reconfigurer le bloc
    setup(type) {
        this.blockType = type;
        switch (type) {
            case 'RedMushroom':
                this.setFrame(0);
                break;
            default:
                this.setFrame(0);
                break;
        }
    }

    hitByPlayer(player) {
        // Faire grandir le joueur
        player.makeBig();
        this.destroy();
    }

    hitByBlock(block) {
        // Vérifier s'il y a une collision à gauche ou à droite
        if (this.body.touching.left || this.body.touching.right) {
            this.velocity = -this.velocity;
            this.setVelocityX(this.velocity);
        }
    }
}
