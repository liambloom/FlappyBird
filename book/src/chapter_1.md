# What is Programming?

When we want one of our fellow humans to do something, we give them a set of *instructions*. 
We do this in the form of words and sentences, in English (or whatever language(s) you may 
speak). When we want computers to do something, we need to give them a set of instructions
too, but this is a bit harder, because computers don't speak English. Instead, we must 
give them instructions in a very specific format, and this is called *code*. When you
are writing code, you are *programming*.

There are many different *programming languages*, for many different purposes. Luckily for
those of us who live in English-speaking parts of the world, nearly all of them are use 
English. Take this snippet of code from [chapter ???]()

```js
class Bird {
    constructor() {
        this.initialJumpPosition = canvas.height / 2;
        this.jumpStartTime = performance.now();
        this.isStopped = false;
    }

    jump() {
        if (game.state != gameStates.running) {
            this.initialJumpPosition = this.y;
            this.jumpStartTime = game.time;
        }
    }
}
```

While you probably have no idea what the above code *does* (yet), you will recognize many of 
the words used in the code, such as `class`, `constructor`, `this`, and `performance`. By using
these words, along with symbols like dots (`.`), equals signs (`=`), parentheses (`()`), and 
curly braces (`{}`), we can create any program you can possibly imagine.

## What can you do with programming?

As the previous section alluded to, the answer to this question is *anything*. Here are a few
examples though, and the programming language(s) that are the best if you want to make them.

- High performance programs, like operating systems and (some) games (C/C++)
- Artificial intelligence and machine learning (Python)
- Enterprise applications, android apps, and minecraft (Java)
- iOS and OSX apps (Swift, Objective C)
- Websites (HTML, CSS, and JavaScript)

## A Brief History of the Internet

> tl;dr (An Even Briefer History of the Internet)
> 
> Hyper-Text Markup Language (HTML) is the language used to create web-pages. The fifth version of
> the language, HTML5, introduced the `<canvas>` element as a way to create web-based animations,
> similar to the now-defunct Adobe Flash. Code for it is written in JavaScript, the language that
> is used to add interactivity to the web.

The government began researching ways for computers to share information in the 1960s. In 1969,
they launched ARPANET, the precursor to the internet, which allowed for the government and other
research institutions to share their research. Then, on January 1, 1983, a standardized way for
computers to talk to each other, know as TCP/IP, was created, and the internet was born. 

On January 1, 1983, a standardized way for computers to talk to each other, known as TCP/IP (you
may have hear the term "ip address") was invented, and the internet was born. There had been previous
computer networks, such as the ARPANET, but this was the first standardized way for computers
to communicate.

In March 1989, Tim Berners-Lee, a CERN scientist, wrote the first proposal for the World Wide Web 
(often abbreviated to WWW or W3). It was a system of resources connected by *hyperlinks*, that
looked like [this](). The first website, published the next year, can still be found 
[here](info.cern.ch/hypertext/WWW/TheProject.html)

Hyper-Text Markup Language, or HTML, was invented in 1991 and first released in 1993 by Tim Berners-Lee.
It is still used today to create web pages, from google to the one you're looking at right now.

In September 1995, Brendan Eich created JavaScript to allow web pages in Netscape Navigator (a web 
browser which later became Firefox) to be *dynamic* (they could change). He named it after the language
Java, not because it had any relationship (it doesn't), but because Java was popular at the time, and 
he wanted people to like JavaScript.  Prior to this creation, web pages were *static* (unchanging),
and there was no way to make anything interactive.

In November 1996, FutureSplash, the animation software used to create the first versions of <i>The
Simpsons</i>, was acquired by Macromedia and rebranded it as <i>Macromedia Flash</i>. This software was
acquired by Adobe in 2005 and renamed to <i>Adobe Flash</i>, by which time it was the most downloaded
web media format.

On January 22, 2008, the fifth version of HTML (HTML5) was released, adding a number of new media features
to the language, including the `<canvas>` element, which had similar animation capabilities to Adobe Flash.

At the end of 2020, Adobe Flash was officially discontinued, leaving the HTML5 Canvas as the way to create
web-based animations and animated games.

