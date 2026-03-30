$(document).ready(function () {    
    let inputFieldsAndSelectedValue = [
        { inputIdAttr: 'ControlAccountID', selectedValue: 0, defaulText: 'Select Control Account' },
        //{ inputIdAttr: 'ControlAccountID', selectedValue: 0, defaulText: 'Select Control Account' },
    ];
    loadAccountHeadsDropdownList(inputFieldsAndSelectedValue);
    loadSubcontractorServiceGroupDropdownList('ServiceGroupID', 0, null, { text: 'Add New Service Group', function: 'newSetupSubcontractorServiceGroup' });
    loadSubcontractorBusinessTypeDropdownList('BusinessTypeID', 0, null, { text: 'Add New Business Type', function: 'newSetupSubcontractorBusinessType' });

    loadCountryDropdownlist('BankAccountCountryID', 0, 0, 0);
    loadCountryDropdownlist('CountryID', 0, 0, 0);
    $('#CountryID').on('select2:select', function () {
        loadCityByCountryDropdownList('CityID', $(this).val(), null, null);
    });
    addTableRowsBySchema(contactDetailSchema, 'ContactDetailTableTbody', {})
    resetTableActions('ContactDetailTableTbody', 'addServiceItemQotationRow', null);
});