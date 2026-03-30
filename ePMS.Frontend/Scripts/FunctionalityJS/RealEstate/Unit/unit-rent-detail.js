leaseTermArray = [];
leaseTermGetAllArray = [];
paymentFrequencyArray = [];
paymentTermArray = [];
securityDepositEquivalentArray = [];
currencyArray = [];
var baseCurrencyID = null;
$(function () {
    datePickerDDMMYYYYFormat('NewRentPriceLeaseRentEndDate');
    //$("#NewRentPriceLeaseRentEndDate").datepicker({
    //    changeMonth: true,
    //    changeYear: true,
    //    format: 'dd-mm-yyyy',
    //    autoclose: true,
    //    container: '#NewRentPriceLeaseRentEndDateContainer',
    //    orientation: "auto bottom",
    //    zIndexOffset: 9999
    //});

    $('#NewRentPriceLeaseRentSecurityDepositEquivalentID').on('select2:select', function (e) {
        calculateNewRentPriceSecurityDeposit();
    });


})
function addRentDetailToTable() {

    var unitRentDetailPaymentFrequenyDDL = loadRentDetailPaymentFrequencyDropdownList(0);
    var unitRentDetailPaymentTermDDL = loadRentDetailPaymentTermDropdownList(0);
    var unitRentDetailCurrencyDDL = loadRentDetailCurrencyDropdownList(0);
    var unitRentDetailSecurityDepositEquivalentDDL = loadRentDetailSecurityDepositEquivalentDropdownList(0);
    var selectectedLeaseTerm = $('#LeaseTerm').val();
    if (selectectedLeaseTerm == '') {
        infoToastr("First select one or more Lease Term(s)", 'info');

    }
    else {
        $.each($('#LeaseTerm').val(), function (rowIndex, rowItem) {

            var isTypeFound = false;
            $('#rentDetailTable tr').each(function (rowIndex) {
                if (parseInt(rowItem) == parseInt($(this).find('td.tdRentDetailLeaseRentDurationID').text())) {
                    isTypeFound = true;
                    return;
                }

            });
            if (!isTypeFound) {
                /*
                <td>
                    <span class="red-tooltip" data-toggle="tooltip" title="" data-original-title="Remove Rent Price">
                         <button type="button" class="btn bg-danger btn-sm" style="padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;" onclick="removeLeaseTermRow($(this));" ');="">
                             <i class="fa fa-times" style="padding:0;color:#fff;"></i>
                         </button>
                     </span>
                    </td>
                */
                tableRow =
                    `<tr>                     
                    <td class="tdRentDetailID" hidden>0</td>
                    <td class="tdRentDetailLeaseRentDurationID" hidden>`+ rowItem + `</td>
                    <td class="tdRentDetailLeaseRentDuration">`+ leaseTermArray.find(filter => filter.Value == rowItem).Text + `</td>                    
                    <td class="tdRentDetailPaymentFrequency"><div class="selector" style="margin-top:0px !important">`+ unitRentDetailPaymentFrequenyDDL + `</div></td>
                    <td style="padding:0;">                        
                         <i class="bi bi-plus-circle fs-5 cursor-pointer green" onclick="newFrequencyFromUnitRentDetail(this);"></i>                         
                    </td>
                    <td class="tdRentDetailAmount"> <div class="selector" style="margin-top:0px !important"><input type="text" style="text-align:right;" placeholder="Amount" class="js-states form-control w-100 rentDetailAmount" min="0" value="0"
                    onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
                    /></div></td>
                    <td class="tdUnitRentDetailCurrency"> <div class="selector" style="margin-top:0px !important">`+ unitRentDetailCurrencyDDL + `</div></td>
                    <td class="tdRentDetailPaymentTerm"> <div class="selector" style="margin-top:0px !important">`+ unitRentDetailPaymentTermDDL + `</div></td>
                    <td class="tdRentDetailSecurityDepositAmount"> <div class="selector" style="margin-top:0px !important"><input type="yrcy" style="text-align:right;" placeholder="Security Deposit" class="js-states form-control w-100 rentSecurityDepositAmount" min="0" value="0"
                    onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
                    /></div></td>
                    <td class="tdRentDetailSecurityDepositEquivalent"> <div class="selector" style="margin-top:0px !important">`+ unitRentDetailSecurityDepositEquivalentDDL + `</div></td>
                    <td class="tdRentDetailNoOfPayments"> <div class="selector" style="margin-top:0px !important"><input type="number" placeholder="No. of Payments" class="js-states form-control w-100 rentNoOfPayments" min="0" value="1" required onkeyup="noOfPaymentOnKeyUp(this);"/></div></td>
                     <td class="tdRentDetailStartDate"><div class="selector" style="margin-top:0px !important"><input type="text" class="form-control  bha-datepicker RentDetailStartDate" placeholder="Start Date" autocomplete="off" value="${getFormattedDate(rowItem.StartDate)}"/></div></td>
                    <td class="tdRentDetailEndDate"><div class="selector" style="margin-top:0px !important"><input type="text" class="form-control  bha-datepicker UnitRentDetailEndDate" placeholder="End Date" autocomplete="off" value="${getFormattedDate(rowItem.EndDate)}"/></div></td>

                    <td>
                      <div class='dropdown bha-dropdown'>
                    <button class='btn bha-button' type ='button' data-bs-toggle='dropdown' aria-expanded='false'>
                    <i class='bi bi-three-dots-vertical'></i></button>
                    <ul class='dropdown-menu bha-dropdown-menu'>

                    <li>
                    <a class="dropdown-item bha-contents-dropdown authorizeOrNotUpdate" href="#"  onclick="removeLeaseTermRow($(this));"><i class="bi bi-trash3 fs-7 text-danger me-1"></i>Remove</a>
                    </li>
                    <li>
                    <a class="dropdown-item bha-contents-dropdown  authorizeOrNotDelete"  href="#" onclick="openAddNewRentPriceModal($(this));"><i class="bi bi-plus-circle fs-7 green me-1"></i>New Rent Price</a>
                    </li>
                    </ul></div>
                    </td>
                    
              </tr>
            `
                $('#rentDetailTable tbody').append(tableRow);
                //$('select').select2();
                //selectStyledAsInputsm('paymentFrequencyDDL');
                //selectStyledAsInputsm('paymentTermDDL');
                //selectStyledAsInputsm('securityDepositEquivalentDDL');
                //selectStyledAsInputsm('currencyDDL');
                //$('.select2-container').css('width', '100%');

                //Commented btn Code date 9 July 2025
                //<div class="dropdown" onclick="tdRentDetailAction()">
                //    <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false" style="background-color:transparent;border-color:transparent;">
                //        <i class="fa fa-ellipsis-v"></i>
                //    </a>

                //    <div class="dropdown-menu tdRentDetailActionMenu">
                //        <a class="dropdown-item" href="#" onclick="removeLeaseTermRow($(this));"><i class="fa fa-times" style="color:#f12d16 !important"></i> Remove</a>
                //        <a class="dropdown-item" href="#" onclick="openAddNewRentPriceModal($(this));"><i class="fa fa-plus" style="color:#2cc185  !important"></i> Add New Rent Price</a>
                //    </div>
                //</div>

                $("select.selector_2").select2({
                    width: "100%",
                    placeholder: "Select an option",

                    minimumResultsForSearch: 0,
                });
                $(`input.bha-datepicker`).datepicker({
                    format: 'dd-mm-yyyy',
                    todayHighlight: true,
                    autoclose: true,
                    orientation: "bottom",
                    changeMonth: true,
                    changeYear: true,
                    todayBtn: 'linked'
                });
                //$(document).on('focus', '.tdRentDetailStartDate, .tdRentDetailEndDate', function () {
                //    $(this).datepicker({
                //        changeMonth: true,
                //        changeYear: true,
                //        format: 'dd-mm-yyyy',
                //        autoclose: true,
                //        container: '#rentDetailTable',
                //        orientation: "auto top",
                //        zIndexOffset: 9999
                //    });
                //});
            }
        });
    }
    //$('#PropertyStructureType').val(addedPropertyStructureTypeArray).change();
}
var requestedRowNewFrequencyFromUnitRentDetail = null;
function newFrequencyFromUnitRentDetail(requestedRow) {
    requestedRowNewFrequencyFromUnitRentDetail = requestedRow;
    newPaymentFrequency();

}
var newFrequencyFromUnitRentDetailCallBack = function () {
    ajaxRequest({ url: '/RealEstate/Payment/FrequencyGetAll', type: 'POST', data: { Table: '[Setup.PaymentFrequency]', Condition: 'WHERE IsDeleted = 0' }, callBack: getNewAddedFrequencyFromUnitRentDetailCallBack });

}
var getNewAddedFrequencyFromUnitRentDetailCallBack = function (responseJOSN) {
    paymentFrequencyArray = responseJOSN.resultJSON;
    var insertAfterRow = $(requestedRowNewFrequencyFromUnitRentDetail).closest('tr');
    var selectedValue = $(insertAfterRow).find('td.tdRentDetailPaymentFrequency').find('select').val()

    var options = `<select class="form-control form-control-sm select2 paymentFrequencyDDL" style="padding-top:0px;padding-bottom:0px;">`
    $.each(responseJOSN.resultJSON, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.ID) {
            options += `<option value="` + rowItem.ID + `" selected>` + rowItem.Description + `</option>`;
        }
        else {
            options += `<option value="` + rowItem.ID + `">` + rowItem.Description + `</option>`;
        }

    });
    /*
    $(document).on('change', '.paymentFrequencyDDL', function () {
        calculateSecirityDeposit(this);
    });
    */
    $('#rentDetailTable tr').each(function (rowIndex) {
        $(this).find('td.tdRentDetailPaymentFrequency').html('').html(options);
    });
}
function removeLeaseTermRow(requestedRow) {
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
                var insertAfterRow = $(requestedRow).closest('tr');
                var tdRentDetailLeaseRentDurationID = $(insertAfterRow).find('td.tdRentDetailLeaseRentDurationID').text();



                requestedRow.closest('tr').remove();
                //get added types
                var addedArray = $('#LeaseTerm').val();
                //remove removed type from multiselect as well
                addedArray = $.grep(addedArray, function (value) {
                    return value != tdRentDetailLeaseRentDurationID;
                });
                //reset tpes multiselect values
                $('#LeaseTerm').val(addedArray).change();

                if (parseInt($(insertAfterRow).find('td.tdRentDetailID').text()) > 0) {
                    ajaxRequest({ url: '/RealEstate/Unit/DeleteRentDetail', type: 'POST', data: { id: parseInt($(insertAfterRow).find('td.tdRentDetailID').text()) }, callBack: deleteRentDetailCallBack });
                }
            }
        });
}
var deleteRentDetailCallBack = function (responseJSON) {
    successToastr(responseJSON.Message, 'success');
}
function loadLeaseTermDropdownList() {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.LeaseTerm]' }, callBack: loadLeaseTermDropdownListCallBack }, null, true, false);
}

var loadLeaseTermDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#LeaseTerm'), 'Select Lease Term');
    leaseTermArray = responseJSON.resultJSON;

}
function leaseTermGetAll() {
    ajaxRequest({
        url: '/RealEstate/Payment/LeaseTermGetAll', type: 'POST', data: { Table: '[Setup.LeaseTerm]' }, callBack: function (responseJSON) {
            leaseTermGetAllArray = responseJSON.resultJSON;
        }
    }, null, true, false);
}
function getRentDetailPaymentFrequency() {
    ajaxRequest({ url: '/RealEstate/Payment/FrequencyGetAll', type: 'POST', data: { Table: '[Setup.PaymentFrequency]', Condition: 'WHERE IsDeleted = 0' }, callBack: getRentDetailPaymentFrequencyCallBack }, null, true, false);
}
var getRentDetailPaymentFrequencyCallBack = function (responseJSON) {
    paymentFrequencyArray = responseJSON.resultJSON;
}

function getRentDetailPaymentTerm() {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.PaymentTerm]', Condition: 'WHERE IsDeleted = 0' }, callBack: getRentDetailPaymentTermCallBack }, null, true, false);
}
var getRentDetailPaymentTermCallBack = function (responseJSON) {
    paymentTermArray = responseJSON.resultJSON;
}

