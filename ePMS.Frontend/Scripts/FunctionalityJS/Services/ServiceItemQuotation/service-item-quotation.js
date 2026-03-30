
var _customersDropdownArray = [],
    _projectsDropdownArrary = [],
    _servicesDropdownArrary = [],
    _statusDropdownArrary = [],
    _paymentTermsDropdownArrary = [];

var isQuotationItemsTabLoaded = false;

let serviceItemQuotationDetailsSchema = {
    ID: { type: 'hidden' },
    ServiceItemID: {
        type: 'select', isMultiple: false, options: []
    },
    Period: { type: 'text', maxlength: 50, isReadOnly: true },
    Rate: { type: 'number', maxlength: 50, isReadOnly: false },
    Quantity: { type: 'number', maxlength: 50, isReadOnly: false },
    Amount: { type: 'number', maxlength: 50, isReadOnly: true },
    DiscountPercent: { type: 'number', maxlength: 50, isReadOnly: false },
    DiscountedAmount: { type: 'number', maxlength: 50, isReadOnly: true },
    ExclDiscount: { type: 'number', maxlength: 50, isReadOnly: true },
    VATPercent: { type: 'number', maxlength: 50, isReadOnly: false },
    VATAmount: { type: 'number', maxlength: 50, isReadOnly: true },
    IncVAT: { type: 'number', maxlength: 50, isReadOnly: true },
    Total: { type: 'number', maxlength: 50, isReadOnly: true },
    //| Action Column Schema
    //| If add icon is not required do not provide add function
    //| If delete icon is not required do not provide delete function
    Action: { type: 'action', addRowFunction: 'addServiceItemQotationRow', removeRowFunction: 'deleteServiceItemQotationRow' }
};

