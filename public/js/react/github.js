(function(App) {

	App.Views.Github = React.createClass({
		loadNotificationsFromServer: function() {
			this.setState({loading: true});
			$.ajax({
				url: this.props.url,
				dataType: 'json',
				cache: false,
				success: function(data) {
					if (typeof data.error !== 'undefined') {
						this.setState({error: data.error, loading: false});
					} else {
						this.setState({data: data, loading: false});
					}
				}.bind(this),
				error: function(xhr, status, err) {
					this.setState({loading: false});
					console.error(this.props.url, status, err.toString());
				}.bind(this)
			});
		},
		getInitialState: function() {
			return {
				loading: false,
				error: null,
				data: []
			};
		},
		componentDidMount: function() {
			this.loadNotificationsFromServer();
			setInterval(this.loadNotificationsFromServer, this.props.pollInterval);
		},
		render: function() {
			var loading;
			if (this.state.loading) {
				loading = <div className="box-loading"><i className="fa fa-spinner fa-spin"></i></div>
			}

			if (this.state.error) {
				return (
					<div className="github-status box box-has-error">
						{loading}
						<App.Views.Error type={this.state.error.type} data={this.state.error.data} />
					</div>
				);
			}

			var notifications = this.state.data.map(function(notification) {
				var typeIcon = <i className="fa fa-exclamation-circle"></i>
				if(notification.subject.type == 'PullRequest') {
					typeIcon = <i className="fa fa-code-fork"></i>
				}

				return (
					<tr key={notification.id}>
						<td className={'type type-' + notification.subject.type.toLowerCase()}>{typeIcon}</td>
						<td className="name"><a href={notification.repository.html_url} target="_blank">{notification.repository.full_name}</a></td>
						<td className="title">{notification.subject.title}</td>
						<td className="time">{moment(notification.updated_at).fromNow()}</td>
					</tr>
				);
			});
			return (
				<div className="github-status box">
					{loading}
					<table className="github-notifications">
						{notifications}
					</table>
				</div>
			);
		}
	});

})(App);