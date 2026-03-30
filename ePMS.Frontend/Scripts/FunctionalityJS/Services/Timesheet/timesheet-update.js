
var _projectTeamEmployees = [], _exsistingEmployeeArray = [];

$(document).ready(function () {

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ID')) {
        let id = urlParams.get('ID');
        getAndDecryptID(id);
    }

    $('#DateRange').prop('disabled', true);
    $('#ProjectID').prop('disabled', true);
    $('#EmployeeID').prop('disabled', true);
    $('#ProjectID').on('select2:select', function () {
        let selectedProjectID = $(this).val();
        getProjectTeamEmployee(selectedProjectID);
    });
});
var getAndDecryptIDCallBack = function (response) {
    getByID(response);
}
function getByID(id) {
    ajaxRequest({ url: '/Services/Timesheet/GetByID', type: 'POST', data: { ID: id }, callBack: getByIDCallBack });
}
var getByIDCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        debugger;
        console.log(responseJSON.resultJSON.Detail);
        setResponseToFormInputs(responseJSON.resultJSON.Header);

        let header = responseJSON.resultJSON.Header;
        if (header) {
            let fromDate = header.FromDate;
            let toDate = header.ToDate;
            $('#DateRange').data('daterangepicker').setStartDate(getFormattedDate(header.FromDate));
            $('#DateRange').data('daterangepicker').setEndDate(getFormattedDate(header.ToDate));
        }

        let approvedByArray = responseJSON.resultJSON.Teams;
        approvedByArray.unshift({ Value: 0, Text: 'Select Approver' });
        console.log(responseJSON.resultJSON.Detail);
        $.each(responseJSON.resultJSON.Detail, function (index, item) {

            if (!_exsistingEmployeeArray.includes(item.EmployeeID)) {
                _exsistingEmployeeArray.push(item.EmployeeID);
            }
            // Convert StartTime & EndTime to 12-hour string format
            if (item.StartTime && typeof item.StartTime === 'object') {
                item.StartTime = formatTimeObjectTo12Hour(item.StartTime);
            }
            if (item.EndTime && typeof item.EndTime === 'object') {
                item.EndTime = formatTimeObjectTo12Hour(item.EndTime);
            }
            if (item.Amount) item.Amount = addThousandSeperator((item.Amount));
           // item.Date = getFormattedDate(item.Date);
            timesheetDetailSchema.ApprovedByID['options'] = approvedByArray;

            item['Invoiced'] = "No"
            addTableRowsBySchema(timesheetDetailSchema, 'TimesheetDetailTableTbody', item);
        });
        updateIsInvoicedBadges('TimesheetDetailTableTbody');
        bindJQueryDropdownList(responseJSON.resultJSON.Teams, $('#EmployeeID'), 'Select Employee(s)', _exsistingEmployeeArray, null);
        ajaxRequest({
            url: '/Services/Timesheet/GetDropdowns', type: 'POST', data: {}, callBack: function (dropdownsJSON) {
                if (responseJSON.IsSuccess) {
                    console.log(dropdownsJSON.resultJSON);
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.Projects, $('#ProjectID'), 'Select Projects', responseJSON.resultJSON.Header.ProjectID, null);
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.TimesheetStatuses, $('#StatusID'), 'Select Status', responseJSON.resultJSON.Header.StatusID, null);

                }
            }
        }, null, false);

    }
    else {
        errorToastr(responseJSON.Message, "error");
    }
}

function getProjectTeamEmployee(id, selectedValues = []) {
    ajaxRequest({
        url: "/Services/Timesheet/GetProjectTeamEmployee", type: 'POST', data: { ID: id }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                console.log(responseJSON.resultJSON);
                bindJQueryDropdownList(responseJSON.resultJSON, $('#EmployeeID'), 'Select Employee(s)', selectedValues, null);
                _projectTeamEmployees = responseJSON.resultJSON;

            }
        }
    });
}
function redirectToAdd(id) {
    redirectToAction("/Services/Timesheet/Add?ID=", id, null);
}