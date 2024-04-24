export class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, object) {
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
            case 'brick':
                this.setFrame(2);
                this.breakable = true;
                break;
            case 'coinBox':
                this.setFrame(24);
                this.breakable = false;
                break;
            case 'randomBox':
                this.setFrame(24);
                this.breakable = false;
                break;
            case 'pipe_1':
                this.setFrame(264);
                this.breakable = false;
                break;
            case 'pipe_2':
                this.setFrame(265);
                this.breakable = false;
                break;
            case 'pipe_3':
                this.setFrame(297);
                this.breakable = false;
                break;
            case 'pipe_4':
                this.setFrame(298);
                this.breakable = false;
                break;
            default:
                this.setFrame(0);
                this.breakable = false;
                break;
        }
    }
    
    hitByPlayer(player) {
        if (player.y > this.y + this.scene.caseSize) {
            if (this.breakable) {
                this.destroy();
            } else if (this.blockType === 'coinBox') {
                this.setFrame(3);
            } else if (this.blockType === 'randomBox') {
                this.setFrame(3);
            }
        } 
        
    }

}
