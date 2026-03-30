var _customersDropdownArray = [],
    _projectsDropdownArrary = [],
    _servicesDropdownArrary = [],
    _statusDropdownArrary = [],
    _paymentTermsDropdownArrary = [],
    _quotationDropdownArrary = [];
_timesheetProjectsDropdownArrary = [];
_timesheetEmployeesDropdownArrary = [];

let serviceItemInvoiceDetailsSchema = {
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
    Action: { type: 'action', addRowFunction: 'addServiceItemInvoiceRow', removeRowFunction: 'deleteServiceItemInvoiceRow' }
};

$(document).ready(function () {
    $("select.selector_2").select2({
        width: "100%",
        placeholder: "Select an option",
        minimumResultsForSearch: 0,
    });
    $(".mutiple_sel").select2({ width: "style" });

    //$('#btnSave').click(function (e) {
    //    e.preventDefault();
    //    saveRecord();
    //});

    $('#btnSave').click(function (e) {
        e.preventDefault();
        var statusText = $("#StatusID option:selected").text();
        if (statusText == 'Post') {
            if (customValidateForm('ServiceItemInvoiceForm')) {
                swal.fire({
                    title: "",
                    text: 'Are you sure you want to post this record?',
                    type: 'info',
                    cancelButtonColor: '#F04249',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    allowOutsideClick: false,
                }).then(
                    function (isConfirm) {
                        if (isConfirm.value == true) {
                            saveRecord(true);
                        }
                        else {
                            infoToastr("Cancelled", 'info');
                        }
                    });
            }
        }
        else if (statusText == 'Draft') {
            if (customValidateForm('ServiceItemInvoiceForm')) {
                swal.fire({
                    title: "",
                    text: 'Are you sure you want to save this record?',
                    type: 'info',
                    cancelButtonColor: '#F04249',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    allowOutsideClick: false,
                }).then(
                    function (isConfirm) {
                        if (isConfirm.value == true) {
                            saveRecord(true);
                        }
                        else {
                            infoToastr("Cancelled", 'info');
                        }
                    });
            }
        }
        else {
            saveRecord(false);
        }
    });

    $('#btnClose').click(function () {
        redirectToInvoiceList();
    });
    $('#TypeID').on('select2:select', function (e) {
        var selectedValue = $(this).find('option:selected').text();
        if (selectedValue === 'Quotation Base') {
            $('.Quotationddl').css('display', 'block');
            $('#StatusID').closest('.col-4').addClass('mt-2 pe-0');
        }
        else {
            $('.Quotationddl').css('display', 'none');
            $('#QuotationID').attr('required', false);
            $('#StatusID').closest('.col-4').removeClass('mt-2 pe-0');
            clearForm();

        }
    });

    $("#QuotationID").on('select2:select', function () {
        var selectedQuotationID = $(this).val();
        debugger;
        if (selectedQuotationID == null || selectedQuotationID == 0) {
            $('#ServiceItemInvoiceDetailsTbody').html('');
        }
        else {

            getQuotationDetailByQuotationNo(selectedQuotationID);
        }

    });

    datePickerDDMMYYYYFormat('InvoiceDate');
    datePickerDDMMYYYYFormat('ValidityDate');

    $(document).on('change input blur', '#ServiceItemInvoiceDetailsTbody .select_ServiceItemID, #ServiceItemInvoiceDetailsTbody .bha-input', function () {
        let $row = $(this).closest('tr');
        let serviceID = $(this).val();
        let service = _servicesDropdownArrary.find(s => s.ID == serviceID);
        if (service) {
            $row.find('td.tdPeriod input').val(service.Period);
            $row.find('td.tdVATPercent input').val(service.TotalVAT);
        }
        else {
             //$row.find('td input').val('0.00);
             //$row.find('td.tdPeriod input').val('');

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
        let rowTotalLCYVAT = 0;
        let rowTotalLCYExclVAT = 0;
        $('#ServiceItemInvoiceDetailsTbody tr').each(function (index, item) {
            rowTotal += parseFloat(removeAllCommas($(this).find('td.tdTotal').text()));
            $('#lblGrandTotal').text(addThousandSeperator(rowTotal.toFixed()));
            $('#FCYAmount').val(addThousandSeperator(rowTotal.toFixed()));
            $('#LCYAmount').val(addThousandSeperator(rowTotal.toFixed()));

            rowTotalLCYVAT += parseFloat(removeAllCommas($(this).find('td.tdVATAmount').text()));
            $('#LCYVAT').val(addThousandSeperator(rowTotalLCYVAT.toFixed()));
            $('#LCYVatValue').val(addThousandSeperator(rowTotalLCYVAT.toFixed()));

            rowTotalLCYExclVAT += parseFloat(removeAllCommas($(this).find('td.tdExclDiscount').text()));
            $('#LCYExclVAT').val(addThousandSeperator(rowTotalLCYExclVAT.toFixed()));

            $('#LCYInclVAT').val(addThousandSeperator(rowTotal.toFixed()));
            /*    console.log($(this).find('td.tdTotal').text());*/
        })
        calculateBaseCurrencyAmount();

    });
});
function saveRecord(isCloseAndSaveAsDraft = false) {
    if (customValidateForm('ServiceItemInvoiceForm')) {
        var inputJSON = getFormDataAsJSONObject('ServiceItemInvoiceForm');

        inputJSON.LCYAmount = removeAllCommas(inputJSON.LCYAmount);
        inputJSON.FCYAmount = removeAllCommas(inputJSON.FCYAmount);
        inputJSON.LCYInclVAT = removeAllCommas(inputJSON.LCYInclVAT);
        inputJSON.LCYVAT = removeAllCommas(inputJSON.LCYVAT);
        inputJSON.LCYExclVAT = removeAllCommas(inputJSON.LCYExclVAT);

        inputJSON.FKeyIdentifier = $('#UniqueFKeyIdenfier').val();

        invoiceDetail = getTableRowsBySchema(serviceItemInvoiceDetailsSchema, 'ServiceItemInvoiceDetailsTbody');

        // validation for invoiceDetail 
        if (invoiceDetail.length > 1) {
            for (let i = 0; i < invoiceDetail.length; i++) {
                let c = invoiceDetail[i], rowNo = i + 1;
                if (!c.ServiceItemID || c.ServiceItemID === "0") return infoToastr(`In Invoice Item row ${rowNo}: Services  is missing`);
            }
        }

        inputJSON['Details'] = invoiceDetail
        inputJSON['Details'] = inputJSON['Details'].map(function (row) {
            if (row.Rate) row.Rate = removeAllCommas(row.Rate);
            if (row.Quantity) row.Quantity = removeAllCommas(row.Quantity);
            if (row.Amount) row.Amount = removeAllCommas(row.Amount);
            if (row.DiscountedAmount) row.DiscountedAmount = removeAllCommas(row.DiscountedAmount);
            if (row.ExclDiscount) row.ExclDiscount = removeAllCommas(row.ExclDiscount);
            if (row.VATAmount) row.VATAmount = removeAllCommas(row.VATAmount);
            if (row.IncVAT) row.IncVAT = removeAllCommas(row.IncVAT);
            if (row.Total) row.Total = removeAllCommas(row.Total);

            return row;
        });
        var selectedTimesheetIds = [];

        $('#ServiceTimesheetTable tbody tr').each(function () {
            var $row = $(this);

            if ($row.find('.row-check').is(':checked')) {
                var id = parseInt($row.find('.tdID').text().trim(), 10);

                if (!isNaN(id) && inputJSON.ProjectID > 0 ) {
                    selectedTimesheetIds.push(id);
                }
            }
        });

        inputJSON.TimesheetIDs = JSON.stringify(selectedTimesheetIds);

        if (inputJSON.ProjectID > 0) {
            inputJSON['Details'] = [];
        }

        if (!inputJSON.FCYAmount || parseFloat(inputJSON.FCYAmount) <= 0) {

            infoToastr("FCY Amount must be greater than 0.00", 'info');

            return false; // stop further execution
        }

        console.log(inputJSON);

        ajaxRequest({ url: "/Services/ServiceItemInvoice/Save", type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft });

    }
}
function saveRecordCallBack(responseJSON, options) {
    if (responseJSON.IsSuccess) {
        debugger;
        $('#ID').val(responseJSON.resultJSON);

        successToastr("The Service Item Invoice has been saved", 'success');

        if (options.isCloseAndSaveAsDraft) {
            setTimeout(function () {
                window.location.href = '/Services/ServiceItemInvoice/List?FID=cgKWwAGqpX2C4N74K+dafw==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
            }, 2000);
        }

    }
    else {
        errorToastr("", responseJSON.Message, responseJSON);
    }
}

function getQuotationDetailByQuotationNo(id) {
    ajaxRequest({ url: '/Services/ServiceItemQuotation/GetByID', type: 'POST', data: { ID: id }, callBack: getQuotationDetailByQuotationNoCallBack });
}
var getQuotationDetailByQuotationNoCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        $('#ServiceItemInvoiceDetailsTbody').html('');
        setResponseToFormInputs(responseJSON.resultJSON.Header, ['ID', 'StatusID', 'ValidityDate', 'ContractRef', 'PaymentTermID']);

       // $('#QuotationNumber').text(responseJSON.resultJSON.Header.QuotationNo);
        loadCurrencyDropdownList('FCYID', responseJSON.resultJSON.Header.FCYID);
        loadCurrencyDropdownList('LCYID', responseJSON.resultJSON.Header.LCYID);

        ajaxRequest({
            url: '/Services/ServiceItemInvoice/GetDropdowns', type: 'POST', data: {}, callBack: function (dropdownJSON) {
                if (dropdownJSON.IsSuccess) {

                    _customersDropdownArray = dropdownJSON.resultJSON.Customers;
                    _projectsDropdownArrary = dropdownJSON.resultJSON.Projects;
                    _servicesDropdownArrary = dropdownJSON.resultJSON.Services;
                    _servicesDropdownArrary.unshift({ Value: 0, Text: 'Select Service' });
                    _statusDropdownArrary = dropdownJSON.resultJSON.Status;
                    _paymentTermsDropdownArrary = dropdownJSON.resultJSON.PaymentTerms;
                    _quotationDropdownArrary = dropdownJSON.resultJSON.QuotationNo;

                    //bindJQueryDropdownList(_paymentTermsDropdownArrary, $('#PaymentTermID'), 'Select Customer', responseJSON.resultJSON.Header.PaymentTermID, null);
                    //bindJQueryDropdownList(_statusDropdownArrary, $('#StatusID'), 'Select Customer', responseJSON.resultJSON.Header.StatusID, null);
                    //bindJQueryDropdownList(_quotationDropdownArrary, $('#QuotationID'), 'Select Quotation', responseJSON.resultJSON.Header.QuotationID, null);
                    bindJQueryDropdownList(_customersDropdownArray, $('#CustomerID'), 'Select Customer', responseJSON.resultJSON.Header.CustomerID, null);
                    var customer = _customersDropdownArray.find(c => c.ID == responseJSON.resultJSON.Header.CustomerID);


                    var customerName = customer.Text ? customer.Text : "";

                    $('#lblCustomerName').text(customerName);
                    setResponseToFormInputs(customer, ['ID']);

                    var customerProjects = _projectsDropdownArrary.filter(p => p.CustomerID == responseJSON.resultJSON.Header.CustomerID);
                    debugger;
                    bindJQueryDropdownList(customerProjects, $('#ProjectID'), 'Select Project ', customerProjects[0].ID, null);
                    var project = _projectsDropdownArrary.find(p => p.ID == customerProjects[0].ID);

                    setResponseToFormInputs(project, ['ID']);

                    serviceItemInvoiceDetailsSchema.ServiceItemID['options'] = _servicesDropdownArrary;
                    if (responseJSON.resultJSON.Detail.length > 0) {
                        console.log(responseJSON.resultJSON.Detail);
                        $.each(responseJSON.resultJSON.Detail, function (index, item) {
                            addTableRowsBySchema(serviceItemInvoiceDetailsSchema, 'ServiceItemInvoiceDetailsTbody', item);
                            resetTableActions('ServiceItemInvoiceDetailsTbody', 'addServiceItemInvoiceRow', null);
                        });
                    }
                    else {

                        addTableRowsBySchema(serviceItemInvoiceDetailsSchema, 'ServiceItemInvoiceDetailsTbody', { ID: 0 })
                        resetTableActions('ServiceItemInvoiceDetailsTbody', 'addServiceItemInvoiceRow', null);
                    }
                    // ⭐ FIRE CALCULATION FOR EACH ROW ⭐
                    $('#ServiceItemInvoiceDetailsTbody tr').each(function () {
                        $(this).find('.bha-input:first').trigger('change');
                    });
                }
            }
        }, null, true);
        calculateBaseCurrencyAmount();

    }
    else {
        errorToastr(responseJSON.Message, "error");
    }
}

