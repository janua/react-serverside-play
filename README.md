# React Serverside in Play

This is just a small example of `react` being rendered by the server in `Scala` using `Nashorn` and `play`.

The main part of the `DOM` is completely rendered by `react` on the server.

In the case of no `javascript`, it accepts `form` `POSTS`, otherwise it just uses standard `ajax`.

#### Requirements

You need JDK 8 which has `Nashorn` included with it.

A browser with the `fetch` API. I have not included a polyfill for this.

#### Run

Go to root directory, then:

`sbt`

`run`

You can now hit the app on `http://locahost:9000/`.

Try using it with and without `javascript`.

