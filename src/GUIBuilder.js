/**
 * Created by JIocb on 2/1/2016.
 */
var GUIBuilderButton = require("./button/GUIBuilderButton");

var GUIBuilder = function (game, textuteAtlasHelper, layoutName) {
    "use strict";
    this._game = game;
    this._layoutName = layoutName || "default";
    this._currentScaleFactor = 1;
    this._tah = textuteAtlasHelper;
};

// ========== Prototype =========
GUIBuilder.prototype = Object.create(Object.prototype);
GUIBuilder.prototype.constructor = GUIBuilder;



GUIBuilder.prototype.dispose = function(container,elements) {
    "use strict";
    for(var key in elements) {
        if(elements.hasOwnProperty(key)) {
            var item = elements[key];

            if (item != null) {
                if (item.type != null && item.type == "GUIBuilderButton") {
                    item.destroy();
                }

                if (item.parent != null) {
                    item.parent.removeChild(item);
                }
            }
        }
    }
};

GUIBuilder.prototype.build = function(container,json,treeDictionary,layoutName,localize) {
    "use strict";
    var done = false;

    this._layoutName = layoutName;
    localize = false;

    for(var i = 0; i<json.layouts.length; i++) {
        var layout = json.layouts[i];

        if(layout && layout.layoutName == this._layoutName) {
            var children = layout.children;

            done = true;

            if(children) {
                for(var j = 0; j<children.length; j++) {
                    this.buildUIInternal(children[j], container, treeDictionary, localize);
                }
            }
        }
    }
};

GUIBuilder.prototype.buildUIInternal = function(json,container,treeDictionary,localize) {
    "use strict";
    switch (json.type) {
        case "uiElement": {
            var uiElement;

            if(json.texture) {
                uiElement= new Phaser.Image(this._game,0, 0, this._tah.getAtlasFor(json.texture), json.texture)
            }
            else
            {
                uiElement= new Phaser.Group(this._game);
            }
            container.addChild(uiElement);
            treeDictionary[json.name] = uiElement;


            uiElement.x = this._currentScaleFactor == 1 ? json.x : json.x * this._currentScaleFactor;
            uiElement.y = this._currentScaleFactor == 1 ? json.y : json.y * this._currentScaleFactor;



            uiElement.width = json.width * this._currentScaleFactor;
            uiElement.height = json.height * this._currentScaleFactor;

            uiElement.rotation = json.rotation;


            var children = json.children;
            if(children)
            {
                for(var j = 0; j<children.length; j++) {

                    this.buildUIInternal(children[j], uiElement, treeDictionary, localize);
                }
            }
            break;
        }
        case "uiButton":
        {

            var upSprite = null;
            var downSprite = null;
            var hoverSprite = null;

            if (json.upSprite == "")
            {
                var tempDict = [];
                upSprite = new Phaser.Group(this._game);

                var elements = json.upState.children;
                var elementsNum = elements.length;

                for (var i = 0; i < elementsNum; i++)
                {
                    this.buildUIInternal(elements[i], upSprite, tempDict, localize);
                }
                if (json.downState)
                {
                    downSprite = new Phaser.Group(this._game);
                    elements = json.downState.children;
                    elementsNum = elements.length;
                    for (i = 0; i < elementsNum; i++)
                    {
                        this.buildUIInternal(elements[i], downSprite, tempDict, localize);
                    }
                }
                if (json.hoverState)
                {
                    hoverSprite= new Phaser.Group(this._game);
                    elements = json.hoverState.children;
                    elementsNum = elements.length;
                    for (i = 0; i < elementsNum; i++)
                    {
                        this.buildUIInternal(elements[i], hoverSprite, tempDict, localize);
                    }
                }

                /*  localText = _localizationManager.getString(layoutXML.@name);
                 if (localize && localText)
                 {
                 var uiCustomButton:UICustomButton = new UICustomButton(layoutXML.@name, _context, upSprite, localText, downSprite, hoverSprite);
                 }
                 else
                 {*/

                //buttonControl = button;
            }
            else
            {
                upSprite = new Phaser.Image(this._game,0, 0, this._tah.getAtlasFor(json.upSprite), json.upSprite);
                if (json.downSprite !=undefined || json.downSprite !=null)
                {
                    downSprite = new Phaser.Image(this._game,0, 0, this._tah.getAtlasFor(json.downSprite), json.downSprite);
                }
                if (json.hoverSprite != json.downSprite && json.hoverSprite != undefined)
                {
                    hoverSprite = new Phaser.Image(this._game,0, 0, this._tah.getAtlasFor(json.hoverSprite), json.hoverSprite);
                }

                /*localText = _localizationManager.getString(layoutXML.@name);
                 if (localize && localText)
                 {
                 textFormat = new UITextFormat(layoutXML.@width, layoutXML.@height, localText, layoutXML.@font, layoutXML.@size, layoutXML.@color, layoutXML.@align);
                 }
                 else
                 {
                 textFormat = new UITextFormat(layoutXML.@width, layoutXML.@height, layoutXML.@text, layoutXML.@font, layoutXML.@size, layoutXML.@color, layoutXML.@align);
                 }
                 var uiButton:UIButton = new UIButton(layoutXML.@name, _context, upTexture, downTexture, textFormat, null, hoverTexture);
                 root.addChild(uiButton);
                 treeDictionary[uiButton.name] = uiButton;
                 buttonControl = uiButton;*/
            }

            var button = new GUIBuilderButton(this._game,hoverSprite,upSprite, downSprite, null);
            //}

            container.addChild(button);
            treeDictionary[json.name] = button;

            button.x = json.x * this._currentScaleFactor;
            button.y = json.y *this. _currentScaleFactor;
            button.width = json.width*this._currentScaleFactor;
            button.height = json.height*this._currentScaleFactor;
            button.rotation = json.rotation;
            break;
        }

    }

};

module.exports = GUIBuilder;