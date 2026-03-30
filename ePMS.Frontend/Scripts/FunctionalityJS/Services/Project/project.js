var _subContractorArray = [];
var _subPaymentTermArray = [];
var _assigneeArray = [];
var _assigneeRoleArray = [];
var _assigneeStatusArray = [];
var _assigneeBillingTypeArray = [];
var isProjectAssigneeLoaded = false;
$(document).ready(function () {
 
    $("select.selector_2").select2({
        width: "100%",
        placeholder: "Select an option",
        minimumResultsForSearch: 0,
    });
    $(".mutiple_sel").select2({ width: "style" });
    datePickerDDMMYYYYFormat('StartDate');
    datePickerDDMMYYYYFormat('EndDate');
    datePickerDDMMYYYYFormat('ActualEndDate');

    $('#CountryID').on('select2:select', function () {
        loadCityByCountryDropdownList('CityID', $(this).val(), null, null);
    });
    $('#btnSave').click(function (e) {
        e.preventDefault();
        saveRecord();
    });
    $('#btnClose').click(function () {
        redirectToProjectList();
    });

});

function saveRecord(isCloseAndSaveAsDraft = false) {
    let _subContractArray = [];
    let _teamsArray = [];

    if (customValidateForm('projectForm')) {
        var inputJSON = getFormDataAsJSONObject('projectForm');
        inputJSON = getFormDataAsJSONObject('budgetAndFinanceForm', inputJSON);
        inputJSON.ActualHours = removeAllCommas(inputJSON.ActualHours);
        inputJSON.ActualRevenue = removeAllCommas(inputJSON.ActualRevenue);
        inputJSON.Variance = removeAllCommas(inputJSON.Variance);
        inputJSON.ContractValue = removeAllCommas(inputJSON.ContractValue);
        $('#SubcontractTableTbody tr').each(function (index, item) {
            let subContract = {
                ID: $(this).find('td.tdID').text(),
                SubcontractorID: $(this).find('td.tdSubcontractorID').find('select').val(),
                ContractNo: $(this).find('td.tdContractNo').find('input').val(),
                StartDate: $(this).find('td.tdStartDate').find('input').val(),
                EndDate: $(this).find('td.tdEndDate').find('input').val(),
                PaymentTermID: $(this).find('td.tdPaymentTermID').find('select').val(),
            }
            _subContractArray.push(subContract);
        });
        inputJSON['Subcontracts'] = _subContractArray;

        $('#TeamTableTbody tr').each(function (index, item) {
            let team = {
                ID: $(this).find('td.tdID').text(),
                HourlyRate: removeAllCommas($(this).find('td.tdHourlyRate').find('input').val()),
                ApprovedHoursLimit: removeAllCommas($(this).find('td.tdApprovedHoursLimit').find('input').val()),
                RoleID: $(this).find('td.tdRoleID').find('select').val(),
                StatusID: $(this).find('td.tdStatusID').find('select').val(),
                AssigneeID: $(this).find('td.tdAssigneeID').find('select').val(),
                BillingTypeID: $(this).find('td.tdBillingTypeID').find('select').val(),
            }
            _teamsArray.push(team);
        });
        inputJSON['Teams'] = _teamsArray;

        // validation for Subcontractor 
        if (_subContractArray.length > 1) {
            for (let i = 0; i < _subContractArray.length; i++) {
                let c = _subContractArray[i], rowNo = i + 1;
                if (!c.SubcontractorID || c.SubcontractorID === "0") return infoToastr(`In Subcontractor row ${rowNo}: contractor is missing`);
            }  
        }

        // validation for team 
        if (_teamsArray.length > 1) {
            for (let i = 0; i < _teamsArray.length; i++) {
                let c = _teamsArray[i], rowNo = i + 1;
                if (!c.AssigneeID || c.AssigneeID === "0") return infoToastr(`In Team row ${rowNo}: Assigne is missing`);
            }
        }


        ajaxRequest({ url: "/Services/Project/Save", type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft });

    }
}
function saveRecordCallBack(responseJSON, options) {
    if (responseJSON.IsSuccess) {
        $('#ID').val(responseJSON.resultJSON);
        successToastr("The Project has been saved", 'success');

        if (options.isCloseAndSaveAsDraft) {
            setTimeout(function () {
                window.location.href = '/Services/Project/List?FID=cgKWwAGqpX2C4N74K+dafw==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
            }, 2000);
        }

    }
    else {
        errorToastr("", responseJSON.Message, responseJSON);
    }
}

