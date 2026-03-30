
$(document).ready(function () {

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ID')) {
        let id = urlParams.get('ID');
        getAndDecryptID(id);
    }


    $("#CustomerID").on('select2:select', function () {
        debugger;
        var selectedID = $(this).val();
        var customer = _customersDropdownArray.find(c => c.ID == selectedID);


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
    $('#FCYID').change(function () {
        checkCurrencyMatch();
    });


    $('#invoiceItemsTab').click(function () {
  

        if ($('#ServiceItemInvoiceDetailsTable tbody tr').length <= 0) {

            //_servicesDropdownArrary.unshift({ Value: 0, Text: 'Select Services' });
           // serviceItemInvoiceDetailsSchema.ServiceItemID['options'] = _servicesDropdownArrary;
            addTableRowsBySchema(serviceItemInvoiceDetailsSchema, 'ServiceItemInvoiceDetailsTbody', { ID: 0 })

            resetTableActions('ServiceItemInvoiceDetailsTbody', 'addServiceItemInvoiceRow', null);
        }

    });

    $('#StatusID').on('select2:select', function (e) {
        var selectedValue = $(this).find('option:selected').text();
        if (selectedValue === 'Post') {
            $("#btnSave").html('<i class="bi bi-journal-check" style="font-size: 23px;"></i> Post');
        }
        else {
            $("#btnSave").html('<i class="bi bi-check2" style="font-size: 23px;";></i> Update');
        }
    });

});
var getAndDecryptIDCallBack = function (response) {
    getByID(response);
    getServiceItemInvoiceUploadPicturesUploadedFilesByFKey(response);
}
function getByID(id) {
    ajaxRequest({ url: '/Services/ServiceItemInvoice/GetByID', type: 'POST', data: { ID: id }, callBack: getByIDCallBack });
}
var getByIDCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        setResponseToFormInputs(responseJSON.resultJSON.Header);

        $('#InvoiceNumber').text(responseJSON.resultJSON.Header.InvoiceNo);
        loadCurrencyDropdownList('FCYID', responseJSON.resultJSON.Header.FCYID);
        loadCurrencyDropdownList('LCYID', responseJSON.resultJSON.Header.LCYID);
        if (responseJSON.resultJSON.Header.TypeID =='QuotationBase') {
            $('.Quotationddl').css('display', 'block');
            $('#QuotationID').attr('required',true);
        }


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

                    bindJQueryDropdownList(_paymentTermsDropdownArrary, $('#PaymentTermID'), 'Select Payment Term', responseJSON.resultJSON.Header.PaymentTermID, null);
                    bindJQueryDropdownList(_statusDropdownArrary, $('#StatusID'), 'Select Status', responseJSON.resultJSON.Header.StatusID, null);
                
                    bindJQueryDropdownList(_quotationDropdownArrary, $('#QuotationID'), 'Select Quotation', responseJSON.resultJSON.Header.QuotationID, null);
               
                    
                    bindJQueryDropdownList(_customersDropdownArray, $('#CustomerID'), 'Select Customer', responseJSON.resultJSON.Header.CustomerID, null);
                    var customer = _customersDropdownArray.find(c => c.ID == responseJSON.resultJSON.Header.CustomerID);
                    var customerName = customer.Text;
                    $('#lblCustomerName').text(customerName);

                    setResponseToFormInputs(customer, ['ID']);
        
                    var customerProjects = _projectsDropdownArrary.filter(p => p.CustomerID == responseJSON.resultJSON.Header.CustomerID); 
                    bindJQueryDropdownList(customerProjects, $('#ProjectID'), 'Select Project ', responseJSON.resultJSON.Header.ProjectID, null);
                    var project = customerProjects.length ? _projectsDropdownArrary.find(p => p.ID == responseJSON.resultJSON.Header.ProjectID): null;
                    if (project) {
                        setResponseToFormInputs(project, ['ID']);
                    }

                    serviceItemInvoiceDetailsSchema.ServiceItemID['options'] = _servicesDropdownArrary;

                    if (responseJSON.resultJSON.Header.ProjectID > 0) {
                        $('#invoiceItemsTab').closest('li').addClass('d-none');
                        $('#TimesheetTab').closest('li').removeClass('d-none');
                        // call the function and load timesheet table
                        loadTableData();
                    }
                    else {
                        $('#TimesheetTab').closest('li').addClass('d-none');
                        
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
                        //  FIRE CALCULATION FOR EACH ROW ⭐
                        $('#ServiceItemInvoiceDetailsTbody tr').each(function () {
                            $(this).find('.bha-input:first').trigger('change');
                        });
                    }
         

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
    redirectToAction("/Services/ServiceItemInvoice/Add?ID=", id, null);
}