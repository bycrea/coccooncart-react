import React, { Component } from 'react';
import InputProduct from './InputProduct';
import trash from '../images/trash.png'

class Cart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      products: [],
      categories: [],
      idcategory: "",
      inTrash: [],
      loading: true,
      error: false
    }
  }

  componentDidMount() {
    fetch('http://coccooncart.com/api/products_list')
    //fetch('http://api.bycrea.me/api/products_list')
      .then(res => res.json())
      .then((result) => {
          this.setState({
            // list: result.list || [],
            list: [
              {name: 'test', idcategory: 2, checked: false},
              {name: 'carotte', idcategory: 1, checked: false},
              {name: 'des choses', idcategory: 8, checked: true},
              {name: 'des choses avec bcp de text', idcategory: 2, checked: false},
            ],
            products: result.products,
            categories: result.categories,
            idcategory: parseInt(result.categories[0].id),
            loading: false,
          })
          console.log('success')
      },
      (error) => {
        this.setState({
          loading: false,
          error: true
        })
        console.log(error)
      }
    )
  }

  addToList = (product) => {
    const addProduct = {name: product.name, idcategory: this.state.idcategory}
    this.setState((prevState) => ({
      list: [addProduct].concat(prevState.list),
    }));
  }

  updateIdcategory = (id) => {
    this.setState({
      idcategory: id
    });
  }

  handleCheck = (e) => {
    const [index, val, prevList] = [e.target.value, e.target.checked, this.state.list];
    prevList[index].checked = val;
    this.setState({
        list: prevList
    });
  }

  handleTrash = (e) => {
    const [index, list] = [e.target.value, this.state.list];
    const addToTrash = list[index];
    list.splice(index, 1);
    this.setState((prevState) => ({
        list: list,
        inTrash: [addToTrash].concat(prevState.inTrash)
    }));
  }

  handleClickOnCategory = (id) => {
    this.setState({
      idcategory: id
    });
  }

  handleUndo = () => {
    if(this.state.inTrash.length > 0) 
    { 
      const [fromTrash, trash] = [this.state.inTrash[0], this.state.inTrash, this.state.list];
      trash.splice(0, 1);
      this.setState((prevState) => ({
        list: [fromTrash].concat(prevState.list),
        inTrash: trash,
      }));
    }
  }

  handleDone = () => {
    const amount = document.getElementById('amount').value;
    console.log(amount)
    document.getElementById('amount').value = "";
  }

  render() {
    const styleLoad = this.state.loading ? {position: 'relative', top: '0'} : {};
    const styleTaunt = {textDecorationLine: 'line-through'}
    const styleHighlight = {backgroundColor: '#4e586b'}

    return (
      <div className="cart" style={styleLoad}>
        <h4 className="title">Shopping List</h4>
        { this.state.loading 
        ? 
            <div>
              <p>Loading...</p>
            </div>
        :
          this.state.error 
          ? 
            <div>
              <p>Erreur de connexion.</p>
            </div>
          :
            <div className="list-container">
              <InputProduct
                idcategory={this.state.idcategory}
                updateIdcategory={this.updateIdcategory}
                categories={this.state.categories} 
                products={this.state.products} 
                addToList={this.addToList}
              />
              <div className="list">
                {this.state.categories.map(
                  (c, index) => 
                  <div key={index}>
                    <a href="#top" onClick={this.handleClickOnCategory.bind(null, c.id)}>
                      <span className="c-list d-flex text-center" style={this.state.idcategory === c.id ? styleHighlight : {}}>
                        {c.name}<hr key={index}></hr>
                      </span>
                    </a>
                    {this.state.list.map(
                      (p, index) => 
                        p.idcategory === c.id 
                        ? 
                          <div key={index} className="p-list row">
                            <div className="col col-10 col-sm-10">
                              <label className="p-list-name">
                                <input className="check" 
                                  type="checkbox" 
                                  //hidden 
                                  checked={p.checked} 
                                  value={index} 
                                  onChange={this.handleCheck} 
                                />
                                <span style={p.checked ? styleTaunt : {}}>{p.name}</span> 
                              </label>
                            </div>
                            <div className="col col-2 col-sm-2">
                              <label className="p-list-trash"><img className="p-trash" src={trash} alt="trash" /> 
                                <input hidden 
                                  className="form-check"
                                  type="checkbox" 
                                  value={index} 
                                  onChange={this.handleTrash} 
                                />
                              </label>
                            </div>                           
                          </div>
                        : 
                          false
                      )}
                  </div>
                )}
              </div>
              <div className="b-list">
                <button className="btn btn-sm btn-info undo" 
                  disabled={this.state.inTrash.length <= 0}
                  onClick={this.handleUndo}>Undo</button>
                <button className="btn btn-sm btn-warning done" onClick={this.handleDone}>Done</button>
                <input id="amount"
                  className="form-control form-control-sm a-input"
                  name="amount" 
                  type="number" 
                  placeholder="€"
                />
              </div>
            </div>
        }
      </div>  
    )
  }
}

export default Cart;
