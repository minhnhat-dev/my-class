export default function (sequelize, DataTypes) {
	const User = sequelize.define('User', {
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		fullname: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		gender: {
			type: DataTypes.STRING,
			allowNull: true
		},
		dateOfBirth: {
			type: DataTypes.DATE,
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true
		},
	});
	return User;
}
