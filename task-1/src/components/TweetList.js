import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import socketIOClient from "socket.io-client";
import CardComponent from './CardComponent';


class TweetList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], searchTerm: "trump" };

    this.search = this.search.bind(this);
  }


  search(e) {

    this.setState({ ...this.state, searchTerm: e.target.innerText })

    console.log(this.state.searchTerm);
    let term = this.state.searchTerm;
    fetch("/setSearchTerm",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ term })
      })
  }

  componentDidMount() {
    const socket = socketIOClient('http://localhost:3000/');

    socket.on('connect', () => {
      console.log("Socket Connected");
      socket.on("tweets", data => {
        console.info(data);
        let newList = [data].concat(this.state.items.slice(0, 15));
        this.setState({ items: newList });
      });
    });
    socket.on('disconnect', () => {
      socket.off("tweets")
      socket.removeAllListeners("tweets");
      console.log("Socket Disconnected");
    });
  }


  render() {
    let items = this.state.items;

    let itemsCards = <CSSTransitionGroup
      transitionName="example"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}>
      {
        items.map((x, i) =>
          <CardComponent key={i} data={x} />
        )
      }
    </CSSTransitionGroup >;

    let searchControls =
      <div style={{ margin: '30px' }}>
        {
          this.state.searchTerm === 'Donald Trump' ?
            <button onClick={this.search}>Hillary Clinton</button> :
            <button onClick={this.search}>Donald Trump</button>
        }
      </div>

    let filterControls = <div>
    </div>

    let controls = <div>
      {
        items.length > 0 ? filterControls : null
      }
    </div>

    let loading = <div>
      <p >Listening to Streams</p>
      <div >
        <div ></div>
      </div>
    </div>

    return (
      <div >
        <div >
          <div >
            {searchControls}
            {
              items.length > 0 ? controls : null
            }
          </div>
        </div>
        <div >
          <div>
            {
              items.length > 0 ? itemsCards : loading
            }

          </div>

        </div>
        <div >
        </div>
      </div>
    );
  }
}

const controlStyle = {
  marginRight: "5px"
};

export default TweetList;