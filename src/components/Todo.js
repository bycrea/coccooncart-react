import React, { Component } from 'react';
import Alert from './Alert'
import $ from 'jquery';

import NavBack from './NavBack';

import trash from '../images/trash.png';
import hideMenu from '../images/up-arrow.png'
import showMenu from '../images/down-arrow.png'
import tickDown from '../images/play-down.png'

class Todo extends Component {
  constructor(props) {
    super(props);

    if(this.props.location.todo) {
      // console.log(this.props.location.todo)
    } else {
      window.location = "/todos";
    }

    this.state = {
      app: this.props.location.app,
      id: this.props.location.todo.id,
      libelle: this.props.location.todo.libelle,
      list: this.props.location.todo.list,
      modifyAt: this.props.location.todo.modifyAt,
      closed: this.props.location.todo.closed,
      line: "",
      inTrash: [],
      loading: false,
      error: false,
    };
    this.textInput = React.createRef();
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    Alert("");
    if($('.input-todo input').is(':focus') && !this.state.focus) {
      this.setState({
        focus: true,
      });
    }
  }

  updateList = (list) => {
    fetch(this.state.app.urlApi + '/todo/updatelist', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.app.token
      },
      body: JSON.stringify({todoId: this.state.id, list: list})
    })
      .then(res => res.json())
      .then((result) => {
        //console.log(result)
        if(result.error === false) {
          this.setState({
            list: result.todo.list,
            modifyAt: result.todo.modifyAt,
            closed: result.todo.closed,
            loading: false
          });
        } else {
          this.setState({
            error: true,
            loading: false
          });
        }
      }, (error) => {
        console.log(error)
        this.setState({
          error: true,
          loading: false
        });
      }
    )
  }

  closeTodo = (list) => {
    fetch(this.state.app.urlApi + '/todo/closetodo', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.app.token
      },
      body: JSON.stringify({todoId: this.state.id, list: list})
    })
      .then(res => res.json())
      .then((result) => {
        // console.log(result)
        if(result.error === false) {
          this.setState({
            list: result.todo.list,
            modifyAt: result.todo.modifyAt,
            closed: result.todo.closed,
            loading: false
          });
        } else {
          this.setState({
            error: true,
            loading: false
          });
        }
      }, (error) => {
        console.log(error)
        this.setState({
          error: true,
          loading: false
        });
      }
    )
  }

  handleAddLine = () => {
    if((this.state.line).replace(/\s+/g, "") !== "") {
      const addLine = {name: this.state.line, checked: false};
      const newList = [addLine].concat(this.state.list);
      
      this.setState({
        line: "",
        list: newList,
        loading: true
      }, this.updateList(newList));
      this.textInput.current.focus();
    } else {
        Alert("please fill a line name");
        this.textInput.current.focus();
        // $('.input-product input').focus();
    }
  }

  handleChange = (e) => {
    const [index, value] = [e.target.name, e.target.value]
    this.setState({
      [index]: value
    });
  }

  handleKey = (e) => {
    if(e.key === 'Enter') {
      this.handleAddLine();
    }
  }

  handleCheck = (e) => {
    const [index, list] = [e.target.value, this.state.list];
    list[index].checked = !list[index].checked

    this.setState({
      list: list,
      loading: true
    }, this.updateList(list));
  }

  handleTrash = (e) => {
    const [index, list] = [e.target.value, this.state.list];
    const addToTrash = list[index];
    list.splice(index, 1);

    this.setState((prevState) => ({
      list: list,
      inTrash: [addToTrash].concat(prevState.inTrash),
      loading: true
    }), this.updateList(list));
  }

  handleMenu = () => {
    this.setState((prevState) => 
      ({menu: !prevState.menu}), () => {
        document.getElementById('menu').style.display = this.state.menu ? 'flex' : 'none';
      });
  }

  handleUndo = () => {
    if(this.state.inTrash.length > 0) 
    { 
      const [fromTrash, trash, list] = [this.state.inTrash[0], this.state.inTrash, this.state.list];
      trash.splice(0, 1);
      const newList = [fromTrash].concat(list);
      this.setState({
        list: newList,
        inTrash: trash,
        loading: true
      }, this.updateList(newList));
    }
  }

  handledone = () => {
    const [reverse, newList] = [!this.state.closed, this.state.list];
    newList.forEach(e => {
      e.checked = reverse;
    });

    this.setState({
      list: newList,
      closed: reverse
    }, () => {
      if(reverse) {
        this.closeTodo(newList)
      } else {
        this.updateList(newList)
      }
    });
  }


  render() {
    const height = this.state.app.isLogged ? {height: '100vh'} : {height: '0'};
    const connexion = this.state.error ? 'offline' : this.state.modifyAt;
    const styleTaunt = {textDecorationLine: 'line-through'};

    return (
      <div className="app container container-fluid" style={height}>
        <NavBack path="/todos"/>
        <div className="cart">
          <h4 className="title">{this.state.libelle}</h4>
          <p className="modify">{this.state.loading ? 'loading' : connexion}</p>
          <div className="list-container">
            <div className="list">

              { (this.state.list).length 
                ?
                <div className="container">
                  <div className="row">
                    <div className="col col-1 col-sm-1 pl-1">
                      <img src={tickDown} className="t-tick" alt="tick" />
                    </div>
                    <div className="col-10 col-sm-10"><hr/></div>
                  </div>
                  { this.state.list.map(
                    (t, index) => 
                    <div key={index} className="row p-list pb-2">
                      <div className="col col-11 col-sm-11">
                        <label className="p-list-name">
                          <input className="t-check" 
                            type="checkbox" 
                            checked={t.checked || false} 
                            value={index} 
                            onChange={this.handleCheck} 
                          />
                          <span style={t.checked ? styleTaunt : {}}>{t.name}</span> 
                        </label>
                      </div>
                      <div className="col col-1 col-sm-1">
                        <label className="p-list-trash">
                            <img className="p-trash" src={trash} alt="trash" /> 
                            <input hidden 
                                className="form-check"
                                type="checkbox" 
                                value={index} 
                                onChange={this.handleTrash} 
                            />
                        </label>
                      </div> 
                    </div>
                  )}
                </div>
                :
                <div className="t-list d-flex justify-content-center align-item-center pt-5">
                  Nothing yet...
                </div>
              }  
              
            </div>
          </div>  

          <div className="footer-list">
            
            <div className="alert">{/* message */}</div>
            <div className="row">
              <div className="input-product">
                <input
                  className="form-control form-control-sm"
                  name="line" 
                  type="text" 
                  autoComplete="off" 
                  value={this.state.line} 
                  onChange={this.handleChange} 
                  onKeyDown={this.handleKey} 
                  placeholder={'Add new line'} 
                  ref={this.textInput}
                />
              </div>
              <div className="add-product">
                <input 
                  className="btn btn-sm btn-secondary"
                  type="submit" 
                  name="add" 
                  value="Add" 
                  onClick={this.handleAddLine} 
                />
              </div>
              <div className="btn-menu">
                <button className="btn btn-sm btn-secondary" onClick={this.handleMenu}>
                  { this.state.menu 
                    ? <img src={showMenu} className="img-menu" alt="menu" />
                    : <img src={hideMenu} className="img-menu" alt="menu" />
                  }
                </button>
              </div>
            </div>

            <div className="row menu" id="menu">
              <div className="t-undo">
                <button className="btn btn-sm btn-secondary" 
                  disabled={this.state.inTrash.length === 0} 
                  onClick={this.handleUndo}
                  >Undo
                </button>
              </div>
              <div className="t-done">
                <button className="btn btn-sm btn-warning" 
                  onClick={this.handledone}
                  >{ this.state.closed ? 'Reset' : 'Done' }
                </button>
              </div>
            </div>
              
          </div>

        </div>
      </div>
    )
  }
}

export default Todo;