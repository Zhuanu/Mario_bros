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

        this.setup(type);
    }

    // Méthode pour initialiser ou reconfigurer le bloc
    setup(type) {
        this.blockType = type;
        switch (type) {
            case 'RedMushroom':
                this.setFrame(0);
                break;
            case 'flag':
                this.body.allowGravity = false;
                this.velocity = 0;
                this.setVelocityX(this.velocity);
                this.setFrame(80);
                this.breakable = false;
                break;
            default:
                this.setFrame(0);
                break;
        }
    }

    hitByPlayer(player) {
        if (this.blockType === 'RedMushroom') {
            // Faire grandir le joueur
            player.makeBig();
            this.destroy();
        } else if (this.blockType === 'flag') {
            this.body.allowGravity = true;
            player.body.checkCollision.up = false;
        }
    }

    hitByBlock(block) {
        if (this.blockType === 'RedMushroom') {
            // Vérifier s'il y a une collision à gauche ou à droite
            if (this.body.touching.left || this.body.touching.right) {
                this.velocity = -this.velocity;
                this.setVelocityX(this.velocity);
            }
        }
    }
}
