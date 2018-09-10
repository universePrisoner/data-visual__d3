const dataset = [
	{
		'lang' : 'Python',
		'usage': 20
	},
	{
		'lang' : 'Ruby',
		'usage': 48
	},
	{
		'lang' : 'Javascript',
		'usage': 74
	},
	{
		'lang' : 'PHP',
		'usage': 90
	},
	{
		'lang' : 'Perl',
		'usage': 8
	},
	{
		'lang' : 'Scala',
		'usage': 11
	},
	{
		'lang' : 'Java',
		'usage': 39
	},
	{
		'lang' : 'Cobalt',
		'usage': 89
	},
	{
		'lang' : 'C++',
		'usage': 9
	},
	{
		'lang' : 'C#',
		'usage': 18
	}
];

const margin = {top: 50, right: 50, bottom: 50, left: 50};

var svgSize = {'width' : 600, 'height' : 600};
var chartSize = {'width' : svgSize.width - margin.left - margin.right, 'height' : svgSize.height - margin.top - margin.bottom};
var barSize = {'width' : chartSize.width / dataset.length};

var svg = d3.select('body').append('svg');

svg.attr('width', svgSize.width)
	.attr('height', svgSize.height);

var xAxis = d3.scaleBand().range([0, chartSize.width]).domain(dataset.map((d) => d.lang));
var yAxis = d3.scaleLinear().range([chartSize.height, 0]).domain([0, d3.max(dataset, (arr) => arr.usage)]);


var chart = svg.append('g')
				.attr('transform', `translate(${margin.left}, ${margin.top})`)
				.selectAll('rect')
				.data(dataset)
				.enter()
				.append('rect')
				.attr('class', 'bar')
				.attr('width', barSize.width)
				.attr('height', (d) => { return chartSize.height - yAxis(d.usage)})
				.attr('x', (d, i) => { return barSize.width * i;})
				.attr('y', (d) => yAxis(d.usage));

svg.append('g')
	.attr('transform', function() {
		let position = [margin.left, svgSize.height - margin.bottom];

		return `translate(${position})`;
	})
	.call(d3.axisBottom(xAxis));

svg.append('g')
	.attr('transform', `translate(${margin.left}, ${margin.top})`)
	.call(d3.axisLeft(yAxis));