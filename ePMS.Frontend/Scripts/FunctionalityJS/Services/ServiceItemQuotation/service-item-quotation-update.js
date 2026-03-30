
$(document).ready(function () {

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ID')) {
        let id = urlParams.get('ID');
        getAndDecryptID(id);
    }

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
    $('#FCYID').change(function () {
        checkCurrencyMatch();
    });


});

var getAndDecryptIDCallBack = function (response) {
    
    getByID(response);
    getServiceItemQuotationUploadPicturesUploadedFilesByFKey(response);
}
function getByID(id) {
    ajaxRequest({ url: '/Services/ServiceItemQuotation/GetByID', type: 'POST', data: { ID: id }, callBack: getByIDCallBack });
}
var getByIDCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {

        setResponseToFormInputs(responseJSON.resultJSON.Header);

        $('#QuotationNumber').text(responseJSON.resultJSON.Header.QuotationNo);
        loadCurrencyDropdownList('FCYID', responseJSON.resultJSON.Header.FCYID);
        loadCurrencyDropdownList('LCYID', responseJSON.resultJSON.Header.LCYID);

        ajaxRequest({
            url: '/Services/ServiceItemQuotation/GetDropdowns', type: 'POST', data: {}, callBack: function (dropdownJSON) {
                if (dropdownJSON.IsSuccess) {

                    _customersDropdownArray = dropdownJSON.resultJSON.Customers;
                    _projectsDropdownArrary = dropdownJSON.resultJSON.Projects;
                    _servicesDropdownArrary = dropdownJSON.resultJSON.Services;
                    _servicesDropdownArrary.unshift({ Value: 0, Text: 'Select Service' });
                    _statusDropdownArrary = dropdownJSON.resultJSON.Status;
                    _paymentTermsDropdownArrary = dropdownJSON.resultJSON.PaymentTerms;

                    bindJQueryDropdownList(_paymentTermsDropdownArrary, $('#PaymentTermID'), 'Select Customer', responseJSON.resultJSON.Header.PaymentTermID, null);
                    bindJQueryDropdownList(_statusDropdownArrary, $('#StatusID'), 'Select Customer', responseJSON.resultJSON.Header.StatusID, null);
                    bindJQueryDropdownList(_customersDropdownArray, $('#CustomerID'), 'Select Customer', responseJSON.resultJSON.Header.CustomerID, null);
                    var customer = _customersDropdownArray.find(c => c.ID == responseJSON.resultJSON.Header.CustomerID);
                    var customerName = customer.Text;
                    $('#lblCustomerName').text(customerName);
                    setResponseToFormInputs(customer, ['ID']);

                    var customerProjects = _projectsDropdownArrary.filter(p => p.CustomerID == responseJSON.resultJSON.Header.CustomerID);
                    debugger;
                    bindJQueryDropdownList(customerProjects, $('#ProjectID'), 'Select Project ', customerProjects[0].ID, null);
                    var project = _projectsDropdownArrary.find(p => p.ID == customerProjects[0].ID);

                    setResponseToFormInputs(project, ['ID']);

                    serviceItemQuotationDetailsSchema.ServiceItemID['options'] = _servicesDropdownArrary;
                    if (responseJSON.resultJSON.Detail.length > 0) {
                        console.log(responseJSON.resultJSON.Detail);
                        $.each(responseJSON.resultJSON.Detail, function (index, item) {
                            addTableRowsBySchema(serviceItemQuotationDetailsSchema, 'ServiceItemQuotationDetailsTbody', item);
                            resetTableActions('ServiceItemQuotationDetailsTbody', 'addServiceItemQotationRow', null);
                        });
                    }
                    else {

                        addTableRowsBySchema(serviceItemQuotationDetailsSchema, 'ServiceItemQuotationDetailsTbody', { ID: 0 })
                        resetTableActions('ServiceItemQuotationDetailsTbody', 'addServiceItemQotationRow', null);
                    }
                    // ⭐ FIRE CALCULATION FOR EACH ROW ⭐
                    $('#ServiceItemQuotationDetailsTbody tr').each(function () {
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


function redirectToAdd(id) {
    redirectToAction("/Services/ServiceItemQuotation/Add?ID=", id, null);
}