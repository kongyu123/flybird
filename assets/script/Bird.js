const State = cc.Enum({
    // 游戏开始前的装备
    Ready: -1,
    // 小鸟上升中
    Rise: -1,
    // 小鸟自由落地
    FreeFall: -1,
    // 碰撞管道坠落
    Drop: -1,
    // 坠落地面静止
    Dead: -1,
})

cc.Class({
    extends: cc.Component,
    // 定义存储小鸟目前飞行状态的静态变量statics
    statics: {
        State: State
    },

    properties: {
        // 定义上抛初速度initRiseSpeed
        initRiseSpeed: 800,
        // 重力加速度gravity
        gravity: 1000,
        // 地面节点ground
        ground: {
            default: null,
            type: cc.Node

        },
        // 定义state来方便下面脚本代码对状态的引用
        state: {
            default: State.Ready,
            type: State
        }

    },



    // onLoad () {},

    start() {

    },
    // 定义初始化方法init()
    init(game) {
        this.game = game;
        this.state = State.Ready;
        //    初始化当前的速度
        this.currentSpeed = 0;
        // 对动画的引用 
        this.anim = this.getComponent(cc.Animation);
    },
    // 计算小鸟在每一帧的位置、速度、运动状态
    update(dt) {
        if (this.state == State.Ready || this.state.Dead) {
            return;
        }
        // 创建updatePosition方法用来计算位置
        this.updatePosition(dt);
        this.updateState(dt);

    },
    updatePosition(dt) {
        // 判断小鸟是否处于飞行状态
        var flying = this.state === State.Rise || this.state === State.FreeFall || this.state === State.Drop;
        // 如果处于飞行状态
        if (flying) {
            var h = cc.director.getVisibleSize().height / 2;
            if (this.node.y > h) {
                // 当小鸟的高度超过上边时，让小鸟的位置和速度降下来
                this.node.y = h - 1;
                this.currentSpeed = -1;

            } else {
                // 根据预先设计好的重力计算当前的速度
                this.currentSpeed -= dt * this.gravity;
                // 根据计算出来的y轴速度，计算当前小鸟的位置
                this.node.y += dt * this.currentSpeed;
            }

        }
    },
    updateState(dt) {
        switch (this.state) {
            case State.Rise:
                // 当当前状态是飞起的时候，如果速度小于0了，则转换为自由下落状态
                if (this.currentSpeed < 0) {
                    this.state = State.FreeFall;
                    this.runFallAction();
                }
                break;
        }
    },
    // 起飞函数
    rise() {
        this.state = State.Rise;
        this.runRiseAction();
        this.currentSpeed = this.initRiseSpeed;
    },
    // 开始起飞
    startFly() {
        this.anim.stop("birdFlapping");
        this.rise();
    },
    // 仰头
    runRiseAction() {
        
        this.node.stopAllActions();
        let jumpAction = cc.rotateTo(0.3, -30).easing(cc.easeCubicActionOut());
        this.node.runAction(jumpAction);
    },
    // 低头
    runFallAction(duration = 0.6) {
        this.node.stopAllActions();
        let dropAction = cc.rotateTo(duration, 90).easing(cc.easeCubicActionIn());
        this.node.runAction(dropAction);
    },
    // 小鸟碰撞管道时，坠落的角速度偏移
    runDropAction() {
        if (this.currentSpeed >= 0) {
            this.currentSpeed = 0;
        }
        this.runFallAction(0.4);
    }
});
