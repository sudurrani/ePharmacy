var cashHandlerID = 0
var cashHandlerAssignedID = 0
var cashHandlerRoleAssigneeObject = null;
var cashSheetArray = [];
$(document).ready(function () {
    //App.formElements();
    //App.dataTables();
    $('#FKeyEntity').val('PayCash');
    $('#CashDate').val(getFormattedTodayDateDDMMYYYY());
    //loadTableData();
    loadCashHandAssignRoleInfo();
    //loadCashCenterCashRoleDropdownList("CashHandlerRoleID", 0);
    $('#CashHandlerRoleID').on('select2:select', function (e) {
        //cashHandlerID = $(this).val();
        //loadCashCenterCashRoleAssigneeDropdownList('CashHandlerRoleAssignedID', 0, null, $(this).val());
        loadTableData();
    });
    $('#CashHandlerRoleAssignedID').on('select2:select', function (e) {
        cashHandlerAssignedID = $(this).val();
        loadTableData();
        getCashRoleAssigneByID(cashHandlerAssignedID);
    });
    $('#DateFrom').on('change', function () {
        if ($('#DateTo').val() == null || $('#DateTo').val() == "") {
            return;
        }
        loadTableData();
    });
    $('#DateTo').on('change', function () {
        if ($('#DateFrom').val() == null || $('#DateFrom').val() == "") {
            return;
        }
        loadTableData();
    });
    $('#btnClearFilter').click(function () {
        $("#DateFrom").val("");
        $("#DateTo").val("");
        $('#CashHandlerRoleID').val(0).change();
        $('#CashHandlerRoleAssignedID').empty().append('<option values="0">Select Role Assignee</option>').val(0).change();
        loadTableData();
    });
    $('#btnProcess').click(function (event) {
        if (cashHandlerID <= 0 || cashHandlerAssignedID <= 0) {
            infoToastr("Select Cash Role or Cash Role Assignee");
            return;
        }
        saveRecord();
    });
});
//function loadTableData() {
//    ajaxRequest({ url: "/CashCenter/PayCash/GetAll", type: 'POST', data: { CashHandlerRoleID: $("#CashHandlerRoleID").val(), CashHandlerRoleAssignedID: $("#CashHandlerRoleAssignedID").val(), DateFrom: $("#DateFrom").val(), DateTo: $("#DateTo").val() }, callBack: loadTableDataCallBack });
//}
//var loadTableDataCallBack = function (responseJSON) {
//    if (responseJSON.IsSuccess) {
//        cashSheetArray = responseJSON.resultJSON;        
//        generateTableRowsExcludeHiddenHeaderFromJSON(responseJSON.resultJSON, 'CashSheetTable', null, null, null, null, ['Amount', 'Received', 'Balance']);

//        $('#CashSheetTable tbody tr').each(function (rowIndex, rowItem) {
//            let id = $(this).find('td.tdID').text();
//            let voucherID = $(this).find('td.tdVoucherID').text();
//            let isPosted = $(this).find('td.tdIsPosted').text();
            
//            let editButton = isPosted == 'Posted' ? '' : `<span class='red-tooltip' data-toggle='tooltip' title='Edit'><button onclick='openCashPaymentModal(${voucherID}, ${id});' type='button' class='btn btn-info btn-sm authorizeOrNotUpdate' ><b><i class='icon s7-pen'></i></b></button></span>`;
//            let deleteButton = isPosted == 'Posted' ? '' : `<span class='red-tooltip' data-toggle='tooltip' title='Delete'><button onclick='deleteRecord(${id}, ${voucherID},$(this));' type='button' class='btn bg-danger btn-sm authorizeOrNotDelete' style='color:white'><b><i class='icon s7-trash'></i></b></button></span>`;

//            let tableRow = `
//                <div class='list-icons'>
//                    <div class='dropdown hide '>
//                        <a href='#' class='btn   btn-sm ' data-toggle='dropdown' aria-expanded='true' style='background-color:#058d56;color:white'>
//                            <i class='icon s7-menu dropdown-toggle'></i>
//                        </a>
//                        <div class='dropdown-menu dropdown-menu-right  hide' role='menu' x-placement='top-end' style='text-align:center;position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-158px, -127px, 0px);min-width: 10.50rem;padding:0.2rem 0!important;'>
                            
//                            ${editButton}
                            
//                            ${deleteButton}
//                            <span class='red-tooltip' data-toggle='tooltip' title='Generate Voucher'>
//                                <button onclick='openCashPaymentModal(${voucherID}, ${id});' type='button' class='btn btn-primary btn-sm authorizeOrNotUpdate'>
//                                    <b><i class='icon s7-print'></i></b>
//                                </button>
//                            </span>
//                        </div>
//                    </div>
//                </div>
//                `;

//            $(this).find('td.tdAction').html(tableRow);
//        });
//    }
//    else {
//        errorToastr(responseJSON.Message, "error");
//    }
//}


