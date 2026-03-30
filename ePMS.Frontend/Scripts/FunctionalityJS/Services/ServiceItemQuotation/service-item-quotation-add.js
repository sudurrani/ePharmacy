$(document).ready(function () {

    $('#UnitUniqueFKeyIdenfier').val('@serviceItemQuotationUniqueFKeyIdenfier');
    //| Load Dropdowns
    ajaxRequest({
        url: '/Services/ServiceItemQuotation/GetDropdowns', type: 'POST', data: {}, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {

                _customersDropdownArray = responseJSON.resultJSON.Customers;
                _projectsDropdownArrary = responseJSON.resultJSON.Projects;
                _servicesDropdownArrary = responseJSON.resultJSON.Services;
                _statusDropdownArrary = responseJSON.resultJSON.Status;
                _paymentTermsDropdownArrary = responseJSON.resultJSON.PaymentTerms;

                bindJQueryDropdownList(_customersDropdownArray, $('#CustomerID'), 'Select Customer ', 0, null);
                bindJQueryDropdownList(_statusDropdownArrary, $('#StatusID'), 'Select Status', 0, 'Draft', { text: 'Add New Quotation Status', function: 'newSetupServiceItemQuotationStatus' });
                bindJQueryDropdownList(_paymentTermsDropdownArrary, $('#PaymentTermID'), 'Select Payment Term ', 0, null, { text: 'Add New Payment Term', function: 'newSetupServiceItemQuotationPaymentTerm' });

                /*        console.log(_projectsDropdownArrary);*/
            }
        }
    }, null, true);
    $("#CustomerID").on('select2:select', function () {
        var selectedID = $(this).val();
        var customer = _customersDropdownArray.find(c => c.ID == selectedID);
        var customerName = customer.Text;
        $('#lblCustomerName').text(customerName);
        setResponseToFormInputs(customer, ['ID']);

        var customerProjects = _projectsDropdownArrary.filter(p => p.CustomerID == selectedID);
        bindJQueryDropdownList(customerProjects, $('#ProjectID'), 'Select Project ', 0, null);

    });
    $("#ProjectID").on('select2:select', function () {
        var selectedProjectID = $(this).val();
        var project = _projectsDropdownArrary.find(p => p.ID == selectedProjectID);


        setResponseToFormInputs(project, ['ID']);
    });

    $('#QuotationItemsTab').click(function () {
        if (!isQuotationItemsTabLoaded) {
            _servicesDropdownArrary.unshift({ Value: 0, Text: 'Select Services' });
            serviceItemQuotationDetailsSchema.ServiceItemID['options'] = _servicesDropdownArrary;
            addTableRowsBySchema(serviceItemQuotationDetailsSchema, 'ServiceItemQuotationDetailsTbody', { ID: 0 });

            resetTableActions('ServiceItemQuotationDetailsTbody','addServiceItemQotationRow',null);
            isQuotationItemsTabLoaded = true;
        }
    });
    getCode();
    getCompanyDefaultCurrency();
    $('#FCYID').change(checkCurrencyMatch);
});

function getCode() {
    ajaxRequest({ url: '/Services/ServiceItemQuotation/GetCode', type: 'POST', data: {}, callBack: getCodeCallBack }, null, false);
}
var getCodeCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        $('#QuotationNo').val(responseJSON.resultJSON.Number);
        $('#QuotationNumber').text(responseJSON.resultJSON.Number);
        $('#QuotationNo').prop('readonly', true);
    }
    else {
        $('#QuotationNo').prop('readonly', false);
    }
}