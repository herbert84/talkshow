import React, { Component } from 'react';
import styled from 'styled-components';
import Anit from './Anit';

export default class BulletScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],       // 弹幕数据列表
            MAX: 100,        // 同屏最大弹幕数量
        }
    }

    push (obj) {
        obj = {
            id: Math.random(),
            vert: Math.random() * 620 + 30 | 0,
            ease: ['linear', 'ease', 'ease-in-out'][Math.random() * 3 | 0],
            obj,
        };

        let { list, MAX } = this.state;
        list = list.concat([obj]);

        // 控制数组的数量
        /*if (list.length > MAX) {
            list = list.slice(list.length - MAX, list.length);
        }*/
        console.log(list)
        this.setState({ list });
    }

    render () {
        const { barrage, list } = this.state;
        const { width, height } = this.props;

        return (
            <Panel>
                {list.map((bar, index) => (
                    <Anit
                        key={`barrage-${bar.id}`}
                        //start={-30 * (bar.text + '').length}
                        start={width}
                        //end={width + 30}
                        end={-30 * (bar.obj.text + '').length}
                        // y 轴位置
                        vert={bar.vert}
                        // 持续时间
                        timeout={15000}
                        // 随机缓动系数
                        ease={bar.ease}
                    >
                        {bar.obj.text}
                    </Anit>
                ))}
            </Panel>
        );
    }
}

const Panel = styled.div`
    position: absolute;
    overflow: hidden;
    top: 82px;
    left: 0;
    right: 0;
    bottom: 115px;
    background-color: rgba(1, 1, 1, 0.35);
`;