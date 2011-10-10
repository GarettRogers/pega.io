Dead simple pub-sub using node.js.  Extremely easy to get started, scale, and use.  It hooks into any back-end you have, and works on any browser your visitors are using.  That means you don't have to worry about refactoring your existing codebase to take advantage of pub-sub push using web sockets.

# easy-pub-sub

easy-pub-sub is a Socket.IO/Node.JS project that makes implementing a scalable and reliable pub/sub application hassle free.  Your back-end doesn't need to be written in Node.JS to take advantage of this.

For example:  Imagine you have a server running a Python application using Tweepy to listen for real-time tweets about foosball, and you've also got a website written in PHP where people are posting comments on your foosball website.

You have decided to build a third website that shows all of this real-time activity to hundreds of thousands of interested people.  How in the world are you going to do this?  easy-pub-sub.

## How to Install

	npm install easy-pub-sub socket.io express redis

## How to Configure

For a simple pub sub server, no configuration required!

For a highly scalable solution, refer to the wiki to learn how to install/manage your servers (and how to scale up from a single pub sub server).

## How to push from a back-end

### Python
	form_fields = {
		"channel":"channel-to-broadcast-to",
		"property1":"Some Text",
		"property2":"Some More Text
	}
	form_data = urllib.urlencode(form_fields)

	urlfetch.make_fetch_call(rpc=urlfetch.create_rpc(), url="http://www.yourpushserver.com/send", payload=form_data, method=urlfetch.POST, headers={'Content-Type': 'application/x-www-form-urlencoded'})

