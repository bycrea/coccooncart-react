import React, { Component } from 'react';
import trash from '../images/trash.png'

class Cart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listId: null,
      list: [],
      categories: [],
      product: "",
      selectedCatgId: null,
      selectedCatgName: "",
      inTrash: [],
      loading: true,
      error: false
    }
    //this.textInput = React.createRef();
  }

  componentDidMount() {
    fetch('http://coccooncart.com/api/getlist')
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        if(result.error === false) {
          this.setState({
            listId: result.listId,
            list: result.list || [],
            categories: result.categories,
            selectedCatgId: parseInt(result.categories[0].id),
            selectedCatgName: result.categories[0].name,
            loading: false,
          });
          console.log('success')
        } else {
          console.log(result.error)
          this.setState({
            error: true,
            loading: false,
          });
        }
      },
      (error) => {
        this.setState({
          error: true,
          loading: false
        });
        console.log(error)
      }
    )
  }

  updateList(newList = this.state.list) {
    fetch('http://coccooncart.com/api/updatelist', {
      method: 'POST',
      body: JSON.stringify({listId: this.state.listId, list: newList, amount: 0})
     })
      .then(res => res.json())
      .then((result) => {
        //console.log(this.state.list.length, result.nbProduct)
        if(result.error === false) {
          if(this.state.listId === null) {
            this.setState({
              listId: result.listId
            });
          }
        } else {
          console.log(result.error)
          this.setState({
            error: true
          });
        }
      },
      (error) => {
        console.log(error)
        this.setState({
          error: true
        });
      }
    )
  }

  handleAddProduct = () => {
    const addProduct = {name: this.state.product, idcategory: this.state.selectedCatgId}
    const newList = [addProduct].concat(this.state.list);
    //console.log(addProduct);
    this.setState({
      list: newList,
      product: ""
    }, this.updateList(newList));
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
      list: prevList
    }, this.updateList(prevList));
  }

  handleTrash = (e) => {
    const [index, list] = [e.target.value, this.state.list];
    const addToTrash = list[index];
    list.splice(index, 1);
    this.setState((prevState) => ({
      list: list,
      inTrash: [addToTrash].concat(prevState.inTrash)
    }), this.updateList(list));
  }

  handleClickOnCategory = (index) => {
    const [id, name] = [parseInt(this.state.categories[index].id), this.state.categories[index].name]
    if(id !== this.state.selectedCatgId)
    {
      this.setState({
        selectedCatgId: id,
        selectedCatgName: name
      });
    }
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
    this.updateList()
  }

  handleDone = () => {
    const amount = document.getElementById('amount').value;
    console.log(amount)
    document.getElementById('amount').value = "";
  }

  render() {
    const styleLoad = this.state.loading ? {position: 'relative', top: '0'} : {};
    const styleTaunt = {textDecorationLine: 'line-through'}

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
              <div className="row d-flex justify-content-center">
                <div className="col col-8 col-sm-8">
                  <input id="add-product"
                    className="form-control form-control"
                    name="product" 
                    type="text" 
                    value={this.state.product} 
                    onChange={this.handleChange} 
                    onKeyDown={this.handleKey} 
                    placeholder={this.state.selectedCatgName} 
                    // ref={this.textInput} 
                  />
                </div>
                <div className="col col-3 col-sm-3 add">
                  <input 
                    className="btn btn btn-secondary"
                    type="submit" 
                    name="add" 
                    value="Add" 
                    onClick={this.handleAddProduct} 
                  />
                </div>
              </div>
              <div className="list">
                {this.state.categories.map(
                  (c, index) => 
                  <div key={index}>
                    <a href="#top" onClick={this.handleClickOnCategory.bind(null, index)}>
                      <span className={this.state.selectedCatgId === c.id ? "c-list-hover" : "c-list"}>
                        {c.name}<hr key={index}></hr>
                      </span>
                    </a>
                    {this.state.list.map(
                      (p, index) => 
                        p.idcategory === c.id 
                        ? 
                          <div key={index} className="p-list row">
                            <div className="col col-11 col-sm-11">
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
                          </div>
                        : 
                          false
                      )}
                  </div>
                )}
              </div>
              <div className="b-list">
                <button className="btn btn-sm btn-secondary undo" 
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
