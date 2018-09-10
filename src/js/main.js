var req = new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.onload = function() {
	const json = JSON.parse(req.responseText);
	const dataset = json.data;
	const sourceName = json.source_name;


	const margin = {top: 50, right: 50, bottom: 50, left: 50};
	var svgSize = {'width' : 1200, 'height' : 600};
	var chartSize = {'width' : svgSize.width - margin.left - margin.right, 'height' : svgSize.height - margin.top - margin.bottom};
	var barSize = {'width' : chartSize.width / dataset.length};

	var svg = d3.select('body').append('svg');

	svg.attr('width', svgSize.width)
		.attr('height', svgSize.height);

	var xAxis = d3.scaleLinear().range([0, chartSize.width]).domain(
					[
						d3.min(dataset, (d) => parseInt(d[0].slice(0, 5), 10)), 
						d3.max(dataset, (d) => parseInt(d[0].slice(0, 5), 10))
					]);
	var yAxis = d3.scaleLinear().range([chartSize.height, 0]).domain([0, d3.max(dataset, (arr) => arr[1])]);

	var tooltip = d3.select('body')
					.append('div')
					.attr('class', 'tooltip')
					.attr('id', 'tooltip')
					.style('opacity', 0);

	var chart = svg.append('g')
					.attr('transform', `translate(${margin.left}, ${margin.top})`)
					.selectAll('rect')
					.data(dataset)
					.enter()
					.append('rect')
					.attr('class', 'bar')
					.attr('data-date', (d) => d[0])
					.attr('data-gdp', (d) => d[1])
					.attr('width', barSize.width - 0.5)
					.attr('height', (d) => { return chartSize.height - yAxis(d[1])})
					.attr('x', (d, i) => { return barSize.width * i;})
					.attr('y', (d) => yAxis(d[1]))
					.on('mouseover', (d) => {
						var dateArray = d[0].split('-');
						switch(parseInt(dateArray[1], 10)){
							case 1:
								dateArray[1] = '1';
								break;
							case 4:
								dateArray[1] = '2';
								break;
							case 7:
								dateArray[1] = '3';
								break;
							case 10:
								dateArray[1] = '4';
								break;
							default:
								dateArray[1] = 1;
						}

						tooltip.transition()
								.duration(200)
								.style('opacity', 0.9);
						
						tooltip.html(
								`Year: ${dateArray[0]} <br/>
								Q: ${dateArray[1]} <br/>
								GDP: ${d[1]}
								`
							)
							.attr('data-date', d[0])
							.style('left', (d3.event.pageX) + 'px')
							.style('top', (d3.event.pageY) + 'px');
					})
					.on('mousemove', () => {
						tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px');
					})
					.on('mouseout', (d) => {
						tooltip.transition()
								.duration(500)
								.style('opacity', 0);
					});

	svg.append('g')
		.attr('transform', function() {
			let position = [margin.left + 0.5, svgSize.height - margin.bottom];

			return `translate(${position})`;
		})
		.attr('id', 'x-axis')
		.call(d3.axisBottom(xAxis).tickFormat(d3.format("d")));

	svg.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)
		.attr('id', 'y-axis')
		.call(d3.axisLeft(yAxis));

	var title = svg.append('text')
					.attr('x', svgSize.width / 2)
					.attr('y', margin.top)
					.style('text-anchor', 'middle')
					.text(sourceName)
					.attr('id', 'title')
					.attr('class', 'title');

	svg.append('text')
		.attr('x', chartSize.width - margin.right * 3)
		.attr('y', chartSize.height + margin.bottom + 30)
		.attr('dy', '1em')
		.style('text-anchor', 'middle')
		.text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf');

	svg.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', margin.left)
		.attr('x', 0 - (chartSize.height / 2))
		.attr('dy', '1em')
		.attr('class', 'axis-title')
		.style('text-anchor', 'middle')
		.text('Gross Domestic Product');
}
req.send();


