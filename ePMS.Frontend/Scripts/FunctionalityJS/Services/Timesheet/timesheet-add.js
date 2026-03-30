var _projectTeamEmployees = [];
var approvedByDDLArray = [];
$(document).ready(function () {

    ajaxRequest({
        url: '/Services/Timesheet/GetDropdowns', type: 'POST', data: {}, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON.Projects, $('#ProjectID'), 'Select Project', 0, null);
                bindJQueryDropdownList(responseJSON.resultJSON.TimesheetStatuses, $('#StatusID'), 'Select Status', 0, 'Draft');
            }
        }
    }, null, false);

    $('#btnAddRow').click(function () {
        addTimesheetRow();

    });
    $('#ProjectID').on('select2:select', function () {
        let selectedProjectID = $(this).val();
        getProjectTeamEmployee(selectedProjectID);
    });
    $('#EmployeeID').on('select2:select select2:unselect', function () {
        const picker = $('#DateRange').data('daterangepicker');
        let startDate = null;
        let endDate = null;

        if ($("#DateRange").val()) {
            // Convert to native JS Date objects
            startDate = new Date(picker.startDate.format('YYYY-MM-DD'));
            endDate = new Date(picker.endDate.format('YYYY-MM-DD'));
        }
        let projectID = $('#ProjectID').val();

        let employeeIDs = [];
        $.each($("#EmployeeID").val(), function (index, item) {
            employeeIDs.push({ ID: item });
        })
        let inputJSON = {
            StartDate: startDate,
            EndDate: endDate,
            ProjectID: projectID,
            EmployeeIDs: employeeIDs
        };
        getDetailByEmployee(inputJSON);
    });
});

function addTimesheetRow() {
    if (customValidateForm('timesheetForm')) {
        var availableTimesheet = getTableRowsBySchema(timesheetDetailSchema, 'TimesheetDetailTableTbody');
        // console.log(availableTimesheet);
        let employees = $('#EmployeeID').val();
        var isEmployeeTimesheetExsist = false, timesheetEmployees = [];

        $.each(employees, function (index, item) {
            let employee = _projectTeamEmployees.find(row => row.ID == item);
            // console.log(employee);
            const picker = $('#DateRange').data('daterangepicker');
            let dateRangeStartDate = null;
            let dateRangeEndDate = null;

            if ($("#DateRange").val()) {
                // Convert to native JS Date objects
                dateRangeStartDate = new Date(picker.startDate.format('YYYY-MM-DD'));
                dateRangeEndDate = new Date(picker.endDate.format('YYYY-MM-DD'));
            }
            for (var d = new Date(dateRangeStartDate); d <= dateRangeEndDate; d.setDate(d.getDate() + 1)) {

                let dayName = d.toLocaleString('en-US', { weekday: 'short' });

                let availableEmployeeTimesheet = availableTimesheet.find(row => row.EmployeeID == item && row.Date == getFormattedDate(d));
                // console.log('availableEmployeeTimesheet');
                // console.log(availableEmployeeTimesheet);
                if (availableEmployeeTimesheet) {
                    isEmployeeTimesheetExsist = true;

                    //cheack if not exsist then push
                    if (!timesheetEmployees.includes(employee.Name)) {
                        timesheetEmployees.push(employee.Name);
                    }
                }
                else {

                    timesheetDetailSchema.ApprovedByID['options'] = approvedByDDLArray;
                    addTableRowsBySchema(timesheetDetailSchema, 'TimesheetDetailTableTbody', { ID: 0, Date: getFormattedDate(d), Day: dayName, EmployeeID: employee.ID, Employee: employee.Name, Designation: employee.Role, HourRate: employee.HourlyRate, BreakHours: "0.00", Overtime: "0.00", IsInvoiced: "false", Invoiced: "No" });
                }

            }
            updateIsInvoicedBadges('TimesheetDetailTableTbody');
        });

        if (isEmployeeTimesheetExsist) {
            // Convert array to comma seperated string
            let startDate = getFormattedDate(new Date($('#DateRange').data('daterangepicker').startDate));
            let endDate = getFormattedDate(new Date($('#DateRange').data('daterangepicker').endDate));
            infoToastr(`Log already exist for (${timesheetEmployees.join(", ")}) For (${startDate} - ${endDate}):`, "Info");
            // alert("This data already exists for: " + timesheetEmployees.join(", "));
        }
    }
}
function getProjectTeamEmployee(id) {
    ajaxRequest({
        url: "/Services/Timesheet/GetProjectTeamEmployee", type: 'POST', data: { ID: id }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {

                bindJQueryDropdownList(responseJSON.resultJSON, $('#EmployeeID'), 'Select Employee(s)', 0, null);
                _projectTeamEmployees = responseJSON.resultJSON;
                approvedByDDLArray = _projectTeamEmployees;
                approvedByDDLArray.unshift({ Value: 0, Text: 'Select Approver' });
            }
        }
    });
}
function getDetailByEmployee(inputJSON) {
    console.log(inputJSON);
    ajaxRequest({
        url: "/Services/TimesheetDetail/GetByEmployee", type: 'POST', data:  inputJSON , callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                console.log(responseJSON.resultJSON);
                //_projectTeamEmployees = responseJSON.resultJSON;
                $(`#TimesheetDetailTableTbody`).html('');


                $.each(responseJSON.resultJSON, function (index, item) {
                 
                    if (item.StartTime && typeof item.StartTime === 'object') {
                        item.StartTime = formatTimeObjectTo12Hour(item.StartTime);
                    }
                    if (item.EndTime && typeof item.EndTime === 'object') {
                        item.EndTime = formatTimeObjectTo12Hour(item.EndTime);
                    }
                    if (item.Amount) item.Amount = addThousandSeperator((item.Amount));


                    timesheetDetailSchema.ApprovedByID['options'] = approvedByDDLArray;

                    item['Invoiced'] = "No"
                    addTableRowsBySchema(timesheetDetailSchema, 'TimesheetDetailTableTbody', item);
                })

                updateIsInvoicedBadges('TimesheetDetailTableTbody');


            }
        }
    });
}
