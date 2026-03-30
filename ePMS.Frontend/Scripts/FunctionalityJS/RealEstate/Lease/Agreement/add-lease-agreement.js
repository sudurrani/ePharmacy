$(document).ready(function () {   
    
    //loadLeaseTermTemplateDropdownList('LeaseTermTemplateID', 0);
    loadLeaseTermTemplateAgreementDropdownList('LeaseTermTemplateID', 0);

    loadCurrencyDropdownList('CurrencyID', 0);

    loadTenantDropdownList('TenantID', 0, 'Select Tenant');
    loadPropertyDropdownList('PropertyID', 0);
    getNumber();

});