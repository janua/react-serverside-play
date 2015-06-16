package service

case class Post(title: String)

object Blog {
  private var posts: List[Post] = Nil

  def addPost(post: Post) = posts = posts :+ post
  def deletePost(post: Post) = posts = posts.filterNot(_ == post)
}
