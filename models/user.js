var bcrypt = require('bcryptjs');
var _ = require('underscore');
module.exports = function (sequelize, DataTypes){
	var user = sequelize.define('user', {
		email : {
			type : DataTypes.STRING,
			allowNull : false,
			unique : true,
			validate :{
				isEmail : true
			}
		},
		salt: {
			type : DataTypes.STRING
		}, 
		password_hash: {
			type: DataTypes.STRING
		},
		password : {
			type : DataTypes.VIRTUAL,
			allowNull : false,
			validate :{
				len: [7, 200]
			},
			set : function (value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);
				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword); 
			} 
		}
	}, {
		hooks: {
			beforValidate: function (user, option){
				if( typeof user.email === 'string'){
					user.email = user.email.toLowerCase();
				}
			} 
		},classMethod: {
			authenticate : function (body) {
				return new promise( function (resolve, reject){
					if(typeof body.email !== 'string' || typeof body.password !== 'string'){
						return reject();
					}

					user.findOne({
								where: {
									email :body.email
								}
					}).then(function (user){
					if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
						return reject();
					}
				resolve(user);
	}, function (e){
		return reject();
	});
				});
			}
		},
		instanceMethods: {
			toPublicJSON : function () {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}
	});
	return user;
};
