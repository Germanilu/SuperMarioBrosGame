kaboom({
    global: true,
    fullscreen: true,
    scale:1.5,
    debug: true,
    clearColor: [0,0,0,1], //BG color set to Black
})

//Loading img

//loadRoot('https://i.imgur.com/') //Load the main root  https://imgur.com/pcWySG3
loadSprite('coin','/img/coin.png') //Get the coing
loadSprite('evil-shroom','/img/evil-shroom.png') //Evil Shroom
loadSprite('brick','/img/brick.png') //Brick
loadSprite('block','/img/block.png') //Block
loadSprite('mario','/img/mario.png') //Mario
loadSprite('mushroom','/img/mushroom.png') //Mushroom
loadSprite('surprise','/img/surprise.png') //Surprise Block
loadSprite('unboxed','/img/unboxed.png') //unBoxed
loadSprite('pipe-top-left','/img/pipe-top-left.png') //Pipe
loadSprite('pipe-top-right','/img/pipe-top-right.png') //Pipe
loadSprite('pipe-bottom-left','/img/pipe-bottom-left.png') //Pipe
loadSprite('pipe-bottom-right','/img/pipe-bottom-right.png') //Pipe



scene("game", () => {
    layers(['bg','obj','ui'],'obj')

//Map of the game
    const map = [
        '                                 ',
        '                                 ',
        '                                 ',
        '                                 ',
        '                                 ',
        '       %  =*=%=                     ',
        '                                 ',
        '                                 ',
        '                      -+          ',
        '                ^   ^ ()          ',
        '=========================  ======',
    ]

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('block'),solid()], //Equal to the block img
        "$": [sprite('coin'), 'coin'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'),solid()],
        '(': [sprite('pipe-bottom-left'),solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'),solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'),solid(), scale(0.5)],
        '+': [sprite('pipe-top-right'),solid(), scale(0.5)],
        '^': [sprite('evil-shroom'),solid()],
        '#': [sprite('mushroom'),solid(), 'mushroom', body()],
    }

    const gameLevel = addLevel(map, levelCfg)


    //This is the text score on the game
    const scoreLabel = add([
        text('test'),
        pos(30,6),
        layer('ui'), //Added to the ui layer so it doesn't interfere witht he game
        {
            value: 'test',
        }
    ])
    //Adding text "test"
    add([text('level ' + 'test', pos(4,6))])

    //Function to make mario big and small and edit jump
    function big(){
        let timer = 0
        let isBig = false
        return{
            update(){
                if(isBig){
                    CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                    timer -=dt()
                    if(timer <= 0){
                        this.smallify()
                    }
                }
            },
            isBig(){
                return isBig
            },
            smallify() {
                this.scale = vec2(1)
                CURRENT_JUMP_FORCE = JUMP_FORCE
                timer = 0
                isBig = false
            },
            biggify(time){
                this.scale = vec2(2)
                timer = time
                isBig = true
            },
        }
    }


    //Adding Mario 
    const player = add([
        sprite('mario'), solid(), //Add mario
        pos(30,0), // Starting position
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
    

    //Action to move mushroom
    action('mushroom', (m) => {
        m.move(40,0)
    })

    // on headbump destroy blocksurprise and show coin
    player.on("headbump", (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}',obj.gridPos.sub(0,0))
        }
        //on headbump destroy block and show coin
        if (obj.is('mushroom-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}',obj.gridPos.sub(0,0))
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
    
    
    //Adding keyboard events
    keyDown('left', () => {
        player.move(-MOVE_SPEED,0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED,0)
    })
    //Jump
    keyPress('space', () => {
        if(player.grounded()){
            player.jump(CURRENT_JUMP_FORCE)
        }
    })

})

start("game")