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
        '       %  =*=%=                        ',
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
        "$": [sprite('coin')],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'),solid()],
        '(': [sprite('pipe-bottom-left'),solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'),solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'),solid(), scale(0.5)],
        '+': [sprite('pipe-top-right'),solid(), scale(0.5)],
        '^': [sprite('evil-shroom'),solid()],
        '#': [sprite('mushroom'),solid()],
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

    add([text('level ' + 'test', pos(4,6))])



    //Adding Mario 
    const player = add([
        sprite('mario'), solid(), //Add mario
        pos(30,0), // Starting position
        body(), // fool gravity at the start
        origin('bot') // implement body to avoid error.
    ])

    //player speed movement
    const MOVE_SPEED = 120

    //Player jump force
    const JUMP_FORCE = 360
    
    
    //Adding keybord events
    keyDown('left', () => {
        player.move(-MOVE_SPEED,0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED,0)
    })

    keyPress('space', () => {
        if(player.grounded()){
            player.jump(JUMP_FORCE)
        }
    })

})

start("game")