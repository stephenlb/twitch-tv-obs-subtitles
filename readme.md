![Add Subtitles to Twitch TV using OBS](https://www.pubnub.com/wp-content/uploads/2018/07/add-subtitles-to-twitch-tv-obs.png)

![tcc](https://user-images.githubusercontent.com/45214/81859404-0abbf580-951a-11ea-9334-9fbee17416fd.gif)

# Twitch TV Subtitles

You are a **live streamer** using OBS ( Open Broadcaster Software ) and you are
open to experimental ways to **increase followers** on your stream.
And you don't want to spend money, because reasons and
the internet should be free!

##  Installation Guide: OBS Subtitles for Twitch TV

> **Start here:** https://www.pubnub.com/developers/twitch-tv-obs-subtitles/

Follow the easy 60 second installation.
To install Subtitles in OBS for Twitch, start by visiting the URL above.

![Step 1](https://i.imgur.com/ScIDnJc.gif)
![Step 2](https://i.imgur.com/MFhOheM.png)
![Step 3](https://i.imgur.com/s0vvMlC.gif)


## Parameters and Settings

It's easy to change various aspects of the voice capture system including
language and text styles.

## Set Language

The default language is detected by your country of origin.
However you may wish to set the language to English.

The following will change the language to USA English:

https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?language=es-US

You can change the language to any language code.
The following are just a few examples:

 - English: `language=en-US`
 - Spanish: `language=es`
 - Mandarin: `language=zh`
 - German: `language=de`
 - Japanese: `language=ja`

More language codes shown here:
https://www.w3schools.com/tags/ref_language_codes.asp

## V1 Old Voice Setting - Downgrade Option

> We've recently upgraded the voice detection algorithm!

The new algorithm offers a continuous stream of voice detection.
The old V1 voice detection algorithm stopped recording
for 0.2 - 1.5 seconds while a new voice recognition session initialized.
The affect was a delay in recognizing your voice,
also it would cause the text on the screen to clear.

The new V2 upgrade is a continuous voice session, without any pauses or delays.
So overall it's an improved voice capture voice-to-text upgrade.
However some may have relied on this.

To downgrade the algorithm, use the `continuous=off` parameter.

> https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?continuous=off

The above link will downgrade your voice-to-text to the old algorithm.

## Change Font Style

You can set the font display style using any valid CSS modifiers.
Some defaults are available for you.

 - Set Style: `?style=CSS_HERE`
 - Set Background White: `?style=background:%23white`
 - Set Font Red: `?style=color:%23red`
 - Set Text Padding: `?style=padding:10px`

Here are some pre-built options to try:

 - Clean: https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?subkey=sub-c-79b0a26a-80a9-11e8-8f4a-96bbd71e7d14&pubkey=pub-c-fd9b97a4-7b78-4ae1-a21e-3614f2b6debe&channel=1588208805983537980353&style=color%3Argba(0%2C0%2C0%2C.9)%3Btext-shadow%3A0%200%205px%20%23fff
 - CC Caption: https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?style=background%3A%23000%3Bfont-weight%3A600%3Btext-transform%3Auppercase%3Btext-shadow%3Anone%3Bpadding%3A10px


![closed-caption](https://user-images.githubusercontent.com/45214/81862816-1fe75300-951f-11ea-9cde-ebd7ad881654.gif)
 
 
 - Blue: https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?subkey=sub-c-79b0a26a-80a9-11e8-8f4a-96bbd71e7d14&pubkey=pub-c-fd9b97a4-7b78-4ae1-a21e-3614f2b6debe&channel=1588208805983537980353&style=color%3A%2300f%3Bfont-weight%3A400%3Btext-shadow%3A0%200%205px%20%23fff
 - Rainbow: https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?subkey=sub-c-79b0a26a-80a9-11e8-8f4a-96bbd71e7d14&pubkey=pub-c-fd9b97a4-7b78-4ae1-a21e-3614f2b6debe&channel=1588208805983537980353&style=background%3Alinear-gradient(to%20right%2Corange%2C%23ff0%2Cgreen%2C%230ff%2C%2300f%2Cviolet)%20100%25%3Bfont-weight%3A800%3B-webkit-background-clip%3Atext%3B-webkit-text-fill-color%3Atransparent%3Btext-shadow%3Anone
 
![rainbow](https://user-images.githubusercontent.com/45214/81860401-8b2f2600-951b-11ea-9a0d-a7513dd63f20.gif)

Sky is the limit!
Enjoy.

## Clear Text on Screen after you stop talking

We've added a new feature to allow the text to clear from the screen after a
moment of silence.
The default is set to `4 seconds`.
You can change this by setting the following:

> Don't go lower than 2 seconds. It will cause unexpected problems for you.

 - Clear Text after 2 Seconds: https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?cleartime=2
 - Clear Text after 5 Seconds: https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?cleartime=5
 - Clear Text after 10 Seconds: https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?cleartime=10
 - Clear Text after 100 Seconds: https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?cleartime=100

And so on, you can change the value to any valid number.
Just don't go lower than 2 seconds.
Using the default of 4 seconds is recommended.

## Change Intro Text

By default the intro text is set to "Start talking."
You can change this value to anything you'd like:

 - Intro Text BLANK: https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?introtext=%20
 - Intro Text "Hello!": https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?introtext=Hello!
 - Intro Text "Whatup": https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?introtext=Whatup

## Display Last Two Lines

Sometimes you don't want a wall of text.
You want to set the display to show only the last two lines.

There's a way to crop using CSS like this `bottom:92vh`.

> https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?style=background%3A%23000%3Bfont-weight%3A600%3Btext-transform%3Auppercase%3Btext-shadow%3Anone%3Bpadding%3A10px;bottom:92vh

![Closed Captions Last Two Lines](https://user-images.githubusercontent.com/45214/81858459-a3517600-9518-11ea-8963-1eb4faaea858.gif)

Change the CSS to match your desired display.  
For example you may wish to fine-tune the crop effect using the calc operator:

`bottom:calc(100vh%20+%201.3em)`

https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?style=background%3A%23000%3Bfont-weight%3A600%3Btext-transform%3Auppercase%3Btext-shadow%3Anone%3Bpadding%3A10px;bottom%3Acalc(100vh%20%2B%201.3em)

Essentially you can add the CSS in the URL, or you can 
customize the look and feel by [forking the repo and editing the HTML directly](https://github.com/stephenlb/twitch-tv-obs-subtitles/fork).

## Nyan Cat Subtitles

Nyan Cat helps you with closed captioning. 
Nyan Cat subtitles, just in case.

![nyan-preview](https://user-images.githubusercontent.com/45214/81875360-f76a5380-9534-11ea-9600-3eb4eec0a8f6.gif)

> Try it here: https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles-nyan.html?channel=MYCHANNEL

Since **Twitch Subtitles** and Streaming Closed Captions are open source and free tool, 
it's open to fully customize the display any way you like.

## Set Max Words

Setting the maximum display words is easy using this URL parameter:

https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?maxwords=10

This will display a maximum of 10 words, just as an example.
Exclude the parameter to remove the limit.

## Disable the Microphone

If you want this page to only be used to display your voice transcript
you can disable the microphone.
This allows you to share a URL that is read-only.

https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?mic=off&subkey=sub-c-XXXX&channel=XXXX

Note that you need to specify the Subscribe Key and Channel,
while excluding the Publish Key.
This will prevent others from speaking over your output. 

## Subscribe and Publish Keys

These keys are used for private account purposes.
Only expose the Publish Key to your self, and do not share the key.

You can get a new key at https://dashboard.pubnub.com/

https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?mic=off&subkey=sub-c-XXXX&pubkey=pub-c-XXX&channel=XXXX


## Running Twitch.TV Subtitles from Local Files on your Hard Drive

If you've downloaded this repository, made changes and want 
them to be available in your OBS, you need to follow these instructions.
Due to security, you need to run an HTTP Server for OBS to access your local files.
You'll do this by opening a terminal window and running a Simple HTTP server.
Attempting to run Twitch Subtitles without an HTTP server will result in a 
non-working page with *"Start talking."* permanently stuck on the viewport.

#### 1.) Download and Install Python: https://www.python.org/downloads/

#### 2.) After you've installed Python, open your terminal and start the 
Python Simple HTTP Server in the same director as the Twitch.TV Subtitles:

> Windows: Press `WinKey+R` type `cmd` and press "Enter" to open a Command Prompt

> Mac: Press `Command+Space` type `terminal` and press "Enter".

Navigate to the Twitch TV Subtitles directory using `cd` command.

For Windows machines use:

```shell
cd twitch-tv-obs-subtitles
python -m http.server 8000
```

For Mac machines use:

```shell
cd twitch-tv-obs-subtitles
python -m SimpleHTTPServer 8080
```

> If the `cd` command fails, you need to know where the folder is located.
> You must `cd` to the folder `twitch-tv-obs-subtitles`.
> It may be in your `Downloads` folder: `cd Downloads/twitch-tv-obs-subtitles`.
> If you are still having trouble, you may try the **`Alternate`** lower in this document.

#### 3.) Copy the URL from Step 2 on the [Subtitles Twitch.TV Page](https://www.pubnub.com/developers/twitch-tv-obs-subtitles/)

The URL will look similar to this:

```shell
https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?subkey=sub-c-79b0a26a-80a9-11e8-8f4a-96bbd71e7d14&pubkey=pub-c-fd9b97a4-7b78-4ae1-a21e-3614f2b6debe&channel=1552687539739502028833&style=background%3Ablack%3Bfont-weight%3A600%3Btext-transform%3Auppercase%3Btext-shadow%3Anone%3Bpadding%3A10px%3B
```

> **Keep [Subtitles Twitch.TV Page](https://www.pubnub.com/developers/twitch-tv-obs-subtitles/) open.**
> This page will capture your voice and transmit it to your local computer.

#### 4.) Modify the copied URL from Step 3 by replacing

**`https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html`** with

**`http://0.0.0.0:8080/subtitles.html`**.

Your final URL will look like:
```shell
http://0.0.0.0:8080/subtitles.html?subkey=sub-c-79b0a26a-80a9-11e8-8f4a-96bbd71e7d14&pubkey=pub-c-fd9b97a4-7b78-4ae1-a21e-3614f2b6debe&channel=1552687539739502028833&style=background%3Ablack%3Bfont-weight%3A600%3Btext-transform%3Auppercase%3Btext-shadow%3Anone%3Bpadding%3A10px%3B
```

#### 5.) Past the Final URL into OBS.
Note that your final URL will differ from the one shown above.

That's it!  
If you've made a mistake start over from the beginning 
it won't hurt to repeat any of the steps.
However you may run into issues.
That's why we've included a second option that may work better for you.

## Alternate: Running Twitch.TV Subtitles from Local Files on your Hard Drive

> While this method is easier, it is not the preferred method.
This method introduces an opportunity for someone else to take
over your subtitles mid-stream.
It is unlikely that someone will know how to do this,
however it is easy for a hacker.
If you want to avoid a hacker taking over your subtitles,
use the secure method:
[Secure Method](#running-twitchtv-subtitles-from-local-files-on-your-hard-drive).

> Also if you're using [Subtitles Twitch.TV Page](https://www.pubnub.com/developers/twitch-tv-obs-subtitles/)
directly off the PubNub website, then your are secured automatically.

#### 1.) Edit the file `js/username.js`.
It will look like this:

```js
function username() {
    return ""; // <-- Fill in your username
               // example: return "ninja";
}
```

And type in your Twitch Username like this:

```js
function username() {
    return "MY_TWITCH_ID_HERE"; // <-- Fill in your username
               // example: return "ninja";
}
```

#### 2.) Copy the URL from Step 2 on the [Subtitles Twitch.TV Page](https://www.pubnub.com/developers/twitch-tv-obs-subtitles/)

It will look similar to this:

```shell
https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?channel=1552687539739502028833&subkey=sub-c-79b0a26a-80a9-11e8-8f4a-96bbd71e7d14&pubkey=pub-c-fd9b97a4-7b78-4ae1-a21e-3614f2b6debe&style=background%3Ablack%3Bfont-weight%3A600%3Btext-transform%3Auppercase%3Btext-shadow%3Anone%3Bpadding%3A10px%3B
```

#### 3.) Modify the copied URL from Step 2 by replacing

**`channel=1552687539739502028833`**  with

**`channel=MY_TWITCH_ID_HERE`**.

#### 4.) Point your Chrome Browser to: 

```shell
https://stephenlb.github.io/twitch-tv-obs-subtitles/subtitles.html?channel=MY_TWITCH_ID_HERE&subkey=sub-c-79b0a26a-80a9-11e8-8f4a-96bbd71e7d14&pubkey=pub-c-fd9b97a4-7b78-4ae1-a21e-3614f2b6debe&style=background%3Ablack%3Bfont-weight%3A600%3Btext-transform%3Auppercase%3Btext-shadow%3Anone%3Bpadding%3A10px%3B
```

> Warning! Make sure only **one Twitch.TV Subtile Page** is open.
If they are others, they will block your local page.

#### 5.) Add a new browser source in OBS.

#### 6.) Check `Local file` in OBS Browser config window.

#### 7.) Click `Browse` button and select `subtitles.html`
found in your folder `twitch-tv-obs-subtitles`.

That's it!
Easy right?

## What is an OBS Browser Source?

Browser Sources can be added to your scenes of your streaming software and
enable you to use web based content such as Flash and JavaScript applications,
websites and so on and even customize them via CSS. Since this kind of content
is usually not written in the same coding languages as your streaming
application, a translator is needed to make it possible for both to
communicate with each other.


## Open Captions

Technically this software is considered as `Open Captions`,
as the captions are controlled by the streamer/broadcaster.
Closed Captions are controllable by the viewer of the stream.

## Build Website Landing page

You will not need to do this as it is only a tool used for building the
landing page on the PubNub Website.
This will build `./build/dashboard.html` and copy source to your clipboard.
You can see a live version of the
[Twitch TV OBS Subtitles Browser Source](https://www.pubnub.com/developers/twitch-tv-obs-subtitles/) page.

```
./copy
```

## See more voice app projects

We have built several more apps using the 
[Spoken NPM Package](https://www.npmjs.com/package/spoken).
Check them out below.

### Build an 80's Chatbot with an NPM Package

How to build a
[voice-controlled intelligent chatbot](https://www.pubnub.com/blog/build-an-80s-chatbot-with-an-npm-package/)
who comprehends human speech and responses accordingly and naturally!

### Add Voice Contorl to your OBS Twitch and YouTube Live Streams

Learn how we [built an OBS
Plugin that adds Subtitles to your
Live Stream](https://www.pubnub.com/developers/twitch-tv-obs-subtitles/).

Add Subtitles to your Twitch stream! Easy OBS integration.
Plugins should be easy to make! And for OBS, this is true. Hurray!
The best way by far, my opinion, is using OBS Browser Sources.
