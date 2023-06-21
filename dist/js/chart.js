function tableToArray(table) {
    let array = [];
    for (let i = 2; i < table.rows.length; i++) {
        let rowObj = {};
        rowObj["Модель"] = table.rows[i].cells[0].innerHTML;
        rowObj["Семейство процессоров"] = table.rows[i].cells[1].innerHTML;
        rowObj["Поколение"] = table.rows[i].cells[2].innerHTML;
        rowObj["Количество ядер"] = table.rows[i].cells[3].innerHTML;
        rowObj["Количество потоков"] = table.rows[i].cells[4].innerHTML;
        rowObj["Тактовая частота, ГГц"] = table.rows[i].cells[5].innerHTML;
        rowObj["Стоимость (USD)"] = table.rows[i].cells[6].innerHTML;
        rowObj["Год"] = table.rows[i].cells[7].innerHTML;
        rowObj["Квартал"] = table.rows[i].cells[8].innerHTML;
        array.push(rowObj);
    }
    return array;
}


function getArrGraph(arrObject, fieldX, fieldY, valuesProp) {
     let groupObj = d3.group(arrObject, d => d[fieldX])
     arrGroup = [];
     for(let entry of groupObj) {
        let value;
        if (valuesProp === "max") {
            value = d3.max(entry[1].map(d => d[fieldY]).filter(d => d !== '-'));
        } else if (valuesProp === "min") {
            value = d3.min(entry[1].map(d => d[fieldY]).filter(d => d !== '-'));
        } else if (valuesProp === "count") {
            value = entry[1].length;
        }
        
        let elementGroup = {};
        elementGroup["labelX"] = entry[0];
        elementGroup["value"] = +value;
        arrGroup.push(elementGroup);
     }
     return arrGroup;
}

let rowsInfo = tableToArray(processorsTable);
function drawChartOn(fieldX, fieldY, valueProp) {
    
    // формируем массив для построения диаграммы
    let arrGraph = getArrGraph(rowsInfo, fieldX, fieldY, valueProp)
    let marginX = 50;
    let marginY = 50;
    let height = 400;
    let width = 500;

    let svg = d3.select("#charts")
    .append("svg")
    .attr("height", height)
    .attr("width", width);


    let newArr = arrGraph.map(d => d.value);
    let minY = d3.min(newArr) * 0.95;
    let maxY = d3.max(newArr) * 1.05;

    let xAxisLen = width - 2 * marginX;
    let yAxisLen = height - 2 * marginY;
   
    // определяем шкалы для осей
    let scaleX = d3.scaleBand()
    .domain(arrGraph.map(function(d) {
            return d.labelX;
        })
    )
    .range([0, xAxisLen]).padding(1);

    let scaleY = d3.scaleLinear()
    .domain([minY, maxY])
    .range([yAxisLen, 0]);
    // создаем оси
    let axisX = d3.axisBottom(scaleX); // горизонтальная
   
    let axisY = d3.axisLeft(scaleY);// вертикальная
   
    // отображаем ось OX, устанавливаем подписи оси ОX и угол их наклона
    svg.append("g")
    .attr("transform", `translate(${marginX}, ${height - marginY})`)
    .call(axisX)
    .attr("class", "x-axis")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
    return "rotate(-45)";
    });
   
    // отображаем ось OY
    svg.append("g")
    .attr("transform", `translate(${marginX}, ${marginY})`)
    .attr("class", "y-axis")
    .call(axisY);
   
    // создаем набор вертикальных линий для сетки
    d3.selectAll("g.x-axis g.tick")
    .append("line") // добавляем линию
    .classed("grid-line", true) // добавляем класс
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", - (yAxisLen));
   
    // создаем горизонтальные линии сетки
    d3.selectAll("g.y-axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", xAxisLen)
    .attr("y2", 0);

    let bandwidth = 25;
   
    // отображаем данные в виде точечной или столбчатой диаграммы
    
    svg.selectAll(".dot")
    .data(arrGraph)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return scaleX(d.labelX); })
    .attr("cy", function(d) { return scaleY(d.value); })
    .attr("transform",
    `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
    .style("fill", "red");

    // svg.append("g")
    // .attr("transform", `translate(${ marginX - bandwidth/2}, ${ marginY})`)
    // .selectAll(".rect")
    // .data(arrGraph)
    // .enter().append("rect")
    // .attr("x", function(d) { return scaleX(d.labelX) ; })
    // .attr("width", bandwidth)
    // .attr("y", function(d) { return scaleY(d.valueMax); })
    // .attr("height", function(d) { return yAxisLen - scaleY(d.valueMax); })
    // .attr("fill", "red");
    
}

function drawChart(data) {
    if (!data.oy[0].checked && !data.oy[1].checked && !data.oy[2].checked) {
        alert("Вы не выбрали ни одного значения по оси OY");
        return;
    }

    d3.select("#charts")
    .selectAll("svg")
    .remove();
    
    d3.select("#charts")
    .selectAll("br")
    .remove();

    let fieldX = data.ox[0].checked ? data.ox[0].value : data.ox[1].value;
    if (data.oy[0].checked) {
        d3.select("#charts").append("br");
        drawChartOn(fieldX, "Тактовая частота, ГГц", "max");
    }
    if (data.oy[1].checked) {
        d3.select("#charts").append("br");
        drawChartOn(fieldX, "Стоимость (USD)", "min");
    }
    if (data.oy[2].checked) {
        d3.select("#charts").append("br");
        drawChartOn(fieldX, "Модель", "count");
    }

}