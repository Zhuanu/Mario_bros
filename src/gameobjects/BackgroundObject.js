export class BackgroundObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, "tiles");
        this.setOrigin(0, 0);

        this.setup(scene, type);

        // Ajouter l'objet à la scène
        scene.add.existing(this);
    }

    // Méthode pour initialiser le décor
    setup(scene, type) {
        const backgroundSprites = scene.cache.json.get('backgroundSprites');
        const spriteData = backgroundSprites.sprites.find(sprite => sprite.name === type);
        if (spriteData) {
            this.setFrame(spriteData.frameIndex);
        }
    }

}
