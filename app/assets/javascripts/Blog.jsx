console = {
  log: print,
  warn: print,
  error: print
};

var BlogPost = React.createClass({
  render: function() {
    return (
          <li>
            <h2>{this.props.title}</h2>
            <div>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </div>
          </li>
    );
  }
});

var BlogEditor = React.createClass({
    getInitialState: function() {
        return ({
            input: ''
        });
    },
    onUpdate: function(event) {
        this.setState({input: event.target.value});
    },
    onClick: function(event) {
        event.preventDefault();
        var self = this;
        fetch('/addpost', {
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: this.state.input}),
            method: 'POST'})
        .then(function(r) { return r.json() })
        .then(function (json) {
          self.props.refreshPosts(json);
        });
    },
    render: function() {
        return (
            <div>
                <form action="addpost" method="post">
                    <input name="title" id="title" type="field" onChange={this.onUpdate.bind(this)}></input>
                    <button onClick={this.onClick.bind(this)}>Send</button>
                </form>
            </div>
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
  componentDidMount: function() {
      var self = this;
      fetch('/allposts', {
          headers: {'Content-Type': 'application/json'},
          method: 'GET'})
          .then(function(r) { return r.json() })
          .then(function (json) {
              var newState = {posts: json};
              self.setState(newState);
          });
  },
  refreshPosts: function(posts) {
    this.setState({posts: posts});
  },
  render: function() {
    var postsHtml = _.map(this.state.posts, function(post) {
      return (<BlogPost title={post.title}/>);
    });

    return (
      <div>
        <h1 className="header">{this.state.title}</h1>
          <BlogEditor refreshPosts={this.refreshPosts}/>
          <ul>
          {postsHtml}
        </ul>
      </div>
    );
  }
});
