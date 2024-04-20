export class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, "tiles");
        this.setup(type);
        this.setOrigin(0, 0);

        // Ajouter l'objet à la scène
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.body.allowGravity = false;
    }

    // Méthode pour initialiser ou reconfigurer le bloc
    setup(type) {
        this.blockType = type;
        switch (type) {
            case 'breakable':
                // choisi le sprite de la brique cassable
                this.setFrame(2);
                this.breakable = true;
                break;
            case 'question':
                // choisi le sprite de la brique question
                this.setFrame(24);
                this.breakable = false;
                break;
            default:
                this.setFrame(0);
                this.breakable = false;
                break;
        }
    }
    
    hitByPlayer() {
        if (this.breakable) {
            this.destroy(); // Détruire le bloc si cassable
        } else if (this.blockType === 'question') {
            // Logique pour libérer un power-up ou des pièces
            this.emit('activate', this);
        }
    }
    
    
}
