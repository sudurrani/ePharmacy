$(document).ready(function () {
  
    //App.formElements();
    //App.dataTables();   
    $('#btnSave').click(function (event) { 
        event.preventDefault();
        saveRecord();
    });
    loadCashCenterRoleTypeDropdownList("RoleTypeID", 0)

});
//function openCashHandlerRoleSaveModal() {  
    function newRecord() {  
     $('#saveModal').modal('show');
    $('#LegendTitle').text("Add Cash Handler Role");
    $('#ID').val(0);
    $('#CashHandlerRoleForm')[0].reset();
    $('#RoleTypeID').val(0);
    $('#RoleTypeID').change();
    $('#btnSave').text('Save');
    $("select.selector_2").select2({
            width: "100%",
            placeholder: "Select an option",
        minimumResultsForSearch: 0,
        dropdownParent: $('#saveModal')
     });
}
function saveRecord() {

    if (customValidateForm('CashHandlerRoleForm')) {

        var code = $("#Code").val();
        ajaxRequest({
            url: "/CashCenter/CashHandler/GetByCode", type: 'POST', data: { Code: code }, callBack: function (responseJSON) {
                if (responseJSON.IsSuccess && responseJSON.resultJSON.length > 0) {
                    if ($('#ID').val() > 0) {
                        var inputJSON = getFormDataAsJSONObject('CashHandlerRoleForm');
                        ajaxRequest({ url: "/CashCenter/CashHandler/Save", type: 'POST', data: inputJSON, callBack: saveCashHandlerRoleRecordCallBack });
                    } else {
                        $.each(responseJSON.resultJSON, function (rowIndex, rowValue) {
                            if (code == rowValue.Code) {
                                infoToastr('' + rowValue.Code + ' is exist with ' + rowValue.Description, 'info');
                                isValidForm = false;
                                return
                            }
                        });
                    }


                }
                else {
                    var inputJSON = getFormDataAsJSONObject('CashHandlerRoleForm');
                    ajaxRequest({ url: "/CashCenter/CashHandler/Save", type: 'POST', data: inputJSON, callBack: saveCashHandlerRoleRecordCallBack });
                }

            }

        });

    }

}
function saveCashHandlerRoleRecordCallBack(responseJSON) {
    if (responseJSON.IsSuccess) {
        successToastr("The Cash Handler Role has been saved", 'success');
        $('#saveModal').modal('hide');
        loadTableData();
    }
    else {
        errorToastr("", responseJSON.Message, responseJSON.Type);
    }
}
//function loadTableData() {
//    ajaxRequest({ url: "/CashCenter/CashHandler/GetAll", type: 'POST', data: {}, callBack: loadTableDataCallBack });
//}
//var loadTableDataCallBack = function (responseJSON) {
//    if (responseJSON.IsSuccess) {
//        generateTableRowsExcludeHiddenHeaderFromJSON(responseJSON.resultJSON, 'CashHandlerRolesTable', null);
//    }
//    else {
//        errorToastr(responseJSON.Message, "error");
//    }
//}
function modifyRecord(id) {
    $('#CashHandlerRoleForm')[0].reset();
    $('#saveModal').modal('show');
    $('#ID').val(id);
    $('#LegendTitle').text("Update Cash Handler");
    get(id);
    $('#btnSave').text('Update');
    $("select.selector_2").select2({
        width: "100%",
        placeholder: "Select an option",

        minimumResultsForSearch: 0,
    });
}
function get(ID) {
    ajaxRequest({ url: "/CashCenter/CashHandler/GetByID", type: 'POST', data: { ID: ID }, callBack: getCallBack });
}
var getCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        setResponseToFormInputs(responseJSON.resultJSON);
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
                ajaxRequest({ url: "/CashCenter/CashHandler/Delete", type: 'POST', data: { ID: id }, callBack: deleteRecordCallBack });
            } else {
                swal.fire("Cancelled", "Your operation Canceled :)", "error");
            }
        });
}
function deleteRecordCallBack(responseJSON) {
    if (responseJSON.IsSuccess) {
        loadTableData();
        successToastr("The Cash Handler Role has been deleted", 'success');
    }
    else {
        errorToastr(responseJSON.Message, 'error');

    }

}