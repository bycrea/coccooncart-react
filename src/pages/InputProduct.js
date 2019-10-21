import React, { Component } from 'react';

class InputProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      idcategory: this.props.idcategory || false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const [index, value] = [e.target.name, e.target.value]
    this.setState(() => ({
      [index]: value
    }));
  }

  handleSubmit() {
    this.props.callbackList(this.state)
    this.setState({
      name: "",
    })
  }

  render() {

    return (
      <div>
        <input id="add-product"
          name="name" 
          type="text" 
          value={this.state.name} 
          onChange={this.handleChange}
          placeholder="add item" 
        />
        <select id="add-categories"
          name="idcategory" 
          value={ this.state.idcategory ? this.state.idcategory : this.props.categories[0].id} 
          onChange={this.handleChange}>
          {this.props.categories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
        </select>
        <input 
          type="submit" 
          name="submit" 
          value="Add" 
          onClick={this.handleSubmit} 
        />
      </div>
    )
  }
}

export default InputProduct;
