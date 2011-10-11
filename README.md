# Pega.IO

Pega.IO is a Socket.IO/Node.JS project that makes implementing a scalable and reliable pub/sub application hassle free.  Your back-end doesn't need to be written in Node.JS to take advantage of this.

For example:  Imagine you have a server running a Python application using Tweepy to listen for real-time tweets about foosball, and you've also got a website written in PHP where people are posting comments on your foosball blog posts.

You have decided to build a third website that shows all of this activity to hundreds of thousands of interested people in real-time.  Where in the world do you start?  Pega.IO.

## Easy Install and Run on Linux

	curl http://www.aimx.com/pega.io/install.sh | sh
	pega-io start

## Install from source
	
	git clone git://github.com/Gootch/pega.io.git
	cd pega.io
	./configure && make && make install
	pega-io start

## How to Configure

For a simple Pega.IO server, no configuration required!

To edit the config file  (to set up more advanced stuff)

	vi /etc/pega.io.config
	pega-io restart

Refer to the wiki to learn how to configure your Pega.IO for a load balanced environment (and how to easily scale up from a single Pega.IO server).

## Examples: Push from any back-end

Just use a simple HTTP POST to push any message you like to your users.

### Python (App Engine)
	form_fields = {
		"channel":"channel-to-broadcast-to",
		"secretkey":"mysecretkey",
		"property1":"Some Text",
		"property2":"Some More Text
	}
	form_data = urllib.urlencode(form_fields)

	urlfetch.make_fetch_call(rpc=urlfetch.create_rpc(), 
		url="http://www.your-pega-io-server.com/send", 
		payload=form_data, 
		method=urlfetch.POST, 
		headers={'Content-Type': 'application/x-www-form-urlencoded'})

### PHP
	$url = 'http://www.your-pega-io-server.com/send';
	$fields = array(
		'channel'=>urlencode("channel-to-broadcast-to"),
		'secretkey'=>urlencode("mysecretkey"),
		'property1'=>urlencode("Some Text"),
		'property2'=>urlencode("Some More Text")
		);

	foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
	rtrim($fields_string,'&');

	$ch = curl_init();
	curl_setopt($ch,CURLOPT_URL,$url);
	curl_setopt($ch,CURLOPT_POST,count($fields));
	curl_setopt($ch,CURLOPT_POSTFIELDS,$fields_string);

	$result = curl_exec($ch);

	//close connection
	curl_close($ch);

### CURL
	curl -d http://www.your-pega-io-server.com/send "channel=channel-to-broadcast-to&secretkey=mysecretkey&property1=Some+Text&property2=Some+More+Text"

## Example: Implement a client  listener

In your HTML, or in a separate .js file, simply connect to your Pega.IO server, and subscribe to whichever channels you want to listen to.

```html
	<script src="http://www.your-pega-io-server.com/pega.io.js"></script>
	<script>
		var socket = io.connect('http://www.your-pega-io-server.com/');
  	
		socket.on('connect', function () {
			socket.on('channel-to-broadcast-to', function (obj) {
				console.log(obj.property1 + obj.property2 + obj.channel);
			});
			socket.on('another-channel', function (obj) {
				console.log(obj);
			});
		});
	</script>
```
## Don't have a server, or don't want to worry about maintaining one?  No problem!

Skip all the installation and configuration by using our servers.  Sign up for the service at www.aimx.com/pegaio to receive a secret and client key.  

### Example: Pushing from your back-end
	#### CURL
		curl -d http://pegaio.aimx.com/send "channel=channel-to-broadcast-to&secretkey=mysecretkey&property1=Some+Text&property2=Some+More+Text"

### Example: Implement a client listener
```html
	<script src="http://pegaio.aimx.com/pega.io.js"></script>
	<script>
		var socket = io.connect('http://pegaio.aimx.com/');
  	
		socket.on('connect', function () {
			socket.on('channel-to-broadcast-to/clientkey', function (obj) {
				console.log(obj.property1 + obj.property2 + obj.channel);
			});
			socket.on('another-channel/clientkey', function (obj) {
				console.log(obj);
			});
		});
	</script>
```
