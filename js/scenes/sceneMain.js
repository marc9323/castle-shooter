class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload() {}
    create() {
        mt.mediaManager.setBackground('background'); // not working
        this.arrowGroup = this.physics.add.group();
        this.arrowCount = 100;
        this.blockGroup = this.physics.add.group();
        this.speed = 100;

        this.arrowsShot = 0;
        this.score = 0;

        this.back = this.add.image(0, 0, 'back').setOrigin(0); // top left corner
        this.back.displayHeight = game.config.height;
        this.back.displayWidth = game.config.width;

        this.aGrid = new AlignGrid({
            scene: this,
            rows: 11,
            cols: 11
        });
        //this.aGrid.showNumbers();

        this.target = this.physics.add.sprite(0, 0, 'target');
        Align.scaleToGameW(this.target, 0.2);
        this.aGrid.placeAtIndex(16, this.target);

        this.target.setVelocityX(this.speed);
        this.target.setImmovable();

        this.input.on('pointerdown', this.addArrow, this);

        this.arrowCountText = this.add
            .text(0, 0, this.arrowCount, {
                color: '#000000',
                fontSize: game.config.width / 30
            })
            .setOrigin(0.5); // center align
        this.aGrid.placeAtIndex(100, this.arrowCountText);
        this.arrowIcon = this.add.image(0, 0, 'arrow');
        Align.scaleToGameW(this.arrowIcon, 0.02);
        this.aGrid.placeAtIndex(99, this.arrowIcon);

        this.scoreText = this.add
            .text(0, 0, '0/0', {
                color: '#000000',
                fontSize: game.config.width / 30
            })
            .setOrigin(0.5);
        this.aGrid.placeAtIndex(108, this.scoreText);

        this.setColliders();
    }

    setColliders() {
        this.physics.add.collider(
            this.target,
            this.arrowGroup,
            this.hitTarget,
            null,
            this
        );

        this.physics.add.collider(
            this.arrowGroup,
            this.blockGroup,
            this.hitBlock,
            null,
            this
        );
    }

    hitBlock(arrow, block) {
        arrow.destroy();
    }

    updateText() {
        this.scoreText.setText(this.score + '/' + this.arrowsShot);
    }

    addBlock(pos) {
        var block = this.physics.add.sprite(0, 0, 'block');

        Align.scaleToGameW(block, 0.1);
        this.blockGroup.add(block);
        // if you set the physics property of a sprite
        // you must do it after you add it to a group
        // (if you use groups)
        // if you set it first and then add it to a group
        // all physics settings are cleared when you add to group
        block.setImmovable();
        this.aGrid.placeAtIndex(pos, block);
        block.setVelocityX(this.speed);
    }

    hitTarget(target, arrow) {
        arrow.destroy();
        this.score++;
        this.speed += 5;
        this.updateText();

        var effect = new Effect({
            scene: this,
            effectNumber: mt.model.effectNumber
        });
        effect.x = this.target.x;
        effect.y = this.target.y;
        if (this.score == 10) {
            this.addBlock(50);
        }
        if (this.score == 20) {
            this.addBlock(68);
        }
        if (this.score == 50) {
            this.addBlock(22);
        }

        mt.mediaManager.playSound('hit');
    }

    addArrow(pointer) {
        if (this.arrowCount == 0) {
            return;
        }
        this.arrowCount--;
        this.arrowsShot++;
        this.arrowCountText.setText(this.arrowCount);
        var arrow = this.physics.add.sprite(0, 0, 'arrow');
        Align.scaleToGameW(arrow, 0.025);
        this.arrowGroup.add(arrow);
        this.aGrid.placeAtIndex(93, arrow);
        arrow.x = pointer.x;
        arrow.setVelocityY(-250);
        this.updateText(); // ???

        // could use mod instead
        if (this.arrowCount / 2 == Math.floor(this.arrowCount / 2)) {
            mt.mediaManager.playSound('swish1');
        } else {
            mt.mediaManager.playSound('swish2');
        }
    }

    update() {
        if (this.target.x > game.config.width) {
            this.target.setVelocityX(-this.speed);
        }
        if (this.target.x < 0) {
            this.target.setVelocityX(this.speed);
        }

        this.arrowGroup.children.iterate(
            function(child) {
                // sometimes its destropyed in the game but still exists
                // inside the loop so to prevent undefined error:
                if (child) {
                    if (child.y < 0) {
                        child.destroy();
                    }
                }
            }.bind(this)
        );

        this.blockGroup.children.iterate(
            function(child) {
                if (child) {
                    if (child.x < 0) {
                        child.setVelocityX(this.speed);
                    }
                    if (child.x > game.config.width) {
                        child.setVelocityX(-this.speed);
                    }
                }
            }.bind(this)
        );

        if (
            this.arrowCount == 0 &&
            this.arrowGroup.children.entries.length == 0
        ) {
            this.scene.start('SceneOver');
        }
    }
}
