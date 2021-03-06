import React, { Component } from 'react';
import Alert from './Alert'
import $ from 'jquery'; 

import trash from '../images/trash.png';
import hideMenu from '../images/up-arrow.png'
import showMenu from '../images/down-arrow.png'

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      app: {
        isLogged: this.props.state.isLogged,
        username: this.props.state.username,
        token: this.props.state.token,
        urlApi: this.props.state.urlApi,
        orderOptions: this.props.state.orderOptions,
      },
      listId: null,
      list: [],
      categories: [],
      orderBy: "Def",
      product: "",
      modify: "",
      selectedCatgId: null,
      selectedCatgName: "",
      inTrash: [],
      clickTwice: false,
      focus: false,
      menu: false,
      loading: true,
      error: false,
    };
    this.textInput = React.createRef();
    this.amountInput = React.createRef();
  }

  componentDidMount() {
    this.getList()
  }

  componentDidUpdate() {
    Alert("");
    if($('.input-product input').is(':focus') && !this.state.focus) {
      this.setState({
        focus: true,
      });
    }
  }

  getList(orderBy = null) {
    fetch(this.state.app.urlApi + '/cart/getlist', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.app.token
      },
      body: JSON.stringify({ orderBy: orderBy })
    })
    .then(res => res.json())
    .then((result) => {
      //console.log(result);
      if(result.error === false) {
        this.setState({
          listId: result.listId,
          list: result.list || [],
          categories: result.categories,
          orderBy: result.orderBy,
          modify: result.modify,
          loading: false,
          error: false
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

  updateProduct(product, action = 'add') {
    fetch(this.state.app.urlApi + '/cart/updateproduct', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.app.token
      },
      body: JSON.stringify({
        listId: this.state.listId, 
        product: product,
        action: action
      })
      })
    .then(res => res.json())
    .then((result) => {
      //console.log(result)
      if(result.error === false) {
        this.setState({
          loading: false,
          list: result.list,
          listId: result.listId,
          modify: result.modify,
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
    });
  }

  closeList(amount) {
    this.setState({ loading: true });
    fetch(this.state.app.urlApi + '/cart/closelist', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.app.token
      },
      body: JSON.stringify({
        listId: this.state.listId, 
        list: this.state.list, 
        amount: amount
      })
     })
      .then(res => res.json())
      .then((result) => {
        //console.log(result)
        if(result.error !== true) {
          if(result.newListId !== null) {
            window.location = '/cart';
          } else {
            window.location = '/wallet';
          }
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

  handleAddProduct = () => {
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
        Alert("please select a category");
    } else if (this.state.product.replace(/\s+/g, "") === "") {
        Alert("please fill a product name");
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
    const [index, val, list] = [e.target.value, e.target.checked, this.state.list];
    list[index].checked = val;
    this.setState({
      list: list,
      loading: true
    }, this.updateProduct(index, 'check'));
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

  handleOrder = (e) => {    
    const [app, value] = [this.state.app, e.target.value];
    let index = app.orderOptions.indexOf(value);
    index++;
    if(index === app.orderOptions.length) { index = 0; }
    this.getList(app.orderOptions[index]);
  }

  handleClickCategory = (index) => {
    const [id, name, click, focus] = [
        parseInt(this.state.categories[index].id), 
        this.state.categories[index].name, 
        this.state.clickTwice,
        this.state.focus
    ];
    
    if(id === this.state.selectedCatgId && click)
    {
        this.setState({
            selectedCatgId: null,
            selectedCatgName: "",
            clickTwice: false,
            focus: false
        });
        this.textInput.current.blur();
        //$('.input-product input').blur();
    } else {
        this.setState({
            selectedCatgId: id,
            selectedCatgName: name,
            clickTwice: true
        });
        if(focus) {
          this.textInput.current.focus();
          //$('.input-product input').focus();
        } else {
          this.textInput.current.blur();
          //$('.input-product input').blur();
        }
    }
  }

  handleClickPlus = (index) => {
    this.textInput.current.focus();
    //$('.input-product input').focus();
    this.setState({
        selectedCatgId: parseInt(this.state.categories[index].id),
        selectedCatgName: this.state.categories[index].name,
        clickTwice: true,
        focus: true
    });
  }

  handleMenu = () => {
    this.setState((prevState) => 
      ({menu: !prevState.menu}), () => {
        document.getElementById('menu').style.display = this.state.menu ? 'flex' : 'none';
      })
  }

  handleModal = (bool) => {
    if(bool) {
      document.getElementById('modal').style.display = 'flex';
      this.amountInput.current.focus();
    } else {
      document.getElementById('modal').style.display = 'none';
    }
  }

  handlePay = (e) => {
    const [amount, list, listId] = [
      document.getElementById('amount').value, 
      this.state.list,
      this.state.listId
    ];

    let nbChecked = 0;
    (list || []).forEach(e => {
      if(typeof e.checked !== 'undefined' && e.checked) {
        nbChecked++;
      }
    });

    if(amount > 0 && listId !== null && nbChecked > 0) {
      document.getElementById('amount').style.backgroundColor = 'white';
      this.closeList(amount);
    } else if (amount === 0) {
      document.getElementById('modal').style.display = 'none';
      Alert('Please insert an amount');
      document.getElementById('amount').value = "";
    } else if (nbChecked === 0) {
      document.getElementById('modal').style.display = 'none';
      Alert('Please select some products')
    }
  }

  render() {
    const styleLoad = this.state.loading && !(this.state.categories).length ? {position: 'relative', top: '0'} : {};
    const connexion = this.state.error ? 'offline' : this.state.modify;

    const isSelect = this.state.selectedCatgId;
    const styleTaunt = {textDecorationLine: 'line-through'};

    return (
      <div className="cart" style={styleLoad}>
        <h4 className="title">Shopping List</h4>
        <p className="modify">{this.state.loading ? 'loading' : connexion}</p>
        <div className="list-container">
          <div className="list">
            { this.state.categories.map(
              (c, index) => 
              <div key={index} className="c-block">
                <hr/>
                <div className={isSelect === c.id ? "c-list-hover" : "c-list"}>
                    <span className="c-name" onClick={this.handleClickCategory.bind(null, index)}>{c.name}</span>
                    { isSelect === c.id 
                      ? <span className="plus" onClick={this.handleClickPlus.bind(null, index)}>+</span> 
                      : <span className="plus" onClick={this.handleClickPlus.bind(null, index)}>&nbsp;</span> 
                    }
                </div>
                { this.state.list.map(
                  (p, index) => 
                    p.idcategory === c.id 
                    ? 
                    <div key={index} className={isSelect === c.id? "p-list row pb-2" : "p-list row"}>
                      <div className="col col-11 col-sm-11">
                        { c.id !== 13 
                        ? <label className="p-list-name">
                            <input className="check" 
                              type="checkbox" 
                              checked={p.checked || false} 
                              value={index} 
                              onChange={this.handleCheck} 
                            />
                            <span style={p.checked ? styleTaunt : {}}>{p.name}</span> 
                          </label>
                        : <span>{p.name}</span> 
                        }
                      </div>
                      { isSelect === c.id 
                        ?
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
                        : false
                      }
                    </div>
                    : false
                  )}
              </div>
            )}
          </div>

          <div className="footer-list">
            
            <div className="alert">{/* message */}</div>
            <div className="row">
              <div className="input-product">
                <input
                  className="form-control form-control-sm"
                  name="product" 
                  type="text" 
                  autoComplete="off" 
                  value={this.state.product} 
                  onChange={this.handleChange} 
                  onKeyDown={this.handleKey} 
                  placeholder={this.state.selectedCatgName || 'Select a category'} 
                  ref={this.textInput}
                />
              </div>
              <div className="add-product">
                <input 
                  className="btn btn-sm btn-secondary"
                  type="submit" 
                  name="add" 
                  value="Add" 
                  onClick={this.handleAddProduct} 
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
              <div className="filter">
                <input type="button" 
                  className="btn btn-sm btn-secondary" 
                  onClick={this.handleOrder} 
                  value={this.state.orderBy}
                />
              </div>
              <div className="undo">
                <button className="btn btn-sm btn-secondary" 
                  disabled={this.state.inTrash.length === 0} onClick={this.handleUndo}>Undo
                </button>
              </div>
              <div className="pay">
                <button className="btn btn-sm btn-warning" onClick={this.handleModal.bind(null, true)}>Pay</button>
              </div>
            </div>

            <div className="modal" id="modal">
              <div className="modal-body">
                <input id="amount"
                  className="form-control form-control-sm amount"
                  name="amount" 
                  type="number" 
                  autoComplete="off" 
                  placeholder="€" 
                  ref={this.amountInput}
                />
                <div className="row amount-valid">
                  <div className="undo">
                    <button className="btn btn-sm btn-info" onClick={this.handleModal.bind(null, false)}>Cancel</button>
                  </div>
                  <div className="pay">
                    <button className="btn btn-sm btn-danger" onClick={this.handlePay}>Ok</button>
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

export default Cart;