function getRentDetailSecurityDepositEquivalent() {
    ajaxRequest({ url: '/RealEstate/Payment/SecurityDepositEquivalentGetAll', type: 'POST', data: { Table: '[Setup.SecurityDepositEquivalent]', Condition: 'WHERE IsDeleted = 0' }, callBack: getRentDetailSecurityDepositEquivalentCallBack }, null, true, false);
}
var getRentDetailSecurityDepositEquivalentCallBack = function (responseJSON) {
    securityDepositEquivalentArray = responseJSON.resultJSON;
}
// Currency function
function getRentDetailCurrency() {
    ajaxRequest({ url: '/CRM/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPCoreSuite.dbo.RefCurrency', Columns: 'ID Value, CurrencySymbol Text', Condition: 'WHERE IsActive = 1' }, callBack: getRentDetailCurrencyCallBack }, null, true, false);

}
var getRentDetailCurrencyCallBack = function (responseJSON) {
    currencyArray = responseJSON.resultJSON;
}
function loadRentDetailCurrencyDropdownList(selectedValue) {
    var options = `<select class="js-states form-control selector_2 w-100 currencyDDL" >`
    $.each(currencyArray, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.Value || rowItem.Value == baseCurrencyID) {
            options += `<option value="` + rowItem.Value + `" selected>` + rowItem.Text + `</option>`;
        }
        else {
            options += `<option value="` + rowItem.Value + `">` + rowItem.Text + `</option>`;
        }

    });
    return options;
}

//|| Rent Detail Common Functions for Add and Update
function loadRentDetailPaymentFrequencyDropdownList(selectedValue) {
    var options = `<select class="js-states form-control selector_2 w-100 paymentFrequencyDDL">`

    $.each(paymentFrequencyArray, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.ID) {
            options += `<option value="` + rowItem.ID + `" selected>` + rowItem.Description + `</option>`;
        }
        else {
            options += `<option value="` + rowItem.ID + `">` + rowItem.Description + `</option>`;
        }

    });
    $(document).on('change', '.paymentFrequencyDDL', function () {
        $(this).closest('tr').find('td.tdRentDetailNoOfPayments input').val(0);
        calculateSecirityDeposit(this);
        

    });

    return options;
}
function loadRentDetailPaymentTermDropdownList(selectedValue) {
    //console.log(paymentTermArray);
    var options = `<select class="js-states form-control selector_2 w-100 paymentTermDDL">`
    $.each(paymentTermArray, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.Value) {
            options += `<option value="` + rowItem.Value + `" selected>` + rowItem.Text + `</option>`;
        }
        else {
            options += `<option value="` + rowItem.Value + `">` + rowItem.Text + `</option>`;
        }

    });
    return options;
}
function loadRentDetailSecurityDepositEquivalentDropdownList(selectedValue) {
    var options = `<select class="js-states form-control selector_2 w-100 securityDepositEquivalentDDL">`
    $.each(securityDepositEquivalentArray, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.ID) {
            options += `<option value="` + rowItem.ID + `" selected>` + rowItem.Description + `</option>`;
        }
        else {
            options += `<option value="` + rowItem.ID + `">` + rowItem.Description + `</option>`;
        }

    });
    $(document).on('change', '.securityDepositEquivalentDDL', function () {
        calculateSecirityDeposit(this);
    });

    return options;
}
$(document).on('blur', '.rentDetailAmount', function () {
    calculateSecirityDeposit(this);
});
function calculateSecirityDeposit(requestedRow) {
    
    var selectedSecurityDepositEquivalentText = $(requestedRow).closest('tr').find('.tdRentDetailSecurityDepositEquivalent').find('select option:selected').text();
    if (selectedSecurityDepositEquivalentText == 'None') {
        $(requestedRow).closest('tr').find('.tdRentDetailSecurityDepositAmount').find('input').prop('disabled', true);
        $(requestedRow).closest('tr').find('.tdRentDetailSecurityDepositAmount').find('input').val(0);
    }
    else if (selectedSecurityDepositEquivalentText == 'Other') {
        $(requestedRow).closest('tr').find('.tdRentDetailSecurityDepositAmount').find('input').prop('disabled', false);
        $(requestedRow).closest('tr').find('.tdRentDetailSecurityDepositAmount').find('input').val(0);
    }
    else {
        $(requestedRow).closest('tr').find('.tdRentDetailSecurityDepositAmount').find('input').prop('disabled', true);


        var selectedPaymentFrequenyID = $(requestedRow).closest('tr').find('.tdRentDetailPaymentFrequency').find('select').val();
        var selectedPaymentFrequencyObject = paymentFrequencyArray.find(row => row.ID == selectedPaymentFrequenyID);
        var selectedPaymentFrequencyDays = selectedPaymentFrequencyObject.Days;

        var selectedLeaseTermID = $(requestedRow).closest('tr').find('.tdRentDetailLeaseRentDurationID').text();
        var selectedLeaseTermObject = leaseTermGetAllArray.find(row => row.ID == selectedLeaseTermID);
        var selectedLeaseTermDays = selectedLeaseTermObject.Days;

        var selectedPaymentSecurityDepositEquivalentID = $(requestedRow).closest('tr').find('.tdRentDetailSecurityDepositEquivalent').find('select').val();
        var selectedPaymentSecurityDepositEquivalentObject = securityDepositEquivalentArray.find(row => row.ID == selectedPaymentSecurityDepositEquivalentID);
        var selectedPaymentSecurityDepositEquivalentDays = selectedPaymentSecurityDepositEquivalentObject.Days;

        var selectedRentDetailAmount = $(requestedRow).closest('tr').find('.tdRentDetailAmount').find('input').val();
        selectedRentDetailAmount = removeAllCommas(selectedRentDetailAmount);
        var selectedRentDetailSecurityDepositAmount = $(requestedRow).closest('tr').find('.tdRentDetailSecurityDepositAmount').find('input').val();


        if (selectedRentDetailAmount > 0 && selectedRentDetailAmount != null) {
            var oneDayAmount = selectedRentDetailAmount / selectedLeaseTermDays;// selectedPaymentFrequencyDays;
            var depositEquivalent = oneDayAmount * selectedPaymentSecurityDepositEquivalentDays;
            //$(requestedRow).closest('tr').find('.tdRentDetailSecurityDepositAmount').find('input').val(parseInt(depositEquivalent));
            $(requestedRow).closest('tr').find('.tdRentDetailSecurityDepositAmount').find('input').val(addThousandSeperator(depositEquivalent));
        }
    }

}

