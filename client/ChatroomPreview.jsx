import React from 'react';
import styled from 'styled-components'
import Paper from 'material-ui/Paper';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';


const Wrapper = styled.div`
  cursor: pointer;
`

export default ({ chatroom, onEnter }) => (
    <Paper
        style={{ maxWidth: 600, marginBottom: 40 }}
        zDepth={5}
    >
        <Wrapper onClick={onEnter}>
            <Card>
                <CardMedia
                    overlay={
                        <CardTitle
                            title={chatroom.name}
                            subtitle={chatroom.date}
                        />
                    }
                >
                    <img height="100%" src={chatroom.image} alt="" />
                </CardMedia>
                <CardText>
                    {chatroom.topic}
                </CardText>
            </Card>
        </Wrapper>
    </Paper>
)
