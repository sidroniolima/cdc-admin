import React, { Component } from 'react';

export default class BotaoCustomizado extends Component
{
	render() {
		return (                  
			<div className="pure-control-group">                                  
	        	<label></label> 
	        	<button type={this.props.type} className="pure-button pure-button-primary" onClick={this.props.onClick}>{this.props.label}</button>
	        </div>
	    );
	}
}