package controllers

import java.io.FileReader
import javax.script.ScriptEngineManager
import play.api.mvc._

object Application extends Controller {

  val maybeEngine = Option(new ScriptEngineManager(null).getEngineByName("nashorn"))

  def index = Action {
    maybeEngine match {
      case None => BadRequest("Nashorn script engine not found. Are you using JDK 8?")
      case Some(engine) =>
        // React expects `window` or `global` to exist. Create a `global` pointing
        // to Nashorn's context to give React a place to define its global namespace.
        engine.eval("var backendState = this;")
        engine.eval("backendState.title = 'Hello';")
        engine.eval("backendState.posts = [{title:'My first backend post'}];")

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
}

