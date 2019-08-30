class SceneLoad extends Phaser.Scene {
    constructor() {
        super('SceneLoad');
    }
    preload() {
        this.progText = this.add.text(0, 0, '0%', {
            color: '#ffffff',
            fontSize: game.config.width / 10
        });
        this.progText.setOrigin(0.5, 0.5);
        Align.center(this.progText);
        Effect.preload(this, mt.model.effectNumber);
        this.load.on('progress', this.showProgress, this);
        this.load.image('btnStart', 'images/btnStart.png');
        this.load.image('titleBack', 'images/titleBack.jpg');
        this.load.image('blue', 'images/buttons/blue.png');
        this.load.image('red', 'images/buttons/red.png');
        this.load.image('orange', 'images/buttons/orange.png');
        this.load.image('green', 'images/buttons/green.png');
        this.load.image('sample', 'images/sample.png');
        //
        //
        //
        /* this.load.audio("right", "audio/right.wav");
        this.load.audio("wrong", "audio/wrong.wav");
        this.load.audio("levelUp", "audio/levelUp.wav");
        this.load.audio("background", "audio/background.mp3");*/

        this.load.image('arrow', 'images/arrow.png');
        this.load.image('back', 'images/back.jpg');
        this.load.image('target', 'images/target.png');
        this.load.image('block', 'images/block.png');

        this.load.audio('swish1', 'audio/audio/swish1.wav');
        this.load.audio('swish2', 'audio/audio/swish2.wav');
        this.load.audio('hit', 'audio/audio/hit.wav');
        this.load.audio('pop', 'audio/audio/pop.wav');
        this.load.audio('boom', 'audio/audio/boom.wav');
        this.load.audio('background', 'audio/audio/background.mp3');
    }
    create() {
        mt.emitter = new Phaser.Events.EventEmitter();
        mt.controller = new Controller();
        mt.mediaManager = new MediaManager({
            scene: this
        });
        this.scene.start('SceneTitle');
    }
    showProgress(prog) {
        var per = Math.floor((prog / 1) * 100);
        this.progText.setText(per + '%');
    }
    update() {}
}