function calculateNewRentPriceSecurityDeposit() {
    var selectedSecurityDepositEquivalentText = $('#NewRentPriceLeaseRentSecurityDepositEquivalentID option:selected').text();
    if (selectedSecurityDepositEquivalentText == 'None') {
        $('#NewRentPriceLeaseRentSecurityDeposit').prop('disabled', true);
        $('#NewRentPriceLeaseRentSecurityDeposit').val(0);
    }
    else if (selectedSecurityDepositEquivalentText == 'Other') {
        $('#NewRentPriceLeaseRentSecurityDeposit').prop('disabled', false);
        $('#NewRentPriceLeaseRentSecurityDeposit').val(0);
    }
    else {
        $('#NewRentPriceLeaseRentSecurityDeposit').prop('disabled', true);


        var selectedPaymentFrequenyID = $('#NewRentPriceLeaseRentPaymentFrequencyID').val();
        var selectedPaymentFrequencyObject = paymentFrequencyArray.find(row => row.ID == selectedPaymentFrequenyID);
        var selectedPaymentFrequencyDays = selectedPaymentFrequencyObject.Days;

        var selectedLeaseTermID = $('#NewRentPriceLeaseRentDurationID').val();
        var selectedLeaseTermObject = leaseTermGetAllArray.find(row => row.ID == selectedLeaseTermID);
        var selectedLeaseTermDays = selectedLeaseTermObject.Days;

        var selectedPaymentSecurityDepositEquivalentID = $('#NewRentPriceLeaseRentSecurityDepositEquivalentID').val();
        var selectedPaymentSecurityDepositEquivalentObject = securityDepositEquivalentArray.find(row => row.ID == selectedPaymentSecurityDepositEquivalentID);
        var selectedPaymentSecurityDepositEquivalentDays = selectedPaymentSecurityDepositEquivalentObject.Days;

        var selectedRentDetailAmount = $('#NewRentPriceLeaseRentAmount').val();
        selectedRentDetailAmount = removeAllCommas(selectedRentDetailAmount);
        var selectedRentDetailSecurityDepositAmount = $('#NewRentPriceLeaseRentSecurityDeposit').val();


        if (selectedRentDetailAmount > 0 && selectedRentDetailAmount != null) {
            var oneDayAmount = selectedRentDetailAmount / selectedLeaseTermDays;// selectedPaymentFrequencyDays;
            var depositEquivalent = oneDayAmount * selectedPaymentSecurityDepositEquivalentDays;
            //$(requestedRow).closest('tr').find('.tdRentDetailSecurityDepositAmount').find('input').val(parseInt(depositEquivalent));
            $('#NewRentPriceLeaseRentSecurityDeposit').val(addThousandSeperator(depositEquivalent));
        }
    }

}
//|| Rent Detail Common Functions for Add and Update
function getAddedRentDetails() {
    var addRentDetailJSONArray = [];
    $('#rentDetailTable tr').each(function (rowIndex) {
        if (rowIndex > 0) {
            var addRentDetailJSONObject = {};

            addRentDetailJSONObject['ID'] = parseInt($(this).find('td.tdRentDetailID').text());
            addRentDetailJSONObject['LeaseTermID'] = parseInt($(this).find('td.tdRentDetailLeaseRentDurationID').text());
            addRentDetailJSONObject['LeaseTermName'] = $(this).find('td.tdRentDetailLeaseRentDuration').text();
            addRentDetailJSONObject['PaymentFrequencyID'] = $(this).find('td.tdRentDetailPaymentFrequency').find('select').val() == undefined ? null : parseInt($(this).find('td.tdRentDetailPaymentFrequency').find('select').val());
            addRentDetailJSONObject['PaymentFrequencyName'] = $(this).find('td.tdRentDetailPaymentFrequency').find('select').val() == undefined ? '' : $(this).find('td.tdRentDetailPaymentFrequency').find('select option:selected').text();
            addRentDetailJSONObject['Amount'] = parseInt(removeAllCommas($(this).find('td.tdRentDetailAmount').find('input').val()));
            addRentDetailJSONObject['CurrencyID'] = $(this).find('td.tdUnitRentDetailCurrency').find('select').val() == undefined ? null : parseInt($(this).find('td.tdUnitRentDetailCurrency').find('select').val());
            addRentDetailJSONObject['PaymentTermID'] = $(this).find('td.tdRentDetailPaymentTerm').find('select').val() == undefined ? null : parseInt($(this).find('td.tdRentDetailPaymentTerm').find('select').val());
            addRentDetailJSONObject['PaymentTermName'] = $(this).find('td.tdRentDetailPaymentTerm').find('select').val() == undefined ? '' : $(this).find('td.tdRentDetailPaymentTerm').find('select option:selected').text();
            addRentDetailJSONObject['SecurityDepositAmount'] = parseInt(removeAllCommas($(this).find('td.tdRentDetailSecurityDepositAmount').find('input').val()));
            addRentDetailJSONObject['SecurityDepositEquivalentID'] = $(this).find('td.tdRentDetailSecurityDepositEquivalent').find('select').val() == undefined ? null : parseInt($(this).find('td.tdRentDetailSecurityDepositEquivalent').find('select').val());
            addRentDetailJSONObject['SecurityDepositEquivalentName'] = $(this).find('td.tdRentDetailSecurityDepositEquivalent').find('select').val() == undefined ? '' : $(this).find('td.tdRentDetailSecurityDepositEquivalent').find('select option:selected').text();
            addRentDetailJSONObject['NoOfPayments'] = parseInt($(this).find('td.tdRentDetailNoOfPayments').find('input').val());
            addRentDetailJSONObject['StartDate'] = $(this).find('td.tdRentDetailStartDate').find('input').val();
            addRentDetailJSONObject['EndDate'] = $(this).find('td.tdRentDetailEndDate').find('input').val();

            addRentDetailJSONArray.push(addRentDetailJSONObject);
        }
    });
    return addRentDetailJSONArray;
}
//function getAddedRentDetails() {
//    var addRentDetailJSONArray = [];
//    var isValid = true;

//    $('#rentDetailTable tr').each(function (rowIndex) {
//        if (rowIndex > 0) {
//            var addRentDetailJSONObject = {};

//            var noOfPayments = parseInt($(this).find('td.tdRentDetailNoOfPayments').find('input').val());

//            if (isNaN(noOfPayments) || noOfPayments < 1) {
//                infoToastr("No Of Payments with Payment Frequency is required");
//                isValid = false;
//                return;
//            }

