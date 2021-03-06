import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from 'material-ui/Avatar';
import PersonIcon from 'material-ui/svg-icons/social/person';

import FullScreen from './FullScreen';
import Overlay from './Overlay';

const ContentWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
  z-index: 1;
`
const Center = styled.div`
  position: relative;
  max-width: 1600px;
  margin: auto;
  padding: 40px 0;
  height: 100%;
  box-sizing: border-box;
`

const Content = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 100%;
`

const BackgroundImage = styled.div`
  background: url(${props => props.src}) no-repeat center center fixed;
  background-size: cover;
  height: 100%;
  overflow: hidden;
`

const AvatarWrapper = styled.div`
cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  a {
    text-decoration: none;
  }
  img {
    box-shadow: rgba(255, 255, 255, 0.2) 0 0 10px 2px;
  }
`

const Relative = styled.div`
  position: relative;
`

const Sticky = styled.div`
  position: fixed;
`
const UserName = styled.p`
  font-size: 24px;
  height: 27px;
  text-align: center;
  color: #fafafa;
`

function renderAvatar (user) {
    const props = user
        ? { src: user.image }
        : {
            icon:
                <PersonIcon />
        }

    return <Avatar size={160} {...props} />
}

function fullName (user) {
    return user ? `${user.name} ${user.lastName}` : '请选择用户'
}

export default ({ children, user }) => (
    <FullScreen>
        <ContentWrapper>
            <Center>
                <Content>
                    <Relative>
                        <Sticky>
                            <AvatarWrapper>
                                <Link to="/user">
                                    {renderAvatar(user)}
                                </Link>
                                <UserName> {fullName(user)} </UserName>
                            </AvatarWrapper>
                        </Sticky>
                    </Relative>
                    {children}
                </Content>
            </Center>
        </ContentWrapper>
        <FullScreen>
            <BackgroundImage src="background.jpg" />
            <Overlay
                opacity={0.4}
                background="#212121"
            />
        </FullScreen>
    </FullScreen>
)
