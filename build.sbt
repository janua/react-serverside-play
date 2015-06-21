name := "react-serverside-play

version := "0.1"

scalaVersion := "2.11.1"

resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

libraryDependencies ++= Seq(
  "com.typesafe.play" %% "play" % "2.3.0",
  "org.webjars" %% "webjars-play" % "2.3.0-3",
  "org.webjars" % "react" % "0.13.1",
  "org.webjars" % "lodash" % "2.4.1"
)

lazy val root = (project in file(".")).enablePlugins(PlayScala).enablePlugins(SbtWeb)

