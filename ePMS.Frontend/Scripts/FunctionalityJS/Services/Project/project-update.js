
$(document).ready(function () {

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ID')) {
        let id = urlParams.get('ID');
        getAndDecryptID(id);
    }

});
var getAndDecryptIDCallBack = function (response) {
    getByID(response);
}
function getByID(id) {
    ajaxRequest({ url: '/Services/Project/GetByID', type: 'POST', data: { ID: id }, callBack: getByIDCallBack });
}
var getByIDCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        setResponseToFormInputs(responseJSON.resultJSON.Header);
        setResponseToFormInputs(responseJSON.resultJSON.Budget);
        $("#ContractValue").val(addThousandSeperator(responseJSON.resultJSON.Budget.ContractValue));
        $("#ActualHours").val(addThousandSeperator(responseJSON.resultJSON.Budget.ActualHours));
        $("#ActualRevenue").val(addThousandSeperator(responseJSON.resultJSON.Budget.ActualRevenue));
        $("#Variance").val(addThousandSeperator(responseJSON.resultJSON.Budget.Variance));
        /*
        loadProjectTypeDropdownList('TypeID', responseJSON.resultJSON.Header.TypeID, null);
        loadCustomerDropdownList('CustomerID', responseJSON.resultJSON.Header.CustomerID, null);
        loadHREmployeeDropdownList('ProjectManagerID', responseJSON.resultJSON.Header.ProjectManagerID, 0, companyID);
        loadProjectCategoryDropdownList('CategoryID', responseJSON.resultJSON.Header.CategoryID, null);
        loadProjectCategoryDropdownList('CategoryID', responseJSON.resultJSON.Header.CategoryID, null);
        loadDivisionDropdownList('DivisionID', responseJSON.resultJSON.Header.DivisionID, null);
        loadProjectStatusDropdownList('StatusID', responseJSON.resultJSON.Header.StatusID, null);
        
        loadProjectBillingMethodDropdownList('BillingMethodID', responseJSON.resultJSON.Header.BillingMethodID, null);
        loadProjectBillingCycleDropdownList('BillingCycleID', responseJSON.resultJSON.Header.BillingCycleID, null);
        loadProjectPaymentTermDropdownList('PaymentTermID', responseJSON.resultJSON.Header.PaymentTermID, null);
        
        loadEstimationUnitDropdownList('EstimatedCompletionUnitID', responseJSON.resultJSON.Budget.EstimatedCompletionUnitID, null);
        loadEstimationUnitDropdownList('ActualCompletionUnitID', responseJSON.resultJSON.Budget.ActualCompletionUnitID, null);
        */
        loadCountryDropdownlist('CountryID', responseJSON.resultJSON.Header.CountryID, 0, 0);
        loadCityByCountryDropdownList('CityID', responseJSON.resultJSON.Header.CountryID, responseJSON.resultJSON.Header.CityID, null);
        loadCurrencyDropdownList('CurrencyID', responseJSON.resultJSON.Budget.CurrencyID, null);
        //loadAccountHeadsDropdownList('RevenueGLAccountID', responseJSON.resultJSON.Header.RevenueGLAccountID);
        //loadAccountHeadsDropdownList('ReceivableGLAccountID', responseJSON.resultJSON.Header.ReceivableGLAccountID);
        loadTaxGroupDropdownList('TaxGLAccountID', responseJSON.resultJSON.Header.TaxGLAccountID);

        $('#TaxGLAccountID').on('select2:select', function () {
            var taxRate = _loadTaxGroupDropdownListArray.find(row => row.Value == $(this).val()).JSON['Rate'];
            $('#VAT').val(addThousandSeperator(removeAllCommas(taxRate)));
        });

        let inputFieldsAndSelectedValue = [
            { inputIdAttr: 'RevenueGLAccountID', selectedValue: responseJSON.resultJSON.Header.RevenueGLAccountID, defaulText: 'Select Revenue GL Account' },
            { inputIdAttr: 'ReceivableGLAccountID', selectedValue: responseJSON.resultJSON.Header.ReceivableGLAccountID, defaulText: 'Select Receivable GL Account' },
        ];
        loadAccountHeadsDropdownList(inputFieldsAndSelectedValue);
        //| Load Dropdowns
        ajaxRequest({
            url: '/Services/Project/GetDropdowns', type: 'POST', data: {}, callBack: function (dropdownsJSON) {
                if (responseJSON.IsSuccess) {
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.Customers, $('#CustomerID'), 'Select Customer', responseJSON.resultJSON.Header.CustomerID, null);
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.Emplyees, $('#ProjectManagerID'), 'Select Project Manager', responseJSON.resultJSON.Header.ProjectManagerID, null);
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ProjectTypes, $('#TypeID'), 'Select Type', responseJSON.resultJSON.Header.TypeID, null, { text: 'Add New Type', function: 'newSetupProjectType' });
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ProjectCategories, $('#CategoryID'), 'Select Category', responseJSON.resultJSON.Header.CategoryID, null, { text: 'Add New Category', function: 'newSetupProjectCategory' });
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ProjectDivisions, $('#DivisionID'), 'Select Division', responseJSON.resultJSON.Header.DivisionID, null);
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ProjectStatuses, $('#StatusID'), 'Select Status', responseJSON.resultJSON.Header.StatusID, null, { text: 'Add New Status', function: 'newSetupProjectStatus' });
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ProjectBillingMethods, $('#BillingMethodID'), 'Select Billing Method', responseJSON.resultJSON.Header.BillingMethodID, null, { text: 'Add New Billing Method', function: 'newSetupProjectBillingMethod' });
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ProjectBillingCycles, $('#BillingCycleID'), 'Select Billing Cycle', responseJSON.resultJSON.Header.BillingCycleID, null, { text: 'Add New Billing Cycle', function: 'newSetupProjectBillingCycle' });
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ProjectPayentTerms, $('#PaymentTermID'), 'Select Payment Term', responseJSON.resultJSON.Header.PaymentTermID, null, { text: 'Add New Payment Term', function: 'newSetupProjectPaymentTerm' });
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ProjectTimeUnits, $('#EstimatedCompletionUnitID'), 'Select Estimated Comp Unit', responseJSON.resultJSON.Budget.EstimatedCompletionUnitID, null, { text: 'Add New Estimated unit', function: 'newSetupProjectEstimatedUnit' });
                    bindJQueryDropdownList(dropdownsJSON.resultJSON.ProjectTimeUnits, $('#ActualCompletionUnitID'), 'Select Actual Comp Unit', responseJSON.resultJSON.Budget.ActualCompletionUnitID, null);
                    _subContractorArray = dropdownsJSON.resultJSON.Subcontractors;
                    _subPaymentTermArray = dropdownsJSON.resultJSON.SubcontractorPaymentTerms;
                    _assigneeArray = dropdownsJSON.resultJSON.Emplyees;
                    _assigneeRoleArray = dropdownsJSON.resultJSON.AssingeeRoles;
                    _assigneeBillingTypeArray = dropdownsJSON.resultJSON.AssingeeBillingTypes;
                    _assigneeStatusArray = dropdownsJSON.resultJSON.AssingeeStatuses;
                    let subcontracts = responseJSON.resultJSON.Subcontracts;
                    if (subcontracts && subcontracts.length > 0) {
                        $.each(subcontracts, function (index, item) {
                            addSubcontractRow(item);
                        });
                    } else {
                        addSubcontractRow(null);
                    }

                    let teams = responseJSON.resultJSON.Teams;
                    if (teams && teams.length > 0) {
                        $.each(teams, function (index, item) {
                            addTeamRow(item);
                        });
                    } else {
                        addTeamRow(null);
                    }
                    

                }
            }
        }, null, false);
        /*
        _getByIDSubContractorsArray = responseJSON.resultJSON.Subcontracts;
        getSubcontractor(_getByIDSubContractorsArray);

        _getByIDTeamArray = responseJSON.resultJSON.Teams;
        getAssignee(_getByIDTeamArray);
        */

    }
    else {
        errorToastr(responseJSON.Message, "error");
    }
}
function redirectToAdd(id) {
    redirectToAction("/Services/Project/Add?ID=", id, null);
}