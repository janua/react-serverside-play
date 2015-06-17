package service

import play.api.libs.json.Json

case class Post(title: String)

object Post {
  implicit val postFormat = Json.format[Post]
}

object Blog {
  private var posts: List[Post] = Nil

  def addPost(post: Post) = {
    posts = posts :+ post
    posts
  }

  def deletePost(post: Post) = {
    posts = posts.filterNot(_ == post)
    posts
  }

  def allPosts = posts
}
