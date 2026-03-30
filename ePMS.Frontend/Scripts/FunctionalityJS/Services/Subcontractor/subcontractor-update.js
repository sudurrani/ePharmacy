$(document).ready(function () {

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ID')) {
        let id = urlParams.get('ID');
        getAndDecryptID(id);
    }
    $('#CountryID').on('select2:select', function () {
        loadCityByCountryDropdownList('CityID', $(this).val(), null, null);
    });


});
var getAndDecryptIDCallBack = function (response) {
    getByID(response);
}
function getByID(id) {
    ajaxRequest({ url: '/Services/Subcontractor/GetByID', type: 'POST', data: { ID: id }, callBack: getByIDCallBack });
}
var getByIDCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        setResponseToFormInputs(responseJSON.resultJSON.Header);
        loadCountryDropdownlist('CountryID', responseJSON.resultJSON.Header.CountryID, 0, 0);
        loadCityByCountryDropdownList('CityID', responseJSON.resultJSON.Header.CountryID, responseJSON.resultJSON.Header.CityID, null);        
        loadSubcontractorServiceGroupDropdownList('ServiceGroupID', responseJSON.resultJSON.Header.ServiceGroupID, null);
        loadSubcontractorBusinessTypeDropdownList('BusinessTypeID', responseJSON.resultJSON.Header.BusinessTypeID, null);

        let inputFieldsAndSelectedValue = [
            { inputIdAttr: 'ControlAccountID', selectedValue: responseJSON.resultJSON.Header.ControlAccountID, defaulText: 'Select Control Account' },
            //{ inputIdAttr: 'ControlAccountID', selectedValue: 0, defaulText: 'Select Control Account' },
        ];
        loadAccountHeadsDropdownList(inputFieldsAndSelectedValue);

        $.each(responseJSON.resultJSON.Contacts, function (index, item) {
            addTableRowsBySchema(contactDetailSchema, 'ContactDetailTableTbody', item);
        });

        debugger;
        loadSubcontractorGetByIDBankAccountTableData(responseJSON.resultJSON.BankAccounts);

        console.log(responseJSON.resultJSON.BankAccounts);

        loadCountryDropdownlist('BankAccountCountryID', responseJSON.resultJSON.BankAccounts.CountryID, 0, 0);

    }
    else {
        errorToastr(responseJSON.Message, "error");
    }
}
function redirectToAdd(id) {
    redirectToAction("/Services/Subcontractor/Add?ID=", id, null);
}