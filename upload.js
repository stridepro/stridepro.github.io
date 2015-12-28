function prompted() { 
	document.body.classList.add('prompted');
}

// IAM user which can upload new videos. And that's it.   
AWS.config.update(
	{accessKeyId: 'AKIAIIHDL5XSGAEASGOA', 
	 secretAccessKey: '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',
	 region: 'us-east-1',
	 sslEnabled: true});
	  
var db = new AWS.DynamoDB({params: {TableName: 'stridepro'}});
var bucket = new AWS.S3({params: {Bucket: 'stridepro'}});

function upload() {
	document.body.classList.add('uploading');
	/*var submit = document.getElementById('submit');
	submit.disabled = true;
	submit.innerHTML = 'Uploading...';*/
	
	var at = Date.now().toString();
	var contact = document.getElementById('contact').value;
	var note = document.getElementById('note').value;
	var folder = 'videos/' + encodeURIComponent(contact) + '/' + at;

	db.putItem(
		{Item: 
			{uploadId: {S: folder}, 
			 contact: {S: contact},
			 at: {N: at},
			 note: {S: note}}
		}, 
		function() {
			var files = document.getElementById('videos').files;
			var progressBar = document.getElementById('progress');
			
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				var key = folder + '/' + file.name;
			
				var upload = bucket.upload(
					{Key: key, ContentType: file.type, Body: file},
					function (err, data) {
						if (err) alert(err);
						document.body.classList.add('done');
				});
				
				upload.on('httpUploadProgress', function (progress) {
					var percent = Math.round(100 * progress.loaded / progress.total);
					progressBar.value = percent;
				});
			}
		}
	);
}