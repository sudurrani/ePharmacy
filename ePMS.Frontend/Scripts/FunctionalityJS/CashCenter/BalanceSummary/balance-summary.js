var _cashHandlerID = 0
var _cashHandlerAssignedID = 0
var _payCashTableContainerId = null;

var cashHandlerRoleAssigneeObject = null;
var payCashArray = [];
$(document).ready(function () {    
   
    //$('#CashDate').val(getFormattedTodayDateDDMMYYYY());
    datePickerDDMMYYYYFormat('CashDate', true)
    loadTableDataPartialView();
    $('#btnProcess').click(function (event) {
        saveRecord();
    });
});

function loadTableDataPartialView() {
    ajaxRequest({
        url: "/CashCenter/PayCash/BalanceSummaryCardPartialView", type: 'POST', data: { CashHandlerRoleID: null, CashHandlerRoleAssignedID: null, DateFrom: $("#DateFrom").val(), DateTo: $("#DateTo").val() }, callBack:
            function (response) {
                $("#TableContainer").html("").append(response);
                //convertToDataTable('CashSheetTable001');
            }
    }, 'html');
}
function saveRecord() {
    if (customValidateForm('ReplenishModalForm')) {
        var inputJSON = getFormDataAsJSONObject('ReplenishModalForm');
        inputJSON.CashInHand = removeAllCommas(inputJSON.CashInHand);
        inputJSON.Received = removeAllCommas(inputJSON.Received);
        inputJSON.CashHandlerRoleID = inputJSON.ReplenishCashHandlerRoleID;
        inputJSON.CashHandlerRoleAssignedID = inputJSON.ReplenishCashHandlerRoleAssignedID;

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
        loadTableDataPartialView();
    }
    else {
        errorToastr("", responseJSON.Message, responseJSON.Type);
    }
}
function openReplenishModal(cashRoleID = 0, cashRoleAssigneeID = 0, balance = 0, cashUsed = 0) {
    /*
    if ($('#CashHandlerRoleID').val() == 0 || $('#CashHandlerRoleID').val() == null
        || $('#CashHandlerRoleAssignedID').val() == 0 || $('#CashHandlerRoleAssignedID').val() == null
    ) {
        infoToastr("Select Cash Role and Cash Role Assignee");
    }
    else {
        let balance = payCashArray[(payCashArray.length - 1)].Balance;
        let cashLimit = cashHandlerRoleAssigneeObject.CashLimit;
        let replenish = cashLimit - balance;
        $('#CashInHand').val(addThousandSeperator(balance));
        $('#Received').val(addThousandSeperator(replenish));
        $('#ReplenishModal').modal('show');
    }
    */
    $('#ReplenishCashHandlerRoleID').val(cashRoleID);
    $('#ReplenishCashHandlerRoleAssignedID').val(cashRoleAssigneeID);
    $('#CashInHand').val((balance));
    $('#Received').val((cashUsed));
    $('#ReplenishModal').modal('show');
}
function openCashSheetTransactionsTable(cashRoleId = 0, cashRoleAssigneeId = 0, payCashtableContainerId = null, isOtherAssignee = true) {
    _cashHandlerID = cashRoleId > 0 ? cashRoleId : _cashHandlerID;
    _cashHandlerAssignedID = cashRoleAssigneeId > 0 ? cashRoleAssigneeId : _cashHandlerAssignedID;
    _payCashTableContainerId = payCashtableContainerId == null ? _payCashTableContainerId : payCashtableContainerId;
    let dateFrom = isOtherAssignee == true ? null : $('#DateFrom').val();
    let dateTo = isOtherAssignee == true ? null : $('#DateTo').val();

    ajaxRequest({
        url: "/CashCenter/PayCash/BalanceSummaryCardTransactionsPartialView", type: 'POST', data: { CashHandlerRoleID: _cashHandlerID, CashHandlerRoleAssignedID: _cashHandlerAssignedID, DateFrom: dateFrom, DateTo: dateTo }, callBack: function (responseJSON) {

            

            closeCashSheetModal();
            $('#' + _payCashTableContainerId).html(responseJSON);
            $('#' + _payCashTableContainerId).css('display', 'block');
            $('#btnClearFilter').click(function () {
                $("#DateFrom").val("");
                $("#DateTo").val("");
                //loadTableDataPartialView();
                openCashSheetTransactionsTable(0, 0, null, false);
            });
            $("#DateFrom").val(dateFrom);
            $("#DateTo").val(dateTo);
            //$("#DateFrom").datepicker({
            //    changeMonth: true,
            //    changeYear: true,
            //    format: 'dd-mm-yyyy',
            //    autoclose: true,
            //    container: '#DateFromContainer',
            //    orientation: "auto bottom",
            //    zIndexOffset: 9999
            //}).datepicker('setDate', dateFrom);
            //$("#DateTo").datepicker({
            //    changeMonth: true,
            //    changeYear: true,
            //    format: 'dd-mm-yyyy',
            //    autoclose: true,
            //    container: '#DateToContainer',
            //    orientation: "auto bottom",
            //    zIndexOffset: 9999
            //}).datepicker('setDate', dateTo);

            $('#DateFrom').on('change', function () {
                if ($('#DateTo').val() == null || $('#DateTo').val() == "") {
                    return;
                }
                //loadTableDataPartialView();
                openCashSheetTransactionsTable(0, 0, null, false);
            });
            $('#DateTo').on('change', function () {
                if ($('#DateFrom').val() == null || $('#DateFrom').val() == "") {
                    return;
                }
                //loadTableDataPartialView();
                openCashSheetTransactionsTable(0, 0, null, false);
            });
        }
    }, 'html');
    /*
    closeCashSheetModal();
    if (payCashTableId != null) {
        $('#' + payCashTableId).css('display', 'block');
        //convertToDataTable(payCashTableId);
    }
    $('#CashSheetTransactionsModal').modal('show');
    */
}
function closeCashSheetModal() {
    $('.cash-sheet-tables').each(function () {
        $(this).css('display', 'none');
        $(this).html('');
    });
    $('#CashSheetTransactionsModal').modal('hide');
    
}


function openCashPaymentModal(id = 0, index = 0) {
    alert('Cash Payment Voucher code is not in the parital view therefore we can not access it');
}
