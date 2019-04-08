import React, { Component } from 'react';
import { initializeApp, database } from 'firebase';
import '../css/index.css';

// Initialize Firebase
var config = {
  apiKey: APIKEY,
  authDomain: DOMAIN,
  databaseURL: URL,
  projectId: ID,
  storageBucket: BUCKET,
  messagingSenderId: SENDERID
};
initializeApp(config);

var chatRef = database().ref().child('chats');

export class App extends Component {
  constructor(props) {
    super(props);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.scrollChatToBottom = this.scrollChatToBottom.bind(this);
    this.clearChat = this.clearChat.bind(this);
    this.handleUserNameKeyDown = this.handleOnKeyDown.bind(this, this.handleNameChange);
    this.handleMessageNameKeyDown = this.handleOnKeyDown.bind(this, this.handleMessage);
    this.state = {
      messages: [],
      userName: 'Anonymous'
    };
  }

  componentWillMount() {
    chatRef.on('value', (snapshot) => {
      let messages = snapshot.val();

      if (messages !== null) {
        messages = Object.keys(messages).map(key => messages[key]);
      } else {
        messages = [];
      }
      this.setState({ messages });
    });
  }

  componentDidMount() {
    this.scrollChatToBottom();
  }

  componentDidUpdate() {
    this.scrollChatToBottom();    
  }

  clearChat() {
    chatRef.set(null);
    this.setState({ messages: [] });
  }

  handleOnKeyDown(callback, e) {
    if(e.key === 'Enter') {
      callback();
    }
  }

  handleNameChange() {
    const userName = this.inputUser.value;

    if (userName.trim().length <= 0) return;
    this.setState({userName});
    this.inputUser.value = '';
  }

  handleMessage() {
    const msg = this.inputMsg.value;
    const { userName } = this.state;

    if (msg.trim().length <= 0) return;
    chatRef.push().set({
      user: userName, text: msg, timestamp: new Date().getTime()
    });
    this.inputMsg.value = '';
  }

  scrollChatToBottom() {
    setTimeout(() => {
      this.panel.scrollTo(0, 682);      
    }, 500);
  }

  render() {
    const { messages, userName } = this.state;

    return (
      <div className="App-wrapper">
        <div className="App-header">
          <div className="grid">
            <div className="row">
              <div className="col-xs-9">
                <h2>React chat app</h2>
                <div className="input-group user-name-row">
                  <input
                    ref={el => this.inputUser = el}
                    className="form-control"
                    placeholder="Type your name"
                    onKeyPress={this.handleUserNameKeyDown}
                  />
                  <div className="input-group-btn">
                    <button className="btn btn-default" type="button" onClick={this.handleNameChange}>Change name</button>
                  </div>
                </div>
              </div>
              <div className="col-xs-3">
                <div className="user-name">
                  Username: <b>{userName}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="App-body">
          <ul id="messages" ref={el => this.panel = el}>
            {
              messages.map(message => <li key={message.timestamp}>{message.user}:{message.text}</li>)
            }
          </ul>
        </div>
        <div id="App-footer" className="input-group">
          <input
            ref={el => this.inputMsg = el}
            className="form-control"
            placeholder="Type your message"
            onKeyPress={this.handleMessageNameKeyDown}
          />
          <div className="input-group-btn">
            <button className="btn btn-default" type="button" onClick={this.handleMessage}>Send</button>
            <button className="btn btn-default" type="button" onClick={this.clearChat}>Clear</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

