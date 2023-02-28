import { useState } from "react";

function InputMessage(props) {
  const [text, setText] = useState("");

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setText("");
    props.onSendMessage(text);
  };

  return (
    <div>
      <form className="input-form" onSubmit={(e) => onSubmit(e)}>
        <input
          className="input-style"
          onChange={(e) => onChange(e)}
          value={text}
          type="text"
          placeholder="Enter your message and press ENTER"
          autoFocus={true}
        />
        <button className="input-send">Send</button>
        <button className="input-logout" onClick={props.onLogout}>
          Logout
        </button>
      </form>
    </div>
  );
}

export default InputMessage;
