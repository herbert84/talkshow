import React from 'react';
import styled from 'styled-components'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import SpeakerNotesIcon from 'material-ui/svg-icons/action/speaker-notes';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
//import Barrage from './bullet/Barrage';
import BulletScreen from './bullet/BulletScreen';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';

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
  color: #fafafa !important;
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
    position:absolute;
    top:82px;
    bottom:115px;
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

        this.onInput = this.onInput.bind(this)
        this.onSendMessage = this.onSendMessage.bind(this)
        this.onMessageReceived = this.onMessageReceived.bind(this)
        this.updateChatHistory = this.updateChatHistory.bind(this)
        this.switchDisplayMode = this.switchDisplayMode.bind(this)
        this.scrollChatToBottom = this.scrollChatToBottom.bind(this)
    }

    componentDidMount () {
        this.props.registerHandler(this.onMessageReceived)
        /*setInterval(() => {
            this.barrage.push({
                text: Math.random() * 1000 | 0
            })
        }, 1000 * 1);*/
        //this.scrollChatToBottom()
    }

    componentDidUpdate () {
        if (this.state.switchToChatList)
            this.scrollChatToBottom()
    }

    componentWillUnmount () {
        this.props.unregisterHandler()
    }

    onInput (e) {
        this.setState({
            input: e.target.value
        })
    }

    onSendMessage () {
        if (!this.state.input)
            return
        //let newMessage = JSON.parse(JSON.stringify(this.state.input));
        /*if (this.barrage) {
            this.barrage.push({
                text: newMessage
            });
        }*/

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
        if (this.barrage && entry.message) {
            this.barrage.push({
                text: entry.message
            });
        }
    }

    updateChatHistory (entry) {
        this.setState({ chatHistory: this.state.chatHistory.concat(entry) })
    }

    scrollChatToBottom () {
        this.panel.scrollTo(0, this.panel.scrollHeight)
    }
    switchDisplayMode () {
        this.setState({
            switchToChatList: !this.state.switchToChatList
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
            return <BulletScreen ref={r => this.barrage = r} width={1324} height={650} />
            //return <Barrage message={this.state.newMessage} onBulletStart={() => this.setState({ newMessage: "" })} />
        }
    }
    handleRequestClose () {
        this.setState({
            toggleNotification: false,
            errorMessage: ''
        })
    }
    render () {
        //console.log(this.state.chatHistory)
        return (
            <div style={{ position: 'absolute', left: '200px', height: '100%', width: '1124px' }}>
                <ChatWindow>
                    <Header>
                        <Title>
                            {this.props.chatroom.name}
                        </Title>
                        <div>
                            <RaisedButton
                                primary
                                icon={
                                    <SpeakerNotesIcon />
                                }
                                style={{ marginRight: '10px' }}
                                onClick={this.switchDisplayMode}
                            />
                            <RaisedButton
                                primary
                                icon={
                                    <ExitToApp />
                                }
                                onClick={this.props.onLeave}
                            />
                        </div>
                    </Header>
                    <ChatroomImage
                        src={this.props.chatroom.image}
                        alt=""
                    />
                    <ChatPanel>
                        {this.renderChatWindow()}

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
