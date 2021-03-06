import React from 'react';
import styled from 'styled-components'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import SpeakerNotesIcon from 'material-ui/svg-icons/action/list';
import ExitToApp from 'material-ui/svg-icons/navigation/arrow-back';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import Loader from './Loader'

import Overlay from './Overlay';

const ChatWindow = styled.div`
  position: absolute;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  float:left;
  height: 100%;
  width: 1324px;
  box-sizing: border-box;
`
const ChatPanel = styled.div`
  position: abs;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px ;
  z-index: 1;
  color: #fafafa !important;
  border-bottom: 1px solid;
`

const Title = styled.p`
  text-align: center;
  font-size: 24px;
`
const NoDots = styled.div`
  hr {
    visibility: hidden;
  }
`

const OutputText = styled.div`
  white-space: normal !important;
  word-break: break-all !important;
  overflow: initial !important;
  width: 100%;
  height: auto !important;
`

const InputPanel = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  align-self: center;
  border-top: 1px solid #fafafa;
  width:90%;
`

const ChatroomImage = styled.img`
  position: absolute;
  top: 0;
  width: 100%;
`

const Scrollable = styled.div`
    height:500px;
    width:100%;
    overflow: auto;
`

export default class Chatroom extends React.Component {
    constructor(props, context) {
        super(props, context)

        const { chatHistory } = props

        this.state = {
            chatHistory,
            input: '',
            switchToChatList: false,
            toggleNotification: false,
            errorMessage: ''
        }
        this.msgs = [];
        this.c_width = 1324;
        this.c_height = 650;
        this.myCanvas = React.createRef();
        this.onInput = this.onInput.bind(this)
        this.onSendMessage = this.onSendMessage.bind(this)
        this.onMessageReceived = this.onMessageReceived.bind(this)
        this.updateChatHistory = this.updateChatHistory.bind(this)
        this.switchDisplayMode = this.switchDisplayMode.bind(this)
        this.scrollChatToBottom = this.scrollChatToBottom.bind(this)
    }

    componentDidMount () {
        this.props.registerHandler(this.onMessageReceived)
        //循环擦写画布实现动画效果
        let _this = this;
        this.timer = setInterval(function () {
            let canvas = _this.myCanvas.current;
            if (canvas) {
                let ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, _this.c_width, _this.c_height);
                ctx.save();
                for (var i = 0; i < _this.msgs.length; i++) {
                    if (_this.msgs[i] != null) {
                        _this.handleDefault(_this.msgs[i]);

                    }
                }
            }
        }, 20)
    }

    componentWillUnmount () {
        this.props.unregisterHandler()
        let _this = this;
        clearInterval(_this.timer);
    }

    onInput (e) {
        this.setState({
            input: e.target.value
        })
    }

    onSendMessage () {
        if (!this.state.input)
            return

        this.props.onSendMessage(this.state.input, (err) => {
            if (err) {
                this.setState({
                    toggleNotification: true,
                    errorMessage: err
                })
                return console.error(err)
            }

            return this.setState({ input: '' })
        })
    }

    onMessageReceived (entry) {
        console.log('onMessageReceived:', entry)
        this.updateChatHistory(entry)
        var tempBarrage = new this.Barrage(entry.message);
        this.msgs.push(tempBarrage);
    }

    updateChatHistory (entry) {
        this.setState({ chatHistory: this.state.chatHistory.concat(entry) })
    }

    scrollChatToBottom () {
        this.panel.scrollTo(0, this.panel.scrollHeight)
    }
    switchDisplayMode () {
        let _this = this;
        this.setState({
            switchToChatList: true
        }, () => {
            setTimeout(() => {
                _this.scrollChatToBottom()
            }, 100)
        })
    }
    renderChatWindow () {
        if (this.state.switchToChatList) {
            return (<Scrollable innerRef={(panel) => { this.panel = panel; }}>
                <List>
                    {
                        this.state.chatHistory.map(
                            ({ user, message, event }, i) => [
                                <NoDots>
                                    <ListItem
                                        key={i}
                                        style={{ color: '#fafafa' }}
                                        leftAvatar={<Avatar src={user.image} />}
                                        primaryText={`${user.name} ${event || ''}`}
                                        secondaryText={
                                            message &&
                                            <OutputText>
                                                {message}
                                            </OutputText>
                                        }
                                    />
                                </NoDots>,
                                <Divider inset />
                            ]
                        )
                    }
                </List>
            </Scrollable>)
        } else {
            return <canvas ref={this.myCanvas} width="1324px" height="650px"></canvas>
        }
    }
    handleRequestClose () {
        this.setState({
            toggleNotification: false,
            errorMessage: ''
        })
    }
    closeHistory () {
        this.setState({
            switchToChatList: false
        })
    }
    //
    //弹幕功能部分代码
    //
    //弹幕对象
    Barrage (content) {
        this.content = content;
        this.color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
        this.speed = parseInt(Math.random() * 5);
        this.size = parseInt(Math.random() * (35 - 10 + 1) + 10, 0) + "px  Courier New";
        this.c_height = 650;
        this.height = parseInt(Math.random() * this.c_height) + 10;

    }
    //处理默认弹幕样式
    handleDefault (barrage) {
        let _this = this;
        let canvas = this.myCanvas.current;
        let ctx = canvas.getContext("2d");
        if (barrage.left == undefined || barrage.left == null) {
            barrage.left = _this.c_width;
        } else {
            if (barrage.left < -200) {
                barrage = null;
            } else {
                //barrage.move()
                barrage.left = barrage.left - barrage.speed;
                ctx.fillStyle = barrage.color;
                ctx.font = barrage.size;
                ctx.fillText(barrage.content, barrage.left, barrage.height)
                ctx.restore();
            }
        }
    }
    renderChatItemWithAvatar () {
        return <ListItem
            key={i}
            leftAvatar={<Avatar src={user.image} />}
            primaryText={`${user.name} ${event || ''}`}
            secondaryText={
                message &&
                <OutputText>
                    {message}
                </OutputText>
            }
        />
    }
    render () {
        const actions = [
            <FlatButton
                label="关闭"
                primary
                onClick={() => this.closeHistory()}
            />
        ]
        //console.log(this.state.chatHistory)
        return (
            <div style={{ position: 'absolute', left: '200px', height: '100%', width: '1124px' }}>
                <ChatWindow>
                    <Header>
                        <FlatButton
                            primary
                            icon={
                                <ExitToApp />
                            }
                            label="离开房间"
                            style={{ color: "white" }}
                            onClick={this.props.onLeave}
                        />
                        <Title>
                            {this.props.chatroom.name}
                        </Title>
                        <FlatButton
                            primary
                            icon={
                                <SpeakerNotesIcon />
                            }
                            label="查看历史"
                            secondary={true}
                            style={{ marginRight: '10px', color: "white" }}
                            onClick={this.switchDisplayMode}
                        />
                    </Header>
                    <ChatroomImage
                        src={this.props.chatroom.image}
                        alt=""
                    />
                    <ChatPanel>
                        <canvas ref={this.myCanvas} width="1324px" height="650px"></canvas>
                        <InputPanel>
                            <TextField
                                textareaStyle={{ color: '#fafafa' }}
                                hintStyle={{ color: '#fafafa' }}
                                floatingLabelStyle={{ color: '#fafafa', top: '18px' }}
                                hintText="请输入弹幕"
                                floatingLabelText="请输入弹幕"
                                style={{ width: '100%', height: '74px' }}
                                rows={4}
                                rowsMax={4}
                                onChange={this.onInput}
                                value={this.state.input}
                                inputStyle={{ color: '#fafafa' }}
                                onKeyPress={e => (e.key === 'Enter' ? this.onSendMessage() : null)}
                            />
                            <FloatingActionButton
                                onClick={this.onSendMessage}
                                style={{ marginLeft: 20 }}
                            >
                                <ChatIcon />
                            </FloatingActionButton>
                        </InputPanel>
                    </ChatPanel>
                    <Overlay
                        opacity={0.6}
                        background="#111111"
                    />
                </ChatWindow>
                <Dialog
                    title="弹幕历史"
                    actions={actions}
                    modal={false}
                    open={this.state.switchToChatList}
                    onRequestClose={() => this.closeHistory()}
                >
                    {
                        !this.state.chatHistory
                            ? <Loader />
                            : (
                                <Scrollable innerRef={(panel) => { this.panel = panel; }}>
                                    <List>
                                        {
                                            this.state.chatHistory.map(
                                                ({ user, message, event }, i) => {
                                                    if (message) {
                                                        return [
                                                            <NoDots>
                                                                <ListItem
                                                                    key={i}
                                                                    leftAvatar={<Avatar src={user.image} />}
                                                                    primaryText={
                                                                        message &&
                                                                        <OutputText>
                                                                            {message}
                                                                        </OutputText>
                                                                    }
                                                                />
                                                            </NoDots>,
                                                            <Divider inset />
                                                        ]
                                                    }
                                                }
                                            )
                                        }</List></Scrollable>
                            )
                    }
                </Dialog>
                <Snackbar
                    open={this.state.toggleNotification}
                    message={this.state.errorMessage}
                    autoHideDuration={2000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        )
    }
}
