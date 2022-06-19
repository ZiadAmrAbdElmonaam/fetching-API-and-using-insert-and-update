localStudentsArray = [];

let studentName = document.querySelector("input[name=studentName]");
let studentNameSpanError = document.querySelector("#nameError");

let departmentsCell = document.getElementById('departmentsTd');
let departmentSpanError = document.querySelector("#departmentError");

let StudentsDiv = document.getElementById('studentsDiv')
let studentsTable = document.createElement("table");
StudentsDiv.append(studentsTable)

// Student name check on Key Up
studentName.addEventListener("keyup", function () {
    studentNameCheck(this.value);
});

/* ----- Helper Method ----- */

// Check for existance student name before
function studentNameCheck(value) {
    if (value == "") {
        studentNameSpanError.innerText = "Name could not be Empty";
        studentNameSpanError.classList.remove("hide");
        return false;
    } else {
        for (let student of localStudentsArray) {
            if (!!student.Name && student.Name.toLowerCase() == value.toLowerCase()) {
                studentNameSpanError.innerText = "This name exists before";
                studentNameSpanError.classList.remove("hide");
                return false;
            } else {
                studentNameSpanError.innerText = "";
                studentNameSpanError.classList.add("hide");
            }
        }
        return true;
    }
}

function departmentCheck() {
    let department = document.querySelector('input[type=radio]:checked')
    if (department == null) {
        departmentSpanError.classList.remove("hide");
        return false;
    } else {
        departmentSpanError.classList.add("hide");
        return true;
    }
}

// Check for grade in range and Exist
function studentGradeCheck(value) {
    if (value == "") {
        studentGradeSpanError.innerText = "Grade could not be Empty";
        studentGradeSpanError.classList.remove("hide");
        return false;
    } else if (parseInt(value) < 0 || parseInt(value) > 100) {
        studentGradeSpanError.innerText = "Grade must be between 0 & 100";
        studentGradeSpanError.classList.remove("hide");
        return false;
    } else {
        studentGradeSpanError.innerText = "";
        studentGradeSpanError.classList.add("hide");
        return true;
    }
}

// Drawing table function
function createTable() {
    studentsTable.remove();
    let studentsDiv = document.getElementById('studentsDiv');
    studentsTable = document.createElement('table')

    let header = document.createElement('tr');
    let tableCell = document.createElement('th');
    tableCell.innerText = 'Name'
    header.append(tableCell);
    tableCell = document.createElement('th');
    tableCell.innerText = 'Department'
    header.append(tableCell);
    tableCell = document.createElement('th');
    tableCell.innerText = 'Action'
    tableCell.colSpan = '2'
    header.append(tableCell);

    studentsTable.append(header)
    studentsDiv.append(studentsTable);
    return studentsTable
}

// Add row of student to the table view
function addToTable(table, studentId, studentName, departmentName) {
    //show table row
    let studentTableRow = document.createElement("tr");
    studentTableRow.dataset.studentId = studentId;
    table.append(studentTableRow);

    //show name value
    //capitalize first character
    let studentTableCell = createTableCell(studentName);
    studentTableRow.append(studentTableCell);

    //show Department name
    studentTableCell = createTableCell(departmentName);
    studentTableRow.append(studentTableCell);

    //show delete button
    studentTableCell = createTableCell('')
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    studentTableCell.append(deleteBtn)
    studentTableRow.append(studentTableCell);

    //show Update button
    let updateBtn = document.createElement("button");
    updateBtn.innerText = "Update";
    updateBtn.classList.add('updateBtn')
    studentTableCell.append(updateBtn)
    studentTableRow.append(studentTableCell);
}

// Create table cell and return it
function createTableCell(valueToShow) {
    let tableCell = document.createElement("td");
    tableCell.innerText = valueToShow;
    return tableCell;
}

