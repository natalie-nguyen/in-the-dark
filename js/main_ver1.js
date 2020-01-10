// game idea 
// ok a gallery map that blocks can spill everywhere
// invisible static blocks of same size 80*80, appear when clicked 
        // ok random position 
        // picture of famous painter, painting
        // ok hint: find hidden painting using the blocks
// OK objects falling from the sky, multiply when clicked
// OK where they clamped together -> where the blocks are
// OK all blocks found = win 
// http://www.strandedsoft.com/tag/enchant-js/

// problems
// game.end()

enchant();
window.onload = function() {
        var winCount = 5; 
        var findCount = 100;
        var game = new Game(640,320);
        game.fps = 16;
        painting = [[64, 64, 'matisse.jpg'], [128, 64, 'picasso.jpg'], [32, 64, 'kandinsky.jpg']];
        game.preload('ball.png', 
                      painting[0][2], 
                      painting[1][2], 
                      painting[2][2],
                      'kusama.jpg');

        game.onload = function() {
                var world = new PhysicsWorld(0, 1, 0); 
                var label = new Label('Find the hidden paintings using the blocks');
                label.x = 320/2;
                label.y = 20;
                game.rootScene.addChild(label);
                // cubes
                for (var i = 0; i < 320; i += 32) {
                        var cube = new Cube(320, i, getRandomArbitrary(8,30));
                        console.log('cube');
                };

                // balls
                // setInterval(function() {
                //         for (var i = 0; i < 640; i += 32) {
                //                 var cube = new Cube(i*10, 8);
                //                 console.log('cube');
                //         };
                // }, 5000);
                

                // pic: w, l, bx, by
                for (var i=0; i<winCount; i++) {
                        var pic = new Pic(42 , 96, 20 + 84*i + getRandomArbitrary(5,9)*10 , getRandomArbitrary(50, 320 - 58));
                        this.frame = i;
                        // wincount ok
                }

                // (w, l, wx , wy)
                ceil = new Wall(320*2-8 , 8, 160*2, 0);
                floorr = new Wall((640-8) , 8, 320, 320-8);
                wall_L1 = new Wall(8, 80, 0+8, 40);
                wall_L2 = new Wall(8, 80, 0+8, 280);
                wall_R = new Wall(8, 320, 640-8, 160);

                game.rootScene.onenterframe = function() {
                        world.step(game.fps);
                        if (winCount == 0) {
                                console.log('won');
                                game.end('game over');                               
                        }
                }
                // wincount ok

        }
        game.start();

        var Cube = Class.create(PhyBoxSprite, {
                initialize: function (x, y, r) {
                        PhyBoxSprite.call(this, r, r*2, enchant.box2d.DYNAMIC_SPRITE, -1, -1, -1);
                        this.backgroundColor = '#ea6024';
                        this.image = game.assets['kusama.jpg'];
                        this.frame = 10;
                        this.x = x;
                        this.y = y;
                        //this.touch = false;
                        game.rootScene.addChild(this);
                },

                ontouchstart: function (e) {
                        this.lx = e.localX;
                        this.ly = e.localY;
                        this.prevx = this.x;
                        this.prevy = this.y;
                        
                },
                ontouchmove: function (e) {
                        //console.log(e.x + ':' + e.y);
                        this.prevx = this.x;
                        this.prevy = this.y;
                        this.x = e.x - this.lx;
                        this.y = e.y - this.ly;
                },
                ontouchend: function (e) {
                        this.x = e.x - this.lx;
                        this.y = e.y - this.ly;
                        if ((this.x != this.prevx) || (this.y != this.prefy)) {
                                //make the block falls down
                                //this.applyImpulse(new b2Vec2(this.x - this.prevx, this.y - this.prevy));
                                this.applyImpulse(new b2Vec2(this.x*2 - this.prevx, this.y*2 - this.prevy));
                        }

                        if (findCount > 0){
                                //.image = false;
                                for (var i = 0; i < 10; i++) {
                                        var cube = new Cube(e.x, e.y, getRandomArbitrary(7, 20));
                                        cube.frame = getRandomArbitrary(1,16);
                                }
                        }
                        findCount--;
                },
                onenterframe: function() {
                        if (this.y <0 || this.x < 0) {
                                this.destroy();
                                console.log('destroy');
                        }
                }

                // ontouchstart: function(evt) {
                //         //this.applyTorque(1);
                        
                //         if (evt.elapsed*0.001 >= 3) {
                //                 this.backgroundColor = 'pink';
                //                 this.destroy();
                //                 console.log('destroy');
                //                 console.log(evt.elapsed*0.001);
                //        }
                //        findCount--;
                //        console.log('touch ' + findCount);                       
                // }

        });

        var Ball = Class.create(PhyCircleSprite, {
                initialize: function (x, y) {
                        PhyCircleSprite.call(this, 8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 1.0, 0.99, true);
                        //this.backgroundColor = '#ea6024';
                        this.image = game.assets['ball.png'];
                        this.x = x;
                        this.y = y;
                        game.rootScene.addChild(this);
                },
                onenterframe: function() {
                        //this.applyForce(new b2Vec2(10, 10));
                        //this.applyTorque(10);
                }
        });

        var Pic = Class.create(PhyBoxSprite, {
                initialize: function(w, l, bx, by) {
                        PhyBoxSprite.call(this, w, l, enchant.box2d.STATIC_SPRITE, 0, 1.0, 0, false);
                        this.backgroundColor = 'white'; //pink
                        this.position = {
                                x: bx,
                                y: by
                        };
                        this.found = false;
                        // ok console.log('pic ' + winCount); 
                        
                        game.rootScene.addChild(this);
                },
                ontouchstart: function() {
                        if (this.backgroundColor == 'white') {
                                this.found = true;
                        }
                        console.log('touch pic ' + winCount);
                        
                        this.backgroundColor = 'purple';
                        this.image = game.assets['matisse.jpg'];
                        if (this.backgroundColor == 'purple' && this.found) {
                                this.found = false;
                                winCount--;
                                console.log('reveal ' + winCount);
                        }
                        
                }

        })

        var Wall = Class.create(PhyBoxSprite,  {
                initialize: function (w, l, wx , wy) {
                        PhyBoxSprite.call(this, w, l, enchant.box2d.STATIC_SPRITE, 0, 1.0, 0, false);
                        this.backgroundColor = 'black';
                        this.position = {
                                x: wx,
                                y: wy
                        }
                        game.rootScene.addChild(this);
                }
        })

        // SceneGameOver  
        var SceneGameOver = Class.create(Scene, {
                initialize: function(score) {
                var gameOverLabel, scoreLabel;
                Scene.apply(this);
                this.backgroundColor = 'black';

                // Game Over label
                gameOverLabel = new Label("GAME OVER<br>Tap to Restart");
                gameOverLabel.x = 8;
                gameOverLabel.y = 128;
                gameOverLabel.color = 'white';
                gameOverLabel.font = '32px strong';
                gameOverLabel.textAlign = 'center';
                this.addChild(gameOverLabel);

                // Listen for taps
                this.addEventListener(Event.TOUCH_START, this.touchToRestart);
                },

                touchToRestart: function(evt) {
                        var game = Game.instance;
                        game.replaceScene(new new PhysicsWorld(0, 5, 5));
                    }
        });

        
    
}

function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

// setInterval(function() {
                // }, 5000);

                // !!!! if the lenght of sprite is negative, the ball sprite would sink into them
                // var floor = new PhyBoxSprite(16, Math.abs(320 - i*32*2), enchant.box2d.STATIC_SPRITE, 0, 1.0, 0);