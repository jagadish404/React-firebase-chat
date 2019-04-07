import React, { Component } from 'react';
import firebase from 'firebase';
import '../css/index.css';
import Logo from '../img/logo.png';

// Initialize Firebase
var config = {
  apiKey: APIKEY,
  authDomain: DOMAIN,
  databaseURL: URL,
  projectId: ID,
  storageBucket: BUCKET,
  messagingSenderId: SENDERID
};
firebase.initializeApp(config);

var chatRef = firebase.database().ref().child('chats');

export class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.scrollChatToBottom = this.scrollChatToBottom.bind(this);
    this.clearChat = this.clearChat.bind(this);
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

  handleSubmit() {
    const msg = this.inputMsg.value;
    const { userName } = this.state;

    if (msg.trim().length <= 0) return;
    chatRef.push().set({
      user: userName, text: msg, timestamp: new Date().getTime()
    });
    this.inputMsg.value = '';
  }

  scrollChatToBottom() {
    console.log(this.panel.scrollHeight);
    console.log(this.panel.clientHeight);
    setTimeout(() => {
      this.panel.scrollTo(0, 682);      
    }, 500);
  }

  render() {
    const { messages, userName } = this.state;

    return (
      <div className="App-wrapper">
        <div className="App-header">
          <img id="App-logo" src={Logo} alt="Logo" />
          <div className="user-name">
            Username: <b>{userName}</b>
          </div>
          <div className="input-group user-name-row">
            <input ref={el => this.inputUser = el} className="form-control" onKeyPress={this.handleOnKeyDown.bind(this, this.handleNameChange)} />
            <div className="input-group-append">
              <button className="btn btn-secondary" type="button" onClick={this.handleNameChange.bind(this)}>Change name</button>
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
        <div className="input-group App-footer mb-3">
          <input ref={el => this.inputMsg = el} className="form-control" onKeyPress={this.handleOnKeyDown.bind(this, this.handleSubmit)} />
          <div className="input-group-append">
            <button className="btn btn-success" type="button" onClick={this.handleSubmit}>Send</button>
            <button className="btn btn-danger" type="button" onClick={this.clearChat}>Clear</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

