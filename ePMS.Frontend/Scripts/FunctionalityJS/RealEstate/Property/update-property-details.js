var getAndDecryptIDCallBack = function (responseJOSN) {
    getPropertyUploadPicturesUploadedFilesByFKey(responseJOSN);
    getPropertyUploadVideoUploadedFilesByFKey(responseJOSN);
    $('#ID').val(responseJOSN);
    ajaxRequest({ url: '/RealEstate/Property/GetPropertyById', type: 'POST', data: { ID: $('#ID').val() }, callBack: getPropertyByIdCallBack });
    //ajaxRequest({ url: '/RealEstate/PropertyStructure/GetByPropertyID', type: 'POST', data: { propertyID: $('#ID').val() }, callBack: getPropertyStructureByPropertyIDCallBack });
}
var getPropertyByIdCallBack = function (responseJSON) {
    if (responseJSON.resultJSON.Property.PropertyStructure == null) {
        //$('#tblPropertyStructureContainer').html(defaultHTML);
    }
    else {
        //$('#tblPropertyStructureContainer').html(JSON.parse(responseJSON.resultJSON.PropertyStructure));
    }
    setResponseToFormInputs(responseJSON.resultJSON.Property);
    console.log(responseJSON.resultJSON);
    //$('.card-title').text(responseJSON.resultJSON.Property.PropertyID + ' - ' + responseJSON.resultJSON.Property.Name);
    $('#PageTitleID').text(responseJSON.resultJSON.Property.PropertyID);
    $('#PageTitleName').text(' - ' + responseJSON.resultJSON.Property.Name);
    loadPropertyTypeDropdownList('TypeID', responseJSON.resultJSON.Property.TypeID, null, { text: 'Add New Property Type', function: 'newPropertyType' });
    loadPropertyStatusDropdownList('StatusID', responseJSON.resultJSON.Property.StatusID);
    loadUnitTypeDropdownList('UnitTypeID', responseJSON.resultJSON.Property.UnitTypeID);
    loadPropertyOwnerDropdownlist('LandlordID', responseJSON.resultJSON.Property.LandlordID);
    getOwnerDetail(responseJSON.resultJSON.Property.LandlordID);
    loadCompanyBranchesDropdownList('ResponsibilityCenterID', responseJSON.resultJSON.Property.ResponsibilityCenterID);
    loadCountryDropdownlist('CountryID', responseJSON.resultJSON.Property.CountryID, responseJSON.resultJSON.Property.StateID, responseJSON.resultJSON.Property.CityID);
    if (responseJSON.resultJSON.Property.AvailableFrom != null) {
        /* COMMENTED AFTER NEW DESIGN
        $('#AvailableFrom').datepicker();
        $('#AvailableFrom').datepicker("setDate", getFormattedDate(responseJSON.resultJSON.Property.AvailableFrom));
        */
    }
    _bankAccountsArray = responseJSON.resultJSON.PropertyBankAccounts;
    if (_bankAccountsArray != null) {
        loadPropertyBankAccountTableData(_bankAccountsArray);
    }
    ajaxRequest({ url: '/RealEstate/Property/GetFeaturesByPropertyID', type: 'POST', data: { propertyID: $('#ID').val() }, callBack: getPropertyFeaturesByPropertyIDCallBack });

    if (activeTab == 'BankAccount-li') {
        $('#BankAccount-li').trigger('click');
    }
    loadPropertyStructureTypeDropdownList();
}

var getPropertyFeaturesByPropertyIDCallBack = function (responseJSON) {
    var propertyAddedFeatures = [];
    $.each(responseJSON.resultJSON, function (rowIndex, rowItem) {
        propertyAddedFeatures.push(rowItem.ID.toString());
    });

    $('#Features').val(propertyAddedFeatures);
    $('#Features').trigger('change');


}
function getOwnerDetail(ID) {
    try {
        ajaxRequest({ url: "/RealEstate/PropertyOwner/GetByID", type: 'POST', data: { ID: ID }, callBack: getOwnerDetailCallBack });
    }
    catch (err) {
        errorToastr(err.toString(), "error");
    }
}
var getOwnerDetailCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        if (responseJSON.resultJSON) {
            if (responseJSON.resultJSON.Landlord) {
                $('#PrimaryContactNumber').val(responseJSON.resultJSON.Landlord.PrimaryContactNumber);
                $('#SecondaryContactNumber').val(responseJSON.resultJSON.Landlord.SecondaryContactNumber);
            }
        }
    }
    else {
        errorToastr(responseJSON.Message, "error");
    }
}
function inputKeyUpEvent(event) {

    $('.card-title').text($("#PropertyID").val() + ' - ' + $("#Name").val());
}