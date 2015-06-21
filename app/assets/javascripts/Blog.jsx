
var BlogPost = React.createClass({
  render: function() {
    return (
          <li>
            <h2>{this.props.title}</h2>
            <div>
                <p>Lorem ipsum dolor sit amet, natum augue simul usu et. Prima tincidunt sed ea. Vel albucius explicari voluptatum ut. Qui vocibus eligendi honestatis cu, cu enim novum est.</p>
                <p>Sit ut discere repudiare. Sed at aliquip accommodare, ei sit nonumy qualisque. Vis ei sint nemore dissentiet. Ex eos case aperiam, cetero vocent posidonium ad cum. Has id populo elaboraret, detracto indoctum philosophia ad cum.</p>
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
                <p className="enterTitle">Enter Post Title:</p>
                <form className="entryForm" action="addpost" method="post">
                    <input name="title" id="title" type="field" onChange={this.onUpdate.bind(this)}></input>
                    <button onClick={this.onClick.bind(this)}>Post</button>
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
