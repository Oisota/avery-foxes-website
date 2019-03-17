const Metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const permaLinks = require('metalsmith-permalinks');
const watch = require('metalsmith-watch');
const collections = require('metalsmith-collections');
const dateFormatter = require('metalsmith-date-formatter');
const fingerprint = require('metalsmith-fingerprint-ignore');

Metalsmith(__dirname)
.metadata({
	bandName: 'The Avery Foxes',
	navLinks: [
	]
})
.source('src')
.destination('dist')
.clean(true)
.use(watch({
	paths: {
		'${source}/**/*': '**/*',
		'layouts/**/*': '**/*',
	},
	livereload: 8081,
}))
.use(inPlace())
.use(collections({
	shows: {
		pattern: 'shows/*',
		sortBy: 'date',
	}
}))
.use(dateFormatter({
	dates: [{
		key: 'date',
		format: 'MMMM Do, h:mm A'
	}]
}))
.use(fingerprint({
	pattern: 'css/*.css',
}))
.use(layouts())
.use(permaLinks({
	pattern: ':title',
	relative: false,
}))
.build((err, _) => {
	if (err) {
		throw err;
	} else {
		console.log('BLAM! It Worked');
	}
});