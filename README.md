# Pega.IO

Pega.IO is a Socket.IO/Node.JS project that makes implementing a scalable and reliable pub/sub application hassle free.  Your back-end doesn't need to be written in Node.JS to take advantage of this.

For example:  Imagine you have a server running a Python application using Tweepy to listen for real-time tweets about foosball, and you've also got a website written in PHP where people are posting comments on your foosball blog posts.

You have decided to build a third website that shows all of this activity to hundreds of thousands of interested people in real-time.  Where in the world do you start?  Pega.IO.

## Easy Install and Run on Linux (Ubuntu)
	curl http://cloud.github.com/downloads/Gootch/pega.io/install.sh | sh

### Common pitfalls:
- Make sure port 8888 is open to TCP traffic on your firewall
- If you choose to use port 80 (set in app.js), you must run with sudo
	killall node
	sudo ~/local/bin/pegaio start

## Install Manually
### Dev Tools (Ubuntu, Debian)
	sudo apt-get -y update
	sudo apt-get -y install libssl-dev git-core pkg-config build-essential curl gcc g++

### Dev Tools (Red Hat, CentOS)
	sudo yum update
	sudo yum install openssl-devel git-core pkgconfig curl gcc gcc-c++ kernel-devel
	
### Node
	mkdir ~/node-install
	cd ~/node-install
	wget http://nodejs.org/dist/node-v0.4.12.tar.gz
	tar -zxf node-v0.4.12.tar.gz
	cd node-v0.4.12
	sudo ./configure 
	sudo make
	sudo make install
	
### NPM
	curl http://npmjs.org/install.sh | sudo sh

### Redis
	cd ~
	mkdir redis && cd redis
	wget http://redis.googlecode.com/files/redis-2.4.1.tar.gz
	tar -zxf redis-2.4.1.tar.gz
	cd redis-2.4.1
	sudo make
	sudo make install
	wget https://github.com/ijonas/dotfiles/raw/master/etc/init.d/redis-server
	sudo rm -f redis.conf
	wget http://cloud.github.com/downloads/Gootch/pega.io/redis.conf
	sudo mv redis-server /etc/init.d/redis-server
	sudo chmod +x /etc/init.d/redis-server
	sudo mv redis.conf /etc/redis.conf
	sudo useradd redis
	sudo mkdir -p /var/lib/redis
	sudo mkdir -p /var/log/redis
	sudo chown redis.redis /var/lib/redis
	sudo chown redis.redis /var/log/redis
	sudo update-rc.d redis-server defaults
	sudo service reeds start

### Pega.IO
	cd ~
	git clone git://github.com/Gootch/pega.io.git
	cd pega.io
	npm install .
	node app.js

## How to Configure

For a simple Pega.IO server, no configuration required!  For advanced configuration, see app.js

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
		url="http://www.your-pega-io-server.com:8888/send", 
		payload=form_data, 
		method=urlfetch.POST, 
		headers={'Content-Type': 'application/x-www-form-urlencoded'})

### PHP
	$url = 'http://www.your-pega-io-server.com:8888/send';
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
	curl -d "channel=channel-to-broadcast-to&secretkey=mysecretkey&property1=Some+Text&property2=Some+More+Text" http://www.your-pega-io-server.com:8888/send

## Example: Implement a client  listener

In your HTML, or in a separate .js file, simply connect to your Pega.IO server, and subscribe to whichever channels you want to listen to.

```html
	<script src="http://www.your-pega-io-server.com:8888/socket.io/socket.io.js"></script>
	<script>
		var socket = io.connect('http://www.your-pega-io-server.com:8888/');
  	
		socket.on('connect', function () {
			socket.on('channel-to-broadcast-to', function (obj) {
				console.log(obj.property1 + obj.property2 + obj.channel);
			});
			socket.on('another-channel', function (obj) {
				console.log(obj);
			});
		});
	</script>