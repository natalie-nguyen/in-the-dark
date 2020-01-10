enchant();
window.onload = function() {
        var game = new Game(320,320);
        game.fps = 16;

        game.onload = function() {
                var world = new PhysicsWorld(0, 9.8);
                
                // balls
                for (var i = 0; i < 320; i += 32) {
                        var box = new Ball(i, i, 10);
                };

                //obstacles
                for (var i=0; i < 9; i++) {
                        var floor = new PhyBoxSprite(320 - i*32*2, 32, enchant.box2d.STATIC_SPRITE, 0, 1.0, 0, false);
                        floor.backgroundColor = '#008080';
                        floor.position = {
                                x : 160,
                                y : 312 - i*32
                        }
                        game.rootScene.addChild(floor);
                }
                console.log('obstacle');

                var ceil = new PhyBoxSprite(320, 16, enchant.box2d.STATIC_SPRITE, 0, 1.0, 0, false);
                ceil.backgroundColor = "#aaa";
                ceil.position = {
                        x: 160,
                        y: 0
                }
                game.rootScene.addChild(ceil);
                var walll = new PhyBoxSprite(16, 320, enchant.box2d.STATIC_SPRITE, 0, 1.0, 0, false);
                walll.backgroundColor = "#aaa";
                walll.position = {
                        x: 0,
                        y: 160
                }
                game.rootScene.addChild(walll);
                var wallr = new PhyBoxSprite(16, 320, enchant.box2d.STATIC_SPRITE, 0, 1.0, 0, false);
                wallr.backgroundColor = "#aaa";
                wallr.position = {
                        x: 312,
                        y: 160
                }
                game.rootScene.addChild(wallr);

                game.rootScene.onenterframe = function() {
                        world.step(game.fps);
                }

        }
        game.start();

        var Ball = Class.create(PhyCircleSprite, {
                initialize: function (x, y, r) {
                        PhyCircleSprite.call(this, r, enchant.box2d.DYNAMIC_SPRITE, 1.0, 1.0, 0.99, true);
                        this.backgroundColor = '#ea6024';
                        this.x = x;
                        this.y = y;
                        game.rootScene.addChild(this);
                },
                onenterframe: function() {
                        //this.applyForce(new b2Vec2(10, 10));
                        this.applyTorque(10);
                }

        });
}