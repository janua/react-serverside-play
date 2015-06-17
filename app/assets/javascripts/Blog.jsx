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
        <h1>{this.state.title}</h1>
        <ul>
          {postsHtml}
        </ul>
        <BlogEditor refreshPosts={this.refreshPosts}/>
      </div>
    );
  }
});
