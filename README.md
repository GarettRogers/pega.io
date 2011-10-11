# Pega

Pega is a Socket.IO/Node.JS project that makes implementing a scalable and reliable pub/sub application hassle free.  Your back-end doesn't need to be written in Node.JS to take advantage of this.

For example:  Imagine you have a server running a Python application using Tweepy to listen for real-time tweets about foosball, and you've also got a website written in PHP where people are posting comments on your foosball blog posts.

You have decided to build a third website that shows all of this activity to hundreds of thousands of interested people in real-time.  Where in the world do you start?  Pega.

## Easy Install and Run on Linux

	curl http://www.aimx.com/pega/install.sh | sh
	pega start

## Install from source
	
	git clone git://github.com/Gootch/Pega.git
	cd Pega
	./configure && make && make install
	pega start

## How to Configure

For a simple Pega server, no configuration required!

To edit the config file  (to set up more advanced stuff)

	vi /etc/pega.config
	pega restart

Refer to the wiki to learn how to configure your pega for a load balanced environment (and how to easily scale up from a single pega server).

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
		url="http://www.yourpegaserver.com/send", 
		payload=form_data, 
		method=urlfetch.POST, 
		headers={'Content-Type': 'application/x-www-form-urlencoded'})

### PHP
	$url = 'http://www.yourpegaserver.com/send';
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
	curl -d http://www.yourpegaserver.com/send "channel=channel-to-broadcast-to&secretkey=mysecretkey&property1=Some+Text&property2=Some+More+Text"

## Example: Implement a client  listener

In your HTML, or in a separate .js file, simply connect to your Pega server, and subscribe to whichever channels you want to listen to.

```html
	<script src="http://www.yourpegaserver.com/socket.io/socket.io.js"></script>
	<script>
		var socket = io.connect('http://www.yourpegaserver.com/');
  	
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

Skip all the installation and configuration by using our servers.  Sign up for the service at www.aimx.com/pega to receive a secret and client key.  

### Example: Pushing from your back-end
	#### CURL
		curl -d http://pega.aimx.com/send "channel=channel-to-broadcast-to&secretkey=mysecretkey&property1=Some+Text&property2=Some+More+Text"

### Example: Implement a client listener
```html
	<script src="http://pega.aimx.com/socket.io/socket.io.js"></script>
	<script>
		var socket = io.connect('http://pega.aimx.com/');
  	
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
