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
      idcategory: false,
      loading: true
    }
  }

  componentDidMount() {
    fetch('http://coccooncart.com/api/products_list')
      .then(res => res.json())
      .then((result) => {
          this.setState({
            //list: result.list || [],
            list: [
              {name: 'test', idcategory: 2, checked: false},
              {name: 'carotte', idcategory: 1, checked: false},
              {name: 'coca', idcategory: 8, checked: true},
            ],
            products: result.products,
            categories: result.categories,
            loading: false,
          })
          console.log('success')
      },
      (error) => {
        this.setState({
          loading: false
        })
        console.log(error)
      }
    )
  }

  callbackList = (product) => {
    // change idcategory after updateID()
    const addProduct = {name: product.name, idcategory: this.state.idcategory}
    this.setState((prevState) => ({
      list: prevState.list.concat(addProduct)
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
    const [index, val, prevList] = [e.target.value, e.target.checked, this.state.list];
    prevList.splice(index, 1);
    this.setState({
        list: prevList
    });
  }

  handleClickOnCategory = (id) => {
    this.setState({
      idcategory: id
    });
  }


  render() {
    const style = {textDecorationLine: 'line-through'}

    return (
      <div className="cart">
        <h2>Add to Cart</h2>
        { this.state.loading 
        ? 
            <div>
              <p>Loading...</p>
            </div>
        :
          <div className="list-container">
            <InputProduct
              idcategory={this.state.idcategory}
              updateIdcategory={this.updateIdcategory}
              categories={this.state.categories} 
              products={this.state.products} 
              callbackList={this.callbackList}
            />
            <div className="list">
              {this.state.categories.map(
                (c, index) => 
                <div key={index}>
                  <a href="#top" onClick={this.handleClickOnCategory.bind(null, c.id)}>
                    <span className="c-list">{c.name}<hr key={index}></hr></span>
                  </a>
                  {this.state.list.map(
                    (p, index) => 
                      p.idcategory == c.id 
                      ? 
                        <div key={index} className="p-list">
                          <label className="p-list-name">
                            <span style={p.checked ? style : {}}>{p.name}</span> 
                            <input className="check" 
                                  type="checkbox" 
                                  checked={p.checked} 
                                  value={index} 
                                  onChange={this.handleCheck} />
                          </label>
                          <label className="p-list-trash"><img className="p-trash" src={trash} alt="trash" /> 
                            <input hidden 
                                  className="form-check"
                                  type="checkbox" 
                                  value={index} 
                                  onChange={this.handleTrash} />
                          </label>
                        </div>
                      : 
                        false
                    )}
                </div>
              )}
            </div>
          </div>
        }
      </div>  
    )
  }
}

export default Cart;