function addServiceItemInvoiceRow(id, requestRow) {
    addTableRowsBySchema(serviceItemInvoiceDetailsSchema, 'ServiceItemInvoiceDetailsTbody', { ID: 0 })
}
function deleteServiceItemInvoiceRow(id, requestedRow)
{
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
                resetTableActions('ServiceItemInvoiceDetailsTbody', 'addServiceItemInvoiceRow', null);
                // ⭐ FIRE CALCULATION FOR EACH ROW ⭐
                $('#ServiceItemInvoiceDetailsTbody tr').each(function () {
                    $(this).find('.bha-input:first').trigger('change');
                });
                return;
            }
            else {
                ajaxRequest({
                    url: "/Services/ServiceItemInvoice/DeleteInvoiceDetail", type: 'POST', data: { ID: id }, callBack: function (responseJSON) {
                        if (responseJSON.IsSuccess) {
                            $row.remove();
                            resetTableActions('ServiceItemInvoiceDetailsTbody', 'addServiceItemInvoiceRow', null);
                            // ⭐ FIRE CALCULATION FOR EACH ROW ⭐
                            $('#ServiceItemInvoiceDetailsTbody tr').each(function () {
                                $(this).find('.bha-input:first').trigger('change');
                            });
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

    if (currencyID != null && baseCurrencyID != null && currencyID === baseCurrencyID) {
        fcRate.prop('disabled', true).addClass('readonly');
        //fcRate.val('1.00');
        calculateBaseCurrencyAmount();
    } else {
        fcRate.prop('disabled', false).removeClass('readonly');
        calculateBaseCurrencyAmount();
    }
}
function calculateBaseCurrencyAmount() {

    let fCAmount = $('#FCYAmount').val();
    let fCRate = $('#ExchangeRate').val();
    var baseCurrencyAmount = removeAllCommas(fCAmount) * removeAllCommas(fCRate);
    $('#LCYAmount').val(addThousandSeperator(baseCurrencyAmount));
    $('#LCYInclVAT').val(addThousandSeperator(baseCurrencyAmount));

    let baseVatValue = removeAllCommas($('#LCYVatValue').val());
    let lcyVat = baseVatValue * fCRate;
    $('#LCYVAT').val(addThousandSeperator(lcyVat));

    let baseLCYExclVAT = removeAllCommas(fCAmount) - removeAllCommas(baseVatValue);
    let lcyExclVAT = removeAllCommas(baseLCYExclVAT) * removeAllCommas(fCRate);
    $('#LCYExclVAT').val(addThousandSeperator(lcyExclVAT));


    return baseCurrencyAmount;
}

function clearForm() {
    // Clear dropdowns
    $('#CustomerID').val(null).trigger('change');
    $('#ProjectID').val(null).trigger('change');
    $('#QuotationID').val(null).trigger('change');

    // Clear customer detail fields
    $('#Country').val('');
    $('#City').val('');
    $('#PrimaryContactNo').val('');

    // Clear project detail fields
    $('#Name').val('');
    $('#StartDate').val('');
    $('#EndDate').val('');

    //Posting Details
    $('#FCYAmount').val('0.00');
    $('#LCYAmount').val('0.00');
    $('#LCYExclVAT').val('0.00');
    $('#LCYVAT').val('0.00');
    $('#LCYInclVAT').val('0.00');

    // Clear service item table body
    $('#ServiceItemInvoiceDetailsTbody').empty();
}

//Btn Close Code
function redirectToInvoiceList() {
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
                window.location.href = '/Services/ServiceItemInvoice/List?FID=fVZFcZW3+pwAgWyGPOtYrg==&ModuleID=stgRMCl4UuaRIz1dElDqYA==';
            }
        });

};
//Btn Close End Code