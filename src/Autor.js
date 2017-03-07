import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoCustomizado from './componentes/BotaoCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component{

  	constructor()
  	{
	    super();

	    this.state = {lista : [], nome: '', email: '', senha: ''};
	    
	    this.enviaForm = this.enviaForm.bind(this);

	    this.setNome = this.setNome.bind(this);
	    this.setEmail = this.setEmail.bind(this);
	    this.setSenha = this.setSenha.bind(this);
	}

	setNome(event)
	{
		this.setState({nome : event.target.value});
	}

	setEmail(event)
	{
	   this.setState({email : event.target.value});
	}

	setSenha(event)
	{
		this.setState({senha : event.target.value});
	}

	enviaForm(event)
	{
		event.preventDefault();

		$.ajax({
		url: 'https://cdc-react.herokuapp.com/api/autores',
		contentType: 'application/json',
		dataType: 'json',
		type: 'post',
		data: JSON.stringify({nome : this.state.nome, email : this.state.email, senha : this.state.senha}),
		success: function(novaListagem)
		{
			PubSub.publish('atualiza-lista-autores', novaListagem)
			this.setState({nome:'', email:'', senha:''});
			}.bind(this),		
		error: (resposta => {
				
				console.log(resposta);

				if (resposta.status === 400)
				{console.log(resposta.responseJSON);
					new TratadorErros().publicaErros(resposta.responseJSON);
				}
				
			}),
		beforeSend: () => { PubSub.publish("limpa-erros", {}); }
		});
	}	

	render() 
	{
		return (
			<div className="pure-form pure-form-aligned">
				<form className="pure-form pure-form-aligned" onSubmit={this.enviaForm}>

					<InputCustomizado id="nome" name="nome" label="Nome" type="text" value={this.state.nome} onChange={this.setNome}/>                  
					<InputCustomizado id="email" name="email" label="Email" type="email" value={this.state.email} onChange={this.setEmail}/>
					<InputCustomizado id="senha" name="senha" label="Senha" type="password" value={this.state.senha} onChange={this.setSenha}/>

					<BotaoCustomizado type="submit" label="Gravar"/>
			    
				</form>             

			</div>  
		);
	}
}

class TabelaAutores extends Component {

	render() 
	{
		return (
        	<div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>email</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    this.props.lista.map(autor => {
                      return (
                        <tr key={autor.id}>
                          <td>{autor.nome}</td>
                          <td>{autor.email}</td>
                        </tr>
                      );
                    })
                }
                  </tbody>
                </table> 
            </div>  
		);
	}
}

export default class AutorBox extends Component {

	constructor()
  	{
	    super();

	    this.state = {lista : []};
	    this.atualizaListagem = this.atualizaListagem.bind(this);
	}

	componentDidMount()
	{
		$.ajax({
			url:"https://cdc-react.herokuapp.com/api/autores",
			dataType: 'json',
			success:function(resposta)
			{
				console.log(resposta);
				this.atualizaListagem(resposta);
			}.bind(this)
		});
	
		PubSub.subscribe('atualiza-lista-autores', function(topico, novaLista) {
			this.setState({lista:novaLista});
		}.bind(this));
	}

	atualizaListagem(novaLista)
	{
		this.setState({lista:novaLista});
	}

	render()
	{
		return (
			<div>
				<FormularioAutor callbackAtualizaListagem={this.atualizaListagem}/>
                <TabelaAutores lista={this.state.lista}/>   
			</div>
		);
	}
}