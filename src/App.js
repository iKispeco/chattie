import React, { Component } from "react";
import "./App.css";
import ShowMessages from "./components/ShowMessages";
import InputMessage from "./components/InputMessage";
import SignUp from "./components/SignUp";
import { randomColor } from "./services/usernameAndColor";

class App extends Component {
  state = {
    members: [],
    messages: [],
    member: {
      username: null,
      color: randomColor(),
    },
    user: "",
    isLoggedIn: false,
  };

  // METODA KOJA SPREMA U STANJE UNOS KORISNIČKOG IMENA
  onUserChange = (event) => {
    this.setState({ user: event.target.value });
  };

  //METODA KOJA SE PROSLIJEDI KAO PROP KOMPONENTI InputMessage
  //PROVJERAVA JE LI POLJE ZA UNOS KORISNIČKOG IMENA PRAZNO I JEL SADRŽI SAMO ALFANUMERIČKE OZNAKE
  //RADI UPDATE STANJA KOMPONENTE, AKO JE SVE TOČNO, POZIVA METODE ZA SPAJANJE NA SCALEDRONE SERVICE
  onSignupAction = () => {
    const regExp = /^[a-zA-Z0-9_ ]+$/;
    const name = this.state.user;

    if (name.length !== 0) {
      if (regExp.test(name)) {
        const updatedMember = {
          ...this.state.member,
          username: name,
        };

        //DRUGI ARGUMENT U SETSTATE-U RADI POZIV CALLBACK FUNKCIJE KOJE OKIDA NA PROMJENU STANJA
        //CALLBACK FUNKCIJA RADI NOVU SCALEDRONE INSTANCU
        this.setState({ member: updatedMember }, () => {
          this.drone = new window.Scaledrone("Fg6iFxkYGwiPwsHs", {
            data: this.state.member,
          });

          //LISTENER KOD OTVARANJA NOVOG KANALA
          this.drone.on("open", (error) => {
            if (error) {
              return console.error(error);
            }
            const member = { ...this.state.member };
            member.id = this.drone.clientId;
            this.setState({ member });
          });

          //SUBSCRIBE NA SOBU, SVI KORISNICI U OVOJ SOBI MOGU VIDJETI MEĐUSOBNO PORUKE
          const room = this.drone.subscribe("observable-chattie-room");
          room.on("data", (data, member) => {
            const messages = this.state.messages;
            messages.push({ member, text: data });
            this.setState({ messages });
            console.log(member);
          });

          //LISTENERI TKO DOLAZI I ODLAZI IZ KAKO BI SE PRATIO BROJ KORISNIKA
          room.on("members", (m) => {
            this.setState({ members: m });
          });
          room.on("member_join", (member) => {
            this.setState({ members: [...this.state.members, member] });
          });
          room.on("member_leave", ({ id }) => {
            const membersArray = this.state.members;
            const index = membersArray.findIndex((member) => member.id === id);
            membersArray.splice(index, 1);
            this.setState({ members: membersArray });
          });
        });
        this.setState({ isLoggedIn: true });
      } else {
        alert("Please use only alphabet letters and numbers!");
      }
    } else {
      alert("Please enter your name.");
    }
  };

  //METODA KOJA SE DAJE KAO PROP KOMPONENTI InputMessage
  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-chattie-room",
      message,
    });
  };

  //METODA SE DAJE KAO PROP KOMPONENTI InputMessage
  //METODA KOJA RADI ODJAVU KORISNIKA IZ SOBE
  onLogout = () => {
    this.drone.unsubscribe("observable-chattie-room");
    this.setState({ isLoggedIn: false });
  };

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <SignUp
          onUserChange={this.onUserChange}
          onSignup={this.onSignupAction}
        />
      );
    } else {
      return (
        <div className="App">
          <div className="App-header">
            <h1>Chattie room</h1>
            <span>
              Number of users in the room: {this.state.members.length}
            </span>
            <div>
              Users on-line:{" "}
              {this.state.members.map((user) => user.clientData.username + " ")}
            </div>
          </div>
          <ShowMessages
            messages={this.state.messages}
            currentMember={this.state.member}
          />
          <InputMessage
            onSendMessage={this.onSendMessage}
            onLogout={this.onLogout}
          />
        </div>
      );
    }
  }
}

export default App;
