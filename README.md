pipviewer
=========

Picture-in-Picture Viewer Chrome Extension

# Requirements
In order to use the new panel window feature you need to type chrome://flags/#enable-panels in address bar and enable panel windows (a chrome restart is required), otherwise only popup windows will be created.

# Features
* Playing online videos in a standalone window!
* A convenient way for Facebook chatting!
* A always-on-top window for Hangouts video calls!
* Viewing websites in mobile view!

# Usage
By clicking the PiP button a panel window will be created based on your current tab.

* If it is a new tab there will be a popup box for you to enter the url you want.
* If you are viewing a video or the url ends with .swf the video or the flash will be captured into a iframe block automatically.
* Otherwise the url will be loaded directly by the panel window, and it's in mobile view!

Supported video sites:
* Youtube
* Youku

# Known issues
* Don't do right click in a PiP window, your chrome will crash, fixed in Chrome Canary v33.0.1703.0
* Your should open PiP window from a video link directly instead of opening Youtube home page

# Updates
## v0.3.1
* Can open url without prefix like "http://"
* Add option for automatically open current tab in panel window
* Add shortcuts for Facebook and Google Keep