//Btn Close Code
function redirectToProjectList() {
    swal.fire({
        title: "",
        text: 'Do you want save changes?',
        type: 'info',
        cancelButtonColor: '#F04249',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        dangerMode: true,
        allowOutsideClick: false,
    }).then(
        function (isConfirm) {
            if (isConfirm.value == true) {
                saveRecord(true);
            }
            else {
                window.location.href = '/Services/Project/List?FID=fVZFcZW3+pwAgWyGPOtYrg==&ModuleID=stgRMCl4UuaRIz1dElDqYA==';
            }
        });

};
//Btn Close End Code


function addSubcontractRow(item = null) {
    let subcontractorDropdownListHTML = loadSubcontractorDropdownList((item == null ? 0 : item.SubcontractorID));
    let paymentTermDropdownListHTML = loadPaymentTermDropdownList((item == null ? 0 : item.PaymentTermID));
    let startDate = item && item.StartDate ? getFormattedDate((item.StartDate)) : getFormattedDate(new Date());
    let endDate = item && item.EndDate ? getFormattedDate((item.EndDate)) : getFormattedDate(new Date());
    let contractNo = item && item.ContractNo ? item.ContractNo : "";
    var insertingRow = ` <tr>
                           <td class="tdID" hidden>${item && item.ID ? item.ID : 0}</td>
                               <td class="tdSubcontractorID"> ${subcontractorDropdownListHTML} </td>
                               <td class="tdContractNo"> <input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" value="${contractNo}" /></td>
                               <td class="tdStartDate"><div class="selector" style="margin-top:0px !important"><input type="text" class="form-control bha-datepicker SubcontractStartDate" placeholder="Start Date" autocomplete="off" value="${startDate}"/></div></td>
                               <td class="tdEndDate"><div class="selector" style="margin-top:0px !important"><input type="text" class="form-control bha-datepicker SubcontractEndDate" placeholder="End Date" autocomplete="off" value="${endDate}"/></div></td>
                               <td class="tdPaymentTermID">${paymentTermDropdownListHTML}</td>
                               <td class="tdAction text-center pt-0 pb-0">


                               </td>
                          </tr>`;

    $('#SubcontractTableTbody').append(insertingRow);
    refreshTableActions();
    $("select.selector_2").select2({
        width: "100%",
        placeholder: "Select an option",

        minimumResultsForSearch: 0,
    });
    datePickerDDMMYYYYFormat('SubcontractStartDate');
    datePickerDDMMYYYYFormat('SubcontractEndDate');
}
function refreshTableActions() {
    let $rows = $("#SubcontractTable tbody tr")
    $rows.each(function (index) {
        const actionCell = $(this).find('td.tdAction');
        actionCell.empty(); // Clear *this* row's action cell

        const isLast = index === $rows.length - 1;

        if ($rows.length === 1) {
            actionCell.append(`
        <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="addSubcontractRow();"></i>
    `);
        } else if (isLast) {
            // Last row: Show Add + Remove
            actionCell.append(`
         <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="addSubcontractRow();"></i>
         <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeSubcontractRow(this);"></i>

    `);
        } else {
            // Other rows: Remove only
            actionCell.append(`
       <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeSubcontractRow(this);"></i>
    `);
        }
    });
}
//function removeSubcontractRow(requestedRow) {
//    let $row = $(requestedRow).closest("tr");
//    $row.remove();
//    refreshTableActions();
//}
function removeSubcontractRow(requestedRow) {
    let $row = $(requestedRow).closest("tr");
    let subcontractorID = $row.find(".tdID").text().trim();
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: `Do you really want to delete this row`,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(function (isConfirm) {
        if (isConfirm.value == true) {
            if (subcontractorID <= 0) {
                let $row = $(requestedRow).closest("tr");
                $row.remove();
                refreshTableActions();
                return;
            }
            else {
                ajaxRequest({
                    url: "/Services/Project/DeleteSubcontractor", type: 'POST', data: { ID: subcontractorID }, callBack: function (responseJSON) {
                        if (responseJSON.IsSuccess) {
                            $row.remove();
                            refreshTableActions();
                        }
                        else {
                            errorToastr("Your operation Canceled :)", "error");
                        }
                    }
                });
            }


        }
        else {
            errorToastr("Your operation Canceled :)", "error");
        }
    });
}

