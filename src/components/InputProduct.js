import React, { Component } from 'react';

class InputProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      idcategory: this.props.categories[0].id,
      // list: [
      //   {name: 'test', idcategory: 12, checked: false},
      //   {name: 'carotte', idcategory: 1, checked: false},
      //   {name: 'des choses', idcategory: 9, checked: true},
      //   {name: 'des choses avec de text', idcategory: 2, checked: false},
      //   {name: 'test', idcategory: 2, checked: false},
      //   {name: 'pq', idcategory: 7, checked: false},
      //   {name: 'des choses encore', idcategory: 8, checked: true},
      //   {name: 'des choses', idcategory: 10, checked: false},
      // ],
    }
    this.textInput = React.createRef();
  }

  handleChange = (e) => {
    const [index, value] = [e.target.name, e.target.value]
    if(index === 'idcategory'){
      this.setState(() => ({
        [index]: parseInt(value)
      }));
      this.props.updateIdcategory(parseInt(value));
    } else {
      this.setState(() => ({
        [index]: value
      }));
    }
    this.textInput.current.focus();
  }

  handleKey = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    if(this.state.name) {
      this.props.addToList(this.state)
      this.props.updateIdcategory(this.props.idcategory);
    }
    this.setState({
      name: "",
    });
    this.textInput.current.focus();
  }


  render() {

    return (
      <div className="row">
        <div className="col col-5 col-sm-5">
          <input id="add-product"
            className="form-control form-control-sm"
            name="name" 
            type="text" 
            value={this.state.name} 
            onChange={this.handleChange} 
            onKeyDown={this.handleKey} 
            placeholder="add item" 
            ref={this.textInput} 
          />
        </div>
        <div className="col col-5 col-sm-5">
          <select id="add-categories"
            className="form-control form-control-sm"
            name="idcategory" 
            value={this.props.idcategory || this.state.idcategory} 
            onChange={this.handleChange}>
            {this.props.categories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col col-sm">
          <input 
            className="btn btn-sm btn-info"
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
