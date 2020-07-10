import React from 'react';
//import initialSize from './flexiable';
//Mobile terminal adaptive
//initialSize(window, window['lib'] || (window['lib'] = {}));
const mBarrage = {
    position: 'absolute',
    top: '82px',
    bottom: '115px',
    width: '100%'
}
const colorConfig = {
    random: false,
    colorList: ['red', 'yellow', 'white']
}
export default class Barra extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bullets: []
        }
        this.myCanvas = React.createRef();
    }
    componentWillReceiveProps (newProps) {
        console.log(newProps);
        if (newProps.message !== "") {
            this.runBulletAnimation(newProps.message);
            this.props.onBulletStart();
        }
    }
    componentDidMount () {
        let _this = this;
        const {
            message
        } = _this.props;
    }

    runBulletAnimation (message) {
        let _this = this;
        //get color of all barrage
        let colorArr = _this.getColor(colorConfig);
        //get the initial left for all barrage
        let numArrL = _this.getLeft();
        //get the initial top for all barrage
        let numArrT = _this.getTop();
        // get speed of all barrage
        let speedArr = _this.getSpeed();
        let canvas = this.myCanvas.current;

        let width = canvas.width;
        let height = canvas.height;
        let ctx = canvas.getContext("2d");
        ctx.font = "20px Courier New";
        //_this.timer = setInterval(function () {

        function loop () {
            ctx.clearRect(0, 0, width, height);
            //ctx.save();
            //for (let j = 0; j < barrageList.length; j++) {
            numArrL -= speedArr;
            ctx.fillStyle = colorArr
            if (message)
                ctx.fillText(message, numArrL, numArrT);
            if (numArrL > -width) {
                requestAnimationFrame(loop)
                //clearInterval(_this.timer);
                //numArrL = canvas.width;
            }

        }
        loop();
        //}
        //ctx.restore();
        //}, 10);
    }
    getTop () {
        let _this = this;
        //let { barrageList } = this.props;
        let canvas = _this.myCanvas.current;
        let height = canvas.height;
        //let len = barrageList.length;
        //let arr = new Array(len).fill(1);
        let tagHeight = Math.random() * height;
        if (tagHeight < 0.2 * height) {
            return 0.2 * height
        }
        if (tagHeight > 0.8 * height) {
            return 0.8 * height
        }
        //console.log(tagHeight)
        return tagHeight
        /*return arr.map(function () {
            let tagHeight = Math.random() * height;
            if (tagHeight < 0.2 * height) {
                return 0.2 * height
            }
            if (tagHeight > 0.8 * height) {
                return 0.8 * height
            }
            //console.log(tagHeight)
            return tagHeight
        });*/
    }
    getLeft () {
        let canvas = this.myCanvas.current;
        let width = canvas.width;
        return width;
    }
    getColor (color) {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }
    getSpeed () {
        return parseInt(Math.random() * 5)
    }
    componentWillUnmount () {
        let _this = this;
        clearInterval(_this.timer);
    }
    render () {
        return <div style={mBarrage}>
            <canvas ref={this.myCanvas} width="1324px" height="650px"></canvas>
        </div>
    }
}