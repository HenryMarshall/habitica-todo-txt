# Habitica and todo.txt integration
This web app syncs your todo list between [Habitica](https://habitica.com/) and 
[todo.txt](http://todotxt.com). Getting the current state of your todo.txt file
relies on Dropbox.

## Running the code 
You'll need to [register an app on
Dropbox](https://www.dropbox.com/developers/apps) and get your API key from
Habitica. At this early stage we rely on a file called `options.js` which must
export your credentials.

## TODO

* Verify the accuracy of the Habitica User ID and API Token on registration
* Verify the existance of specified todo.txt file on registration
