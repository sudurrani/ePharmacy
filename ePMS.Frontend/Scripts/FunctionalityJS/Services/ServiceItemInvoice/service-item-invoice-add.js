
$(document).ready(function () {
    //| Load Dropdowns
    ajaxRequest({
        url: '/Services/ServiceItemInvoice/GetDropdowns', type: 'POST', data: {}, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {

                _customersDropdownArray = responseJSON.resultJSON.Customers;
                _projectsDropdownArrary = responseJSON.resultJSON.Projects;
                _servicesDropdownArrary = responseJSON.resultJSON.Services;
                _statusDropdownArrary = responseJSON.resultJSON.Status;
                _paymentTermsDropdownArrary = responseJSON.resultJSON.PaymentTerms;
                _quotationDropdownArrary = responseJSON.resultJSON.QuotationNo;
                _timesheetProjectsDropdownArrary = responseJSON.resultJSON.TimesheetProjects;
                _timesheetEmployeesDropdownArrary = responseJSON.resultJSON.TimesheetEmployees;

                bindJQueryDropdownList(_customersDropdownArray, $('#CustomerID'), 'Select Customer ', 0, null);
                bindJQueryDropdownList(_statusDropdownArrary, $('#StatusID'), 'Select Status', 0, 'Draft');
                bindJQueryDropdownList(_paymentTermsDropdownArrary, $('#PaymentTermID'), 'Select Payment Term ', 0, null);
                bindJQueryDropdownList(_quotationDropdownArrary, $('#QuotationID'), 'Select Quotation ', 0, null);
                bindJQueryDropdownList(_timesheetProjectsDropdownArrary, $('#TimesheetProjectsID'), 'Select Project ', 0, null);
                bindJQueryDropdownList(_timesheetEmployeesDropdownArrary, $('#TimesheetEmployeesID'), 'Select Employee ', 0, null);

                /*        console.log(_projectsDropdownArrary);*/
            }
        }
    }, null, true);


    $("#CustomerID").on('select2:select', function () {
        var selectedID = $(this).val();
        var customer = _customersDropdownArray.find(c => c.ID == selectedID);
        var customerName = customer.Text;
        if (customer != null) {
            setResponseToFormInputs(customer, ['ID']);
            var customerName = customer.Text;
            $('#lblCustomerName').text(customerName);
        } else {
            $('#Country').val('');
            $('#City').val('');
            $('#PrimaryContactNo').val('');
            $('#lblCustomerName').text('');
        }

        var customerProjects = _projectsDropdownArrary.filter(p => p.CustomerID == selectedID);
        bindJQueryDropdownList(customerProjects, $('#ProjectID'), 'Select Project ', 0, null);

        $('#invoiceItemsTab').closest('li').removeClass('d-none');
        $('#TimesheetTab').closest('li').addClass('d-none');

        $('#FCYAmount').val('0.00');
        $('#LCYAmount').val('0.00');
        $('#LCYExclVAT').val('0.00');
        $('#LCYVAT').val('0.00');
        $('#LCYVatValue').val('0.00');
        $('#LCYInclVAT').val('0.00');
        $('#Name').val('');
        $('#StartDate').val('');
        $('#EndDate').val('');
    });
    $("#ProjectID").on('select2:select', function () {
        var selectedProjectID = $(this).val();
        var project = _projectsDropdownArrary.find(p => p.ID == selectedProjectID);
        if (project != null) {
            setResponseToFormInputs(project, ['ID']);
        } else {
            $('#Name').val('');
            $('#StartDate').val('');
            $('#EndDate').val('');
        }

        if (selectedProjectID > 0) {

            $('#invoiceItemsTab').closest('li').addClass('d-none');
            $('#TimesheetTab').closest('li').removeClass('d-none');

            // call the function and load timesheet table
            loadTableData();
        } else {

            $('#invoiceItemsTab').closest('li').removeClass('d-none');
            $('#TimesheetTab').closest('li').addClass('d-none');

            //clear fcy amount and lcy amount when again de slect the project
            $('#FCYAmount').val('0.00');
            $('#LCYAmount').val('0.00');
            $('#LCYExclVAT').val('0.00');
            $('#LCYVAT').val('0.00');
            $('#LCYVatValue').val('0.00');
            $('#LCYInclVAT').val('0.00');
        }
    });

    $('#invoiceItemsTab').click(function () {
     
            if ($('#ServiceItemInvoiceDetailsTable tbody tr').length <= 0) {

                _servicesDropdownArrary.unshift({ Value: 0, Text: 'Select Services' });
                serviceItemInvoiceDetailsSchema.ServiceItemID['options'] = _servicesDropdownArrary;
                addTableRowsBySchema(serviceItemInvoiceDetailsSchema, 'ServiceItemInvoiceDetailsTbody', { ID: 0 })
          
                resetTableActions('ServiceItemInvoiceDetailsTbody', 'addServiceItemInvoiceRow', null);
            }
    });
    getCode();
    getCompanyDefaultCurrency();
    $('#FCYID').change(checkCurrencyMatch);

    // hide timesheet tab
    $('#TimesheetTab').closest('li').addClass('d-none');

    $('#StatusID').on('select2:select', function (e) {
        var selectedValue = $(this).find('option:selected').text();
        if (selectedValue === 'Post') {
            $("#btnSave").html('<i class="bi bi-journal-check" style="font-size: 23px;"></i> Post');
        }
        else {
            $("#btnSave").html('<i class="bi bi-check2" style="font-size: 23px;";></i> Save');
        }
    });
});
function getCode() {
    ajaxRequest({ url: '/Services/ServiceItemInvoice/GetCode', type: 'POST', data: {}, callBack: getCodeCallBack }, null, false);
}
var getCodeCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        $('#InvoiceNo').val(responseJSON.resultJSON.Number);
        $('#InvoiceNumber').text(responseJSON.resultJSON.Number);
        $('#InvoiceNo').prop('readonly', true);
    }
    else {
        $('#InvoiceNo').prop('readonly', false);
    }
}