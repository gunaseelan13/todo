var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': 'basic-sqlite.sqlite'
});

var Todo = sequelize.define('todo',{
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({ 
	//force: true
	})
	.then(function () {
	console.log('Everything is Synced');
		Todo.findById(1).then( function (todo){
			if(todo){
				console.log(todo.toJSON());
			} else {
				console.log('No match found');
			}
		});

	// Todo.create({
	// 	description: 'Walking my dog',
	// 	completed: true
	// }).then(function (todo){
	// 	return Todo.create({
	// 		description:'clean office'
	// 	});
	// }).then( function (){
	// 	//return Todo.findById(1);
	// 	return Todo.findAll({
	// 		where: {
	// 			description:{
	// 				$like : '%dog%'
	// 			}
	// 		}
	// 	});
	// }).then( function (todos){
	// 	if(todos){
	// 		todos.forEach(function (todo){
	// 			console.log(todo.toJSON());
	// 		});
	// 	} else {
	// 		console.log('no todo found in ID');
	// 	}
	// }).catch( function (e){
	// 	console.log(e);
	// });
});