function toggleUpdateState(actionTd, state) {
    let studentRow = actionTd.parentElement;
    // hide delete and update button , and show studentNameTxtBox and departmentSelection
    if (state) {
        setTempData(studentRow.dataset.studentId, studentRow.children[0].innerText, studentRow.children[1].innerText)
        Array.from(actionTd.children).forEach(btn => btn.remove());

        // append change button
        let btn = document.createElement("button");
        btn.innerText = "Confirm";
        btn.classList.add('updateBtn')
        btn.dataset.viewOnly = true
        actionTd.append(btn)

        // append cancel button
        btn = document.createElement("button");
        btn.innerText = "Cancel";
        actionTd.append(btn)

        //append studentNameTxtBox
        let studentNameTxtBox = document.createElement('input');
        studentNameTxtBox.type = 'text'
        studentNameTxtBox.value = studentRow.children[0].innerText
        studentRow.children[0].innerText = ''
        studentRow.children[0].append(studentNameTxtBox);

        //append departmentsSelection
        let deptSelect = document.createElement('select');
        oldDepartment = studentRow.children[1].innerText
        getDepartments().then(departments => {
            for (const department of departments) {
                let deptOption = document.createElement('option');
                deptOption.innerText = department.Name;
                deptOption.value = department._id;
                deptOption.dataset.name = department.Name;
                if (department.Name == oldDepartment)
                    deptOption.selected = true;
                deptSelect.append(deptOption);
            }
        })
        studentRow.children[1].innerText = ''
        studentRow.children[1].append(deptSelect);

    }
    // hide changeBtn, cancelBtn, studentNameTxtBox and departmentSelection and display old data
    else {
        Array.from(actionTd.children).forEach(btn => btn.remove());

        // append delete button
        let btn = document.createElement("button");
        btn.innerText = "Delete";
        actionTd.append(btn)

        // append cancel button
        btn = document.createElement("button");
        btn.classList.add('updateBtn')
        btn.innerText = "Update";
        actionTd.append(btn)

        //remove textbox and show text
        studentRow.children[0].children[0].remove();
        studentRow.children[0].innerText = getTempData(studentRow.dataset.studentId).studentName

        //remove departmentsSelection and show text
        studentRow.children[1].children[0].remove()
        studentRow.children[1].innerText = getTempData(studentRow.dataset.studentId).studentDept
    }
}

// save and retreive old data if confirm or cancel buttons clicked in updates
let tempStudents = [];
function setTempData(studentId, studentName, studentDept) {
    tempStudents.push({ studentId: studentId, studentName: studentName, studentDept: studentDept })
}
function getTempData(studentId) {
    return tempStudents.find(element => element.studentId == studentId);
}
function updateTempData(studentId, studentName, studentDept) {
    return tempStudents.forEach(element => {
        if (element.studentId == studentId) {
            element.studentName = studentName;
            element.studentDept = studentDept
        }
    });
}

async function getDepartments() {
    try {
        let response = await fetch("https://node-monge-iti-project.herokuapp.com/departments");
        return await response.json();
    } catch (err) {
        console.log("Error Ocurred in fetching Depatments", err);
    }
}

async function getStudents() {
    try {
        let response = await fetch("https://node-monge-iti-project.herokuapp.com/students");
        return await response.json();
    } catch (err) {
        console.log("Error Ocurred in fetching students", err);
    }
}

async function addStudent(studentData) {
    try {
        let response = await fetch("https://node-monge-iti-project.herokuapp.com/students", {
            method: 'POST',
            body: JSON.stringify({
                'name': studentData.name,
                'department': studentData.department
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    } catch (err) {
        console.log("Error Ocurred in adding the student : ", studentData.name, err);
    }
}

async function deleteStudent(studentId) {
    try {
        let response = await fetch("https://node-monge-iti-project.herokuapp.com/students", {
            method: 'delete',
            body: JSON.stringify({
                id: studentId
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        return response
    } catch (err) {
        console.log("Error Ocurred in Deleting the student : ", err);
    }
}

async function updateStudent(studentId, studentName, studentDept) {
    try {
        let response = await fetch("https://node-monge-iti-project.herokuapp.com/students", {
            method: 'put',
            body: JSON.stringify({
                'id': studentId,
                'name': studentName,
                'department': studentDept
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    } catch (err) {
        console.log("Error Ocurred in updating the student : ", err);
    }
}
