console = {
  log: print,
  warn: print,
  error: print
};

var BlogPost = React.createClass({
  render: function() {
    return (
          <li>{this.props.title}</li>
    );
  }
});

var Blog = React.createClass({
  getInitialState: function() {
    return ({
      title: backendState.title || "No Title",
      posts: backendState.posts || []
    });
  },
  render: function() {
    var postsHtml = _.map(this.state.posts, function(post) {
      return (<BlogPost title={post.title}/>);
    });

    return (
      <div>
        <h1>{this.state.title}</h1>
        <ul>
          {postsHtml}
        </ul>
      </div>
    );
  }
});
