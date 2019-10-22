import React, { Component } from 'react';

class InputProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      idcategory: this.props.categories[0].id,
    }
  }

  handleChange = (e) => {
    const [index, value] = [e.target.name, e.target.value]
    this.setState(() => ({
      [index]: value
    }));
    if(index == 'idcategory'){
      this.props.updateIdcategory(value);
    }
  }

  handleKey = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleSubmit = () => {        //Ne pas envoyer si vide
    this.props.callbackList(this.state)
    this.setState({
      name: "",
    })
    this.props.updateIdcategory(this.props.idcategory);
  }


  render() {

    return (
      <div className="row">
        <div className="col col-5 col-sm-5">
          <input id="add-product"
            className="form-control"
            name="name" 
            type="text" 
            value={this.state.name} 
            onChange={this.handleChange} 
            onKeyDown={this.handleKey} 
            placeholder="add item" 
          />
        </div>
        <div className="col col-5 col-sm-5">
          <select id="add-categories"
            className="form-control"
            name="idcategory" 
            value={this.props.idcategory || this.state.idcategory} 
            onChange={this.handleChange}>
            {this.props.categories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col col-sm">
          <input 
            className="btn btn-info"
            type="submit" 
            name="submit" 
            value="Add" 
            onClick={this.handleSubmit} 
          />
        </div>
      </div>
    )
  }
}

export default InputProduct;