function getSubcontractor(subContracts = []) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: 'Subcontractor', Columns: 'ID Value, Name Text', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                _subContractorArray = responseJSON.resultJSON;
                getPaymentTerm(subContracts);
            }
        }
    });
}
function loadSubcontractorDropdownList(selectedValue) {
    var options = `<select class="js-states form-control selector_2 w-100 SubcontractDDL">`

    let exist = _subContractorArray.find(row => row.Value == selectedValue);
    if (exist) {
        options += `<option value="0">Select Subcontract</option>`;
    }
    else {
        options += `<option value="0" selected>Select Subcontract</option>`;
    }

    $.each(_subContractorArray, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.Value) {
            options += `<option value="` + rowItem.Value + `" selected>` + rowItem.Text + `</option>`;
        }
        else {
            options += `<option value="` + rowItem.Value + `">` + rowItem.Text + `</option>`;
        }

    });

    return options;
}
function getPaymentTerm(subContracts = []) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ProjectPaymentTerm]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                _subPaymentTermArray = responseJSON.resultJSON;
                if (subContracts == null) {
                    addSubcontractRow(null);
                }
                else {
                    $.each(subContracts, function (index, item) {
                        addSubcontractRow(item);
                    });
                }

            }
        }
    });
}
function loadPaymentTermDropdownList(selectedValue) {
    var options = `<select class="js-states form-control selector_2 w-100 PaymentTermDDL">`
    let exist = _subPaymentTermArray.find(row => row.Value == selectedValue);
    if (exist) {
        options += `<option value="0">Select Payment Term</option>`;
    }
    else {
        options += `<option value="0" selected>Select Payment Term</option>`;
    }

    $.each(_subPaymentTermArray, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.Value) {
            options += `<option value="` + rowItem.Value + `" selected>` + rowItem.Text + `</option>`;
        }
        else {
            options += `<option value="` + rowItem.Value + `">` + rowItem.Text + `</option>`;
        }

    });

    return options;
}
function addTeamRow(item = null) {
    let assigneeDropdownListHTML = loadAssigneeDropdownList((item == null ? 0 : item.AssigneeID));
    let assigneeRoleDropdownListHTML = loadAssigneeRoleDropdownList((item == null ? 0 : item.RoleID));
    let BillingTypeID = loadAssigneeBillingTypeDropdownList((item == null ? 0 : item.BillingTypeID));
    let hourlyRate = item && item.HourlyRate ? item.HourlyRate : "";
    let approvedHoursLimit = item && item.ApprovedHoursLimit ? item.ApprovedHoursLimit : "";
    let assigneeStatusDropdownListHTML = loadAssigneeStatusDropdownList((item == null ? 0 : item.StatusID));
    var insertingRow = ` <tr>
                                 <td class="tdID" hidden>${item && item.ID ? item.ID : 0}</td>
                                  <td class="tdAssigneeID"> ${assigneeDropdownListHTML} </td>
                                  <td class="tdRoleID"> ${assigneeRoleDropdownListHTML} </td>
                                  <td class="tdBillingTypeID"> ${BillingTypeID} </td>
                                  <td class="tdHourlyRate"> <input class="js-states form-control bha-input w-100 mt-0" value="${addThousandSeperator(hourlyRate)}" maxlength="15" onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"></td>
                                  <td class="tdApprovedHoursLimit"> <input class="js-states form-control bha-input w-100 mt-0" value="${addThousandSeperator(approvedHoursLimit)}" maxlength="15" onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"></td>
                                  <td class="tdStatusID"> ${assigneeStatusDropdownListHTML} </td>
                                  <td class="tdAction text-center pt-0 pb-0">


                                  </td>
                             </tr>`;

    $('#TeamTableTbody').append(insertingRow);
    refreshTeamTableActions();
    $("select.selector_2").select2({
        width: "100%",
        placeholder: "Select an option",

        minimumResultsForSearch: 0,
    });
}
function refreshTeamTableActions() {
    let $rows = $("#TeamTable tbody tr")
    $rows.each(function (index) {
        const actionCell = $(this).find('td.tdAction');
        actionCell.empty(); // Clear *this* row's action cell

        const isLast = index === $rows.length - 1;

        if ($rows.length === 1) {
            actionCell.append(`
            <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="addTeamRow();"></i>
        `);
        } else if (isLast) {
            // Last row: Show Add + Remove
            actionCell.append(`
             <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="addTeamRow();"></i>
             <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeTeamRow(this);"></i>

        `);
        } else {
            // Other rows: Remove only
            actionCell.append(`
           <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeTeamRow(this);"></i>
        `);
        }
    });
}
//function removeTeamRow(requestedRow) {
//    let $row = $(requestedRow).closest("tr");
//    $row.remove();
//    refreshTeamTableActions();
//}
function removeTeamRow(requestedRow) {
    let $row = $(requestedRow).closest("tr");  
    let teamID = $row.find(".tdID").text().trim() || 0;
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: `Do you really want to delete this row`,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(function (isConfirm) {
        if (isConfirm.value == true) {
            if (teamID <= 0) {
                let $row = $(requestedRow).closest("tr");
                $row.remove();
                refreshTeamTableActions();
                return;
            }
            else {
                ajaxRequest({
                    url: "/Services/Project/DeleteTeam", type: 'POST', data: { ID: teamID }, callBack: function (responseJSON) {
                        if (responseJSON.IsSuccess) {
                            $row.remove();
                            refreshTeamTableActions();
                        }
                        else {
                            errorToastr("Your operation Canceled :)", "error");
                        }
                    }
                });
            }


        }
        else {
            errorToastr("Your operation Canceled :)", "error");
        }
    });
}
function getAssignee(teams = []) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPCoreSuite.dbo.Employee EMP', Columns: 'EMP.ID Value, CONCAT(EMP.FirstName, \' \', EMP.LastName) Text', Condition: 'WHERE IsActive = 1 AND EMP.CompanyID =' + companyID + '' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                _assigneeArray = responseJSON.resultJSON;
                getAssigneeRole(teams);

            }
        }
    });
}
function loadAssigneeDropdownList(selectedValue) {
    var options = `<select class="js-states form-control selector_2 w-100 AssigneeDDL">`

    let exist = _assigneeArray.find(row => row.Value == selectedValue);
    if (exist) {
        options += `<option value="0">Select Assignee</option>`;
    }
    else {
        options += `<option value="0" selected>Select Assignee</option>`;
    }

    $.each(_assigneeArray, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.Value) {
            options += `<option value="` + rowItem.Value + `" selected>` + rowItem.Text + `</option>`;
        }
        else {
            options += `<option value="` + rowItem.Value + `">` + rowItem.Text + `</option>`;
        }

    });

    return options;
}
function getAssigneeRole(teams = []) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.AssigneeRole]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                _assigneeRoleArray = responseJSON.resultJSON;
                getAssigneeBillingType(teams);
            }
        }
    });
}
function loadAssigneeRoleDropdownList(selectedValue) {
    var options = `<select class="js-states form-control selector_2 w-100 AssigneeRoleDDL">`
    let exist = _assigneeRoleArray.find(row => row.Value == selectedValue);
    if (exist) {
        options += `<option value="0">Select Assignee Role</option>`;
    }
    else {
        options += `<option value="0" selected>Select Assignee Role</option>`;
    }

    $.each(_assigneeRoleArray, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.Value) {
            options += `<option value="` + rowItem.Value + `" selected>` + rowItem.Text + `</option>`;
        }
        else {
            options += `<option value="` + rowItem.Value + `">` + rowItem.Text + `</option>`;
        }

    });

    return options;
}
function getAssigneeBillingType(teams = []) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.AssigneeBillingType]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                _assigneeBillingTypeArray = responseJSON.resultJSON;
                getAssigneeStatus(teams);
            }
        }
    });
}
function loadAssigneeBillingTypeDropdownList(selectedValue) {
    var options = `<select class="js-states form-control selector_2 w-100 AssigneeBillingTypeDDL">`
    let exist = _assigneeBillingTypeArray.find(row => row.Value == selectedValue);
    if (exist) {
        options += `<option value="0">Select Billing Type</option>`;
    }
    else {
        options += `<option value="0" selected>Select Billing Type</option>`;
    }

    $.each(_assigneeBillingTypeArray, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.Value) {
            options += `<option value="` + rowItem.Value + `" selected>` + rowItem.Text + `</option>`;
        }
        else {
            options += `<option value="` + rowItem.Value + `">` + rowItem.Text + `</option>`;
        }

    });

    return options;
}
function getAssigneeStatus(teams = []) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.AssigneeStatus]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                _assigneeStatusArray = responseJSON.resultJSON;
                if (teams == null) {
                    addTeamRow(null);
                }
                else {
                    $.each(teams, function (index, item) {
                        addTeamRow(item);
                    });
                }


            }
        }
    });
}
function loadAssigneeStatusDropdownList(selectedValue) {
    var options = `<select class="js-states form-control selector_2 w-100 AssigneeStatusDDL">`
    let exist = _assigneeStatusArray.find(row => row.Value == selectedValue);
    if (exist) {
        options += `<option value="0">Select Assignee Status</option>`;
    }
    else {
        options += `<option value="0" selected>Select Assignee Status</option>`;
    }

    $.each(_assigneeStatusArray, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.Value) {
            options += `<option value="` + rowItem.Value + `" selected>` + rowItem.Text + `</option>`;
        }
        else {
            options += `<option value="` + rowItem.Value + `">` + rowItem.Text + `</option>`;
        }

    });

    return options;
}