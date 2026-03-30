//function openAssignedCashHandlerRoleSaveModal() {
function newRecord() {
    $('#saveModal').modal('show');
    loadHREmployeeDropdownList('LineManagerID', 0, 0, companyID);
    getPostingAccounts(null);
    $('#AssignedCashHandlerRoleForm')[0].reset();
    $('#LegendTitle').text("Add Assign Cash Handler Role");
    $('#ID').val(0);
    $('#AssignedCashHandlerRoleForm select').val(0).trigger('change'); 
    $('#EmployeeID').empty();
    $('#btnSave').text('Save');
 
}
function saveRecord() {
    if (customValidateForm('AssignedCashHandlerRoleForm')) {
        var inputJSON = getFormDataAsJSONObject('AssignedCashHandlerRoleForm');
        inputJSON.CashLimit = removeAllCommas(inputJSON.CashLimit);
        ajaxRequest({ url: "/CashCenter/AssignedCashHandler/Save", type: 'POST', data: inputJSON, callBack: saveCashHandlerRoleRecordCallBack });
    }
}
function saveCashHandlerRoleRecordCallBack(responseJSON) {
    if (responseJSON.IsSuccess) {
        successToastr("The Assigned Cash Handler Role has been saved", 'success');
        $('#saveModal').modal('hide');
        loadTableData();
    }
    else {
        errorToastr("", responseJSON.Message, responseJSON.Type);
    }
}
//Aman this function move to Assign View on 23june2025
//function loadTableData() {
//    ajaxRequest({ url: "/CashCenter/AssignedCashHandler/GetAll", type: 'POST', data: {}, callBack: loadTableDataCallBack });
//}
//var loadTableDataCallBack = function (responseJSON) {
//    if (responseJSON.IsSuccess) {
//        generateTableRowsExcludeHiddenHeaderFromJSON(responseJSON.resultJSON, 'AssignedCashHandlerRolesTable', null, null, null, null, ['CashLimit']);
//    }
//    else {
//        errorToastr(responseJSON.Message, "error");
//    }
//}
function modifyRecord(id) {
  
    $('#AssignedCashHandlerRoleForm')[0].reset();
    $('#saveModal').modal('show');
    loadHREmployeeDropdownList('LineManagerID', 0, 0, companyID);
    $('#ID').val(id);
    $('#LegendTitle').text("Update Assign Cash Handler Role");
    get(id);
    $('#btnSave').text('Update');
}
function get(ID) {
    ajaxRequest({ url: "/CashCenter/AssignedCashHandler/GetByID", type: 'POST', data: { ID: ID }, callBack: getCallBack });
}
var getCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        // addThousandSeparator(responseJSON.resultJSON.CashLimit);           
        setResponseToFormInputs(responseJSON.resultJSON);
        $("#CashLimit").val(addThousandSeperator(responseJSON.resultJSON.CashLimit));
        loadHREmployeeDropdownList('EmployeeID', responseJSON.resultJSON.EmployeeID, responseJSON.resultJSON.DepartmentID, companyID);
        loadCompanyBranchesDropdownList('LocationID', responseJSON.resultJSON.LocationID);
        getPostingAccounts(responseJSON.resultJSON);
    }
    else {
        errorToastr("", responseJSON.Message, "error");
    }
}
function deleteRecord(id = 0) {

    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: swalConfirmText,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(
        function (isConfirm) {
            if (isConfirm.value == true) {
                ajaxRequest({ url: "/CashCenter/AssignedCashHandler/Delete", type: 'POST', data: { ID: id }, callBack: deleteRecordCallBack });
            } else {
                swal.fire("Cancelled", "Your operation Canceled :)", "error");
            }
        });
}
function deleteRecordCallBack(responseJSON) {
    if (responseJSON.IsSuccess) {
        loadTableData();
        successToastr("The Assigned Cash Handler Role has been deleted", 'success');
    }
    else {
        errorToastr(responseJSON.Message, 'error');

    }

}
var assignCashHandlerObject = {};
function getPostingAccounts(assignOject) {
    assignCashHandlerObject = assignOject
    ajaxRequest({ url: '/AccountsManagement/JournalVoucher/GetAccountHeadForProduct', type: 'POST', data: {}, callBack: getAccountHeadForProductCallBack }, null, false);
}
var getAccountHeadForProductCallBack = function (responseJSON) {
    var accountHeadArray = [];
    $.each(JSON.parse(responseJSON), function (index, item) {
        item.Description = item.Code + ' - ' + item.Description;
        accountHeadArray.push(item);
    });
    bindJQueryDropdownList(accountHeadArray, $('#AccountHeadID'), 'Select Account', (assignCashHandlerObject == null ? 0 : assignCashHandlerObject.AccountHeadID));

}