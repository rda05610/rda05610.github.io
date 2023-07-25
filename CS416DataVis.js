let globalData;
let colorCode = ["cornflowerblue", "darkkhaki", "yellow", "mediumseagreen", "orange", "mediumpurple", "tomato"]
let oilColor = colorCode[0];
let cementColor = colorCode[1];
let coalColor = colorCode[2];
let consumptionColor = colorCode[3];
let flaringColor = colorCode[4];
let gasColor = colorCode[5];
let tradeColor = colorCode[6];
let nameCode = ["Oil Co2", "Cement Co2", "Coal Co2", "Consumption Co2", "Flaring Co2", "Gas Co2", "Trade Co2"]
//Scene 1 Globals
let filteredCountries = [];
let currYear = "1980";

//Scene 2 Globals
//Year Range
//Country
let startYear = "1980";
let endYear = "2000";
let selectedCountry;

//Scene 3 Globals
//Year
async function init() {
   
    hideScene1()
    hideScene2()
    hideScene3()
    
    console.log("Start Loading...")
    const data = await d3.csv('https://gist.githubusercontent.com/rda05610/eb25a873cd0452e32d08461689fa3120/raw/53b3fc81db304220dbd37536574b5cae4caff285/owid-co2-data')
    console.log("Done Loading...")     
    
    globalData = cleanAndFilterData(data);

    let cleanAndFilteredData = cleanAndFilterData(data)

    //let yearSelected = cleanAndFilteredData.filter(d => d.year === currYear)
    let uniqueCountry = [...new Set(Array.from(new Set(cleanAndFilteredData.map(d => d.country))).sort())]
    let yearSelectedOptions = [...new Set(Array.from(new Set(cleanAndFilteredData.map(d => d.year))).sort())]
   
    initYearDropdown(yearSelectedOptions, cleanAndFilteredData);
    initCountryDropdown(uniqueCountry, cleanAndFilteredData);
    initFilterCheckboxes(uniqueCountry, cleanAndFilteredData);

    loadScene1(cleanAndFilteredData)
}  

function initScatter(input) {
    let height = screen.height
    let width = screen.width
    var marginx = 50
    var marginy = 50
        
    input.forEach(function(d) {
        d.population = +d.population;
        d.co2 = +d.co2;
    });

    var filteredByYear = input.filter(function(d) {return d.year == currYear})

    var popmax = d3.max(filteredByYear, function(d) { return d.population; });
    var co2max = d3.max(filteredByYear, function(d) { return d.co2; });

    
    var popmin = d3.min(filteredByYear, function(d) { return d.population; });
    var co2min = d3.min(filteredByYear, function(d) { return d.co2; });

    console.log(popmax)
    console.log(popmin)

    //982372480
    var scaleX = d3.scaleLog().domain([popmin,popmax]).range([50,width * .55])
    var scaleY = d3.scaleLog().domain([co2min,co2max]).range([height * .4,15])
    var scaleRad =  d3.scaleLog().domain([21,popmax/2]).range([2,10])
    var scaleColor = d3.scaleLinear().domain([co2min,co2max/4]).range(["cornflowerblue", "red"])

    console.log(eval((height * .45)+50))
    console.log(eval((height * .45)))
    
    d3.select('#scene1svg')
        .selectAll("g")
        .remove();
    d3.select('#scene1svg')
        .append('g')
        .attr("transform","translate("+eval((marginx*2)-5)+","+eval(marginy)+")")
        .call(d3
            .axisLeft()
            .scale(scaleY)
            .ticks(4)
            .tickFormat(function(d,i) {
                return new Number(d);
            }))
            //.tickFormat((d, i) => [.1, 1, 10, 100, 1000, 10000][i]))
    d3.select('#scene1svg')
        .append('g')
        .attr("transform","translate("+marginx+","+eval((height*.4)+marginy+5)+")")
        .call(d3
            .axisBottom()
            .scale(scaleX)
            .ticks(4)
            .tickFormat(function(d,i) {
                return new Number(d);
            }))
    d3.select('#scene1svg')
        .append("g")
        .attr("transform","translate("+marginx+","+marginy+")")
        .selectAll("circle")
        .data(input)
        .enter()
        .filter(d => d.year === currYear)
        .filter(d => !filteredCountries.includes(d.country))
        .append("circle")
            .attr("cx", function(d) {return scaleX(d.population);})
            .attr("cy", function(d) {return scaleY(d.co2);})
            .attr("r", function(d) {return scaleRad(d.population);})
            .attr("stroke", "black")
            .attr("stroke-width", "1")
            .attr("fill", function(d) { return scaleColor(d.co2);})
            .on("mouseover",function(d) {
                d3.select("#scene1svg")
                    .append("g")
                        .attr("transform","translate("+marginx+","+marginy+")")
                    .append("line")        
                        .style("stroke", "black")
                        .attr("x1", marginy-5)    
                        .attr("y1", scaleY(d.co2))     
                        .attr("x2", scaleX(d.population)-5)     
                        .attr("y2", scaleY(d.co2))
                        .attr("class", "test1")
                d3.select("#scene1svg")
                    .append("g")
                        .attr("transform","translate("+marginx+","+marginy+")")
                    .append("line")        
                        .style("stroke", "black")
                        .attr("x1", scaleX(d.population))    
                        .attr("y1", scaleY(d.co2)+5)     
                        .attr("x2", scaleX(d.population))     
                        .attr("y2", height * .4+5)
                        .attr("class", "test1")
                       
                d3.select(this).style("fill", "lightgray")
                d3.select(this).style("stroke-width", "2")
                d3.select(this).style("r", function(d) {return scaleRad(d.population) + 1})
                var tooltip = document.getElementById("tooltip1");
                
                tooltip.style.opacity = 1;
                tooltip.style.position = "absolute"
                tooltip.style.zIndex = 1
                tooltip.style.backgroundColor = "whitesmoke"
                tooltip.style.borderColor = "black"
                tooltip.style.border = "1px";
                tooltip.style.borderStyle = "solid"
                tooltip.style.padding = "5px"
                tooltip.style.flexWrap = true;

                var tooltipCountry = document.getElementById("tooltipcountry")
                var tooltipoil = document.getElementById("tooltipoil");
                var tooltipcement = document.getElementById("tooltipcement");
                var tooltipcoal = document.getElementById("tooltipcoal");
                var tooltipconsumption = document.getElementById("tooltipconsumption");
                var tooltipflaring = document.getElementById("tooltipflaring");
                var tooltipgas = document.getElementById("tooltipgas");
                var tooltiptrade = document.getElementById("tooltiptrade");
                
                tooltipCountry.innerHTML =  d.country;
                
                var oilVal = d.oil_co2
                if (oilVal=="") { oilVal = "N/A"}
                var cementVal = d.cement_co2
                if (cementVal=="") { cementVal = "N/A"}
                var coalVal = d.coal_co2
                if (coalVal=="") { coalVal = "N/A"}
                var consumptionVal = d.consumption_co2
                if (consumptionVal=="") { consumptionVal = "N/A"}
                var flaringVal = d.flaring_co2
                if (flaringVal=="") { flaringVal = "N/A"}
                var gasVal = d.gas_co2
                if (gasVal=="") { gasVal = "N/A"}
                var tradeVal = d.trade_co2
                if (tradeVal=="") { tradeVal = "N/A"}

                tooltipoil.innerHTML = oilVal;
                tooltipcement.innerHTML = cementVal;
                tooltipcoal.innerHTML = coalVal;
                tooltipconsumption.innerHTML = consumptionVal;
                tooltipflaring.innerHTML = flaringVal;
                tooltipgas.innerHTML = gasVal;
                tooltiptrade.innerHTML = tradeVal;

                tooltip.hidden = false

                var tooltip1x = document.getElementById("tooltip1x")
                var tooltip1y = document.getElementById("tooltip1y")

                tooltip1x.style.left = eval(d3.event.clientX+25)+"px"
                tooltip1x.style.top = Math.min(eval((d3.event.clientY-50)+(d3.event.clientY/2)),  height * .65) + window.scrollY +"px"

                tooltip1y.style.left = eval((d3.event.clientX+250)-(d3.event.clientX/2))+"px"
                tooltip1y.style.top = eval(d3.event.clientY-50)+window.scrollY+"px"

                tooltip1x.hidden = false
                tooltip1x.style.opacity = 1;
                tooltip1x.style.position = "absolute"
                tooltip1x.style.zIndex = 1
                tooltip1x.style.flexWrap = true;

                tooltip1y.hidden = false
                tooltip1y.style.opacity = 1;
                tooltip1y.style.position = "absolute"
                tooltip1y.style.zIndex = 1
                tooltip1y.style.flexWrap = true;

                var tooltipCo2 = document.getElementById("tooltipCo2")
                var tooltipPop = document.getElementById("tooltipPop")

                tooltipCo2.innerHTML = d.co2
                tooltipPop.innerHTML = d.population
            })                  
            .on("mouseout", function(d) {
                d3.select(this).style("fill", scaleColor(d.co2));
                d3.select(this).style("stroke-width", "1")
                d3.select(this).style("r", function(d) {return scaleRad(d.population)})
                
                var tooltip = document.getElementById("tooltip1");
                tooltip.style.opacity = 0;

                var tooltipoil = document.getElementById("tooltipoil");
                var tooltipcement = document.getElementById("tooltipcement");
                var tooltipcoal = document.getElementById("tooltipcoal");
                var tooltipconsumption = document.getElementById("tooltipconsumption");
                var tooltipflaring = document.getElementById("tooltipflaring");
                var tooltipgas = document.getElementById("tooltipgas");
                var tooltiptrade = document.getElementById("tooltiptrade");
                
                tooltipoil.innerHTML =  "";
                tooltipcement.innerHTML = "";
                tooltipcoal.innerHTML = "";
                tooltipconsumption.innerHTML = "";
                tooltipflaring.innerHTML = "";
                tooltipgas.innerHTML = "";
                tooltiptrade.innerHTML = "";
                
                var tooltip1x = document.getElementById("tooltip1x")
                var tooltip1y = document.getElementById("tooltip1y")
                var tooltip = document.getElementById("tooltip1");
                
                tooltip1x.hidden = true
                tooltip1y.hidden = true
                
                tooltip.style.zIndex = -20
                tooltip1x.style.zIndex = -20
                tooltip1y.style.zIndex = -20

                tooltip1x.style.left = 0+"px"
                tooltip1x.style.top = 0+"px"

                tooltip1y.style.left = 0+"px"
                tooltip1y.style.top = 0+"px"

                d3.selectAll(".test1")
                    .remove()
            })
            .on("click", function(d) {
                console.log(Array.of(d.co2, 
                    d.population, 
                    d.country, 
                    d.cement_co2, 
                    d.coal_co2,
                    d.consumption_co2,
                    d.flaring_co2,
                    d.gas_co2,
                    d.oil_co2,
                    d.trade_co2)
                    )
                    selectedCountry = d.country;

                    var countryTitle2 = document.getElementById("countryTitle2")
                    var countryTitle3 = document.getElementById("countryTitle3")
                    
                    countryTitle2.innerHTML = d.country+"'s";
                    countryTitle3.innerHTML = d.country;

                    var countryOutput2 = document.getElementById("CountryOutput2")
                    var outputCountry3 = document.getElementById("CountryOutput3")

                    countryOutput2.innerHTML = d.country;
                    outputCountry3.innerHTML = d.country;  
                    
                    initLine(input);
                    loadScene2();
            })
            .on("mousemove", function(d,i) {
                var tooltip = document.getElementById("tooltip1");
                var tooltip1x = document.getElementById("tooltip1x")
                var tooltip1y = document.getElementById("tooltip1y")

                tooltip1x.style.left = eval(d3.event.clientX+25)+"px"
                tooltip1x.style.top = Math.min(eval((d3.event.clientY-50)+(d3.event.clientY/2)),  height * .65) + window.scrollY +"px"

                tooltip1y.style.left = eval((d3.event.clientX+250)-(d3.event.clientX/2))+"px"
                tooltip1y.style.top = eval(d3.event.clientY-50)+window.scrollY+"px"
            });
}