function saveRecord() {
    if (customValidateForm('ReplenishModalForm')) {
        var inputJSON = getFormDataAsJSONObject('ReplenishModalForm');
        inputJSON.CashInHand = removeAllCommas(inputJSON.CashInHand);
        inputJSON.Received = removeAllCommas(inputJSON.Received);
        inputJSON.CashHandlerRoleID = cashHandlerID;
        inputJSON.CashHandlerRoleAssignedID = cashHandlerAssignedID;

        ajaxRequest({ url: "/CashCenter/PayCash/Save", type: 'POST', data: inputJSON, callBack: saveCashHandlerRoleRecordCallBack });

    }

}
function saveCashHandlerRoleRecordCallBack(responseJSON) {
    if (responseJSON.IsSuccess) {
        successToastr("Replenish has been Processed", 'success');
        $('#CashHandlerRoleID').val(0);
        $('#CashHandlerRoleAssignedID').val(0);
        $('#CashInHand').val("");
        $('#Received').val("");
        $('#ReplenishModal').modal('hide');
        loadTableData();
    }
    else {
        errorToastr("", responseJSON.Message, responseJSON.Type);
    }
}
function deleteRecord(id = 0, voucherID = 0) {

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
                ajaxRequest({ url: "/CashCenter/PayCash/Delete", type: 'POST', data: { ID: id, VoucherID: voucherID }, callBack: deleteRecordCallBack });
            } else {
                swal.fire("Cancelled", "Your operation Canceled :)", "error");
            }
        });
}
function deleteRecordCallBack(responseJSON) {
    if (responseJSON.IsSuccess) {
        loadTableData();
        successToastr("The Cash Sheet has been deleted", 'success');
    }
    else {
        errorToastr(responseJSON.Message, 'error');

    }

}

function modifyRecord(id) {
    redirectToAction("/CashCenter/PayCash/Update?ID=", id, '_blank');
}
function openReplenishModal(cashRoleID = 0, cashRoleAssigneeID = 0, balance = 0, cashUsed = 0) {

    if ($('#CashHandlerRoleID').val() == 0 || $('#CashHandlerRoleID').val() == null
        || $('#CashHandlerRoleAssignedID').val() == 0 || $('#CashHandlerRoleAssignedID').val() == null
    ) {
        infoToastr("Select Cash Role and Cash Role Assignee");
    }
    else {
        let balance = cashSheetArray[(cashSheetArray.length - 1)].Balance;
        let cashLimit = cashHandlerRoleAssigneeObject.CashLimit;
        let replenish = cashLimit - balance;
        $('#CashInHand').val(addThousandSeperator(balance));
        $('#Received').val(addThousandSeperator(replenish));
        $('#ReplenishModal').modal('show');
    }

}
function getCashRoleAssigneByID(ID) {
    ajaxRequest({
        url: "/CashCenter/AssignedCashHandler/GetByID", type: 'POST', data: { ID: ID }, callBack: function (responseJSON) {
            cashHandlerRoleAssigneeObject = responseJSON.resultJSON;
        }
    });
}
function openCashSheetTransactionsModal(cashSheetTableId = null) {
    if (cashSheetTableId != null) {
        $('#' + cashSheetTableId).css('display', 'block');
        //convertToDataTable(cashSheetTableId);
    }
    $('#CashSheetTransactionsModal').modal('show');
}
function closeCashSheetModal() {
    $('.cash-sheet-tables table').each(function () {
        $(this).css('display', 'none');
    });
    $('#CashSheetTransactionsModal').modal('hide');
}



function loadCashHandAssignRoleInfo() {
    ajaxRequest({ url: "/CashCenter/PayCash/GetAssignedCashHandlerRoleInfo", type: 'POST', data: {}, callBack: loadCashHandAssignRoleInfoCallBack });
}
var loadCashHandAssignRoleInfoCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        // cashierRoles = responseJSON.resultJSON.CashHandlerRoleInfoDetails;

        let selectedValue = (responseJSON.resultJSON.CashHandlerRoles.length == 1 ? responseJSON.resultJSON.CashHandlerRoles[0].Value : 0)

        bindJQueryDropdownList(responseJSON.resultJSON.CashHandlerRoles, $('#CashHandlerRoleID'), 'Select Casher Role', selectedValue, null);
        //if (selectedValue > 0) {
        //    var cashHalderRole = cashierRoles.find(row => row.CashHandlerRoleID == selectedValue);
        //    setResponseToFormInputs(cashHalderRole);
        //}
    }
    else {
        errorToastr("", responseJSON.Message, "error");
    }
}
//$("#DateFrom").datepicker({
//    changeMonth: true,
//    changeYear: true,
//    format: 'dd-mm-yyyy',
//    autoclose: true,
//    container: '#DateFromContainer',
//    orientation: "auto bottom",
//    zIndexOffset: 9999
//});
//$("#DateTo").datepicker({
//    changeMonth: true,
//    changeYear: true,
//    format: 'dd-mm-yyyy',
//    autoclose: true,
//    container: '#DateToContainer',
//    orientation: "auto bottom",
//    zIndexOffset: 9999
//});
/*
$("#CashDate").datepicker({
    changeMonth: true,
    changeYear: true,
    format: 'dd-mm-yyyy',
    autoclose: true,
    container: '#DateContainer',
    orientation: "auto bottom",
    zIndexOffset: 9999,
}).datepicker('setDate', new Date()).attr('readonly','readonly');
*/