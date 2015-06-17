package controllers

import java.io.FileReader
import javax.script.ScriptEngineManager
import play.api.libs.json.Json
import play.api.mvc._
import service.{Post, Blog}

object Application extends Controller {

  val maybeEngine = Option(new ScriptEngineManager(null).getEngineByName("nashorn"))

  def index = Action {
    maybeEngine match {
      case None => BadRequest("Nashorn script engine not found. Are you using JDK 8?")
      case Some(engine) =>
        // React expects `window` or `global` to exist. Create a `global` pointing
        // to Nashorn's context to give React a place to define its global namespace.
        engine.eval("var backendState = this;")
        engine.eval("backendState.title = 'List of posts';")
        engine.eval(s"backendState.posts = ${Json.stringify(Json.toJson(Blog.allPosts))};")

        //val posts = new SimpleBindings()
        //posts.put("posts", "[{title: 'From engine put'}]")
        //engine.setBindings(posts, ScriptContext.GLOBAL_SCOPE)

        // Evaulate React and the application code.
        engine.eval(new FileReader("target/web/web-modules/main/webjars/lib/react/react-with-addons.js"))
        engine.eval(new FileReader("target/web/web-modules/main/webjars/lib/lodash/lodash.min.js"))
        engine.eval(new FileReader("target/web/public/main/javascripts/Blog.js"))

        Ok(views.html.index {
          play.twirl.api.Html(engine.eval("React.renderToString(React.createElement(Blog));").toString)
        })
    }
  }

  def getAllPosts = Action {
    Ok(Json.toJson(Blog.allPosts)).as("application/json")
  }

  def addPost = Action { request =>
    (request.body.asFormUrlEncoded, request.body.asJson.flatMap(_.asOpt[Post])) match {
      case (_, Some(post)) => Ok(Json.toJson(Blog.addPost(post))).as("application/json")
      case (Some(formData), _) =>
        formData.mapValues(_.mkString).get("title").map(Post.apply).map(Blog.addPost).map(_ => Redirect("/")).getOrElse(NotAcceptable)
      case _ => NotAcceptable
    }
  }

  def deletePost = Action { request =>
    request.body.asJson.flatMap(_.asOpt[Post]) match {
      case Some(post) => Ok(Json.toJson(Blog.deletePost(post))).as("application/json")
      case None => NotAcceptable
    }  }
}