function initLine(input) {
    input.forEach(function(d) {
        d.oil_co2 = +d.oil_co2;
        d.cement_co2 = +d.cement_co2;
        d.coal_co2 = +d.coal_co2;
        d.consumption_co2 = +d.consumption_co2;
        d.flaring_co2 = +d.flaring_co2;
        d.gas_co2 = +d.gas_co2;
        d.trade_co2 = +d.trade_co2;
    });

    var filteredByCountry = input.filter(d => d.country == selectedCountry)

    var Oilmax = d3.max(filteredByCountry, function(d) { return d.oil_co2; });
    var Cementmax = d3.max(filteredByCountry, function(d) { return d.cement_co2; });
    var Coalmax = d3.max(filteredByCountry, function(d) { return d.coal_co2; });
    var Consumptionmax = d3.max(filteredByCountry, function(d) { return d.consumption_co2; });
    var Flaringmax = d3.max(filteredByCountry, function(d) { return d.flaring_co2; });
    var Gasmax = d3.max(filteredByCountry, function(d) { return d.gas_co2; });
    var Trademax = d3.max(filteredByCountry, function(d) { return d.trade_co2; });

    var Oilmin = d3.min(filteredByCountry, function(d) { return d.oil_co2; });
    var Cementmin = d3.min(filteredByCountry, function(d) { return d.cement_co2; });
    var Coalmin = d3.min(filteredByCountry, function(d) { return d.coal_co2; });
    var Consumptionmin = d3.min(filteredByCountry, function(d) { return d.consumption_co2; });
    var Flaringmin = d3.min(filteredByCountry, function(d) { return d.flaring_co2; });
    var Gasmin = d3.min(filteredByCountry, function(d) { return d.gas_co2; });
    var Trademin = d3.min(filteredByCountry, function(d) { return d.trade_co2; });
    var minArray = [Oilmin, Cementmin, Coalmin, Consumptionmin, Flaringmin, Gasmin, Trademin]

    let height = screen.height
    let width = screen.width
    var scaleX = d3.scaleLinear().domain([1980,2021]).range([50,width * .6])
    var scaleY = d3.scaleLinear().domain([Math.min.apply(null, minArray.filter(Boolean)),Math.max(Oilmax, Cementmax, Coalmax, Consumptionmax, Flaringmax, Gasmax, Trademax)]).range([height * .4,0])
    var marginx = 50
    var marginy = 50

    //Clear Scene
    d3.select('#scene2svg')
        .selectAll("g")
        .remove()

    var filteredLine = filteredByCountry.filter(function(d) {
        return d.year >= startYear && d.year <= endYear;
    })
    
    if (Oilmax != 0) {
        //Add Oil Line
        var oilLine = d3.line()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.oil_co2));
        d3.select("#scene2svg")
            .append("g")
            .attr("transform","translate("+marginx+","+eval(marginy)+")")
            .append("path")
            .data([filteredLine])
            .attr("d", oilLine) 
            .attr("fill", "none")
            .attr("stroke-width", "5")
            .attr("stroke", oilColor);
        d3.select('#scene2svg')
            .append('g')
            .attr("transform","translate("+eval((marginy*2)-5)+","+eval(marginy)+")")
            .call(d3
                .axisLeft()
                .scale(scaleY)
                .ticks(5))
        d3.select('#scene2svg')
            .append('g')
            .attr("transform","translate("+marginx+","+eval((height*.4+marginy+5))+")")
            .call(d3
                .axisBottom()
                .scale(scaleX)
                .ticks(5)     
                .tickFormat((d, i) => ["1980", "1990", "2000", "2010", "2020"][i]))
        //Add Oil dots
        d3.select('#scene2svg')
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .selectAll("circle")
            .data(filteredLine)
            .enter()
            .append("circle")
                .attr("cx", function(d) {return scaleX(d.year);})
                .attr("cy", function(d) {return scaleY(d.oil_co2);})
                .attr("r", 5)
                .attr("stroke", "black")
                .attr("stroke-width", "1")
                .attr("fill", oilColor)
                .on("mouseover",function(d) {
                    d3.select(this).style("fill", "lightgray")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", oilColor)
                            .attr("x1", marginx-5)    
                            .attr("y1", scaleY(d.oil_co2))     
                            .attr("x2", scaleX(d.year)-5)     
                            .attr("y2", scaleY(d.oil_co2))
                            .attr("class", "test2")
                            .attr("stroke-width", "2")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", oilColor)
                            .attr("x1", scaleX(d.year))    
                            .attr("y1", scaleY(d.oil_co2)+5)     
                            .attr("x2", scaleX(d.year))     
                            .attr("y2", height * .4 + 5)
                            .attr("class", "test2")
                            .attr("stroke-width", "2")
                        d3.select(this).style("fill", "lightgray")
                        d3.select(this).style("stroke-width", "2")
                        d3.select(this).style("r", 6)
                        
                        tooltip2x.style.left = eval(d3.event.clientX+10)+"px"
                        tooltip2x.style.top = eval((height * .6+55) - (((height * .4 + 5) - scaleY(d.oil_co2)+5)/2))+"px"
                        tooltip2y.style.left = eval((width*.35)+((scaleX(d.year)-5) - (marginx-5))/2)+"px"
                        tooltip2y.style.top = eval(d3.event.clientY-50)+(window.scrollY-(height * .80 + 15))+"px"

                        tooltip2x.hidden = false
                        tooltip2x.style.opacity = 1;
                        tooltip2x.style.position = "absolute"
                        tooltip2x.style.zIndex = 1
                        tooltip2x.style.flexWrap = true;

                        tooltip2y.hidden = false
                        tooltip2y.style.opacity = 1;
                        tooltip2y.style.position = "absolute"
                        tooltip2y.style.zIndex = -1
                        tooltip2y.style.flexWrap = true;

                        var tooltipCo22 = document.getElementById("tooltipCo22")
                        var tooltipYear2 = document.getElementById("tooltipYear2")
                        var tooltipLabel2 = document.getElementById("tooltipLabel2")

                        tooltipLabel2.innerHTML = "Oil Co2: "
                        tooltipCo22.innerHTML = d.oil_co2
                        tooltipYear2.innerHTML = d.year
                })                  
                .on("mouseout", function(d) {
                    d3.select(this).style("fill", oilColor);
                    d3.select(this).style("fill", oilColor);
                    d3.select(this).style("stroke-width", "1")
                    d3.select(this).style("r", 5)
                    
                    d3.selectAll(".test2")
                        .remove()

                    var tooltipoil = document.getElementById("tooltipoil");
                    var tooltipcement = document.getElementById("tooltipcement");
                    var tooltipcoal = document.getElementById("tooltipcoal");
                    var tooltipconsumption = document.getElementById("tooltipconsumption");
                    var tooltipflaring = document.getElementById("tooltipflaring");
                    var tooltipgas = document.getElementById("tooltipgas");
                    var tooltiptrade = document.getElementById("tooltiptrade");
                    
                    tooltipoil.innerHTML =  "";
                    tooltipcement.innerHTML = "";
                    tooltipcoal.innerHTML = "";
                    tooltipconsumption.innerHTML = "";
                    tooltipflaring.innerHTML = "";
                    tooltipgas.innerHTML = "";
                    tooltiptrade.innerHTML = "";

                    var tooltip1x = document.getElementById("tooltip2x")
                    var tooltip1y = document.getElementById("tooltip2y")
    
                    tooltip1x.hidden = true
                    tooltip1y.hidden = true

                    tooltip1x.style.zIndex = -1
                    tooltip1y.style.zIndex = -1
                    var tooltipLabel2 = document.getElementById("tooltipLabel2")

                    tooltipLabel2.zIndex = -1
                })
                .on("click", function(d) {
                    currYear = d.year;
                    selectedCountry = d.country;
                    initBar(input);
                    loadScene3();
                });
    } else {
        console.log("Make a note data not available for Oil")
    }

     if (Cementmax != 0) {
        //Add Cement Line
        var cementLine = d3.line()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.cement_co2));
        d3.select("#scene2svg")
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .append("path")
            .data([filteredLine])
            .attr("d", cementLine) 
            .attr("fill", "none")
            .attr("stroke-width", "5")
            .attr("stroke", cementColor);

        //Add Cement Dots
        d3.select('#scene2svg')
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .selectAll("circle")
            .data(filteredLine)
            .enter()
            .append("circle")
                .attr("cx", function(d) {return scaleX(d.year);})
                .attr("cy", function(d) {return scaleY(d.cement_co2);})
                .attr("r", 5)
                .attr("stroke", "black")
                .attr("stroke-width", "1")
                .attr("fill", cementColor)
                .on("mouseover",function(d) {
                    d3.select(this).style("fill", "lightgray")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", cementColor)
                            .attr("x1", marginx-5)    
                            .attr("y1", scaleY(d.cement_co2))     
                            .attr("x2", scaleX(d.year)-5)     
                            .attr("y2", scaleY(d.cement_co2))
                            .attr("class", "test2")
                            .attr("stroke-width", "2")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", cementColor)
                            .attr("x1", scaleX(d.year))    
                            .attr("y1", scaleY(d.cement_co2)+5)     
                            .attr("x2", scaleX(d.year))     
                            .attr("y2", height * .4 + 5)
                            .attr("class", "test2")
                            .attr("stroke-width", "2")
                        d3.select(this).style("fill", "lightgray")
                        d3.select(this).style("stroke-width", "2")
                        d3.select(this).style("r", 6)
                       
                        tooltip2x.style.left = eval(d3.event.clientX+10)+"px"
                        tooltip2x.style.top = eval((height * .6+55) - (((height * .4 + 5) - scaleY(d.cement_co2)+5)/2))+"px"
                        tooltip2y.style.left = eval((width*.35)+((scaleX(d.year)-5) - (marginx-5))/2)+"px"
                        tooltip2y.style.top = eval(d3.event.clientY-50)+(window.scrollY-(height * .80 + 15))+"px"

                        tooltip2x.hidden = false
                        tooltip2x.style.opacity = 1;
                        tooltip2x.style.position = "absolute"
                        tooltip2x.style.zIndex = -1
                        tooltip2x.style.flexWrap = true;

                        tooltip2y.hidden = false
                        tooltip2y.style.opacity = 1;
                        tooltip2y.style.position = "absolute"
                        tooltip2y.style.zIndex = -1
                        tooltip2y.style.flexWrap = true;

                        var tooltipCo22 = document.getElementById("tooltipCo22")
                        var tooltipYear2 = document.getElementById("tooltipYear2")
                        var tooltipLabel2 = document.getElementById("tooltipLabel2")

                        tooltipLabel2.innerHTML = "Cement Co2: "
                        tooltipCo22.innerHTML = d.cement_co2
                        tooltipYear2.innerHTML = d.year
                })                  
                .on("mouseout", function(d) {
                    d3.select(this).style("fill", cementColor);
                    d3.select(this).style("fill", cementColor);
                    d3.select(this).style("stroke-width", "1")
                    d3.select(this).style("r", 5)
                    
                    d3.selectAll(".test2")
                        .remove()
                        
                    var tooltipoil = document.getElementById("tooltipoil");
                    var tooltipcement = document.getElementById("tooltipcement");
                    var tooltipcoal = document.getElementById("tooltipcoal");
                    var tooltipconsumption = document.getElementById("tooltipconsumption");
                    var tooltipflaring = document.getElementById("tooltipflaring");
                    var tooltipgas = document.getElementById("tooltipgas");
                    var tooltiptrade = document.getElementById("tooltiptrade");
                    
                    tooltipoil.innerHTML =  "";
                    tooltipcement.innerHTML = "";
                    tooltipcoal.innerHTML = "";
                    tooltipconsumption.innerHTML = "";
                    tooltipflaring.innerHTML = "";
                    tooltipgas.innerHTML = "";
                    tooltiptrade.innerHTML = "";

                    var tooltip1x = document.getElementById("tooltip2x")
                    var tooltip1y = document.getElementById("tooltip2y")
    
                    tooltip1x.hidden = true
                    tooltip1y.hidden = true
                })
                .on("click", function(d) {
                    currYear = d.year;
                    selectedCountry = d.country;
                    initBar(input);
                    loadScene3();
                });
    } else {
        console.log("Make a note data not available for Cement")
    }

    if (Coalmax != 0) {
        //Add Coal Line
        var coalLine = d3.line()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.coal_co2));
        d3.select("#scene2svg")
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .append("path")
            .data([filteredLine])
            .attr("d", coalLine) 
            .attr("fill", "none")
            .attr("stroke-width", "5")
            .attr("stroke", coalColor);

        //Add Coal Dots
        d3.select('#scene2svg')
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .selectAll("circle")
            .data(filteredLine)
            .enter()
            .append("circle")
                .attr("cx", function(d) {return scaleX(d.year);})
                .attr("cy", function(d) {return scaleY(d.coal_co2);})
                .attr("r", 5)
                .attr("stroke", "black")
                .attr("stroke-width", "1")
                .attr("fill", coalColor)
                .on("mouseover",function(d) {
                    d3.select(this).style("fill", "lightgray")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", coalColor)
                            .attr("x1", marginx-5)    
                            .attr("y1", scaleY(d.coal_co2))     
                            .attr("x2", scaleX(d.year)-5)     
                            .attr("y2", scaleY(d.coal_co2))
                            .attr("class", "test2")
                            .attr("stroke-width", "2")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", coalColor)
                            .attr("x1", scaleX(d.year))    
                            .attr("y1", scaleY(d.coal_co2)+5)     
                            .attr("x2", scaleX(d.year))     
                            .attr("y2", height * .4 + 5)
                            .attr("class", "test2")
                            .attr("stroke-width", "2")
                        
                        d3.select(this).style("fill", "lightgray")
                        d3.select(this).style("stroke-width", "2")
                        d3.select(this).style("r", 6)
                        
                        tooltip2x.style.left = eval(d3.event.clientX+10)+"px"
                        tooltip2x.style.top = eval((height * .6+55) - (((height * .4 + 5) - scaleY(d.coal_co2)+5)/2))+"px"
                        tooltip2y.style.left = eval((width*.35)+((scaleX(d.year)-5) - (marginx-5))/2)+"px"
                        tooltip2y.style.top = eval(d3.event.clientY-50)+(window.scrollY-(height * .80 + 15))+"px"

                        tooltip2x.hidden = false
                        tooltip2x.style.opacity = 1;
                        tooltip2x.style.position = "absolute"
                        tooltip2x.style.zIndex = -1
                        tooltip2x.style.flexWrap = true;

                        tooltip2y.hidden = false
                        tooltip2y.style.opacity = 1;
                        tooltip2y.style.position = "absolute"
                        tooltip2y.style.zIndex = -1
                        tooltip2y.style.flexWrap = true;

                        var tooltipCo22 = document.getElementById("tooltipCo22")
                        var tooltipYear2 = document.getElementById("tooltipYear2")
                        var tooltipLabel2 = document.getElementById("tooltipLabel2")

                        tooltipLabel2.innerHTML = "Coal Co2: "
                        tooltipCo22.innerHTML = d.coal_co2
                        tooltipYear2.innerHTML = d.year
                })                  
                .on("mouseout", function(d) {
                    d3.select(this).style("fill", coalColor);
                    d3.select(this).style("fill", coalColor);
                    d3.select(this).style("stroke-width", "1")
                    d3.select(this).style("r", 5)
                    
                    d3.selectAll(".test2")
                        .remove()
                        
                    var tooltipoil = document.getElementById("tooltipoil");
                    var tooltipcement = document.getElementById("tooltipcement");
                    var tooltipcoal = document.getElementById("tooltipcoal");
                    var tooltipconsumption = document.getElementById("tooltipconsumption");
                    var tooltipflaring = document.getElementById("tooltipflaring");
                    var tooltipgas = document.getElementById("tooltipgas");
                    var tooltiptrade = document.getElementById("tooltiptrade");
                    
                    tooltipoil.innerHTML =  "";
                    tooltipcement.innerHTML = "";
                    tooltipcoal.innerHTML = "";
                    tooltipconsumption.innerHTML = "";
                    tooltipflaring.innerHTML = "";
                    tooltipgas.innerHTML = "";
                    tooltiptrade.innerHTML = "";

                    var tooltip1x = document.getElementById("tooltip2x")
                    var tooltip1y = document.getElementById("tooltip2y")
    
                    tooltip1x.hidden = true
                    tooltip1y.hidden = true
                })
                .on("click", function(d) {
                    currYear = d.year;
                    selectedCountry = d.country;
                    initBar(input);
                    loadScene3();
                });
    } else {
        console.log("Make a note data not available for Coal")
    }

    if (Consumptionmax != 0) {
         //Add Consumption Line
        var ConsumptionLine = d3.line()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.consumption_co2));
        d3.select("#scene2svg")
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .append("path")
            .data([filteredLine])
            .attr("d", ConsumptionLine) 
            .attr("fill", "none")
            .attr("stroke-width", "5")
            .attr("stroke", consumptionColor);

        //Add Consumption Dots
        d3.select('#scene2svg')
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .selectAll("circle")
            .data(filteredLine)
            .enter()
            .append("circle")
                .attr("cx", function(d) {return scaleX(d.year);})
                .attr("cy", function(d) {return scaleY(d.consumption_co2);})
                .attr("r", 5)
                .attr("stroke", "black")
                .attr("stroke-width", "1")
                .attr("fill", consumptionColor)
                .on("mouseover",function(d) {
                    d3.select(this).style("fill", "lightgray")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", consumptionColor)
                            .attr("x1", marginx-5)    
                            .attr("y1", scaleY(d.consumption_co2))     
                            .attr("x2", scaleX(d.year)-5)     
                            .attr("y2", scaleY(d.consumption_co2))
                            .attr("class", "test2")
                            .attr("stroke-width", "2")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", consumptionColor)
                            .attr("x1", scaleX(d.year))    
                            .attr("y1", scaleY(d.consumption_co2)+5)     
                            .attr("x2", scaleX(d.year))     
                            .attr("y2", height * .4 + 5)
                            .attr("class", "test2")
                            .attr("stroke-width", "2")

                        d3.select(this).style("fill", "lightgray")
                        d3.select(this).style("stroke-width", "2")
                        d3.select(this).style("r", 6)

                        tooltip2x.style.left = eval(d3.event.clientX+10)+"px"
                        tooltip2x.style.top = eval((height * .6+55) - (((height * .4 + 5) - scaleY(d.consumption_co2)+5)/2))+"px"
                        tooltip2y.style.left = eval((width*.35)+((scaleX(d.year)-5) - (marginx-5))/2)+"px"
                        tooltip2y.style.top = eval(d3.event.clientY-50)+(window.scrollY-(height * .80 + 15))+"px"

                        tooltip2x.hidden = false
                        tooltip2x.style.opacity = 1;
                        tooltip2x.style.position = "absolute"
                        tooltip2x.style.zIndex = -1
                        tooltip2x.style.flexWrap = true;

                        tooltip2y.hidden = false
                        tooltip2y.style.opacity = 1;
                        tooltip2y.style.position = "absolute"
                        tooltip2y.style.zIndex = -1
                        tooltip2y.style.flexWrap = true;

                        var tooltipCo22 = document.getElementById("tooltipCo22")
                        var tooltipYear2 = document.getElementById("tooltipYear2")
                        var tooltipLabel2 = document.getElementById("tooltipLabel2")

                        tooltipLabel2.innerHTML = "Consumption Co2: "
                        tooltipCo22.innerHTML = d.consumption_co2
                        tooltipYear2.innerHTML = d.year
                })                  
                .on("mouseout", function(d) {
                    d3.select(this).style("fill", consumptionColor);
                    d3.select(this).style("fill", consumptionColor);
                    d3.select(this).style("stroke-width", "1")
                    d3.select(this).style("r", 5)
                    
                    d3.selectAll(".test2")
                        .remove()
                        
                    var tooltipoil = document.getElementById("tooltipoil");
                    var tooltipcement = document.getElementById("tooltipcement");
                    var tooltipcoal = document.getElementById("tooltipcoal");
                    var tooltipconsumption = document.getElementById("tooltipconsumption");
                    var tooltipflaring = document.getElementById("tooltipflaring");
                    var tooltipgas = document.getElementById("tooltipgas");
                    var tooltiptrade = document.getElementById("tooltiptrade");
                    
                    tooltipoil.innerHTML =  "";
                    tooltipcement.innerHTML = "";
                    tooltipcoal.innerHTML = "";
                    tooltipconsumption.innerHTML = "";
                    tooltipflaring.innerHTML = "";
                    tooltipgas.innerHTML = "";
                    tooltiptrade.innerHTML = "";

                    var tooltip1x = document.getElementById("tooltip2x")
                    var tooltip1y = document.getElementById("tooltip2y")
    
                    tooltip1x.hidden = true
                    tooltip1y.hidden = true
                })
                .on("click", function(d) {
                    currYear = d.year;
                    selectedCountry = d.country;
                    initBar(input);
                    loadScene3();
                });
    } else {
        console.log("Make a note data not available for Consumption")
    }
   
    if (Flaringmax != 0) {
        //Add Flaring Line
        var FlaringLine = d3.line()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.flaring_co2));
        d3.select("#scene2svg")
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .append("path")
            .data([filteredLine])
            .attr("d", FlaringLine) 
            .attr("fill", "none")
            .attr("stroke-width", "5")
            .attr("stroke", flaringColor);
        
        //Add Flaring Dots
        d3.select('#scene2svg')
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .selectAll("circle")
            .data(filteredLine)
            .enter()
            .append("circle")
                .attr("cx", function(d) {return scaleX(d.year);})
                .attr("cy", function(d) {return scaleY(d.flaring_co2);})
                .attr("r", 5)
                .attr("stroke", "black")
                .attr("stroke-width", "1")
                .attr("fill", flaringColor)
                .on("mouseover",function(d) {
                    d3.select(this).style("fill", "lightgray")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", flaringColor)
                            .attr("x1", marginx-5)    
                            .attr("y1", scaleY(d.flaring_co2))     
                            .attr("x2", scaleX(d.year)-5)     
                            .attr("y2", scaleY(d.flaring_co2))
                            .attr("class", "test2")
                            .attr("stroke-width", "2")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", flaringColor)
                            .attr("x1", scaleX(d.year))    
                            .attr("y1", scaleY(d.flaring_co2)+5)     
                            .attr("x2", scaleX(d.year))     
                            .attr("y2", height * .4 + 5)
                            .attr("class", "test2")
                            .attr("stroke-width", "2")

                        d3.select(this).style("fill", "lightgray")
                        d3.select(this).style("stroke-width", "2")
                        d3.select(this).style("r", 6)
                        
                        tooltip2x.style.left = eval(d3.event.clientX+10)+"px"
                        tooltip2x.style.top = eval((height * .6+55) - (((height * .4 + 5) - scaleY(d.flaring_co2)+5)/2))+"px"
                        tooltip2y.style.left = eval((width*.35)+((scaleX(d.year)-5) - (marginx-5))/2)+"px"
                        tooltip2y.style.top = eval(d3.event.clientY-50)+(window.scrollY-(height * .80 + 15))+"px"

                        tooltip2x.hidden = false
                        tooltip2x.style.opacity = 1;
                        tooltip2x.style.position = "absolute"
                        tooltip2x.style.zIndex = -1
                        tooltip2x.style.flexWrap = true;

                        tooltip2y.hidden = false
                        tooltip2y.style.opacity = 1;
                        tooltip2y.style.position = "absolute"
                        tooltip2y.style.zIndex = -1
                        tooltip2y.style.flexWrap = true;

                        var tooltipCo22 = document.getElementById("tooltipCo22")
                        var tooltipYear2 = document.getElementById("tooltipYear2")
                        var tooltipLabel2 = document.getElementById("tooltipLabel2")

                        tooltipLabel2.innerHTML = "Flaring Co2: "
                        tooltipCo22.innerHTML = d.flaring_co2
                        tooltipYear2.innerHTML = d.year
                })                  
                .on("mouseout", function(d) {
                    d3.select(this).style("fill", flaringColor);
                    d3.select(this).style("fill", flaringColor);
                    d3.select(this).style("stroke-width", "1")
                    d3.select(this).style("r", 5)
                    
                    d3.selectAll(".test2")
                        .remove()
                        
                    var tooltipoil = document.getElementById("tooltipoil");
                    var tooltipcement = document.getElementById("tooltipcement");
                    var tooltipcoal = document.getElementById("tooltipcoal");
                    var tooltipconsumption = document.getElementById("tooltipconsumption");
                    var tooltipflaring = document.getElementById("tooltipflaring");
                    var tooltipgas = document.getElementById("tooltipgas");
                    var tooltiptrade = document.getElementById("tooltiptrade");
                    
                    tooltipoil.innerHTML =  "";
                    tooltipcement.innerHTML = "";
                    tooltipcoal.innerHTML = "";
                    tooltipconsumption.innerHTML = "";
                    tooltipflaring.innerHTML = "";
                    tooltipgas.innerHTML = "";
                    tooltiptrade.innerHTML = "";

                    var tooltip1x = document.getElementById("tooltip2x")
                    var tooltip1y = document.getElementById("tooltip2y")
    
                    tooltip1x.hidden = true
                    tooltip1y.hidden = true
                })
                .on("click", function(d) {
                    currYear = d.year;
                    selectedCountry = d.country;
                    initBar(input);
                    loadScene3();
                });
    } else {
        console.log("Make a note data not available for Flaring")   
    }

    if (Gasmax != 0) {
        //Add Gas Line
        var GasLine = d3.line()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.gas_co2));
        d3.select("#scene2svg")
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .append("path")
            .data([filteredLine])
            .attr("d", GasLine) 
            .attr("fill", "none")
            .attr("stroke-width", "5")
            .attr("stroke", gasColor);

        //Add Gas Dots
        d3.select('#scene2svg')
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .selectAll("circle")
            .data(filteredLine)
            .enter()
            .append("circle")
                .attr("cx", function(d) {return scaleX(d.year);})
                .attr("cy", function(d) {return scaleY(d.gas_co2);})
                .attr("r", 5)
                .attr("stroke", "black")
                .attr("stroke-width", "1")
                .attr("fill", gasColor)
                .on("mouseover",function(d) {
                    d3.select(this).style("fill", "lightgray")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", gasColor)
                            .attr("x1", marginx-5)    
                            .attr("y1", scaleY(d.gas_co2))     
                            .attr("x2", scaleX(d.year)-5)     
                            .attr("y2", scaleY(d.gas_co2))
                            .attr("class", "test2")
                            .attr("stroke-width", "2")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", gasColor)
                            .attr("x1", scaleX(d.year))    
                            .attr("y1", scaleY(d.gas_co2)+5)     
                            .attr("x2", scaleX(d.year))     
                            .attr("y2", height * .4 + 5)
                            .attr("class", "test2")
                            .attr("stroke-width", "2")

                        d3.select(this).style("fill", "lightgray")
                        d3.select(this).style("stroke-width", "2")
                        d3.select(this).style("r", 6)
                        
                        tooltip2x.style.left = eval(d3.event.clientX+10)+"px"
                        tooltip2x.style.top = eval((height * .6+55) - (((height * .4 + 5) - scaleY(d.gas_co2)+5)/2))+"px"
                        tooltip2y.style.left = eval((width*.35)+((scaleX(d.year)-5) - (marginx-5))/2)+"px"
                        tooltip2y.style.top = eval(d3.event.clientY-50)+(window.scrollY-(height * .80 + 15))+"px"

                        tooltip2x.hidden = false
                        tooltip2x.style.opacity = 1;
                        tooltip2x.style.position = "absolute"
                        tooltip2x.style.zIndex = -1
                        tooltip2x.style.flexWrap = true;

                        tooltip2y.hidden = false
                        tooltip2y.style.opacity = 1;
                        tooltip2y.style.position = "absolute"
                        tooltip2y.style.zIndex = -1
                        tooltip2y.style.flexWrap = true;

                        var tooltipCo22 = document.getElementById("tooltipCo22")
                        var tooltipYear2 = document.getElementById("tooltipYear2")
                        var tooltipLabel2 = document.getElementById("tooltipLabel2")

                        tooltipLabel2.innerHTML = "Gas Co2: "
                        tooltipCo22.innerHTML = d.gas_co2
                        tooltipYear2.innerHTML = d.year
                })                  
                .on("mouseout", function(d) {
                    d3.select(this).style("fill", gasColor);
                    d3.select(this).style("fill", gasColor);
                    d3.select(this).style("stroke-width", "1")
                    d3.select(this).style("r", 5)
                    
                    d3.selectAll(".test2")
                        .remove()
                        
                    var tooltipoil = document.getElementById("tooltipoil");
                    var tooltipcement = document.getElementById("tooltipcement");
                    var tooltipcoal = document.getElementById("tooltipcoal");
                    var tooltipconsumption = document.getElementById("tooltipconsumption");
                    var tooltipflaring = document.getElementById("tooltipflaring");
                    var tooltipgas = document.getElementById("tooltipgas");
                    var tooltiptrade = document.getElementById("tooltiptrade");
                    
                    tooltipoil.innerHTML =  "";
                    tooltipcement.innerHTML = "";
                    tooltipcoal.innerHTML = "";
                    tooltipconsumption.innerHTML = "";
                    tooltipflaring.innerHTML = "";
                    tooltipgas.innerHTML = "";
                    tooltiptrade.innerHTML = "";

                    var tooltip1x = document.getElementById("tooltip2x")
                    var tooltip1y = document.getElementById("tooltip2y")
    
                    tooltip1x.hidden = true
                    tooltip1y.hidden = true
                })
                .on("click", function(d) {
                    currYear = d.year;
                    selectedCountry = d.country;
                    initBar(input);
                    loadScene3();
                });
    } else {
        console.log("Make a note data not available for Gas")   
    }

    if (Trademax != 0) {
        //Add Trade Line
        var TradeLine = d3.line()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.trade_co2));
        d3.select("#scene2svg")
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .append("path")
            .data([filteredLine])
            .attr("d", TradeLine) 
            .attr("fill", "none")
            .attr("stroke-width", "5")
            .attr("stroke", tradeColor);
        
        //Add Trade Dots
        d3.select('#scene2svg')
            .append("g")
            .attr("transform","translate("+marginx+","+marginy+")")
            .selectAll("circle")
            .data(filteredLine)
            .enter()
            .append("circle")
                .attr("cx", function(d) {return scaleX(d.year);})
                .attr("cy", function(d) {return scaleY(d.trade_co2);})
                .attr("r", 5)
                .attr("stroke", "black")
                .attr("stroke-width", "1")
                .attr("fill", tradeColor)
                .on("mouseover",function(d) {
                    d3.select(this).style("fill", "lightgray")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", tradeColor)
                            .attr("x1", marginx-5)    
                            .attr("y1", scaleY(d.trade_co2))     
                            .attr("x2", scaleX(d.year)-5)     
                            .attr("y2", scaleY(d.trade_co2))
                            .attr("class", "test2")
                            .attr("stroke-width", "2")
                    d3.select("#scene2svg")
                        .append("g")
                            .attr("transform","translate("+marginx+","+marginy+")")
                        .append("line")        
                            .style("stroke", tradeColor)
                            .attr("x1", scaleX(d.year))    
                            .attr("y1", scaleY(d.trade_co2)+5)     
                            .attr("x2", scaleX(d.year))     
                            .attr("y2", height * .4 + 5)
                            .attr("class", "test2")
                            .attr("stroke-width", "2")

                        d3.select(this).style("fill", "lightgray")
                        d3.select(this).style("stroke-width", "2")
                        d3.select(this).style("r", 6)
                        
                        tooltip2x.style.left = eval(d3.event.clientX+10)+"px"
                        tooltip2x.style.top = eval((height * .6+55) - (((height * .4 + 5) - scaleY(d.trade_co2)+5)/2))+"px"
                        tooltip2y.style.left = eval((width*.35)+((scaleX(d.year)-5) - (marginx-5))/2)+"px"
                        tooltip2y.style.top = eval(d3.event.clientY-50)+(window.scrollY-(height * .80 + 15))+"px"

                        tooltip2x.hidden = false
                        tooltip2x.style.opacity = 1;
                        tooltip2x.style.position = "absolute"
                        tooltip2x.style.zIndex = -1
                        tooltip2x.style.flexWrap = true;

                        tooltip2y.hidden = false
                        tooltip2y.style.opacity = 1;
                        tooltip2y.style.position = "absolute"
                        tooltip2y.style.zIndex = -1
                        tooltip2y.style.flexWrap = true;

                        var tooltipCo22 = document.getElementById("tooltipCo22")
                        var tooltipYear2 = document.getElementById("tooltipYear2")
                        var tooltipLabel2 = document.getElementById("tooltipLabel2")

                        tooltipLabel2.innerHTML = "Trade Co2: "
                        tooltipCo22.innerHTML = d.trade_co2
                        tooltipYear2.innerHTML = d.year
                })                  
                .on("mouseout", function(d) {
                    d3.select(this).style("fill", tradeColor);
                    d3.select(this).style("fill", tradeColor);
                    d3.select(this).style("stroke-width", "1")
                    d3.select(this).style("r", 5)
                    
                    d3.selectAll(".test2")
                        .remove()
                        
                    var tooltipoil = document.getElementById("tooltipoil");
                    var tooltipcement = document.getElementById("tooltipcement");
                    var tooltipcoal = document.getElementById("tooltipcoal");
                    var tooltipconsumption = document.getElementById("tooltipconsumption");
                    var tooltipflaring = document.getElementById("tooltipflaring");
                    var tooltipgas = document.getElementById("tooltipgas");
                    var tooltiptrade = document.getElementById("tooltiptrade");
                    
                    tooltipoil.innerHTML =  "";
                    tooltipcement.innerHTML = "";
                    tooltipcoal.innerHTML = "";
                    tooltipconsumption.innerHTML = "";
                    tooltipflaring.innerHTML = "";
                    tooltipgas.innerHTML = "";
                    tooltiptrade.innerHTML = "";

                    var tooltip1x = document.getElementById("tooltip2x")
                    var tooltip1y = document.getElementById("tooltip2y")
    
                    tooltip1x.hidden = true
                    tooltip1y.hidden = true
                })
                .on("click", function(d) {
                    currYear = d.year;
                    selectedCountry = d.country;
                    initBar(input);
                    loadScene3();
                });
    } else {
        console.log("Make a note data not available for Trade")    
    }
}

