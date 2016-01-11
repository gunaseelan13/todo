var express = require('express');
var bodyParser = require('body-parser');
var _ =require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res){
	res.send('TODO Api Root');
});

app.get('/todos', function (req, res){
	var queryParams = req.query;
	var filtertedTodos = todos;
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filtertedTodos = _.where(filtertedTodos,{completed: true});
	}else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filtertedTodos = _.where(filtertedTodos, {completed: false});
	}

	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		filtertedTodos = _.filter(filtertedTodos, function (todo){
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase() > -1);
		});
	}
	res.json(filtertedTodos);
});

app.get('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id, 10);
	db.todo.findById(todoId).then( function (todo){
		if(!!todo){
			res.json(todo.toJSON());
		} else {
			res.status(400).send();
		}
	}, function (e){
		res.status(500).send();
	});
});

app.post('/todos', function (req, res){
	var body = _.pick(req.body, 'description','completed');
	
	db.todo.create(body).then( function(todo){
		res.json(todo.toJSON());
	}, function (e){
		res.status(400).json(e);
	});
});

app.delete('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo){
		res.status(404).json({"error": "no todos found in id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

app.put('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body =_.pick(req.body, 'description','completed');
	var validAttribute = {};

	 if(!matchedTodo){
	 	return res.status(404).send();
	 }

	 if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
	 	validAttribute.completed = body.completed;
	 } else if (body.hasOwnProperty('completed')) {
	 	return res.status(400).send();
	 }

	 if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
	 	validAttribute.description =body.description;
	 } else if (body.hasOwnProperty('description')) {
	 	return res.status(400).send();
	 }

	 _.extend(matchedTodo, validAttribute);
	 res.json(matchedTodo);
});

db.sequelize.sync().then( function (){
	app.listen(PORT, function (){
	console.log('Express listening on port '+PORT);
	});
});