$(document).ready(function () {

    $("select.selector_2").select2({
        width: "100%",
        placeholder: "Select an option",
        minimumResultsForSearch: 0,
    });
    $(".mutiple_sel").select2({ width: "style" });

    $('#btnSave').click(function (e) {
        e.preventDefault();
        saveRecord();
    });
    $('#btnClose').click(function () {
        redirectToQuotationList();
    });

    datePickerDDMMYYYYFormat('QuotationDate');
    datePickerDDMMYYYYFormat('ValidityDate');

    $(document).on('change input blur', '#ServiceItemQuotationDetailsTbody .select_ServiceItemID, #ServiceItemQuotationDetailsTbody .bha-input', function () {
        let $row = $(this).closest('tr');
        let serviceID = $(this).val();
        let service = _servicesDropdownArrary.find(s => s.ID == serviceID);
        if (service) {
            $row.find('td.tdPeriod input').val(service.Period);
            $row.find('td.tdVATPercent input').val(service.TotalVAT);
        }
        else {
            // $row.find('td input').val('0.00);
            // $row.find('td.tdPeriod input').val('');

        }

        let rate = removeAllCommas($row.find('.tdRate .bha-input').val().trim());
        let quantity = removeAllCommas($row.find('.tdQuantity .bha-input').val().trim());
        let discountPercent = removeAllCommas($row.find('.tdDiscountPercent .bha-input').val().trim());
        let vatPercent = removeAllCommas($row.find('.tdVATPercent .bha-input').val().trim());

        let amount = 0;
        amount = rate * quantity;
        let discountAmount = (amount * discountPercent) / 100;

        let excludeDiscountAmount = amount - discountAmount;

        let vatAmount = (excludeDiscountAmount * vatPercent) / 100;

        let includeVATAmount = excludeDiscountAmount + vatAmount;

        $row.find('.tdAmount').text(addThousandSeperator(amount.toFixed()));
        $row.find('.tdDiscountedAmount').text(addThousandSeperator(discountAmount.toFixed()));
        $row.find('.tdExclDiscount').text(addThousandSeperator(excludeDiscountAmount.toFixed()));
        $row.find('.tdVATAmount').text(addThousandSeperator(vatAmount.toFixed()));
        $row.find('.tdIncVAT').text(addThousandSeperator(includeVATAmount.toFixed()));
        $row.find('.tdTotal').text(addThousandSeperator(includeVATAmount.toFixed()));


        let rowTotal = 0;
        $('#ServiceItemQuotationDetailsTbody tr').each(function (index, item) {
            rowTotal += parseFloat(removeAllCommas($(this).find('td.tdTotal').text()));
            $('#lblGrandTotal').text(addThousandSeperator(rowTotal.toFixed()));
            $('#FCYAmount').val(addThousandSeperator(rowTotal.toFixed()));
            $('#LCYAmount').val(addThousandSeperator(rowTotal.toFixed()));
            /*    console.log($(this).find('td.tdTotal').text());*/
        })

    });


});
function saveRecord(isCloseAndSaveAsDraft = false) {
    if (customValidateForm('ServiceItemQuotationForm')) {
        var inputJSON = getFormDataAsJSONObject('ServiceItemQuotationForm');
        inputJSON.FKeyIdentifier = $('#UniqueFKeyIdenfier').val();
        inputJSON.LCYAmount = removeAllCommas(inputJSON.LCYAmount);
        inputJSON.FCYAmount = removeAllCommas(inputJSON.FCYAmount);

        var quotationDetail = getTableRowsBySchema(serviceItemQuotationDetailsSchema, 'ServiceItemQuotationDetailsTbody');
        // validation for invoiceDetail 
        if (quotationDetail.length > 1) {
            for (let i = 0; i < quotationDetail.length; i++) {
                let c = quotationDetail[i], rowNo = i + 1;
                if (!c.ServiceItemID || c.ServiceItemID === "0") return infoToastr(`In Quotation Item row ${rowNo}: Services  is missing`);
            }
        }

        inputJSON['Details'] = quotationDetail;
        inputJSON['Details'] = inputJSON['Details'].map(function (row) {
            if (row.Rate) row.Rate = removeAllCommas(row.Rate);
            if (row.Amount) row.Amount = removeAllCommas(row.Amount);
            if (row.DiscountedAmount) row.DiscountedAmount = removeAllCommas(row.DiscountedAmount);
            if (row.ExclDiscount) row.ExclDiscount = removeAllCommas(row.ExclDiscount);
            if (row.VATAmount) row.VATAmount = removeAllCommas(row.VATAmount);
            if (row.IncVAT) row.IncVAT = removeAllCommas(row.IncVAT);
            if (row.Total) row.Total = removeAllCommas(row.Total);

            return row;
        });

        console.log(inputJSON);
        ajaxRequest({ url: "/Services/ServiceItemQuotation/Save", type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft });

    }
}
function saveRecordCallBack(responseJSON, options) {
    if (responseJSON.IsSuccess) {
        debugger;
        $('#ID').val(responseJSON.resultJSON);
        successToastr("The Service Item Quotation has been saved", 'success');

        if (options.isCloseAndSaveAsDraft) {
            setTimeout(function () {
                window.location.href = '/Services/ServiceItemQuotation/List?FID=cgKWwAGqpX2C4N74K+dafw==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
            }, 2000);
        }


    }
    else {
        errorToastr("", responseJSON.Message, responseJSON);
    }
}
function addServiceItemQotationRow(id, requestRow) {
    addTableRowsBySchema(serviceItemQuotationDetailsSchema, 'ServiceItemQuotationDetailsTbody', {ID:0})
}
function deleteServiceItemQotationRow(id, requestedRow) {
    let $row = $(requestedRow).closest("tr");
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
            if (id <= 0) {
                $row.remove();
                resetTableActions('ServiceItemQuotationDetailsTbody', 'addServiceItemQotationRow', null);
                return;
            }
            else {
                ajaxRequest({
                    url: "/Services/ServiceItemQuotation/DeleteQuotationDetail", type: 'POST', data: { ID: id }, callBack: function (responseJSON) {
                        if (responseJSON.IsSuccess) {
                            $row.remove();
                            resetTableActions('ServiceItemQuotationDetailsTbody', 'addServiceItemQotationRow', null);
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


var getCompanyDefaultCurrencyCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        baseCurrencyID = responseJSON.resultJSON.Value;
        loadCurrencyDropdownList('FCYID', baseCurrencyID);
        loadCurrencyDropdownList('LCYID', baseCurrencyID);
        //$('#BaseCurrencyID').prop("disabled", true);
        checkCurrencyMatch();
    } else {
        errorToastr(responseJSON.Message, "error");
    }
}

function checkCurrencyMatch() {
    var currencyID = $('#FCYID').val();
    var baseCurrencyID = $('#LCYID').val();
    var fcRate = $('#ExchangeRate');

    if (currencyID === baseCurrencyID) {
        fcRate.prop('disabled', true).addClass('readonly');
        fcRate.val('1.00');
        calculateBaseCurrencyAmount();
    } else {
        fcRate.prop('disabled', false).removeClass('readonly');
    }
}
function calculateBaseCurrencyAmount() {
    let fCAmount = $('#FCYAmount').val();
    let fCRate = $('#ExchangeRate').val();
    var baseCurrencyAmount = removeAllCommas(fCAmount) * removeAllCommas(fCRate);
    $('#LCYAmount').val(addThousandSeperator(baseCurrencyAmount));
    return baseCurrencyAmount;
}


//Btn Close Code
function redirectToQuotationList() {
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
                window.location.href = '/Services/ServiceItemQuotation/List?FID=fVZFcZW3+pwAgWyGPOtYrg==&ModuleID=stgRMCl4UuaRIz1dElDqYA==';
            }
        });

};
//Btn Close End Code