function initBar(input) {
    var marginx = 50
    var marginy = 50
    
    let height = screen.height
    let width = screen.width

    var canvasWidth = width * .65;
    var canvasHeight = height * .5;

    var filteredData = input.filter(d => d.country == selectedCountry && d.year == currYear)[0]

    let values = [filteredData.oil_co2, filteredData.cement_co2, filteredData.coal_co2, filteredData.consumption_co2, filteredData.flaring_co2, filteredData.gas_co2, filteredData.trade_co2];

    var scaleX = d3.scaleBand().domain([0,1,2,3,4,5,6]).range([0,canvasWidth - 175])
    var scaleY = d3.scaleLinear().domain([Math.min(filteredData.oil_co2, filteredData.cement_co2, filteredData.coal_co2, filteredData.consumption_co2, filteredData.flaring_co2, filteredData.gas_co2, filteredData.trade_co2) - 1,Math.max(filteredData.oil_co2, filteredData.cement_co2, filteredData.coal_co2, filteredData.consumption_co2, filteredData.flaring_co2, filteredData.gas_co2, filteredData.trade_co2)]).range([0,canvasHeight])
    var scaleYAxis = d3.scaleLinear().domain([Math.min(filteredData.oil_co2, filteredData.cement_co2, filteredData.coal_co2, filteredData.consumption_co2, filteredData.flaring_co2, filteredData.gas_co2, filteredData.trade_co2) - 1,Math.max(filteredData.oil_co2, filteredData.cement_co2, filteredData.coal_co2, filteredData.consumption_co2, filteredData.flaring_co2, filteredData.gas_co2, filteredData.trade_co2)]).range([canvasHeight,0])

    d3.select('#scene3svg')
        .selectAll("g")
        .remove()

    d3.select('#scene3svg')
    .append('g')
    .attr("transform","translate("+marginy+","+eval(marginy)+")")
    .call(d3
        .axisLeft()
        .scale(scaleYAxis)
        .ticks(5))
    d3.select('#scene3svg')
        .append('g')
        .attr("transform","translate("+eval(marginx)+","+eval((height*.45+marginy*2+10))+")")
        .call(d3
            .axisBottom()
            .scale(scaleX)
            .ticks(7)     
            .tickFormat((d, i) => ["Oil Co2", "Cement Co2", "Coal Co2", "Consumption Co2", "Flaring Co2", "Gas Co2", "Trade Co2"][i]))
    d3.select("#scene3svg")
        .append("g")
        .attr("transform", "translate("+marginx+","+marginy+")")
        .selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
            .attr("x",  function(d, i) { return (scaleX.bandwidth() * i +15);})
            .attr("y", function(d) { return canvasHeight - scaleY(d); } )
            .attr("width", scaleX.bandwidth() - 25)
            .attr("height", function(d) {return scaleY(d);})
            .attr("stroke", "black")
            .attr("stroke-width", "1")
            .attr("name", function(d,i) {
                return nameCode[i];
            })
            .attr("fill", function(d,i) {
                return colorCode[i];
            })
            .on("mouseover", function(d, i) {
                var tooltip = document.getElementById("tooltip3");
                
                tooltip.style.opacity = 1;
                tooltip.style.position = "absolute"
                tooltip.style.left = eval(d3.event.clientX+10)+"px"
                tooltip.style.top = eval(d3.event.clientY+10)-(window.scrollY-(height*.35)) +"px"
                tooltip.style.zIndex = 1
                tooltip.style.backgroundColor = "whitesmoke"
                tooltip.style.borderColor = "black"
                tooltip.style.border = "1px";
                tooltip.style.borderStyle = "solid"
                tooltip.style.padding = "5px"
                tooltip.innerHTML = nameCode[i]+ " is: "+d;
            })
            .on("mouseout", function(d, i) {
                var tooltip = document.getElementById("tooltip3");
                tooltip.style.opacity = 0;
                tooltip.innerHTML = "";
            })
            .on("mousemove", function(d,i) {
                var tooltip = document.getElementById("tooltip3");
                tooltip.style.left = eval(d3.event.clientX+10)+"px"
                //tooltip.style.top = Math.min(eval(d3.event.clientY+10)-(window.scrollY+(height*.45)), (height*.45))+"px"
                console.log(eval(d3.event.clientY+10))                
                console.log(eval(d3.event.clientY+10)-(window.scrollY-(height*1.2)))                
                //tooltip.style.top = eval(d3.event.clientY+10)-(window.scrollY-(height*.35))+"px"
                tooltip.style.top = eval(d3.event.clientY+10)+(window.scrollY-(height*1.65)) +"px"
            });
}
function initCountryDropdown(input) {
    d3.select('#scene3')
        .select('#CountryDropdown3')
        .selectAll('option')
        .data(input)
        .enter()
        .append('option')
            .text(d => d)
            .attr('value', d => d);
}

