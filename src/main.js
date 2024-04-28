import { Boot } from './scenes/Boot';
import { Stage } from './scenes/Stage';
import { Game } from 'phaser';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Win } from './scenes/Win';

//  Find out more information about the Game Config at: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 960,
    parent: 'game-container',
    backgroundColor: '#FFFFFF',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 }
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Stage,
        GameOver,
        Win
    ]
};

export default new Game(config);
