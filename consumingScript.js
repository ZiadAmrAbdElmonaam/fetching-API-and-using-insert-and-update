// load Existance Department and display them in the view
getDepartments().then(departmentsArray => {
    //remove loading text
    if (departmentsArray) departmentsCell.children[0].remove();

    departmentsArray.forEach(department => {
        //creation for radio Input
        let radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.id = department._id;
        radioInput.name = 'department';
        radioInput.value = department.Name;

        //creation for label for radio Input
        let label = document.createElement('label');
        label.htmlFor = department._id;
        label.innerText = department.Name;

        //add radio input and label to the table cell
        departmentsCell.append(radioInput);
        departmentsCell.append(label);
    });
})

// load Existance Student and display them in the view
getStudents().then(studentsArray => {
    //remove loading text
    let studentsDiv = document.getElementById('studentsDiv');
    if (studentsArray) studentsDiv.children[1].remove();

    //add student to the local students Array
    localStudentsArray = studentsArray;

    let studentsTable = createTable();
    studentsArray.forEach(student => {
        addToTable(studentsTable, student._id, student?.Name, student.Department?.Name)
    })
})

// Check for department selection
departmentsCell.addEventListener('click', function (event) {
    if (event.target.tagName == "INPUT") {
        departmentCheck();
    }
})


// Add Student Button
let addBtn = document.querySelector("#addBtn");
addBtn.addEventListener("click", function () {
    if (studentNameCheck(studentName.value) && departmentCheck()) {

        let studentDept = document.querySelector("input[name=department]:checked");
        let capitalizedName = studentName.value[0].toUpperCase() + studentName.value.slice(1, studentName.value.length);
        let student = { name: capitalizedName, department: studentDept.id };

        addStudent(student).then(res => {
            if (res.Name == capitalizedName) {
                getStudents().then(students => {
                    localStudentsArray = students
                    let table = createTable();
                    for (let student of localStudentsArray) {
                        addToTable(table, student._id, student?.Name, student.Department?.Name)
                    }
                })
            }
            else {
                alert('error Occured')
            }
        })

    }
});

// Delete Student Button
let studentRow = document.querySelector("#studentsDiv");
studentRow.addEventListener("click", function (event) {
    if (event.target.tagName == 'BUTTON' && event.target.innerText == 'Delete') {
        let studentId = event.target.parentElement.parentElement.dataset.studentId;
        deleteStudent(studentId).then(() => {
            getStudents().then(res => {
                localStudentsArray = res;
                let table = createTable();
                for (let student of localStudentsArray) {
                    addToTable(table, student._id, student?.Name, student.Department?.Name)
                }
            })
        }
        )
    }
});

// Update Student Button
studentRow.addEventListener("click", function (event) {
    if (event.target.tagName == 'BUTTON' && event.target.innerText == 'Update') {
        let actionTd = event.target.parentElement;
        toggleUpdateState(actionTd, true)
    }
});

// cancelUpdate Student Button
studentRow.addEventListener("click", function (event) {
    if (event.target.tagName == 'BUTTON' && event.target.innerText == 'Cancel') {
        let actionTd = event.target.parentElement;
        toggleUpdateState(actionTd, false)
    }
});

// changeUpdate Student Button
studentRow.addEventListener("click", function (event) {
    if (event.target.tagName == 'BUTTON' && event.target.innerText == 'Confirm') {
        let actionTd = event.target.parentElement;
        let studentId = event.target.parentElement.parentElement.dataset.studentId;
        let newStudentName = event.target.parentElement.parentElement.children[0].children[0].value;
        let newStudentDept = event.target.parentElement.parentElement.children[1].children[0].value;
        updateStudent(studentId, newStudentName, newStudentDept).then(() => {
            let selectedDeptOption = actionTd.parentElement.querySelector('select option:checked')
            updateTempData(studentId, newStudentName, selectedDeptOption.innerText)
            toggleUpdateState(actionTd, false)
        })
    }
});