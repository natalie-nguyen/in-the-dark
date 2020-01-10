enchant();
window.onload = function() {
        windowAge = 7;
        roomColor = 'black';
        vaseFound = false;
        vaseTouch = false;
        vaseColor = 'black';
        cube_image = false;
        cube_color = 'white'
        windowYPos = 128-5+42;
        windowBroken = 0; 

        var game = new Game(640,340);
        game.fps = 16;
        game.preload( 'horror.png',
                      'flower.png',
                      'vase.png',
                      'happy.png');

        game.onload = function() {
                
                var bg = new Sprite(game.width, game.height);
                bg.backgroundColor = roomColor;
                game.rootScene.addChild(bg);

                var world = new PhysicsWorld(0, 9.8, 0); 

                // Wall(w, h, wx , wy)
                ceil = new Wall(320*2 , 32, 160*2, 32/2);
                floorr = new Wall(320*2 , 16, 320, 340-8/2);
                wall_L = new Wall(8, 340, 0+8/2, 340/2);
                wall_R = new Wall(8, 340, 640-8/2, 340/2);
                // Room's objects
                window_back = new Wall(32*2+10*3, 32*2+10*3, 280-5+42, 128-5+42);
                for (var i=1; i<6; i++) {
                        if (!(i == 3)) {
                                light = new Wall(16, 16, 106*i, 32-8);
                                light.i = i;
                                light.backgroundColor = 'white';
                                light.ontouchstart = function() {
                                        light_voice = new Story('nothing here');
                                }
                        } else continue;
                }

                var table_xpos = 478
                var table_height = 110;
                table_top1 = new Wall(32*2, 8, table_xpos, game.height -table_height);
                table_top2 = new Wall(32*1.5, 8, table_xpos, game.height -table_height+8);
                table_leg1 = new Wall(8, 110, table_xpos, game.height -table_height/2);
                vase = new Vase(table_xpos-16, game.height -table_height -(8+8+64));

                // Window buttons(x, y, frame, cube_xpos)
                var win_xcenter = window_back.x +32-1;
                var win_ycenter = window_back.y +32-1;
                var win_offset = 16+5;
                window1 = new Window(win_xcenter -win_offset, win_ycenter -win_offset, 1, 106*1);
                window2 = new Window(win_xcenter +win_offset, win_ycenter -win_offset, 2, 106*5);
                window3 = new Window(win_xcenter -win_offset, win_ycenter +win_offset, 3, 106*2);
                window4 = new Window(win_xcenter +win_offset, win_ycenter +win_offset, 4, 106*4);

                // setInterval(function() {
                //         new Ghost();
                //         console.log('ghost appear');
                // }, getRandomArbitrary(5, 10)*1000);

                hello = new Story('Hello!')
                narration =['You are inside a dark room.', 'Fill the room with light', 'to find a magic box,', '(which has a vase inside)', 'and the room will be lit up (with some suprises)', 'Notice any unusual blank space.'];
                narrationTimer = setInterval(function() {
                        new Story(narration[0]);
                        narration.shift();       
                }, 2500);
                game.rootScene.onenterframe = function() {
                        world.step(game.fps);
                        bg.backgroundColor = roomColor;
                        bg.image = vaseFound;
                        if (narration.length == 0) {
                                clearInterval(narrationTimer);
                        }
                        // if collide ghost & window -> window touchCount =0
                        // world.contact(function(Ghost, Window) {
                        //         Ghost.destroy();
                        //         Window.destroy();
                        // })
                }


        }
        game.start();

        var Story = Class.create(Label, {
                initialize: function(text) {
                        Label.call(this);
                        this.text = text;
                        this.textAlign = 'left';
                        this.color = 'white';
                        this.font = '14px Futura';
                        this.x = 100;
                        this.y = window_back.y -48;
                        this.timing = 2
                        game.rootScene.addChild(this);
                },
                onenterframe: function() {
                        if (this.age == 16*this.timing) {
                                game.rootScene.removeChild(this);
                        }
                }
        })

        var Window = Class.create(PhyBoxSprite, {
                initialize: function(x, y, frame, c_xpos) {
                        PhyBoxSprite.call(this, 32, 32, enchant.box2d.STATIC_SPRITE, 0, 0, 1);
                        this.backgroundColor = 'white';
                        this.frame = frame;
                        this.x =x;
                        this.y =y;
                        this.cube_xpos = c_xpos;
                        this.touchCount = windowAge;
                        this.specialCount = getRandomArbitrary(1, windowAge);
                        game.rootScene.addChild(this);
                },
                ontouchstart: function() {
                        if (this.touchCount > 0) {
                                this.backgroundColor = 'yellow';
                                for (var i = 0; i < 10; i++) {
                                        var cube = new Cube(this.cube_xpos, 32, 16);
                                }
                                window_voice = new Story('Filling the room with light');
                                window_voice.timing = 1;
                        }
                        if (this.touchCount == this.specialCount) {
                                var special_cube = new Cube(this.cube_xpos, 32, 16);
                                special_cube.special = true;
                        }

                },
                ontouchend: function() {
                        this.touchCount--;
                        if (this.touchCount > 0) {
                                this.backgroundColor = 'white';
                        } else if (this.touchCount == 0) {
                                windowDelay = setTimeout(() => {
                                        window_voice = new Story('The lamp is broken, be careful.');
                                        window_voice.timing = 3;
                                        window_voice.y = window_back.y-48-14;
                                        window_voice.color = 'red';
                                        // for (var i = 0; i < 10; i++) {
                                        //         var cube = new Cube(this.cube_xpos, 32, 10);
                                        //         cube.backgroundColor = 'red';
                                        //         cube.selfDestruct = true;
                                        // }        
                                }, 2500);

                                windowBroken++;
                                console.log(windowBroken + ' broke');
                                if (windowBroken == 3) {
                                        hintDelay = setTimeout(() => {
                                                hint = new Story('Notice any unsual blank space.');
                                                hint.color = 'yellow';        
                                        }, 2500 + 3*1000);

                                } else if (windowBroken == 4) {
                                        var i = 11;
                                        countdown = setInterval(() => {
                                                console.log(i);
                                                if (i == 11) {
                                                        new Story('Find the object');
                                                } else if (vaseTouch) {
                                                        // trigger win
                                                        console.log('won!');
                                                        clearInterval(countdown);
                                                } else if (i == 0) {
                                                        // trigger lose
                                                        console.log('lost!');
                                                        vaseFound = game.assets['horror.png'];
                                                        cube_image = game.assets['horror.png'];
                                                        loseVoice = new Story('Light\'s out, You lost');
                                                        loseVoice.timing = null;
                                                        loseVoice.color = 'red';
                                                        loseVoice.x = 106*2 + 30;
                                                        loseVoice.y = 16;
                                                        clearInterval(countdown);
                                                        setTimeout(() => {
                                                                scene = new Scene();
                                                                game.pushScene(scene);          
                                                        }, 4000);
                                                } else {
                                                        down = new Story(i);
                                                        down.color = 'red';
                                                }
                                                i--;
                                        }, 2500);
                                }
                                this.backgroundColor = 'red';
                        } else
                        this.backgroundColor = 'red';
                }
        });

        var Cube = Class.create(PhyBoxSprite, {
                initialize: function (x, y, r) {
                        PhyBoxSprite.call(this, r, r, enchant.box2d.DYNAMIC_SPRITE, 0.1, 1, 0);
                        this.backgroundColor = cube_color;
                        this.frame = [7];
                        this.x = x;
                        this.y = y;
                        this.r = r;
                        this.special = false;
                        this.selfDestruct = false;
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
                                this.applyImpulse(new b2Vec2(this.x - this.prevx, this.y - this.prevy));
                        }
                        for (var i = 0; i < 5; i++) {
                                var cube = new Cube(e.x, e.y, 16);
                        }
                        windowAge--;
                },
                onenterframe: function() {
                        this.backgroundColor = cube_color;
                        this.image = cube_image;
                        if (this.selfDestruct) {
                                if(this.age == 7) {
                                        game.rootScene.removeChild(this);
                                }        
                        }
                        if (this.special) {
                                this.backgroundColor = 'yellow';
                                this.ontouchstart = function() {
                                        roomColor = '#111111';
                                        game.rootScene.removeChild(this);
                                        hint = new Story('The room is lit up a little');
                                        hint.color = 'blue';
                                        hint.y = window_back.y-48-14;
                                        setTimeout(() => {
                                                hint = new Story('Look closely for the rectangular box');
                                                hint.y = window_back.y-48-14;
                                        }, 2500);
                                }
                        }
                }
        });

        var Vase = Class.create(PhyBoxSprite, {
                initialize: function(x, y) {
                        PhyBoxSprite.call(this, 32, 64, enchant.box2d.STATIC_SPRITE, 0, 0, 1);
                        this.backgroundColor = vaseColor;
                        this.x = x;
                        this.y = y;
                        game.rootScene.addChild(this);
                },
                ontouchstart: function() {
                        vaseColor = null;
                        this.image = game.assets['vase.png']; 
                        cube_image = game.assets['flower.png'];
                        cube_color = null;
                        vaseVoice = new Story('VASE FOUND! YOU WON!');
                        vaseVoice.timing = null;
                        vaseVoice.color = 'yellow';
                        vaseVoice.x = 106*2 + 19;
                        vaseVoice.y = 16;
                        roomColor = 'white';
                        vaseFound = game.assets['happy.png'];
                        vaseTouch = true;
                        setTimeout(() => {
                                scene = new Scene();
                                game.pushScene(scene);                                
                        }, 5000);
                },
                onenterframe: function() {
                        this.backgroundColor = vaseColor;
                }
        });

        var Ghost = Class.create(PhyBoxSprite, {
                initialize: function() {
                        PhyBoxSprite.call(this, 32, 64, enchant.box2d.STATIC_SPRITE, 0, 0, 1);
                        this.backgroundColor = 'white';
                        //this.image = game.assets['ghost.png'];
                        this.x = 0;
                        this.y = windowYPos;
                        game.rootScene.addChild(this);
                },
                onenterframe: function() {
                        // if (this.case > 0) {
                        //         this.x -= 1;
                        //         console.log('ghost 1');
                        // } else  { 
                        //         this.x += 1;
                        //         console.log('ghost 2');
                        // }
                        this.x++;
                }
        })

        var Wall = Class.create(PhyBoxSprite,  {
                initialize: function (w, h, wx , wy) {
                        PhyBoxSprite.call(this, w, h, enchant.box2d.STATIC_SPRITE, 0, 1.0, 0, false);
                        this.backgroundColor = 'black';
                        this.position = {
                                x: wx,
                                y: wy
                        }
                        game.rootScene.addChild(this);
                }
        })
}

function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }