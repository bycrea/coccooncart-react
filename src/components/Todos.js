import React, { Component } from 'react';
import Todo from '../components/Todo';
import $ from 'jquery';

import trash from '../images/trash.png';
import tick from '../images/play.png'
import tickDown from '../images/play-down.png'

class Todos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogged: this.props.state.isLogged,
      username: this.props.state.username,
      token: this.props.state.token,
      urlApi: this.props.state.urlApi,
      todoId: null,
      todos: [],
      dates: [],
      libelle: "",
      modify: "",
      tick: null,
      inTrash: [],
      focus: false,
      menu: false,
      loading: true,
      error: false,
    };
    this.textInput = React.createRef();
  }

  componentDidMount() {
    fetch(this.state.urlApi + '/todo/getall', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      }
    })
    .then(res => res.json())
    .then((result) => {
      console.log(result);
      if(result.error === false) {
        let dates = [];
        for (let [i, e] of Object.entries(result.todos)) {
          if(!dates.includes(e.date)) {
            dates[i] = e.date;
          } else {
            dates[i] = "";
          }
        }
        this.setState({
          todos: result.todos || [],
          dates: dates,
          error: false,
          loading: false,
        });
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
      this.handleAlert("");
      if($('.input-product input').is(':focus') && !this.state.focus) {
        this.setState({
            focus: true
        });
      }
  }

  // updateProduct(product, action = 'add') {
  //   fetch(this.state.urlApi + '/cart/updateProduct', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': 'Bearer ' + this.state.token
  //     },
  //     body: JSON.stringify({
  //       listId: this.state.listId, 
  //       product: product,
  //       action: action
  //     })
  //    })
  //     .then(res => res.json())
  //     .then((result) => {
  //       //console.log(result)
  //       if(result.error === false) {
  //         this.setState({
  //           loading: false,
  //           list: result.list,
  //           listId: result.listId,
  //           modify: result.modify,
  //           error: false
  //         });
  //       } else {
  //         this.setState({
  //           error: true,
  //           loading: false
  //         });
  //       }
  //     }, (error) => {
  //       console.log(error)
  //       this.setState({
  //         error: true,
  //         loading: false
  //       });
  //     }
  //   )
  // }

  // closeList(amount) {
  //   this.setState({ loading: true });
  //   fetch(this.state.urlApi + '/cart/closelist', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': 'Bearer ' + this.state.token
  //     },
  //     body: JSON.stringify({
  //       listId: this.state.listId, 
  //       list: this.state.list, 
  //       amount: amount
  //     })
  //    })
  //     .then(res => res.json())
  //     .then((result) => {
  //       //console.log(result)
  //       if(result.error !== true) {
  //         if(result.newListId !== null) {
  //           window.location = '/cart';
  //         } else {
  //           window.location = '/wallet';
  //         }
  //       }
  //     }, (error) => {
  //       console.log(error)
  //       this.setState({
  //         error: true,
  //         loading: false
  //       });
  //     }
  //   )
  // }

  handleNewLibelle = () => {
    if(this.state.product.replace(/\s+/g, "") !== "" && this.state.selectedCatgId)
    {
      const addProduct = {name: this.state.product, idcategory: this.state.selectedCatgId}
      const newList = [addProduct].concat(this.state.list);
      this.setState({
        product: "",
        list: newList,
        loading: true
      }, this.updateProduct(addProduct));
      this.textInput.current.focus();
      // $('.input-product input').focus();
    } else if (!this.state.selectedCatgId) {
        this.handleAlert("please select a category");
    } else if (this.state.product.replace(/\s+/g, "") === "") {
        this.handleAlert("please fill a product name");
        this.textInput.current.focus();
        // $('.input-product input').focus();
    }
  }

  handleChange = (e) => {
    const [index, value] = [e.target.name, e.target.value]
    this.setState(() => ({
      [index]: value
    }));
  }

  handleKey = (e) => {
    if (e.key === 'Enter') {
      this.handleAddProduct();
    }
  }

  handleCheck = (e) => {
    console.log(e.target.value)
  }

  handleId = (id) => {
    this.setState({
      loading: true
    });
  }

  handleTrash = (e) => {
    const [index, list] = [e.target.value, this.state.list];
    const addToTrash = list[index];
    list.splice(index, 1);
    this.setState((prevState) => ({
      list: list,
      inTrash: [addToTrash].concat(prevState.inTrash),
      loading: true
    }), this.updateProduct(index, 'delete'));
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
      }, this.updateProduct(fromTrash));
    }
  }

  handleAlert = (message) => {
    if(message) {
        $('.alert').text(message).slideUp(100).fadeIn(200);
    } else {
        $('.alert').css('display', 'none');
        $('.alert').text(message);
    }
  }

  handleMenu = () => {
    this.setState((prevState) => 
      ({menu: !prevState.menu}), () => {
        document.getElementById('menu').style.display = this.state.menu ? 'flex' : 'none';
      })
  }

  handleTick = (id) => {
    const tick = this.state.tick;
    this.setState({
      tick: tick === id ? null : id
    })
  }

  handleTodo = (todo) => {
    this.setState({
      todoId: todo
    });
  }


  render() {
    const styleLoad = this.state.loading ? {position: 'relative', top: '0'} : {};
    const styleTaunt = {textDecorationLine: 'line-through'};

    return (
      <div className="todo" style={styleLoad}>
        { this.state.todoId
        ? 
          <Todo todo={this.state.todoId} />
        : 
          <div className="t-lists">
            <h4 className="title">To Do Lists</h4>
            <p className="modify">{this.state.loading ? 'loading' : ''}</p>
            <div className="list-container">
              { this.state.todos.map(
                (todo, index) => 
                <div key={index}>
                  <div className="t-date" style={!this.state.dates[index] ? {paddingTop: '0'} : {}}>{this.state.dates[index]}</div>
                  <div className="t-list row">
                    <div className="col-1 col-sm-1 pl-1" onClick={this.handleTick.bind(null, todo.id)}>
                      <img src={this.state.tick === todo.id ? tickDown : tick} className="t-tick" alt="tick" />
                    </div>
                    <div className="t-libelle col-8 col-sm-8 pl-1" onClick={this.handleTodo.bind(null, todo)}>
                      <p>{todo.libelle}</p>
                    </div>
                    <div className="t-hour">{todo.hour}</div>
                    <div className="col-1 col-sm-1" onClick={this.handleTrash.bind(null, todo.id)}>
                      <img className="t-trash" src={trash} alt="trash" />
                    </div>
                  </div>
                  { this.state.tick === todo.id 
                    ? todo.list.length ? 
                      todo.list.map(
                        (e, index) =>
                        <label key={index} className="row">
                          <div className="t-list-name col-1 col-sm-1">
                            <input className="check" 
                              type="checkbox" 
                              checked={e.checked || false} 
                              value={index} 
                              onChange={this.handleCheck} 
                            />
                          </div>
                          <div className="col-10 col-sm-10">
                            <p className="t-list-name" style={e.checked ? styleTaunt : {}}>{e.name}</p>
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
              )}

              <div className="footer-list">
                <div className="alert">{/* message */}</div>
                <div className="row">
                  <div className="input-libelle">
                    <input
                      className="form-control form-control-sm"
                      name="product" 
                      type="text" 
                      autoComplete="off" 
                      value={this.state.product} 
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
                      onClick={this.handleNewLibelle} 
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Todos;