function initYearDropdown(input) {
    d3.select('#scene1')
        .select('select')
        .selectAll('option')
        .data(input)
        .enter()
        .append('option')
            .text(d => d)
            .attr('value', d => d);
            
    d3.select('#scene3')
        .select('#YearDropdown3')
        .selectAll('option')
        .data(input)
        .enter()
        .append('option')
            .text(d => d)
            .attr('value', d => d);
}

function initFilterCheckboxes(input, raw) {
    d3.select('#scene1')
        .select('#filterCheckboxes')
        .selectAll('input')
        .data(input)  
        .enter()
        .append("label")
            .text(d => d)   
        .append('input')
            .attr("type", "checkbox")
            .attr("name", "test")
            .attr("value", d => d)
            .on('change', function(d) {
                if (filteredCountries.includes(d)) {
                    filteredCountries = filteredCountries.filter( item => item !== d)
                } else {
                    filteredCountries.push(d)
                }
                initScatter(raw)
            })
            .property('checked', true);
}

function loadScene1(input) {
    var year = document.getElementById("YearDropdown");
    var outputYear = document.getElementById("YearOutput")
    var scene1 = document.getElementById("scene1");
    var scene1SVG = document.getElementById("scene1svg")
    
    scene1.hidden = false;
    scene1SVG.setAttribute("display", "block");
    outputYear.innerHTML = "1980";
    currYear = "1980"
    initScatter(input)

    year.oninput = function() {
        outputYear.innerHTML = this.value;    
        //Load Scene 1
        currYear = this.value      
        initScatter(input)
    }

}

