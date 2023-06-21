let formFilter = document.getElementById("filter");

//TODO: пофиксить фильтрацию по дате, и мейби совмещение с сортировкой реализовать
for (let i = 0; i < formFilter.elements.length; i++) {
    formFilter[i].addEventListener("input", function(event) {
        for (let j = 2; j < processorsTable.rows.length; j++) {  // проходимся по всем строкам
            let row = processorsTable.rows[j];
            let toHide = false;

             // для каждой строки проверяем совпадают ли введенные в форму фильтра значения с теми, что находятся в строке
            for (let k = 0; k < formFilter.elements.length; k++) {
                let input = formFilter[k];
                let isNum = !(isNaN(parseFloat(input.value)) || !isFinite(input.value))
                switch (input.name) {
                    case 'priceFrom':
                        if (isNum && (row.cells[6].textContent === '-'
                        || +row.cells[6].textContent < +input.value)) {
                            toHide = true;
                        }
                        break;
                    case 'priceTo':
                        if (isNum && (row.cells[6].textContent === '-'
                        || +row.cells[6].textContent > +input.value)) {
                            toHide = true;
                        }
                        break;
                    case 'yearFrom':
                        if (formFilter[k+1].value === '') {
                            if (isNum && +row.cells[7].textContent < +input.value) {
                                toHide = true;
                            }
                        }
                        break;
                    case 'quarterFrom':
                        if (isNum &&
                            (+row.cells[7].textContent < +formFilter[k-1].value
                                || (+row.cells[8].textContent < +input.value
                                    && +row.cells[7].textContent === +formFilter[k-1].value))) {
                            toHide = true;
                        }
                        break;
                    case 'yearTo':
                        if (formFilter[k+1].value === '') {
                            if (isNum && +row.cells[7].textContent > +input.value) {
                                toHide = true;
                            }
                        }
                        break;
                    case 'quarterTo':
                        if (isNum &&
                            (+row.cells[7].textContent > +formFilter[k-1].value
                                || (+row.cells[8].textContent > +input.value
                                    && +row.cells[7].textContent === +formFilter[k-1].value))) {
                            toHide = true;
                        }
                        break;
                    default:
                        let index = +input.name;
                        if (row.cells[index].textContent.indexOf(input.value) === -1
                        && input.value !== '') {
                            toHide = true;
                        }
                        break;
                }

                if (toHide) break;
            }
            row.hidden = toHide;
        }
    });
}