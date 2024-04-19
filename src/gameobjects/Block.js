export class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'blocks', type);

        // Ajouter l'objet à la scène
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.body.allowGravity = false;
    }

    // Méthode pour initialiser ou reconfigurer le bloc
    setup(type) {
        // Configuration supplémentaire basée sur le type si nécessaire
    }

    preload() {
        this.load.spritesheet('blocks', 'assets/img/blocksSpritesheet.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.json('backgroundSprites', 'assets/sprites/backgroundSprites.json');
    }

    create() {
        const blockData = this.cache.json.get('backgroundSprites');
        blockData.forEach(data => {
            const block = new Block(this, data.x, data.y, data.type);
            block.setup(data.type);
        });
    }
    
}
