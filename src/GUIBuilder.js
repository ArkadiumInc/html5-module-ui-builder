/**
 * Created by JIocb on 2/1/2016.
 */
var GUIBuilderButton = require("./button/GUIBuilderButton");
var GUIBuilder = function (game, textureAtlasHelper, scaleFactor,layoutName)
{
    "use strict";

    this._game = game;
    this._tah = textureAtlasHelper;
    this._currentScaleFactor = scaleFactor || 1;
    this._layoutName = layoutName || "default";

};

// ========== Prototype =========
GUIBuilder.prototype = Object.create(Object.prototype);
GUIBuilder.prototype.constructor = GUIBuilder;
module.exports = GUIBuilder;

GUIBuilder.prototype.destroy = function()
{
    "use strict";
    this._layoutName = null;
    this._game = null;
    this._tah = null;
};

GUIBuilder.prototype.build = function(container,json,/*treeDictionary,*/layoutName,localize)
{
    "use strict";
    this._layoutName = layoutName;
    var done = false;
    localize = false;
    for(var i = 0; i<json.layouts.length; i++)
    {

        var layout = json.layouts[i];
        if(layout && layout.layoutName == this._layoutName)
        {
            done = true;
            var children = layout.children;
            if(children)
            {
                for(var j = 0; j<children.length; j++) {

                    this.buildUIInternal(children[j], container, /*treeDictionary, */localize);
                }
            }
        }
    }


};


GUIBuilder.prototype.addLabel = function (text, style) {
    "use strict";

    this._label = new Phaser.BitmapText(this._game,0,0, style.font, text, style.fontSize);
    this._label.align = "center";

    this._label.tint = style.tint;
    //this._label.tint = 0xc6fffd;

    this._label.anchor.set(.5,.5);
    this._label.x = this._hitArea.width*.5;
    this._label.y = this._hitArea.height*.6;
    this._label.inputEnabled = false;
    this.addChild(this._label);
    return this._label;
};

GUIBuilder.prototype.buildUIInternal = function(json,container,/*treeDictionary,*/localize) {

    switch (json.type) {
        case "uiElement":
        {
            var uiElement;
            if(json.texture)
            {
                uiElement= new Phaser.Image(this._game,0, 0, this._tah.getAtlasFor(json.texture), json.texture);
                uiElement.width = json.width * this._currentScaleFactor;
                uiElement.height = json.height * this._currentScaleFactor;
            }
            else
            {
                uiElement= new Phaser.Group(this._game);
                uiElement.scale.x = json.scaleX;
                uiElement.scale.y = json.scaleY;
            }
            container[json.name] = uiElement;
            container.addChild(uiElement);
            //treeDictionary[json.name] = uiElement;


            uiElement.x = this._currentScaleFactor == 1 ? json.x : json.x * this._currentScaleFactor;
            uiElement.y = this._currentScaleFactor == 1 ? json.y : json.y * this._currentScaleFactor;





            uiElement.rotation = json.rotation;


            var children = json.children;
            if(children)
            {
                for(var j = 0; j<children.length; j++) {

                    this.buildUIInternal(children[j], uiElement, /*treeDictionary, */localize);
                }
            }
            break;
        }
        case "uiButton":
        {

            var upSprite = null;
            var downSprite = null;
            var hoverSprite = null;

            var hasUp = false;
            var hasDown = false;
            var hasHover = false;


            if (json.upSprite == "")
            {

                var tempDict = [];
                upSprite = new Phaser.Group(this._game,null);
                if(json.upState!= undefined && json.upState.children!=undefined && json.upState.children.length>0)
                {
                    var elements = json.upState.children;
                    var elementsNum = elements.length;
                    hasUp = true;
                    upSprite.x = json.upState.x;
                    upSprite.y = json.upState.y;
                    for (var i = 0; i < elementsNum; i++) {
                        this.buildUIInternal(elements[i], upSprite, tempDict, localize);

                    }
                }
            }
            else
            {
                upSprite = new Phaser.Image(this._game,0, 0, this._tah.getAtlasFor(json.upSprite), json.upSprite);
                hasUp = true;
            }

            if (json.downSprite == "")
            {

                var tempDict = [];
                downSprite = new Phaser.Group(this._game,null);

                if(json.downState!= undefined && json.downState.children!=undefined)
                {
                    var elements = json.downState.children;
                    var elementsNum = elements.length;
                    hasDown = true;
                    downSprite.x = json.downState.x;
                    downSprite.y = json.downState.y;
                    for (var i = 0; i < elementsNum; i++) {
                        this.buildUIInternal(elements[i], downSprite, tempDict, localize);
                    }
                }
            }
            else
            {
                downSprite = new Phaser.Image(this._game,0, 0, this._tah.getAtlasFor(json.downSprite), json.downSprite);
                hasDown = true;
            }


            if (json.hoverSprite == "")
            {

                var tempDict = [];
                hoverSprite = new Phaser.Group(this._game,null);

                if(json.hoverState!= undefined && json.hoverState.children!=undefined)
                {
                    var elements = json.hoverState.children;
                    var elementsNum = elements.length;
                    hasHover = true;
                    hoverSprite.x = json.hoverState.x;
                    hoverSprite.y = json.hoverState.y;
                    for (var i = 0; i < elementsNum; i++) {
                        this.buildUIInternal(elements[i], hoverSprite, tempDict, localize);
                    }
                }
            }
            else
            {
                hoverSprite = new Phaser.Image(this._game,0, 0, this._tah.getAtlasFor(json.hoverSprite), json.hoverSprite);
                hasHover = true;
            }

            upSprite = upSprite;//|| hoverSprite || downSprite;
            hoverSprite = hoverSprite;// || downSprite || upSprite;
            downSprite = downSprite;// || hoverSprite || upSprite;

            /*if(!hasHover)
            {
                if(hasDown)
                {
                    hoverSprite = downSprite;
                }
                else
                {
                    hoverSprite = upSprite;
                }
            }

            if(!hasDown)
            {
                if(hasOver)
                {
                    downSprite = overSprite;
                }
                else
                {
                    downSprite = upSprite;
                }
            }*/
            //container.addChild(upSprite);
            var button = new GUIBuilderButton(this._game,upSprite,hoverSprite,downSprite,upSprite);

            container.addChild(button);
            container[json.name] = button;

            button.x = parseInt(json.x) * this._currentScaleFactor;
            button.y = parseInt(json.y) *this. _currentScaleFactor;
            button.width = parseInt(json.width)*this._currentScaleFactor;
            button.height = parseInt(json.height)*this._currentScaleFactor;
            button.rotation = parseInt(json.rotation);
            break;
        }

    }

};