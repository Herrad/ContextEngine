var assert = require('assert');
var proxyquire = require('proxyquire');

describe('fileAppendingEventListener', function(){
	describe('data directory creation', function(){
		
		it('should ensure that the users data directory exists before writing any file', function(done){
			var mock_mkdirp = function(dirToCreate){
				assert.equal(dirToCreate, "/foo/bar");
				done();
			};
			var fileAppendingEventListener = proxyquire('../core/fileAppendingEventListener',{'mkdirp':mock_mkdirp});

			var stubContextEngine = {
				userDataPath : "/foo/bar"
			}

			var listener = new fileAppendingEventListener.FileAppendingEventListener(stubContextEngine);
			listener.persistEvent({text:'some event'});
		})

		it('should append events to the file', function(done){
			var eventToSend = {hello:'world'};

			var mock_fs = {
				appendFile:function(filename, content, callback){
					console.log('appending file');
					assert.equal(filename, '/foo/bar/eventLog.txt');
					assert.equal(content, JSON.stringify(eventToSend));
					done();
					callback();
				}
			};

			var stub_mkdirp = function(dirToCreate, callback){
				callback();
			};

			var fileAppendingEventListener = proxyquire('../core/fileAppendingEventListener',{'fs':mock_fs, 'mkdirp':stub_mkdirp});

			var stubContextEngine = {
				userDataPath : "/foo/bar"
			}

			var listener = new fileAppendingEventListener.FileAppendingEventListener(stubContextEngine);
			listener.persistEvent(eventToSend);
		})
	});
});