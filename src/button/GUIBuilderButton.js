/**
 * Created by JIocb on 2/1/2016.
 */
GUIBuilderButton = function (game, overFrame, outFrame, downFrame, upFrame) {
    "use strict";
    this._callback = null;
    this._callbackContext = this;
    this._game = game;

    Phaser.Group.call(this, this._game,null);

    this._frameByState = {};
    this._frameByState[STATE_OVER] = overFrame;
    this._frameByState[STATE_OUT] = outFrame;
    this._frameByState[STATE_DOWN] = downFrame;
    this._frameByState[STATE_UP] = upFrame;

    if(upFrame)
    {
         this.addChild(upFrame);
    }

    if(overFrame)
    {
        this.addChild(overFrame);
    }

    if(outFrame)
    {
        this.addChild(outFrame);
    }

    if(downFrame)
    {
        this.addChild(downFrame);

        var graph =  new Phaser.Graphics(this._game);
        graph.lineStyle(0,0,1);
        graph.beginFill(0,0);
        graph.drawRect(0,0,1,1);
        graph.endFill();
        graph.cacheAsBitmap = true;


        this._hitArea = new Phaser.Image(this._game,0,0,graph._cachedSprite.texture);
        this._hitArea.width = downFrame.width;
        this._hitArea.height = downFrame.height;

        this.addChildAt(this._hitArea,0);
    }
     this.type = "GUIBuilderButton";


    this._hitArea.physicsType = Phaser.SPRITE;


    this.onOverSound = null;


    this.onOutSound = null;


    this.onDownSound = null;

    this.onUpSound = null;

    this.onOverSoundMarker = '';

    this.onOutSoundMarker = '';


    this.onDownSoundMarker = '';

    this.onUpSoundMarker = '';

    this._hitArea.onInputOver = new Phaser.Signal();

    this._hitArea.onInputOut = new Phaser.Signal();

    this._hitArea.onInputDown = new Phaser.Signal();

    this._hitArea.onInputUp = new Phaser.Signal();

    this._hitArea.onOverMouseOnly = true;


    //this.justReleasedPreventsOver = Phaser.PointerMode.TOUCH;

    this.freezeFrames = false;

    this.forceOut = false;

    this._hitArea.inputEnabled = true;

    this._hitArea.input.start(0, true);

    this._hitArea.input.useHandCursor = true;

    //this.setFrames(overFrame, outFrame, downFrame, upFrame);
    this.changeStateFrame(STATE_OUT);


    //  Redirect the input events to here so we can handle animation updates, etc
    this._hitArea.events.onInputOver.add(this.onInputOverHandler, this);
    this._hitArea.events.onInputOut.add(this.onInputOutHandler, this);
    this._hitArea.events.onInputDown.add(this.onInputDownHandler, this);
    this._hitArea.events.onInputUp.add(this.onInputUpHandler, this);

    this._hitArea.events.onRemovedFromWorld.add(this.removedFromWorld, this);

};

GUIBuilderButton.prototype = Object.create(Phaser.Group.prototype);
GUIBuilderButton.prototype.constructor = GUIBuilderButton;
module.exports = GUIBuilderButton;

//  State constants; local only. These are tied to property names in Phaser.Button.
var STATE_OVER = 'Over';
var STATE_OUT = 'Out';
var STATE_DOWN = 'Down';
var STATE_UP = 'Up';

GUIBuilderButton.prototype.removePressListener = function (callback,callbackContext) {
    "use strict";
    if (this._hitArea !== null)
    {
        this._hitArea.onInputUp.remove(this._callback, this._callbackContext);
        this._callback = null;
        this._callbackContext = null;
    }

}

GUIBuilderButton.prototype.addPressListener = function (callback,callbackContext) {
    "use strict";
    if (this._hitArea !== null)
     {
         this._callback = callback;
         this._callbackContext = callbackContext;
         this._hitArea.onInputUp.add(this._callback, this._callbackContext);
     }

}
GUIBuilderButton.prototype.clearFrames = function () {
    "use strict";
    //this.setFrames(null, null, null, null);

};

GUIBuilderButton.prototype.removedFromWorld = function () {
    "use strict";
    this._hitArea.inputEnabled = false;

};

GUIBuilderButton.prototype.changeStateFrame = function (state) {
    "use strict";
    if (this.freezeFrames)
    {
        return false;
    }

    var frame = this._frameByState[state];
    if(frame)
    {
        if(this._frameByState[STATE_OVER])
            this._frameByState[STATE_OVER].visible = false;

        if(this._frameByState[STATE_DOWN])
            this._frameByState[STATE_DOWN].visible = false;

        if(this._frameByState[STATE_OUT])
            this._frameByState[STATE_OUT].visible = false;

        if(this._frameByState[STATE_UP])
            this._frameByState[STATE_UP].visible = false;

        frame.visible = true;
        return true;
    }
    else
    {
        return false;
    }

};

GUIBuilderButton.prototype.setStateSound = function (state, sound, marker) {

    "use strict";
    var soundKey = 'on' + state + 'Sound';
    var markerKey = 'on' + state + 'SoundMarker';

    if (sound instanceof Phaser.Sound || sound instanceof Phaser.AudioSprite)
    {
        this[soundKey] = sound;
        this[markerKey] = typeof marker === 'string' ? marker : '';
    }
    else
    {
        this[soundKey] = null;
        this[markerKey] = '';
    }

};

