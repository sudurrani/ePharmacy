
function show(id = 0) {
    alert(id);
}
function showChequeDetail(currentCheque = null, otherCheques = null, additionalCharges = null, taxes = null) {
    let inputJSON = {};
    inputJSON.CurrentInvoice = currentCheque;
    inputJSON.OtherInvoices = otherCheques;
    inputJSON.AdditionalCharges = additionalCharges;
    inputJSON.Taxes = taxes;
    ajaxRequest({
        url: "/RealEstate/DueInvoices/GetAmountBreakdownPartialView", type: 'POST', data: inputJSON, callBack: function (responseJSON) {
            $('#AmountBreakdownContainer').html(responseJSON);
            $('#AmountBreakdownModal').modal('show');

        }
    }, 'html');
}
function generateDueInvoice(invoiceId) {   
    ajaxRequest({
        url: "/RealEstate/DueInvoices/GetGenerateInvoiceDetailPartialView", type: 'POST', data: { ID: invoiceId }, callBack: function (responseJSON) {
            $('#DueInvoiceContainer').html(responseJSON);
            $('#DueInvoiceDetailModal').modal('show');
        }
    }, 'html');
}
function generateRentInvoice(id, chequeNo, invoiceDate) { 
      
    if (invoiceDate === "") {
        infoToastr('Please select an invoice date first.', 'Info');    
        return;
    }
    $('#InvoiceDate').off('focus');
    swal.fire({  
        title: "Confirmation",
        text: (`Do you really want to generate Rent Invoice for the Cheque No (${chequeNo})`),
        type: 'info',
        cancelButtonColor: '#F04249',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        dangerMode: true,      
    }).then((result) => {
        if (result.value) {
            ajaxRequest({
                url: '/RealEstate/DueInvoices/GenerateRentInvoice', type: 'POST', data: { ID: id, InvoiceDate: invoiceDate }, callBack: function (responseJSON) {
                    if (responseJSON.IsSuccess) {
                        $('#DueInvoiceDetailModal').modal('hide');
                        loadTableData();
                        successToastr(`Invoice generated against Cheque No (${chequeNo})  successfully`, 'success');
                    }
                    else {
                        errorToastr(responseJSON.Message, "error");
                    }
                }
            });
        } else {
            $('#InvoiceDate').on('focus.myHandler', function () {
                $(this).datepicker('show');
            });
        }
    });
}