function loadScene2() {
    var sliderStart = document.getElementById("StartDateRange");
    var sliderEnd = document.getElementById("EndDateRange");
    var outputStart = document.getElementById("start");
    var outputEnd = document.getElementById("end");
    var scene2 = document.getElementById("scene2");
    var scene2SVG = document.getElementById("scene2svg")

    scene2.hidden = false;
    scene2SVG.setAttribute("display", "block");
    scene2.scrollIntoView() + 200

    outputStart.innerHTML = sliderStart.value;
    outputEnd.innerHTML = sliderEnd.value;

    sliderStart.oninput = function() {
        if (this.value > sliderEnd.value) {
            sliderEnd.value = this.value
            outputEnd.innerHTML = sliderEnd.value;
        }
        startYear = sliderStart.value
        endYear = sliderEnd.value

        outputStart.innerHTML = this.value;
        initLine(globalData)
    }

    sliderEnd.oninput = function() {
        if (this.value < sliderStart.value) {
            sliderStart.value = this.value
            outputStart.innerHTML = sliderStart.value
        }
        startYear = sliderStart.value
        endYear = sliderEnd.value

        outputEnd.innerHTML = this.value;
        initLine(globalData)
    }
}

function loadScene3() {
    var year3 = document.getElementById("YearDropdown3");
    var year1 = document.getElementById("YearDropdown");
    var outputYear3 = document.getElementById("YearOutput3")
    var country3 = document.getElementById("CountryDropdown3");
    var outputCountry3 = document.getElementById("CountryOutput3")
    var countryOutput2 = document.getElementById("CountryOutput2")
    var scene3 = document.getElementById("scene3");
    var scene3SVG = document.getElementById("scene3svg")
    var countryTitle2 = document.getElementById("countryTitle2")
    var countryTitle3 = document.getElementById("countryTitle3")

    scene3.hidden = false;
    scene3.scrollIntoView()
    scene3SVG.setAttribute("display", "block");
    outputYear3.innerHTML = currYear;
    year3.value = currYear;
    year1.value = currYear;
    
    country3.value = selectedCountry;
    outputCountry3.innerHTML = selectedCountry
    countryOutput2.innerHTML = selectedCountry
    countryTitle2.innerHTML = selectedCountry+"'s";
    countryTitle3.innerHTML = selectedCountry;
    
    year3.oninput = function() {
        outputYear3.innerHTML = this.value;   
        currYear = this.value;
        year1.value = currYear;
        initScatter(globalData)
        initBar(globalData)
    }

    country3.oninput = function() {
        outputCountry3.innerHTML = this.value;
        countryOutput2.innerHTML = this.value;
        countryTitle2.innerHTML = this.value+"'s";
        countryTitle3.innerHTML = this.value;
        selectedCountry = this.value
        initLine(globalData)
        initBar(globalData)
    }
}

