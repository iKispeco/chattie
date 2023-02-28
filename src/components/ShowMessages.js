import { Component } from "react";
import React from "react";

class ShowMessages extends Component {
  renderMessage(message) {
    const { member, text } = message;
    const { currentMember } = this.props;
    const messageFromMe = member.id === currentMember.id;
    const className = messageFromMe
      ? "Messages-message currentMember"
      : "Messages-message";
    const avatarIcon = `https://robohash.org/${
      currentMember.username + member.id
    }`;
    return (
      <li className={className} key={Math.random() * 1000}>
        <span
          className="avatar"
          style={{ backgroundColor: member.clientData.color }}
        >
          <img src={avatarIcon} alt="avatar-icon" className="icon" />
        </span>
        <div className="Message-content">
          <div className="username">{member.clientData.username}</div>
          <div className="text">{text}</div>
        </div>
      </li>
    );
  }

  render() {
    const { messages } = this.props;
    return (
      <ul className="Messages-list">
        {messages.map((m) => this.renderMessage(m))}
      </ul>
    );
  }
}

export default ShowMessages;
