

const logger = {
	fileName: 'logs/error-%DATE%.log',
	datePattern: 'YYYY-MM-DD-HH',
	zippedArchive: true,
	maxSize: '5m',
	maxFiles: '30d'
};

const JWT_SECRET = 'SECRET_KEY_WEB_REVIEW';

const expire = (params) => {
	return Date.now() + 1000*60*60*24*params;
};


const accessTokenData = {
	iss: '321xem.com',
	sub: 'accessToken',
	aud: 'user',
	iat: Date.now(),
	exp: expire(2),
};

const refreshTokenData = {
	iss: '321xem.com',
	sub: 'refreshToken',
	aud: 'user',
	iat: Date.now(),
	exp: expire(3),
};

const ngrok = 'https://814a7eba252a.ngrok.io';

const roles = [
	'admin',
	'customer',
	'partner',
	'student',
	'teacher'
];

const REALM = {
	student: 'student',
	teacher: 'teacher',
};

const uploadFiles = {
	'create-products': {
		'fields': [
			{
				'name': 'images',
				'maxCount': 5
			}
		],
		'acl': 'public-read',
		'fieldKey': 'products',
		'bucket': 'products',
		'allowedContentTypes': [
			'image/png',
			'image/jpeg'
		],
		'maxFileSize': 8388608
	}
};

module.exports =  {
	logger,
	accessTokenData,
	refreshTokenData,
	JWT_SECRET,
	uploadFiles,
	roles,
	ngrok,
	REALM
};