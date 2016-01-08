define(function () {
	return {
		version: "2.0.0",
		load: function (name, req, onLoad, config) {
			if (config.isBuild) {
				//don't do anything if this is a build, can't inline a web worker
				onLoad();
				return;
			}

			var url = req.toUrl(name);

			var xhr = new XMLHttpRequest();
			xhr.open('GET', url);
			xhr.onload = function() {
			    if (xhr.status === 200) {
			        var workerSrcBlob;
			        var workerBlobURL;
		            workerSrcBlob = new Blob([xhr.responseText], { type: 'text/javascript' });
		            workerBlobURL = window.URL.createObjectURL(workerSrcBlob);
			        
			        if (window.Worker) {
			        	onLoad(new Worker(workerBlobURL));
			        } else {
			        	req(["worker-fake"], function () {
							onLoad(new Worker(url));
						});
			        }
			    }
			};
			xhr.send();
		}
	};
});