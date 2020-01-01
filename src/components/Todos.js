import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Alert from './Alert'

import trash from '../images/trash.png';
import tick from '../images/play.png'
import tickDown from '../images/play-down.png'

class Todos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      app: {
        isLogged: this.props.state.isLogged,
        username: this.props.state.username,
        token: this.props.state.token,
        urlApi: this.props.state.urlApi
      },
      todoId: null,
      todos: [],
      dates: [],
      libelle: "",
      tick: null,
      deleteId: null,
      loading: true,
      error: false,
    };
    this.textInput = React.createRef();
  }

  componentDidMount() {
    fetch(this.state.app.urlApi + '/todo/getall', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.app.token
      }
    })
    .then(res => res.json())
    .then((result) => {
      //console.log(result);
      if(result.error === false) {
        this.handleFetchResult(result.todos);
        console.log('success')
      } else {
        this.setState({
          error: true,
          loading: false,
        });
      }
    }, (error) => {
        this.setState({
          error: true,
          loading: false
        });
        console.log(error)
      }
    )
  }

  componentDidUpdate() {
    Alert("");
  }

  handleFetchResult = (newTodos) => {
    let dates = [];
    newTodos.map((todo, index) => {
      if(!dates.includes(todo.date)) {
        dates[index] = todo.date;
      } else {
        dates[index] = "";
      }
      return true;
    });
    
    this.setState({
      libelle: "",
      deleteId: null,
      todos: newTodos,
      dates: dates,
      error: false,
      loading: false
    });
  }

  createNewTodo = () => {
    const libelle = this.state.libelle;
    if(libelle.replace(/\s+/g, "") !== "")
    {
      this.setState({loading: true}, () => {
        fetch(this.state.app.urlApi + '/todo/newtodo', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.state.app.token
          },
          body: JSON.stringify({libelle: libelle})
         })
          .then(res => res.json())
          .then((result) => {
            if(result.error === false) {
              //console.log(result)
              const newTodos = [result.todo].concat(this.state.todos)
              this.handleFetchResult(newTodos);
            } else {
              this.setState({
                error: true,
                loading: false,
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
      });
    } else {
        Alert("please fill a name for your to do list");
        this.textInput.current.focus();
    }
  }

  deleteTodo = (id) => {
    fetch(this.state.app.urlApi + '/todo/deletetodo', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.app.token
      },
      body: JSON.stringify({id: id})
    })
      .then(res => res.json())
      .then((result) => {
        //console.log(result)
        if(result.error === false) {
          this.setState({
            loading: false,
            error: false
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

  updateList = (todoId, list) => {
    fetch(this.state.app.urlApi + '/todo/updatelist', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.app.token
      },
      body: JSON.stringify({todoId: todoId, list: list})
    })
      .then(res => res.json())
      .then((result) => {
        //console.log(result)
        if(result.error !== true) {
          let newTodos = this.state.todos;
          newTodos.map((todo) => {
            if(todo.id === todoId) {
              todo.date = result.todo.date;
              todo.hour = result.todo.hour;
              todo.closed = result.todo.closed;
            };
            return true;
          });
          this.handleFetchResult(newTodos);
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

  handleChange = (e) => {
    const [index, value] = [e.target.name, e.target.value]
    this.setState(() => ({
      [index]: value
    }));
  }

  handleKey = (e) => {
    if (e.key === 'Enter') {
      this.createNewTodo();
    }
  }

  handleCheck = (todoId, lineIndex) => {
    let newTodos = this.state.todos;
    let newList;
    newTodos.map((todo) => {
      if(todo.id === todoId) {
        todo.list[lineIndex].checked = !todo.list[lineIndex].checked;
        todo.date = "";
        todo.hour = '--:--';
        newList = todo.list;
      };
      return true;
    });
    
    this.setState({
      todos: newTodos
    }, this.updateList(todoId, newList));
  }

  handleTrash = () => {
    const [newTodos, deleteId] = [
      this.state.todos, 
      this.state.deleteId
    ];

    if(deleteId !== null)
    {
      newTodos.map((todo, index) => {
        if(todo.id === deleteId) {
          newTodos.splice(index, 1);
        }
        return true;
      });
    }
    
    this.deleteTodo(deleteId);
    this.handleFetchResult(newTodos);
    document.getElementById('modal').style.display = 'none';
  }

  handleTick = (id) => {
    this.setState({
      tick: this.state.tick === id ? null : id
    })
  }

  handleModal = (bool, id) => {
    if(bool) {
      document.getElementById('modal').style.display = 'flex';
      this.setState({deleteId: id})
    } else {
      document.getElementById('modal').style.display = 'none';
      this.setState({deleteId: null})
    }
  }


  render() {
    const styleLoad = this.state.loading ? {position: 'relative', top: '0'} : {};
    const connexion = this.state.error ? 'offline' : this.state.modify;

    const styleTaunt = {textDecorationLine: 'line-through'};
    const styleClosed = {color: 'grey', fontStyle: 'oblique'};

    return (
      <div className="todo" style={styleLoad}>
        <div className="t-lists">
          <h4 className="title">To do lists</h4>
          <p className="modify">{this.state.loading ? 'loading' : connexion}</p>
          <div className="list-container">
            { !this.state.loading ? 
              <div>
                { !(this.state.todos).length 
                  ? 
                  <div className="t-list d-flex justify-content-center align-item-center pt-5">
                    Nothing yet...
                  </div>
                  : 
                  this.state.todos.map(
                    (todo, index) => 
                    <div key={index}>
                      <div className="t-date" style={!this.state.dates[index] ? {paddingTop: '0'} : {}}>{this.state.dates[index]}</div>
                      <div className="t-list row">
                        <div className="col-1 col-sm-1 pl-1" onClick={this.handleTick.bind(null, todo.id)}>
                          <img src={this.state.tick === todo.id ? tickDown : tick} className="t-tick" alt="tick" />
                        </div>
                        <div className="t-libelle col-8 col-sm-8 pl-1">
                          <Link to={{pathname: '/todo', app: this.state.app, todo: todo}}>
                            <p style={ todo.closed ? styleClosed : {}}>{todo.libelle}</p>
                          </Link>
                        </div>
                        <div className="t-hour">{todo.hour}</div>
                        <div className="col-1 col-sm-1" onClick={this.handleModal.bind(null, true, todo.id)}>
                          <img className="t-trash" src={trash} alt="trash" />
                        </div>
                      </div>
                      { this.state.tick === todo.id 
                        ? 
                        todo.list.length 
                          ? 
                          todo.list.map(
                            (line, index) =>
                            <label key={index} className="row">
                              <div className="t-list-name col-1 col-sm-1">
                                <input className="check" 
                                  type="checkbox" 
                                  checked={line.checked || false} 
                                  onChange={this.handleCheck.bind(null, todo.id, index)} 
                                />
                              </div>
                              <div className="col-10 col-sm-10">
                                <p className="t-list-name" style={line.checked ? styleTaunt : {}}>{line.name}</p>
                              </div> 
                            </label>
                          )
                          : 
                          <div className="row">
                            <div className="col-10">
                              <span className="t-list-name">Nothing here...</span>
                            </div> 
                          </div>
                        : false
                      }
                    </div>
                  )
                }
              </div>
              : false 
            }
            <div className="footer-list">
              
              <div className="alert">{/* message */}</div>
              <div className="row">
                <div className="input-libelle">
                  <input
                    className="form-control form-control-sm"
                    name="libelle" 
                    type="text" 
                    autoComplete="off" 
                    value={this.state.libelle} 
                    onChange={this.handleChange} 
                    onKeyDown={this.handleKey} 
                    placeholder="To do ..." 
                    ref={this.textInput}
                  />
                </div>
                <div className="new-libelle">
                  <input 
                    className="btn btn-sm btn-secondary"
                    type="submit" 
                    name="new" 
                    value="New" 
                    onClick={this.createNewTodo} 
                  />
                </div>
              </div>

              <div className="modal" id="modal">
                <div className="modal-body">
                  <div className="row amount-valid">
                    <div className="undo">
                      <button 
                        className="btn btn-sm btn-info" 
                        onClick={this.handleModal.bind(null, false)}>Cancel
                      </button>
                    </div>
                    <div className="pay">
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={this.handleTrash}>Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
          </div>
        </div>
      </div>
    )
  }
}

export default Todos;
