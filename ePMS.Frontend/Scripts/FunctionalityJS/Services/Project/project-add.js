var isProjectPaymentTermLoaded = false;
$(document).ready(function () {
    /*
    loadProjectTypeDropdownList('TypeID', 0, null);
    loadProjectCategoryDropdownList('CategoryID', 0, null);
    loadHREmployeeDropdownList('ProjectManagerID', 0, 0, companyID);
    loadCustomerDropdownList('CustomerID', 0, null);
    loadDivisionDropdownList('DivisionID', 0, null);
    loadProjectStatusDropdownList('StatusID', 0, null);
    loadProjectBillingMethodDropdownList('BillingMethodID', 0, null);
    loadProjectBillingCycleDropdownList('BillingCycleID', 0, null);
    loadProjectPaymentTermDropdownList('PaymentTermID', 0, null);
    
    
    loadEstimationUnitDropdownList('EstimatedCompletionUnitID', 0, null);
    loadEstimationUnitDropdownList('ActualCompletionUnitID', 0, null);
    */
    loadCountryDropdownlist('CountryID', 0, 0, 0);
    loadCurrencyDropdownList('CurrencyID', 0, null);
    loadTaxGroupDropdownList('TaxGLAccountID', 0);

    $('#TaxGLAccountID').on('select2:select', function () {
        var taxRate = _loadTaxGroupDropdownListArray.find(row => row.Value == $(this).val()).JSON['Rate'];
        $('#VAT').val(addThousandSeperator(removeAllCommas(taxRate)));
    });
    let inputFieldsAndSelectedValue = [
        { inputIdAttr: 'RevenueGLAccountID', selectedValue: 0, defaulText: 'Select Revenue GL Account' },
        { inputIdAttr: 'ReceivableGLAccountID', selectedValue: 0, defaulText: 'Select Receivable GL Account' },        
    ];
    loadAccountHeadsDropdownList(inputFieldsAndSelectedValue);
    var newBilingMethodFunc = function () {
        alert('hey');
    }
    //| Load Dropdowns
    ajaxRequest({
        url: '/Services/Project/GetDropdowns', type: 'POST', data: {}, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON.Customers, $('#CustomerID'), 'Select Customer', 0, null);
                bindJQueryDropdownList(responseJSON.resultJSON.Emplyees, $('#ProjectManagerID'), 'Select Project Manager', 0, null);
                bindJQueryDropdownList(responseJSON.resultJSON.ProjectTypes, $('#TypeID'), 'Select Type', 0, null, { text: 'Add New Type', function: 'newSetupProjectType' });
                bindJQueryDropdownList(responseJSON.resultJSON.ProjectCategories, $('#CategoryID'), 'Select Category', 0, null, { text: 'Add New Category', function: 'newSetupProjectCategory' });
                bindJQueryDropdownList(responseJSON.resultJSON.ProjectDivisions, $('#DivisionID'), 'Select Division', 0, null);
                bindJQueryDropdownList(responseJSON.resultJSON.ProjectStatuses, $('#StatusID'), 'Select Status', 0, null, { text: 'Add New Status', function: 'newSetupProjectStatus' });
                bindJQueryDropdownList(responseJSON.resultJSON.ProjectBillingMethods, $('#BillingMethodID'), 'Select Billing Method', 0, null, { text: 'Add New Billing Method', function: 'newSetupProjectBillingMethod' });
                bindJQueryDropdownList(responseJSON.resultJSON.ProjectBillingCycles, $('#BillingCycleID'), 'Select Billing Cycle', 0, null, { text: 'Add New Billing Cycle', function: 'newSetupProjectBillingCycle' });
                bindJQueryDropdownList(responseJSON.resultJSON.ProjectPayentTerms, $('#PaymentTermID'), 'Select Payment Term', 0, null, { text: 'Add New Payment Term', function: 'newSetupProjectPaymentTerm' });
                //bindJQueryDropdownList(responseJSON.resultJSON.ProjectTimeUnits, $('#ProjectTimeUnits'), 'Select Est Comp Unit', 0, null);
                bindJQueryDropdownList(responseJSON.resultJSON.ProjectTimeUnits, $('#EstimatedCompletionUnitID'), 'Select Estimated Comp Unit', 0, null, { text: 'Add New Estimated unit', function: 'newSetupProjectEstimatedUnit' });
                bindJQueryDropdownList(responseJSON.resultJSON.ProjectTimeUnits, $('#ActualCompletionUnitID'), 'Select Actual Comp Unit', 0, null,  );
                _subContractorArray = responseJSON.resultJSON.Subcontractors;
                _subPaymentTermArray = responseJSON.resultJSON.SubcontractorPaymentTerms;
                _assigneeArray = responseJSON.resultJSON.Emplyees;
                _assigneeRoleArray = responseJSON.resultJSON.AssingeeRoles;
                _assigneeBillingTypeArray = responseJSON.resultJSON.AssingeeBillingTypes;
                _assigneeStatusArray = y = responseJSON.resultJSON.AssingeeStatuses;

               
                
            }
        }
    }, null,false);
    getCode();
    

    $('#SubcontractTab').click(function () {
        if (!isProjectPaymentTermLoaded) {
            //getSubcontractor(null);
            addSubcontractRow(null);
            isProjectPaymentTermLoaded = true;
        }

    });
    $('#TeamTab').click(function () {
        if (!isProjectAssigneeLoaded) {
            //getAssignee(null);
            addTeamRow(null);
            isProjectAssigneeLoaded = true;
        }

    });
});

function getCode() {
    ajaxRequest({ url: '/Services/Project/GetCode', type: 'POST', data: {}, callBack: getCodeCallBack }, null, false);
}
var getCodeCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        $('#Code').val(responseJSON.resultJSON.Number);
        $('#Code').prop('readonly', true);
    }
    else {
        $('#Code').prop('readonly', false);
    }
}