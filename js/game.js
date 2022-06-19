kaboom({
    global: true,
    fullscreen: true,
    scale: 1.5,
    debug: true,
    clearColor: [0, 0, 0, 1], //BG color set to Black
})

//Loading img

//loadRoot('https://i.imgur.com/') //Load the main root  https://imgur.com/pcWySG3
loadSprite('coin', './img/coin.png') //Get the coing
loadSprite('evil-shroom', './img/evil-shroom.png') //Evil Shroom
loadSprite('brick', './img/brick.png') //Brick
loadSprite('block', './img/block.png') //Block
loadSprite('mario', './img/mario.png') //Mario
loadSprite('mushroom', './img/mushroom.png') //Mushroom
loadSprite('surprise', './img/surprise.png') //Surprise Block
loadSprite('unboxed', './img/unboxed.png') //unBoxed
loadSprite('pipe-top-left', './img/pipe-top-left.png') //Pipe
loadSprite('pipe-top-right', './img/pipe-top-right.png') //Pipe
loadSprite('pipe-bottom-left', './img/pipe-bottom-left.png') //Pipe
loadSprite('pipe-bottom-right', './img/pipe-bottom-right.png') //Pipe

loadSprite('blue-block', './img/blue-block.png') 
loadSprite('blue-brick', './img/blue-brick.png') 
loadSprite('blue-steal', './img/blue-steal.png') 
loadSprite('blue-evil-shroom', './img/blue-evil-shroom.png') 
loadSprite('blue-surprise', '../img/blue-surprise.png') 


//Game scene
scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    //Map of the game
    const maps = [
        [
            '                                                ',
            '                                                ',
            '                                                ',
            '                                                ',
            '                                                ',
            '       %  =*=%=                       %%%%      ',
            '                                                ',
            '                                   ==           ',
            '                                              -+',
            '             ^    ^                  ^        ()',
            '=========================  =====================',
        ],
        [
            '€                                                €',
            '€                                                €',
            '€                                                €',
            '€                                                €',
            '€                                                €',
            '€       @@@@@@@                                  €',
            '€                                      xx        €',
            '€                 €€                  xxx        €',
            '€                                    xxxx      -+€',
            '€            z    z                 xxxxx      ()€',
            '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        ],

    ] 

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()], //Equal to the block img
        "$": [sprite('coin'), 'coin'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
        '^': [sprite('evil-shroom'), solid(), 'dangerous'],
        '#': [sprite('mushroom'), solid(), 'mushroom', body()],
        '!': [sprite('blue-block'), solid(), scale(0.5)],
        '€': [sprite('blue-brick'), solid(), scale(0.5)],
        'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
        '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
        'x': [sprite('blue-steal'), solid(), scale(0.5), ],
    }

    const gameLevel = addLevel(maps[level], levelCfg)


    //This is the text score on the game
    const scoreLabel = add([
        text(score),
        pos(30, 6),
        layer('ui'), //Added to the ui layer so it doesn't interfere witht he game
        {
            value: score,
        }
    ])

    //Adding text "test"
    add([text('level ' + parseInt(level + 1)), pos(60, 6)])

    //Function to make mario big and small and edit jump
    function big() {
        let timer = 0
        let isBig = false
        return {
            update() {
                if (isBig) {
                    CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                    timer -= dt()
                    if (timer <= 0) {
                        this.smallify()
                    }
                }
            },
            isBig() {
                return isBig
            },
            smallify() {
                this.scale = vec2(1)
                CURRENT_JUMP_FORCE = JUMP_FORCE
                timer = 0
                isBig = false
            },
            biggify(time) {
                this.scale = vec2(1.5)
                timer = time
                isBig = true
            },
        }
    }


    //Adding Mario 
    const player = add([
        sprite('mario'), solid(), //Add mario
        pos(30, 0), // Starting position
        body(), // fool gravity at the start
        big(), // to change mario size
        origin('bot') // implement body to avoid error.
    ])

    //player speed movement
    const MOVE_SPEED = 120

    //Player jump force
    const JUMP_FORCE = 360

    //Player jump force when big
    const BIG_JUMP_FORCE = 450

    let CURRENT_JUMP_FORCE = JUMP_FORCE

    //Enemy speed
    const ENEMY_SPEED = 20

    let isJumping = true


    //falling death
    const FALL_DEATH = 400

    //Action to move mushroom
    action('mushroom', (m) => {
        m.move(40, 0)
    })

    // on headbump destroy blocksurprise and show coin
    player.on("headbump", (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }
        //on headbump destroy block and show coin
        if (obj.is('mushroom-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }
    })

    //If player collides with mushroom it biggify for 6 seconds
    player.collides('mushroom', (m) => {
        destroy(m)
        player.biggify(6)
    })

    //if player collides with coin destroy coin and edit score
    player.collides('coin', (c) => {
        destroy(c)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
    })


    //Movement enemy
    action('dangerous', (d) => {
        d.move(-ENEMY_SPEED, 0)
        
    })

    // If player collides go to lose scene (if jump on head no)
    player.collides('dangerous', (d) => {
        if (isJumping) {
            destroy(d)
        } else {
            go('lose', { score: scoreLabel.value })
        }
    })

    //if player fall will die + camera position following player
    player.action(() => {
        camPos(player.pos)
        if (player.pos.y >= FALL_DEATH) {
            go('lose', { score: scoreLabel.value })
        }
    })


    //Next level, if i press keydown in a pipe will go to next level and bring score with me

    player.collides('pipe', () => {
        keyPress('down', () => {
            go('game', {
                level: (level + 1) % maps.length, // (use to map looping)
                score: scoreLabel.value
            })
        })
    })


    //Adding keyboard events
    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })

    player.action(() => {
        if (player.grounded()) {
            isJumping = false
        }
    })

    //Jump
    keyPress('space', () => {
        if (player.grounded()) {
            isJumping = true
            player.jump(CURRENT_JUMP_FORCE)
        }
    })

})

//Lose scene
scene('lose', ({ score }) => {
    add([text(score, 32), origin('center'), pos(width() / 2, height() / 2)])
})

start("game", { level: 0, score: 0 })