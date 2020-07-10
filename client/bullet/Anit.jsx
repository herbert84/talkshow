import React, { Component } from 'react';
import styled from 'styled-components';

export default class Anit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            x: this.props.start,
            ok: false,
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        return !this.state.ok;      // 初始化后就不更新了
    }

    componentDidMount () {
        setTimeout(() => {
            this.setState({ x: this.props.end, ok: true });
        }, 10);
    }
    getFontSize () {
        return parseInt(Math.random() * (35 - 10 + 1) + 10, 0);
    }
    getFontColor () {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }
    render () {
        const { x } = this.state;
        const { timeout, vert, ease = 'linear' } = this.props;
        let fontSize = this.getFontSize();
        let fontColor = this.getFontColor();
        return (
            <Panel
                timeout={timeout}   // 持续时间
                x={x}               // X 轴位置
                y={vert}            // Y 轴的位置
                ease={ease}         // 随机缓动系数
            >
                <span style={{ fontSize, color: fontColor }}>{this.props.children}</span>
            </Panel>
        );
    }
}

const Panel = styled.div`
    position: absolute;
    top: ${p => p.y || 0}px;
    left: 0px;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 2px 2px rgba(1, 1, 1, 0.32);
    transition: transform ${p => p.timeout}ms ${p => p.ease};
    transform: translate3d(${p => p.x}px, 0,0);
    display: flex;
    justify-content: center;
    align-items: center;
`;