let formSort = document.getElementById("sort");
let sortButton = document.getElementById("sortButton");

// логика сортирвки при нажатии на кнопку
sortButton.addEventListener("click", function(event) {
    let cellsIndexAndOrder = {};
    for (let i = 0; i < 3; i++) {
        let index = formSort['sort' + i].selectedIndex;
        //let sortValue = form['sort' + i].options[index].text;
        if (index == 0) {
            if (i == 0) {
                alert("Вы не выбрали поле для сравнения");
                return;
            } 
            break;
        }

        let order = formSort['desc' + i].checked ? 'desc' : 'asc';
        cellsIndexAndOrder[`${index - 1}.0`] = order; // добавляю точку с нулем, чтобы массив не сортировался по ключам (из-за целых чисел)
        if (index == 8) {
            cellsIndexAndOrder[`${index}.0`] = order; // если дата выпуска, то сравниваем не только по году, но и кварталу
        }
    }

    processorsTable.sort(cellsIndexAndOrder);
});

let selects = formSort.getElementsByTagName("select");

// убирает из списков значение, которое выбрано на том, с которого вызван ивент
for (let i = 0; i < selects.length; i++) {
    selects[i].addEventListener("focus", function(event) {
        this.oldIndex = this.selectedIndex;
    });

    selects[i].addEventListener("change", function(event) {
        for (let j = 0; j < selects.length; j++) {
            if (j !== i && this.selectedIndex !== 0) {
                selects[j][this.selectedIndex].hidden = true;
            }
            selects[j][this.oldIndex].hidden = false;
        }
    });
}