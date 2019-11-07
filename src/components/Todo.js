import React, { Component } from 'react';
import $ from 'jquery';

import trash from '../images/trash.png';

class Todo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // isLogged: this.props.state.isLogged,
      // username: this.props.state.username,
      // token: this.props.state.token,
      // urlApi: this.props.state.urlApi,
      // todoId: null,
      // libelle: "",
      // modify: "",
      // inTrash: [],
      // focus: false,
      // menu: false,
      loading: true,
      error: false,
    };
    this.textInput = React.createRef();
  }

  componentDidMount() {
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


  render() {
    const styleLoad = this.state.loading ? {position: 'relative', top: '0'} : {};
    const connexion = this.state.error ? 'offline' : this.state.modify;
    const styleTaunt = {textDecorationLine: 'line-through'};

    return (
      <div>
        {this.props.todo.libelle}
      </div>  
    )
  }
}

export default Todo;