//            addRentDetailJSONObject['ID'] = parseInt($(this).find('td.tdRentDetailID').text());
//            addRentDetailJSONObject['LeaseTermID'] = parseInt($(this).find('td.tdRentDetailLeaseRentDurationID').text());
//            addRentDetailJSONObject['LeaseTermName'] = $(this).find('td.tdRentDetailLeaseRentDuration').text();
//            addRentDetailJSONObject['PaymentFrequencyID'] = $(this).find('td.tdRentDetailPaymentFrequency').find('select').val() == undefined ? null : parseInt($(this).find('td.tdRentDetailPaymentFrequency').find('select').val());
//            addRentDetailJSONObject['PaymentFrequencyName'] = $(this).find('td.tdRentDetailPaymentFrequency').find('select').val() == undefined ? '' : $(this).find('td.tdRentDetailPaymentFrequency').find('select option:selected').text();
//            addRentDetailJSONObject['Amount'] = parseInt(removeAllCommas($(this).find('td.tdRentDetailAmount').find('input').val()));
//            addRentDetailJSONObject['CurrencyID'] = $(this).find('td.tdUnitRentDetailCurrency').find('select').val() == undefined ? null : parseInt($(this).find('td.tdUnitRentDetailCurrency').find('select').val());
//            addRentDetailJSONObject['PaymentTermID'] = $(this).find('td.tdRentDetailPaymentTerm').find('select').val() == undefined ? null : parseInt($(this).find('td.tdRentDetailPaymentTerm').find('select').val());
//            addRentDetailJSONObject['PaymentTermName'] = $(this).find('td.tdRentDetailPaymentTerm').find('select').val() == undefined ? '' : $(this).find('td.tdRentDetailPaymentTerm').find('select option:selected').text();
//            addRentDetailJSONObject['SecurityDepositAmount'] = parseInt(removeAllCommas($(this).find('td.tdRentDetailSecurityDepositAmount').find('input').val()));
//            addRentDetailJSONObject['SecurityDepositEquivalentID'] = $(this).find('td.tdRentDetailSecurityDepositEquivalent').find('select').val() == undefined ? null : parseInt($(this).find('td.tdRentDetailSecurityDepositEquivalent').find('select').val());
//            addRentDetailJSONObject['SecurityDepositEquivalentName'] = $(this).find('td.tdRentDetailSecurityDepositEquivalent').find('select').val() == undefined ? '' : $(this).find('td.tdRentDetailSecurityDepositEquivalent').find('select option:selected').text();
//            addRentDetailJSONObject['NoOfPayments'] = noOfPayments;

//            addRentDetailJSONArray.push(addRentDetailJSONObject);
//        }
//    });
//    if (!isValid) {
//        return;
//    }
//    return addRentDetailJSONArray;
//}

var getUnitRentDetailCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        //console.log(responseJSON.resultJSON);
        $('#rentDetailTable tbody').html('');
        var tableRow = '';
        var addedLeaseTerms = [];
        $.each(responseJSON.resultJSON, function (rowIndex, rowItem) {
            rowItem.ID = parseInt($('#ID').val()) > 0 ? rowItem.ID : 0;

            var unitRentDetailPaymentFrequenyDDL = loadRentDetailPaymentFrequencyDropdownList(rowItem.PaymentFrequencyID);
            var unitRentDetailPaymentTermDDL = loadRentDetailPaymentTermDropdownList(rowItem.PaymentTermID);
            var unitRentDetailCurrencyDDL = loadRentDetailCurrencyDropdownList(rowItem.CurrencyID);
            var unitRentDetailSecurityDepositEquivalentDDL = loadRentDetailSecurityDepositEquivalentDropdownList(rowItem.SecurityDepositEquivalentID);

            /*
            <span class="red-tooltip" data-toggle="tooltip" title="" data-original-title="Remove Rent Price">
                         <button type="button" class="btn bg-danger btn-sm" style="padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;" onclick="removeLeaseTermRow($(this));" ');="">
                             <i class="fa fa-times" style="padding:0;color:#fff;"></i>
                         </button>
                     </span>
            */
            tableRow =
                `<tr>                     
                    <td class="tdRentDetailID" hidden>`+ rowItem.ID + `</td>
                    <td class="tdRentDetailLeaseRentDurationID" hidden>`+ rowItem.LeaseTermID + `</td>
                    <td class="tdRentDetailLeaseRentDuration">`+ rowItem.LeaseTermName + `</td>                    
                    <td class="tdRentDetailPaymentFrequency"><div class="selector"  style="margin-top:0px !important">`+ unitRentDetailPaymentFrequenyDDL + `</div></td>
                    <td style="padding:0;">
                        <i class="bi bi-plus-circle fs-5 cursor-pointer green" onclick="newFrequencyFromUnitRentDetail(this);"></i>
                    </td>
                    <td class="tdRentDetailAmount"><div class="selector" style="margin-top:0px !important"><input type="text" placeholder="Amount" style="text-align:right;" class="js-states form-control w-100"
                    onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
                    value="`+ addThousandSeperator(rowItem.Amount) + `"/></div>
                    </td>
                    <td class="tdUnitRentDetailCurrency"><div class="selector" style="margin-top:0px !important">`+ unitRentDetailCurrencyDDL + `</div></td>
                    <td class="tdRentDetailPaymentTerm"><div class="selector" style="margin-top:0px !important">`+ unitRentDetailPaymentTermDDL + `</div></td>
                    <td class="tdRentDetailSecurityDepositAmount"><div class="selector" style="margin-top:0px !important"><input type="text" style="text-align:right;" placeholder="Security Deposit" class="js-states form-control w-100 rentSecurityDepositAmount" onkeypress="return only0To9WithDecimalAllowed(window.event);" value="`+ addThousandSeperator(rowItem.SecurityDepositAmount) + `"/></div></td>
                    <td class="tdRentDetailSecurityDepositEquivalent"><div class="selector" style="margin-top:0px !important">`+ unitRentDetailSecurityDepositEquivalentDDL + `</div></td>
                    <td class="tdRentDetailNoOfPayments"><div class="selector" style="margin-top:0px !important"><input type="number" placeholder="No. of Payments" class="js-states form-control w-100 rentNoOfPayments" min="1" value="`+ rowItem.NoOfPayments + `" onkeyup="noOfPaymentOnKeyUp(this);"/></div></td>
                                        
                    <td class="tdRentDetailStartDate"><div class="selector" style="margin-top:0px !important"><input type="text" class="form-control bha-datepicker RentDetailStartDate" placeholder="Start Date" autocomplete="off" value="${getFormattedDate(rowItem.StartDate)}"/></div></td>
                    <td class="tdRentDetailEndDate"><div class="selector" style="margin-top:0px !important"><input type="text" class="form-control bha-datepicker UnitRentDetailEndDate" placeholder="End Date" autocomplete="off" value="${getFormattedDate(rowItem.EndDate)}"/></div></td>

                    <td>                    
                    <div class='dropdown bha-dropdown'>
                    <button class='btn bha-button' type ='button' data-bs-toggle='dropdown' aria-expanded='false'>
                    <i class='bi bi-three-dots-vertical'></i></button>
                    <ul class='dropdown-menu bha-dropdown-menu'>

                    <li>
                    <a class="dropdown-item bha-contents-dropdown authorizeOrNotUpdate" href="#"  onclick="removeLeaseTermRow($(this));"><i class="bi bi-trash3 fs-7 text-danger me-1"></i>Remove</a>
                    </li>
                    <li>
                    <a class="dropdown-item bha-contents-dropdown  authorizeOrNotDelete"  href="#" onclick="openAddNewRentPriceModal($(this));"><i class="bi bi-plus-circle fs-7 green me-1"></i>New Rent Price</a>
                    </li>
                    </ul></div>
                    </td>
                
              </tr>
            `
            //Commented by 9-July-2025
            //< div class="dropdown" onclick = "tdRentDetailAction()" >
            //              <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false" style="background-color:transparent;border-color:transparent;">
            //                 <i class="fa fa-ellipsis-v"></i>
            //              </a>

            //              <div class="dropdown-menu tdRentDetailActionMenu">
            //                <a class="dropdown-item" href="#" onclick="removeLeaseTermRow($(this));"><i class="fa fa-times" style="color:#f12d16 !important"></i> Remove</a>
            //                <a class="dropdown-item" href="#" onclick="openAddNewRentPriceModal($(this));"><i class="fa fa-plus" style="color:#2cc185  !important"></i> Add New Rent Price</a>
            //              </div>
            //            </div >
            //<span class="red-tooltip" data-toggle="tooltip" title="" data-original-title="Add New Payment Frequency" aria-describedby="tooltip751305">
            // <button type="button" class="btn  btn-sm btn-primary btnAddType" onclick="newFrequencyFromUnitRentDetail(this);" style="padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;"><b><i class="icon s7-plus"></i></b></button>
            //</span>
            $('#rentDetailTable tbody').append(tableRow);
            addedLeaseTerms.push(rowItem.LeaseTermID);
        });
        $('#LeaseTerm').val(addedLeaseTerms).change();
        //$('select').select2();
        //selectStyledAsInputsm('paymentFrequencyDDL');
        //selectStyledAsInputsm('paymentTermDDL');
        //selectStyledAsInputsm('securityDepositEquivalentDDL');
        //selectStyledAsInputsm('currencyDDL');
        //$('.select2-container').css('width', '100%');
        $("select.selector_2").select2({
            width: "100%",
            placeholder: "Select an option",

            minimumResultsForSearch: 0,
        });

        $(`input.bha-datepicker`).datepicker({
            format: 'dd-mm-yyyy',
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            changeMonth: true,
            changeYear: true,
            todayBtn: 'linked'
        });

        //$(document).on('focus', '.tdRentDetailStartDate, .tdRentDetailEndDate', function () {
        //    $(this).datepicker({
        //        changeMonth: true,
        //        changeYear: true,
        //        format: 'dd-mm-yyyy',
        //        autoclose: true,
        //        container: '#rentDetailTable',
        //        orientation: "auto top",
        //        zIndexOffset: 9999
        //    });
        //});

    }
    else {
        debugger;
        errorToastr(responseJSON.Message, "error");
    }
}
function tdRentDetailAction() {
    $('.tdRentDetailActionMenu').css('transform', 'translate3d(-100px, 35px, 0px)');
    $('.tdRentDetailActionMenu').css('transition', 'transform 1s ease');
}
function openAddNewRentPriceModal(requestedRow) {

    var durationID = $(requestedRow).closest('tr').find('td.tdRentDetailLeaseRentDurationID').text();
    var duration = $(requestedRow).closest('tr').find('td.tdRentDetailLeaseRentDuration').text();

    var paymentFrequencyID = $(requestedRow).closest('tr').find('td.tdRentDetailPaymentFrequency').find('select').val();
    var paymentFrequency = $(requestedRow).closest('tr').find('td.tdRentDetailPaymentFrequency').find('select option:selected').text();

    var amount = $(requestedRow).closest('tr').find('td.tdRentDetailAmount').find('input').val();
    var securityDeposit = $(requestedRow).closest('tr').find('td.tdRentDetailSecurityDepositAmount').find('input').val();
    var secDepositEqvID = $(requestedRow).closest('tr').find('td.tdRentDetailSecurityDepositEquivalent').find('select').val();

    var currencyID = $(requestedRow).closest('tr').find('td.tdUnitRentDetailCurrency').find('select').val();
    var paymentTermID = $(requestedRow).closest('tr').find('td.tdRentDetailPaymentTerm').find('select').val();

    var noOfPayments = $(requestedRow).closest('tr').find('td.tdRentDetailNoOfPayments').find('input').val();

    var startDate = $(requestedRow).closest('tr').find('td.tdRentDetailStartDate').find('input').val();
    var endDate = $(requestedRow).closest('tr').find('td.tdRentDetailEndDate').find('input').val();
    if (!endDate) {
        infoToastr(`End Date with Payment Frequency (${paymentFrequency}) is required`);
        return;
    }
    //if (startDate == undefined || startDate == '' || endDate == undefined || endDate == '') {
    //    infoToastr(`Start and/or End Date is missing with Payment Freq(${paymentFrequency})`);
    //}
    //else {
    $('#NewRentPriceLeaseRentDurationID').val(durationID);
    $('#NewRentPriceLeaseRentDuration').val(duration);

    bindJQueryDropdownList(paymentFrequencyArray, $('#NewRentPriceLeaseRentPaymentFrequencyID'), 'Select Payment Frequency', paymentFrequencyID);

    $('#NewRentPriceLeaseRentAmount').val(amount);
    $('#NewRentPriceLeaseRentSecurityDeposit').val(securityDeposit);
    bindJQueryDropdownList(currencyArray, $('#NewRentPriceLeaseRentCurrencyID'), 'Select Currency', currencyID);
    bindJQueryDropdownList(paymentTermArray, $('#NewRentPriceLeaseRentPaymentTermID'), 'Select Payment Term', paymentTermID);
    bindJQueryDropdownList(securityDepositEquivalentArray, $('#NewRentPriceLeaseRentSecurityDepositEquivalentID'), 'Select Sec Depost Eqv', secDepositEqvID);

    $('#NewRentPriceLeaseRentNoOfPayments').val(noOfPayments);

    var startDateValue = new Date(getDatepickerValueNewDate(endDate));
    let endDateValue = startDateValue;

    $('#NewRentPriceLeaseRentStartDate').val(getFormattedDateDDMMYYYY(new Date(startDateValue.setDate(startDateValue.getDate() + 1))));
    $("#NewRentPriceLeaseRentStartDate").prop('readonly', true);
    $("#NewRentPriceLeaseRentEndDate").val('');
    $("#NewRentPriceLeaseRentEndDate").datepicker('setStartDate', new Date(startDateValue.setDate(startDateValue.getDate() + 1)));



    $('#NewRentPriceLeaseRentPaymentFrequencyID, #NewRentPriceLeaseRentCurrencyID, #NewRentPriceLeaseRentPaymentTermID, #NewRentPriceLeaseRentSecurityDepositEquivalentID').select2({
        dropdownParent: $('#AddNewRentPriceModal')
    });
    //$('.select2-container').css('width', '100%');
    //selectStyledAsInputmd('NewRentPriceLeaseRentPaymentFrequencyID', '100%');
    //selectStyledAsInputmd('NewRentPriceLeaseRentCurrencyID', '100%');
    //selectStyledAsInputmd('NewRentPriceLeaseRentPaymentTermID', '100%');
    //selectStyledAsInputmd('NewRentPriceLeaseRentSecurityDepositEquivalentID', '100%');

    //$('#AddNewRentPriceModal').modal('show');
    addNewRentPriceToTheTable($(requestedRow).closest('tr').index());
    //}

    /*
    let isValidationFailed = false;
     $('#rentDetailTable tbody tr').each(function (rowIndex) {        
         var startDate = $(this).find('td.tdRentDetailStartDate').find('input').val();
         var endDate = $(this).find('td.tdRentDetailEndDate').find('input').val();
         var paymentFrequency = $(this).find('td.tdRentDetailPaymentFrequency').find('select option:selected').text();// $("#PaymentTypeID option:selected").text()        
         if (startDate == undefined || startDate == '' || endDate == undefined || endDate == '') {
             infoToastr(`Start and/or End Date is missing with Payment Freq(${paymentFrequency})`);

             isValidationFailed = true;
             return;
         }

         if (isValidationFailed)
             return;        

     });
     if (!isValidationFailed)
         alert('Open modal');
   */
}

