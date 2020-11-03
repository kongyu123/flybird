var Bird = require('Bird');

cc.Class({
    extends: cc.Component,

    properties: {
        /** 遮罩节点 */
        maskLayer: {
            default: null,
            type: cc.Node
        },
        /** 准备开始菜单节点 */
        readyMenu: {
            default: null,
            type: cc.Node
        },
        /** 小鸟组件 */
        bird: Bird,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._revealScene();
        this._enableInput(true);
        this.bird.init(this);
    },
    _revealScene() {
        this.maskLayer.active = true;
        this.maskLayer.color = cc.Color.BLACK;
        this.maskLayer.runAction(cc.fadeOut(0.3));
    },
    start() {

    },
    _enableInput(enable) {
        if (enable) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
        } else {
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            this.node.off(cc.Node.EventType.TOUCH_START, this.onTouch, this);
        }
    },
    onKeyDown() {
        this._startGameOrJumpBird();
    },

    onTouch() {
        this._startGameOrJumpBird();
        return true;
    },
    _hideReadyMenu() {
        this.readyMenu.runAction(
            cc.sequence(
                cc.fadeOut(0.5),
                cc.callFunc(() => {
                    this.readyMenu.active = false;
                }, this)
            )
        );
    },
    //开始或者飞行
    _startGameOrJumpBird() {
        //如果是准备状态则运行开始游戏，否则继续飞行
        if (this.bird.state == Bird.State.Ready) {
            this._gameStart();
        } else {
            this.bird.rise();//继续飞行
        }
    },
    //游戏开始
    _gameStart() {
        this._hideReadyMenu();//隐藏menu
        this.bird.startFly();//开始飞行
    },
    // update (dt) {},
});
