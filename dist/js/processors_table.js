let processorsTable = document.getElementById("processors");

// метод меняет местами k-ый и p-ый элементы массива каждого поля
processorsTable.swapRows = function(k, p) {
    let cells1 = this.rows[k].cells;
    let cells2 = this.rows[p].cells;
    for (let i = 0; i < cells1.length; i++) {
        let temp = cells1[i].innerHTML;
        cells1[i].innerHTML = cells2[i].innerHTML;
        cells2[i].innerHTML = temp;
    }
}

// возвращает true, если элементы менять местами надо, false - в противном случае
processorsTable.isCompareOrder = function(n, cellsIndexAndOrder) {
    for (let index in cellsIndexAndOrder) {
        let order = cellsIndexAndOrder[index];
        index = parseInt(index); //не забываем, что у каждого индекса в конце стоит '.0'
        let cellValue = this.rows[n].cells[index].innerHTML === '-' ?
                        0 : this.rows[n].cells[index].innerHTML;
        let nextCellValue = this.rows[n + 1].cells[index].innerHTML === '-' ?
                            0 : this.rows[n + 1].cells[index].innerHTML;
        if (index > 1) { // все что идет после первых двух стобцов таблицы сравниваем как числа
            cellValue = +cellValue; nextCellValue = +nextCellValue;
        }
        
        let compare = order === 'asc' ? cellValue > nextCellValue
                                      : cellValue < nextCellValue
        
        if(compare) {
            return true;
        } else if(cellValue === nextCellValue) {
            continue; // переходим к сравнению следующего поля
        } else {
            return false;
        }	
    }
    return false
}

processorsTable.sort = function(cellsIndexAndOrder) {
    let n = this.rows.length;
    for(let i = 0; i < n - 1; i++) {
        for (let j = 2; j < n - i - 1; j++) {
            if (this.isCompareOrder(j, cellsIndexAndOrder)) {
                this.swapRows(j, j + 1);
            }
        }
    }
    return true;
}
