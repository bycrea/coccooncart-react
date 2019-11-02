import React, { Component } from 'react';
import $ from 'jquery'; 
import trash from '../images/trash.png';

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogged: this.props.state.isLogged,
      username: this.props.state.username,
      token: this.props.state.token,
      urlApi: this.props.state.urlApi,
      listId: null,
      list: [],
      categories: [],
      product: "",
      modify: "",
      selectedCatgId: null,
      selectedCatgName: "",
      inTrash: [],
      clickTwice: false,
      loading: true,
      error: false,
    };
    this.textInput = React.createRef();
  }

  componentDidMount() {
    
    fetch(this.state.urlApi + '/api/getlist', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      }
    })
    .then(res => res.json())
    .then((result) => {
      //console.log(result);
      if(result.error === false) {
        this.setState({
          listId: result.listId,
          list: result.list || [],
          categories: result.categories,
          modify: result.modify,
          selectedCatgId: parseInt(result.categories[0].id),
          selectedCatgName: result.categories[0].name,
          loading: false
        });
        console.log('success')
      } else {
        console.log(result.error)
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

  // updateList(newList = this.state.list) {
  //   fetch(this.state.urlApi + '/api/updatelist', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': 'Bearer ' + this.state.token
  //     },
  //     body: JSON.stringify({listId: this.state.listId, list: newList, amount: 0, closed: false})
  //    })
  //     .then(res => res.json())
  //     .then((result) => {
  //       //console.log(result)
  //       if(result.error === false) {
  //         this.setState({
  //           list: result.list,
  //           listId: result.listId,
  //           modify: result.modify
  //         });
  //       } else {
  //         console.log(result.error)
  //         this.setState({
  //           error: true
  //         });
  //       }
  //     }, (error) => {
  //       console.log(error)
  //       this.setState({
  //         error: true
  //       });
  //     }
  //   )
  // }

  updateProduct(product, action = 'add') {
    console.log(product)
    
    fetch(this.state.urlApi + '/api/updateProduct', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
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
            modify: result.modify
          });
        } else {
          console.log(result.error)
          this.setState({
            error: true
          });
        }
      }, (error) => {
        console.log(error)
        this.setState({
          error: true
        });
      }
    )
  }

  closeList(amount) {
    this.setState({ loading: true });
    fetch(this.state.urlApi + '/api/closelist', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: JSON.stringify({
        listId: this.state.listId, 
        list: this.state.list, 
        amount: amount
      })
     })
      .then(res => res.json())
      .then((result) => {
        console.log(result)
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
          error: true
        });
      }
    )
  }

  handleAddProduct = () => {
    if(this.state.product.replace(/\s+/g, "") !== "")
    {
      const addProduct = {name: this.state.product, idcategory: this.state.selectedCatgId}
      const newList = [addProduct].concat(this.state.list);
      this.setState({
        product: "",
        loading: true
      }, this.updateProduct(addProduct));
    }
    this.textInput.current.focus();
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
    const [index, val, prevList] = [e.target.value, e.target.checked, this.state.list];
    prevList[index].checked = val;
    this.setState({
      loading: true
    }, this.updateProduct(index, 'check'));
  }

  handleTrash = (e) => {
    const [index, list] = [e.target.value, this.state.list];
    const addToTrash = list[index];
    list.splice(index, 1);
    this.setState((prevState) => ({
      loading: true,
      inTrash: [addToTrash].concat(prevState.inTrash)
    }), this.updateProduct(index, 'delete'));
  }

  handleUndo = () => {
    if(this.state.inTrash.length > 0) 
    { 
      const [fromTrash, trash, list] = [this.state.inTrash[0], this.state.inTrash, this.state.list];
      trash.splice(0, 1);
      const newList = [fromTrash].concat(list);
      this.setState({
        loading: true,
        inTrash: trash,
      }, this.updateProduct(fromTrash));
    }
  }

  handleClickOnCategory = (index) => {
    document.getElementById('amount').style.backgroundColor = 'white';
    document.getElementById('amount').value = "";
    
    const [id, name, click] = [
      parseInt(this.state.categories[index].id), 
      this.state.categories[index].name, 
      this.state.clickTwice
    ];
    
    if(id === this.state.selectedCatgId)
    {
      $('.footer-list').fadeIn();
      this.setState({
        clickTwice: !click
      });
      this.textInput.current.focus();
    } else {
      $('.footer-list').fadeOut();
      this.setState({
        selectedCatgId: id,
        selectedCatgName: name,
        clickTwice: false
      });
    }
  }

  handlePay = () => {
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
    } else {
      document.getElementById('amount').style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    }
    document.getElementById('amount').value = "";
  }

  render() {
    const isSelect = this.state.selectedCatgId;
    const styleLoad = this.state.loading && !(this.state.categories).length? {position: 'relative', top: '0'} : {};
    const styleTaunt = {textDecorationLine: 'line-through'};
    
    return (
      <div className="cart" style={styleLoad}>
        <h4 className="title">Shopping List</h4>
        <p className="modify">{this.state.loading ? 'loading' : this.state.modify}</p>
        { this.state.error 
          ? 
            <div>
              <p>Connexion error.</p>
            </div>
          :
            <div className="list-container">
              <div className="list">
                {this.state.categories.map(
                  (c, index) => 
                  <div key={index} className="c-block">
                    <span className={isSelect === c.id ? "c-list-hover" : "c-list"}
                      onClick={this.handleClickOnCategory.bind(null, index)}>
                      {c.name}<hr key={index}></hr>
                    </span>
                    {this.state.list.map(
                      (p, index) => 
                        p.idcategory === c.id 
                        ? 
                          <div key={index} className={isSelect === c.id? "p-list row pb-2" : "p-list row"}>
                            <div className="col col-11 col-sm-11">
                              <label className="p-list-name">
                                <input className="check" 
                                  type="checkbox" 
                                  checked={p.checked || false} 
                                  value={index} 
                                  onChange={this.handleCheck} 
                                />
                                <span style={p.checked ? styleTaunt : {}}>{p.name}</span> 
                              </label>
                            </div>
                            {
                              isSelect === c.id 
                              ?
                              <div className="col col-1 col-sm-1">
                                <label className="p-list-trash"><img className="p-trash" src={trash} alt="trash" /> 
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
                <div className="row pb-2 input-product">
                  <div className="col col-9 col-sm-9">
                    <input
                      className="form-control form-control-sm"
                      name="product" 
                      type="text" 
                      autoComplete="off" 
                      value={this.state.product} 
                      onChange={this.handleChange} 
                      onKeyDown={this.handleKey} 
                      placeholder={this.state.selectedCatgName} 
                      ref={this.textInput} 
                    />
                  </div>
                  <div className="col col-3 col-sm-3 add">
                    <input 
                      className="btn btn-sm btn-secondary"
                      type="submit" 
                      name="add" 
                      value="Add" 
                      onClick={this.handleAddProduct} 
                    />
                  </div>
                </div>
                <div className="row buttons">
                  <div className="col col-3 col-sm-3">
                    <button className="btn btn-sm btn-secondary undo" 
                      disabled={this.state.inTrash.length <= 0}
                      onClick={this.handleUndo}>Undo
                    </button>
                  </div>
                  <div className="col col-5 col-sm-5">
                    <button className="btn btn-sm btn-warning pay" onClick={this.handlePay}>Pay</button>
                  </div>
                  <div className="col col-3 col-sm-3">
                    <input id="amount"
                      className="form-control form-control-sm amount"
                      name="amount" 
                      type="number" 
                      autoComplete="off" 
                      placeholder="€"
                    />
                  </div>
                </div>
              </div>
            </div>
        }
      </div>  
    )
  }
}

export default Cart;
