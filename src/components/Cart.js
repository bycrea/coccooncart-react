import React, { Component } from 'react';
import trash from '../images/trash.png';

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
      countClick: 0,
      loading: true,
      error: false
    }
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.setState({
      list: [
        { name: "fraise", idcategory: 3 },
        { name: "pomme", idcategory: 3 },
        { name: "coca", checked: false, idcategory: 2 },
        { name: "pates", checked: true, idcategory: 1 },
        { name: "tomates", checked: false, idcategory: 3 },
        { name: "steak haché bio", checked: false, idcategory: 5 },
        { name: "des choses", checked: false, idcategory: 10 }
      ],
      categories: [
        { id: 1, name: "Epicerie" },
        { id: 2, name: "Boissons" },
        { id: 3, name: "Fruit/Légume" },
        { id: 4, name: "Produits Laitiers" },
        { id: 5, name: "Viandes/Poissons" },
        { id: 6, name: "Petit Déjeuné" },
        { id: 7, name: "Surgelés" },
        { id: 8, name: "Plats Préparés" },
        { id: 9, name: "Entretien" },
        { id: 10, name: "Hygiène" },
        { id: 11, name: "Divers" },
        { id: 12, name: "Recettes (idées)" }
      ],
      selectedCatgId: parseInt(1),
      selectedCatgName: "Epicerie",
      loading: false,
    })
    // fetch('http://coccooncart.com/api/getlist')
    //   .then(res => res.json())
    //   .then((result) => {
    //     console.log(result);
    //     if(result.error === false) {
    //       this.setState({
    //         listId: result.listId,
    //         list: result.list || [],
    //         categories: result.categories,
    //         selectedCatgId: parseInt(result.categories[0].id),
    //         selectedCatgName: result.categories[0].name,
    //         loading: false,
    //       });
    //       console.log('success')
    //     } else {
    //       console.log(result.error)
    //       this.setState({
    //         error: true,
    //         loading: false,
    //       });
    //     }
    //   },
    //   (error) => {
    //     this.setState({
    //       error: true,
    //       loading: false
    //     });
    //     console.log(error)
    //   }
    // )
  }

  // componentDidUpdate() {
  //   console.log(this.textInput.current)
  // }

  updateList(newList = this.state.list) {
    // fetch('http://coccooncart.com/api/updatelist', {
    //   method: 'POST',
    //   body: JSON.stringify({listId: this.state.listId, list: newList, amount: 0})
    //  })
    //   .then(res => res.json())
    //   .then((result) => {
    //     //console.log(this.state.list.length, result.nbProduct)
    //     if(result.error === false) {
    //       if(this.state.listId === null) {
    //         this.setState({
    //           listId: result.listId
    //         });
    //       }
    //     } else {
    //       console.log(result.error)
    //       this.setState({
    //         error: true
    //       });
    //     }
    //   },
    //   (error) => {
    //     console.log(error)
    //     this.setState({
    //       error: true
    //     });
    //   }
    // )
  }

  handleAddProduct = () => {
    if(this.state.product.replace(/\s+/g, "") !== "")
    {
      const addProduct = {name: this.state.product, idcategory: this.state.selectedCatgId}
      const newList = [addProduct].concat(this.state.list);
      //console.log(addProduct);
      this.setState({
        list: newList,
        product: ""
      }, this.updateList(newList));
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
    const [id, name, click] = [
      parseInt(this.state.categories[index].id), 
      this.state.categories[index].name, 
      this.state.countClick + 1
    ];
    if(id === this.state.selectedCatgId && click > 1)
    {
      this.setState({
        countClick: 0
      });
      this.textInput.current.focus();
    } else {
      this.setState({
        selectedCatgId: id,
        selectedCatgName: name,
        countClick: click,
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
              <div className="list">
                {this.state.categories.map(
                  (c, index) => 
                  <div key={index}>
                    <span className={this.state.selectedCatgId === c.id ? "c-list-hover" : "c-list"}
                      onClick={this.handleClickOnCategory.bind(null, index)}>
                      {c.name}<hr key={index}></hr>
                    </span>
                    {this.state.list.map(
                      (p, index) => 
                        p.idcategory === c.id 
                        ? 
                          <div key={index} className="p-list row">
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
              <div className="footer-list">
                <div className="row pb-2 input-product">
                  <div className="col col-9 col-sm-9">
                    <input
                      className="form-control form-control-sm"
                      name="product" 
                      type="text" 
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
                    <button className="btn btn-sm btn-warning done" onClick={this.handleDone}>Done</button>
                  </div>
                  <div className="col col-3 col-sm-3">
                    <input id="amount"
                      className="form-control form-control-sm amount"
                      name="amount" 
                      type="number" 
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
