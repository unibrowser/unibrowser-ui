import React from 'react';
import ResultView from './result-view';
import querystring from 'query-string';
import mock, { sportsMock, seminarMock, freeFoodMock, eventsMock, faqMock } from '../../model/results';

class ResultControl extends React.Component {
	constructor(props) {
		super(props);
		let search = querystring.parse(this.props.location.search);
		this.state = {
			query: search.query,
			category: this.props.match.params.category,
			results: [],
			selectedResult: null
		};

		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.onResultSelect = this.onResultSelect.bind(this);
		this.retrieveSearchResults = this.retrieveSearchResults.bind(this);
	}

	async componentDidMount() {
		let results = await this.retrieveSearchResults(this.state.category, this.state.query);
		this.setState({ results: results });
	}

	async retrieveSearchResults(category, query) {
		try {
			let resp = await fetch(`http://localhost:8080/api/${category}?query=${query}`);
			let data = await resp.json();
			return data;
		} catch (e) {
			console.log(e);
			console.log(faqMock);
			if (category === 'sports') return sportsMock;
			if (category === 'seminars') return seminarMock;
			if (category === 'freefood') return freeFoodMock;
			if (category === 'events') return eventsMock;
			if (category === 'faqs') return faqMock;
			return mock;
		}
	}

	async onSearchSubmit(query) {
		this.props.history.push({
			pathname: `/search/${this.props.match.params.category}`,
			search: '?query=' + encodeURI(query)
		});
		this.setState({ query });
		let results = await this.retrieveSearchResults(this.state.category, query);
		this.setState({ results });
	}

	onResultSelect(result) {
		this.setState({ selectedResult: result });
		this.props.history.push({
			pathname: `/search/${this.props.match.params.category}/results/${result.id}`
		});
	}

	render() {
		return (
			<ResultView
				query={this.state.query}
				category={this.state.category}
				onSearch={this.onSearchSubmit}
				onResultSelect={this.onResultSelect}
				results={this.state.results}
				selectedResult={this.state.selectedResult}
			/>
		);
	}
}

export default ResultControl;
