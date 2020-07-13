import React from 'react';

const mBarrage = {
    position: 'absolute',
    top: '82px',
    bottom: '115px',
    width: '100%'
}
export default class BarrageBullet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bullets: []
        }
        this.myCanvas = React.createRef();
        this.left = 1324;
        this.height = 650;
        this.speed = 1;
    }
    move () {
        //if (this.type == "default") {
        this.left = this.left - this.speed;
        //}
    }
    //处理默认弹幕样式
    handleDefault () {
        let _this = this;
        let canvas = this.myCanvas.current;
        let ctx = canvas.getContext("2d");
        if (_this.left == undefined || _this.left == null) {
            _this.left = _this.width;
        } else {
            if (_this.left < -200) {
                //barrage = null;
            } else {
                _this.move()
                ctx.fillStyle = _this.props.color;
                ctx.fillText(barrage.content, _this.left, _this.height)
                ctx.restore();
            }
        }
    }

    //处理静止弹幕样式
    handleStatic () {
        let _this = this;
        let canvas = this.myCanvas.current;
        let ctx = canvas.getContext("2d");
        ctx.moveTo(_this.width / 2, _this.height);
        ctx.textAlign = "center";
        ctx.fillStyle = _this.props.color;
        ctx.fillText(this.message, c_width / 2, _this.height);
        if (_this.left == undefined || _this.left == null) {
            _this.left = _this.width;
        } else {
            if (_this.left < -200) {
                ctx.fillText("", _this.width / 2, _this.height);
                //barrage = null;
                //ctx.restore();
                ctx.clearRect(0, 0, _this.width, c_height);
            } else {
                _this.left = _this.left - 6;
            }
        }
    }
    render () {
        return <div style={mBarrage}>
            <canvas ref={this.myCanvas} width="1324px" height="650px"></canvas>
        </div>
    }
}