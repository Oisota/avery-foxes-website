const Metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const permaLinks = require('metalsmith-permalinks');
const watch = require('metalsmith-watch');
const collections = require('metalsmith-collections');
const dateFormatter = require('metalsmith-date-formatter');
const fingerprint = require('metalsmith-fingerprint-ignore');

function skip(opts) {
	if (!opts.test()) {
		return opts.plugin(opts.opts);
	}
	return (files, metalsmith, done) => {
		setImmediate(done);
	};
}

Metalsmith(__dirname)
.metadata({
	bandName: 'The Avery Foxes',
	liveReload: process.env.NODE_ENV === 'development',
})
.source('src')
.destination('dist')
.clean(true)
.use(skip({
	test: () => process.env.NODE_ENV === 'production',
	plugin: watch,
	opts: {
		paths: {
			'${source}/**/*': '**/*',
			'layouts/**/*': '**/*',
		},
		livereload: 8081,
	}
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
	pattern: [
		'css/*.css',
		'assets/*',
	]
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