function hideScene1() {
    var scene1 = document.getElementById("scene1");
    var scene1SVG = document.getElementById("scene1svg")
    scene1.hidden = true;
    scene1SVG.setAttribute("display", "none");
}

function hideScene2() {
    var scene2 = document.getElementById("scene2");
    var scene2SVG = document.getElementById("scene2svg")
    scene2.hidden = true;
    scene2SVG.setAttribute("display", "none");
}
function hideScene3() {
    var scene3 = document.getElementById("scene3");
    var scene3SVG = document.getElementById("scene3svg")
    scene3.hidden = true;
    scene3SVG.setAttribute("display", "none");
}

function cleanAndFilterData(dataIn) {
    var tmp = cleanData(dataIn)
    return filterData(tmp)
}

function cleanData(dataIn) {
    let yearFilter = dataIn.filter(d=> d.year > 1979 && d.year < 2021)
    let cleanData = yearFilter.filter(d => d.population != "" && d.co2 != "" && d.oil_co2 != "" && d.co2 != 0)
    return cleanData;
}

function filterData(dataIn) {
    let countryFilter = dataIn.filter(d=> d.country != "World" && 
        d.country != "Asia" && 
        d.country != "Upper-middle-income countries" &&
        d.country != "Lower-middle-income countries" &&
        d.country != "High-income countries" &&
        d.country != "Lower-income countries" &&
        d.country != "European Union (27)" &&
        d.country != "Europe" &&
        d.country != "North America" &&
        d.country != "South America" &&
        d.country != "Africa" &&
        d.country != "Bonaire Sint Eustatius and Saba" &&
        d.country != "Angola" &&
        d.country != "Andorra" &&
        d.country != "Azerbaijan" &&
        d.country != "Bahrain" &&
        d.country != "Bhutan" &&
        d.country != "Antigua and Barbuda" &&
        d.country != "Bosnia and Herzegovina" &&
        d.country != "Botswana" &&
        d.country != "Brunei" &&
        d.country != "Burkina Faso" &&
        d.country != "Burundi" &&
        d.country != "Central African Republic" &&
        d.country != "Cote d'Ivoire" &&
        d.country != "Curacao" &&
        d.country != "Cook Islands" &&
        d.country != "Djibouti" &&
        d.country != "Eritrea" &&
        d.country != "French Polynesia" &&
        d.country != "French Guiana" &&
        d.country != "Kiribati" &&
        d.country != "Low-income countries" &&
        d.country != "Marshall Islands" &&
        d.country != "Mauritania" &&
        d.country != "Micronesia (country)" &&
        d.country != "North Macedonia" &&
        d.country != "Reunion" &&
        d.country != "Saint Kitts and Nevis" &&
        d.country != "Saint Pierre and Miquelon" &&
        d.country != "Saint Vincent and the Grenadines" &&
        d.country != "Sao Tome and Principe" &&
        d.country != "Sint Maarten (Dutch part)" &&
        d.country != "Turks and Caicos Islands" &&
        d.country != "Wallis and Futuna" &&
        d.country != "Anguilla" &&
        d.country != "Benin" &&
        d.country != "Cape Verde" &&
        d.country != "Cyprus" &&
        d.country != "Equatorial Guinea" &&
        d.country != "Faeroe Islands" &&
        d.country != "Gabon" &&
        d.country != "Gambia" &&
        d.country != "Guadeloupe" &&
        d.country != "Guinea-Bissau" &&
        d.country != "Guyana" &&
        d.country != "Kosovo" &&
        d.country != "Liechtenstein" &&
        d.country != "Malawi" &&
        d.country != "Macao" &&
        d.country != "Mauritius" &&
        d.country != "Mayotte" &&
        d.country != "Moldova" &&
        d.country != "Montenegro" &&
        d.country != "Montserrat" &&
        d.country != "Namibia" &&
        d.country != "New Caledonia" &&
        d.country != "Niue" &&
        d.country != "Oceania" &&
        d.country != "Oman" &&
        d.country != "Saint Helena" &&
        d.country != "Saint Lucia" &&
        d.country != "Seychelles" &&
        d.country != "Sierra Leone" &&
        d.country != "Tuvalu" &&
        d.country != "Vanuatu" &&
        d.country != "Aruba" &&
        d.country != "Mali" &&
        d.country != "Malta" &&
        d.country != "Palau" &&
        d.country != "South Sudan" &&
        d.country != "Suriname" &&
        d.country != "Tajikistan" &&
        d.country != "Timor" &&
        d.country != "Togo" &&
        d.country != "Tonga" &&
        d.country != "Trinidad and Tobago" &&
        d.country != "Tunisia" && 
        d.country != "Nauru" && 
        d.country != "Dominica" && 
        d.country != "Chad" &&
        d.country != "Lesotho" &&
        d.country != "Fiji" &&
        d.country != "Eswatini" && 
        d.country != "Bahamas")
    return countryFilter
}
   
//Utilites
function toggleAll(source) {
    filteredCountries = []
    checkboxes = document.getElementsByName("test");
    checkboxes.forEach(element => {
        element.checked = source.checked
        if (source.checked == false) {
            filteredCountries.push(element.value)
        }
    })
    initScatter(globalData)
}

//TODO
//LOAD SCENE 1 IMPL
//LOAD SCENE 2 IMPL
//LOAD SCENE 3 IMPL