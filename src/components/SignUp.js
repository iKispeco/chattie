function SignUp(props) {
  return (
    <div className="signup">
      <div className="signup-header">
        <h1>Welcome to Chattie</h1>
      </div>

      <form className="signup-form">
        <label htmlFor="signup">Enter your name and start chating: </label>
        <br />
        <input
          type="text"
          id="signup"
          className="signup-input"
          placeholder="example: MaxWarrior123"
          onChange={props.onUserChange}
        />
        <input
          type="submit"
          className="signup-submit"
          onClick={props.onSignup}
        />
      </form>
    </div>
  );
}

export default SignUp;
