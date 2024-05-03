import { Coin } from "./Coin";
import { Item } from "./Item";

export class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, item) {
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
            case 'ground':
                this.setFrame(0);
                this.breakable = false;
                break;
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
            case 'emptyBox':
                this.setFrame(3);
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
            case 'stairs':
                this.setFrame(33);
                this.breakable = false;
                break;
            default:
                this.setFrame(32);
                this.breakable = false;
                break;
        }
    }
    
    hitByPlayer(player) {
        if (this.body.touching.down) {
            if (this.blockType === 'brick') {
                this.scene.breakBlockSfx.play()
                this.scene.addScore(50);
                this.destroy();
            } else if (this.blockType === 'coinBox') {
                this.scene.coinSfx.play();
                this.setFrame(3);
                this.blockType = 'emptyBox';
                
                const coin = new Coin(this.scene, this.x, this.y - this.scene.caseSize);
                this.scene.coins.push(coin);

                this.scene.addScore(200);
                this.scene.addCoin();
            } else if (this.blockType === 'randomBox') {
                this.scene.powerUpAppearSfx.play();
                this.setFrame(3);
                this.blockType = 'emptyBox';

                const item = new Item(this.scene, this.x, this.y - this.scene.caseSize, "RedMushroom");
                this.scene.items.push(item);  

                this.scene.addScore(1000);
            } else if (this.blockType === 'emptyBox') {
                this.scene.brickBumpSfx.play();
            }
        }
    }

}
