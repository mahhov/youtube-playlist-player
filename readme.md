## yt playlist
    
### demo
    
    http://yt-playlist-player.herokuapp.com/
    
### purpose

Since a recnet youtube update, playing playlists containing more than 200 video's has been problamatic (restarts at first video every ~2-3 videos).

This angular app is meant as a work around for playing youtube playlists.

### features
- Shuffle option
- Video preview
- Saves playlist id to localstorage so that it needs not be entered every time
- Skip to next video & skip to specific video
- List all video's in playlist (clicking on them jumps to that video without changing shuffle option) 
    - This is something youtube has been lacking for a while. The youtube playlist page only loads 100 videos at a time. And the youtube player only shows ~9 videos at a time.
    
### running locally
```
cd {workspace}
mkdir {dirname}
git clone {git remote url} {dirname}
grunt dev
```