function getUnitRentDetailHistory() {
    ajaxRequest({ url: "/RealEstate/Unit/UnitRentDetailHistory", type: 'POST', data: { UnitID: _unitID }, callBack: getUnitRentDetailHistoryCallBack });
}
function getUnitRentDetailHistoryCallBack(responseJSON) {
    if (responseJSON.IsSuccess) {
        generateHTMLTableRowsFromJSON(responseJSON.resultJSON.CurrentAgreements, 'CurrentAgreementDetailsTable', null, null, null, null, ['Amount', 'SecurityDeposit']);
        generateHTMLTableRowsFromJSON(responseJSON.resultJSON.PreviousAgreements, 'PreviousAgreementDetailsTable', null, null, null, null, ['Amount', 'SecurityDeposit'])
    }
    else {
        errorToastr("", responseJSON.Message, responseJSON.Type);
    }
}
function addNewRentPriceToTheTable(requestRowIndex = 0) {
    if (customValidateForm('AddNewRentPriceModalForm')) {

        let inputJSON = getFormDataAsJSONObject('AddNewRentPriceModalForm');

        var unitRentDetailPaymentFrequenyDDL = loadRentDetailPaymentFrequencyDropdownList(inputJSON.NewRentPriceLeaseRentPaymentFrequencyID);
        var unitRentDetailPaymentTermDDL = loadRentDetailPaymentTermDropdownList(inputJSON.NewRentPriceLeaseRentPaymentTermID);
        var unitRentDetailCurrencyDDL = loadRentDetailCurrencyDropdownList(inputJSON.NewRentPriceLeaseRentCurrencyID);
        var unitRentDetailSecurityDepositEquivalentDDL = loadRentDetailSecurityDepositEquivalentDropdownList(inputJSON.NewRentPriceLeaseRentSecurityDepositEquivalentID);
        var selectectedLeaseTerm = $('#LeaseTerm').val();
        //if (selectectedLeaseTerm == '') {
        //    infoToastr("First select one or more Lease Term(s)", 'info');

        //}
        //else {
        //$.each($('#LeaseTerm').val(), function (rowIndex, rowItem) {

        var isTypeFound = false;

        //if (!isTypeFound) {
        tableRow =
            `<tr>                     
                    <td class="tdRentDetailID" hidden>0</td>
                    <td class="tdRentDetailLeaseRentDurationID" hidden>${inputJSON.NewRentPriceLeaseRentDurationID}</td>
                    <td class="tdRentDetailLeaseRentDuration">${inputJSON.NewRentPriceLeaseRentDuration}</td>                    
                    <td class="tdRentDetailPaymentFrequency"><div class="selector" style="margin-top:0px !important">`+ unitRentDetailPaymentFrequenyDDL + `</div></td>
                   
                     <td style="padding:0;">
                         <span class="red-tooltip" data-toggle="tooltip" title="" data-original-title="Add New Payment Frequency" aria-describedby="tooltip751305">                            
                                <i class="bi bi-plus-circle fs-5 cursor-pointer green" onclick="newFrequencyFromUnitRentDetail(this);"></i>                            
                         </span>
                    </td>
                    <td class="tdRentDetailAmount">
                        <div class="selector" style="margin-top:0px !important">
                            <input type="text" placeholder="Amount" style="text-align:right;" class="js-states form-control w-100 rentDetailAmount"
                            onkeypress="return only0To9WithDecimalAllowed(window.event);" onblur="addThousandSeperator(this.value,this);"
                            value="${inputJSON.NewRentPriceLeaseRentAmount}"/>
                        </div>
                    </td>
                    <td class="tdUnitRentDetailCurrency"><div class="selector" style="margin-top:0px !important">`+ unitRentDetailCurrencyDDL + `</div></td>
                    <td class="tdRentDetailPaymentTerm"><div class="selector" style="margin-top:0px !important">`+ unitRentDetailPaymentTermDDL + `</div></td>
                    <td class="tdRentDetailSecurityDepositAmount">
                        <div class="selector" style="margin-top:0px !important">
                           <input type="text" style="text-align:right;" placeholder="Security Deposit" class="js-states form-control w-100 rentSecurityDepositAmount" onkeypress="return only0To9WithDecimalAllowed(window.event);" value="${inputJSON.NewRentPriceLeaseRentSecurityDeposit}"/>
                        </div>
                    </td>
                    <td class="tdRentDetailSecurityDepositEquivalent"><div class="selector" style="margin-top:0px !important">`+ unitRentDetailSecurityDepositEquivalentDDL + `</div></td>
                    <td class="tdRentDetailNoOfPayments">
                        <div class="selector" style="margin-top:0px !important">
                            <input type="number" placeholder="No. of Payments" class="js-states form-control w-100 rentNoOfPayments" min="1" value="${inputJSON.NewRentPriceLeaseRentNoOfPayments}"/>
                        </div>
                    </td>

                                        
                    <td class="tdRentDetailStartDate">
                        <div class="selector" style="margin-top:0px !important">
                            <input type="text" class="js-states form-control w-100 bha-datepicker RentDetailStartDate" placeholder="Start Date" autocomplete="off" value="${inputJSON.NewRentPriceLeaseRentStartDate}"/>
                        </div>
                    </td>
                    <td class="tdRentDetailEndDate">
                        <div class="selector" style="margin-top:0px !important">
                            <input type="text" class="js-states form-control w-100 bha-datepicker UnitRentDetailEndDate" placeholder="End Date" autocomplete="off" value="${inputJSON.NewRentPriceLeaseRentEndDate}"/>
                        </div>
                     </td>

                    <td>
                    <div class='dropdown bha-dropdown'>
                    <button class='btn bha-button' type ='button' data-bs-toggle='dropdown' aria-expanded='false'>
                    <i class='bi bi-three-dots-vertical'></i></button>
                    <ul class='dropdown-menu bha-dropdown-menu'>

                    <li>
                    <a class="dropdown-item bha-contents-dropdown authorizeOrNotUpdate" href="#"  onclick="removeLeaseTermRow($(this));"><i class="bi bi-trash3 fs-7 text-danger me-1"></i>Remove</a>
                    </li>
                    <li>
                    <a class="dropdown-item bha-contents-dropdown  authorizeOrNotDelete"  href="#" onclick="openAddNewRentPriceModal($(this));"><i class="bi bi-plus-circle fs-7 green me-1"></i>New Rent Price</a>
                    </li>
                    </ul></div>                            
                    </td>
                
              </tr>
            `
        //$('#rentDetailTable tbody').append(tableRow);

        //| When Implemented Index, Add Row After Requested Row Index
        //| Commentd this code adn Add below line
        /*
        $('#rentDetailTable tr').each(function (rowIndex) {
            if (parseInt(inputJSON.NewRentPriceLeaseRentDurationID) == parseInt($(this).find('td.tdRentDetailLeaseRentDurationID').text())) {
                //$('#rentDetailTable tbody').before(tableRow);
                $(this).after(tableRow);
                return false;
            }

        });
        */
        $('#rentDetailTable tbody tr').eq(requestRowIndex).after(tableRow);

        $("select.selector_2").select2({
            width: "100%",
            placeholder: "Select an option",

            minimumResultsForSearch: 0,
        });
        $(`input.bha-datepicker`).datepicker({
            format: 'dd-mm-yyyy',
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            changeMonth: true,
            changeYear: true,
            todayBtn: 'linked'
        });

        //$('#AddNewRentPriceModal').modal('hide');        

    }
}
function closeAddNewRentPriceModal() {
    $('#AddNewRentPriceModal').modal('hide');
}
function noOfPaymentOnKeyUp(e) {
    const $input = $(e);
    const $row = $input.closest('tr');
    const paymentFrequency = $row.find('td.tdRentDetailPaymentFrequency select option:selected').text().trim();
    const duration = $row.find('td.tdRentDetailLeaseRentDuration').text().trim();
    let numberOfPayments = parseInt($input.val(), 10);

    // Normalize for safe comparison
    const norm = str => str.toLowerCase();

    const rules = {
        daily: {
            allowed: ['daily', 'on checkout', 'other'],
            limits: {
                'daily': 1,
                'on checkout': 'readonly',
                'other': 'unlimited'
            }
        },
        weekly: {
            allowed: ['daily', 'weekly', 'on checkout', 'other'],
            limits: {
                'daily': 7,
                'weekly': 1,
                'on checkout': 'readonly',
                'other': 'unlimited'
            }
        },
        monthly: {
            allowed: ['daily', 'weekly', 'monthly', 'other'],
            limits: {
                'daily': 30,
                'weekly': 4,
                'monthly': 1,
                'on checkout': 'readonly',
                'other': 'unlimited'
            }
        },
        yearly: {
            allowed: ['daily', 'weekly', 'monthly', 'yearly', 'other'],
            limits: {
                'daily': 365,
                'weekly': 52,
                'monthly': 12,
                'yearly': 1,
                'other': 'unlimited'
            }
        }
    };

    const dKey = norm(duration);
    const pKey = norm(paymentFrequency);

    const durationRules = rules[dKey];

    if (!durationRules) {
        infoToastr(`Unsupported Duration: ${duration}`);
        $input.val(0).prop('readonly', false);
        return;
    }

    if (!durationRules.allowed.includes(pKey)) {
        infoToastr(`Payment Frequency '${paymentFrequency}' is not allowed for Duration '${duration}'`);
        $input.val(0).prop('readonly', false);
        return;
    }

    const limit = durationRules.limits[pKey];

    if (limit === 'readonly') {
        $input.val(1).prop('readonly', true);
    } else if (limit === 'unlimited') {
        $input.prop('readonly', false);
    } else if (typeof limit === 'number') {
        if (numberOfPayments > limit || isNaN(numberOfPayments)) {
            infoToastr(`Maximum ${limit} payment(s) allowed for Duration '${duration}' with Frequency '${paymentFrequency}'`);
            $input.val(limit).prop('readonly', false);
        } else {
            $input.prop('readonly', false);
        }
    }
}