GUIBuilderButton.prototype.playStateSound = function (state) {

    "use strict";
    var soundKey = 'on' + state + 'Sound';
    var sound = this[soundKey];

    if (sound)
    {
        var markerKey = 'on' + state + 'SoundMarker';
        var marker = this[markerKey];

        sound.play(marker);
        return true;
    }
    else
    {
        return false;
    }

};

GUIBuilderButton.prototype.setSounds = function (overSound, overMarker, downSound, downMarker, outSound, outMarker, upSound, upMarker) {

    "use strict";
    this.setStateSound(STATE_OVER, overSound, overMarker);
    this.setStateSound(STATE_OUT, outSound, outMarker);
    this.setStateSound(STATE_DOWN, downSound, downMarker);
    this.setStateSound(STATE_UP, upSound, upMarker);

};

GUIBuilderButton.prototype.setOverSound = function (sound, marker) {
    "use strict";
    this.setStateSound(STATE_OVER, sound, marker);

};

GUIBuilderButton.prototype.setOutSound = function (sound, marker) {

    "use strict";
    this.setStateSound(STATE_OUT, sound, marker);

};

GUIBuilderButton.prototype.setDownSound = function (sound, marker) {
    "use strict";
    this.setStateSound(STATE_DOWN, sound, marker);

};

GUIBuilderButton.prototype.setUpSound = function (sound, marker) {
    "use strict";
    this.setStateSound(STATE_UP, sound, marker);

};

GUIBuilderButton.prototype.onInputOverHandler = function (sprite, pointer) {
    "use strict";
    if (pointer.justReleased() &&
        (/*this.justReleasedPreventsOver & */pointer.pointerMode) === pointer.pointerMode)
    {
        //  If the Pointer was only just released then we don't fire an over event
        return;
    }

    this.changeStateFrame(STATE_OVER);

    if (this._hitArea.onOverMouseOnly && !pointer.isMouse)
    {
        return;
    }

    this.playStateSound(STATE_OVER);

    if (this._hitArea.onInputOver)
    {
        this._hitArea.onInputOver.dispatch(this, pointer);
    }

};

GUIBuilderButton.prototype.onInputOutHandler = function (sprite, pointer) {
    "use strict";
    this.changeStateFrame(STATE_OUT);

    this.playStateSound(STATE_OUT);

    if (this._hitArea.onInputOut)
    {
        this._hitArea.onInputOut.dispatch(this, pointer);
    }
};

GUIBuilderButton.prototype.onInputDownHandler = function (sprite, pointer) {
    "use strict";
    this.changeStateFrame(STATE_DOWN);

    this.playStateSound(STATE_DOWN);

    if (this._hitArea.onInputDown)
    {
        this._hitArea.onInputDown.dispatch(this, pointer);
    }
};

GUIBuilderButton.prototype.onInputUpHandler = function (sprite, pointer, isOver) {
    "use strict";
    this.playStateSound(STATE_UP);

    if (this.freezeFrames)
    {
        return;
    }

    if (this.forceOut === true || (this.forceOut & pointer.pointerMode) === pointer.pointerMode)
    {
        this.changeStateFrame(STATE_OUT);
    }
    else
    {
        var changedUp = this.changeStateFrame(STATE_UP);
        if (!changedUp)
        {
            //  No Up frame to show..
            if (isOver)
            {
                this.changeStateFrame(STATE_OVER);
            }
            else
            {
                this.changeStateFrame(STATE_OUT);
            }
        }
    }

    //  Input dispatched early, before state change (but after sound)
    if (this._hitArea.onInputUp)
    {
        this._hitArea.onInputUp.dispatch(this, pointer, isOver);
    }


};

GUIBuilderButton.prototype.destroy = function () {
    "use strict";
    this._callback = null;
    this._callbackContext = this;
    this._game = null;
    this.freezeFrames = false;
    this.forceOut = false;


    if(this._frameByState[STATE_UP])
    {
        this.removeChild(this._frameByState[STATE_UP]);
    }

    if(this._frameByState[STATE_OVER])
    {
        this.removeChild(this._frameByState[STATE_OVER]);
    }

    if(this._frameByState[STATE_OUT])
    {
        this.removeChild(this._frameByState[STATE_OUT]);
    }

    if(this._frameByState[STATE_DOWN])
    {
        this.removeChild(this._frameByState[STATE_DOWN]);
    }

    if(this._hitArea)
    {
        this._hitArea.physicsType = null;
        this._hitArea.inputEnabled = false;
        this._hitArea.onOverMouseOnly = false;
        this._hitArea.input.stop();
        this._hitArea.input.useHandCursor = false;


        this._hitArea.events.onInputOver.remove(this.onInputOverHandler, this);
        this._hitArea.events.onInputOut.remove(this.onInputOutHandler, this);
        this._hitArea.events.onInputDown.remove(this.onInputDownHandler, this);
        this._hitArea.events.onInputUp.remove(this.onInputUpHandler, this);
        this._hitArea.events.onRemovedFromWorld.remove(this.removedFromWorld, this);


        this._hitArea.onInputOver = null;
        this._hitArea.onInputOut = null;
        this._hitArea.onInputDown = null;
        this._hitArea.onInputUp = null;

    //  Redirect the input events to here so we can handle animation updates, etc
        this.removeChild(this._hitArea);
    }
    this._hitArea = null;

    //this.justReleasedPreventsOver = Phaser.PointerMode.TOUCH;
    this.type = null;
    this._frameByState = null;



    this.onOverSound = null;

    this.onOutSound = null;

    this.onDownSound = null;

    this.onUpSound = null;

    this.onOverSoundMarker = '';

    this.onOutSoundMarker = '';

    this.onDownSoundMarker = '';

    this.onUpSoundMarker = '';

};

