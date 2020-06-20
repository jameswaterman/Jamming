import React from 'react';
import './SearchBar.css';


class SearchBar extends React.Component {
  constructor(props) {
  	super(props);

  	this.search = this.search.bind(this);
  	this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  search() {
    if(this.state) { 
  	  this.props.onSearch(this.state.term);
    }
    return;
  }

  handleKeyPress(event) {
        if (event.key === "Enter") {
          this.search();
        }
    }

  handleTermChange(event) {
    this.setState({term: event.target.value});
  }

  render() {
  	return (
  		<div className="SearchBar">
  			<input placeholder="Enter A Song, Album, or Artist"
  			  onChange={this.handleTermChange } 
          onKeyUp={this.handleKeyPress}/>
  			<button className="SearchButton" onClick={this.search}
                                        onKeyUp={this.handleKeyPress}>SEARCH</button>
		</div>
	);
  }
};

export default SearchBar;